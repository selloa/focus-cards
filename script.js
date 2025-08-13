class CardLearningSystem {
    constructor() {
        this.deckInit = [];
        this.deckNext = [];
        this.deckStorage = [];
        this.currentMode = 1;
        this.currentCardIndex = 0;
        this.emptyInputCount = 0;
        this.practiceRemovedCount = 0; // Track cards removed in practice mode
        this.reviewRightCount = 0; // Track cards moved right during current review session
        
        // Fade-out functionality
        this.inactivityTimer = null;
        this.fadeOutDelay = 3000; // 3 seconds of inactivity before fade-out
        this.fadeOutElements = [];
        
        // Color scheme functionality
        this.colorSchemes = ['default', 'warm', 'ocean', 'lavender', 'sage', 'minimal'];
        this.currentColorSchemeIndex = 0;
        
        // Title screen state
        this.titleScreenActive = true;
        
        // Cursor state - show at startup, hide after first interaction
        this.cursorHidden = false;
        
        this.initializeElements();
        this.setupEventListeners();
        this.setupInactivityTracking();
        this.loadFromLocalStorage();
        this.updateCardCounters(); // Initialize counters
        this.initializeColorScheme(); // Initialize random color scheme
        this.showTitleScreen(); // Show title screen on load
    }

    initializeElements() {
        this.inputMode = document.getElementById('input-mode');
        this.reviewMode = document.getElementById('review-mode');
        this.practiceMode = document.getElementById('practice-mode');
        this.resetMode = document.getElementById('reset-mode');
        
        this.cardInput = document.getElementById('card-input');
        this.cursor = document.getElementById('cursor');
        this.cardText = document.getElementById('card-text');
        this.practiceCardText = document.getElementById('practice-card-text');
        
        // Card counter elements
        this.deckCountElement = document.getElementById('deck-count');
        this.practiceRemovedElement = document.getElementById('practice-removed-count');
        
        // Title screen element
        this.titleScreen = document.getElementById('title-screen');
        
        // Watermark element
        this.watermark = document.getElementById('watermark');
    }

    setupEventListeners() {
        // Input mode events
        this.cardInput.addEventListener('input', (e) => {
            this.updateCursorPosition(e.target.value);
            this.resetFadeOut(); // Reset fade-out on input
            
            // Hide cursor once user starts typing
            if (!this.cursorHidden && this.cursor) {
                this.cursor.style.display = 'none';
                this.cursorHidden = true;
            }
            
            // Apply debounced text scaling to input field
            if (e.target.value.trim()) {
                debouncedTextScaling(e.target, e.target.value);
            }
        });

        this.cardInput.addEventListener('keydown', (e) => {
            this.resetFadeOut(); // Reset fade-out on keydown
            
            // Hide cursor on any key press
            if (!this.cursorHidden && this.cursor) {
                this.cursor.style.display = 'none';
                this.cursorHidden = true;
            }
            
            if (e.key === 'Enter') {
                e.preventDefault();
                this.handleInputEnter();
            } else if (e.key === 'Backspace' && this.cardInput.value === '') {
                e.preventDefault();
                this.clearMemory();
            }
        });

        // Add paste event listener for bulk card input
        this.cardInput.addEventListener('paste', (e) => {
            this.resetFadeOut(); // Reset fade-out on paste
            
            // Hide cursor on paste
            if (!this.cursorHidden && this.cursor) {
                this.cursor.style.display = 'none';
                this.cursorHidden = true;
            }
            
            setTimeout(() => {
                this.handleBulkInput();
                // Apply text scaling after paste
                if (this.cardInput.value.trim()) {
                    updateTextScaling(this.cardInput, this.cardInput.value);
                }
            }, 10); // Small delay to ensure paste content is in the input field
        });

        // Hide cursor when input field is focused (but only if user has already interacted)
        this.cardInput.addEventListener('focus', () => {
            if (this.cursorHidden && this.cursor) {
                this.cursor.style.display = 'none';
            }
        });

        // Swipe events for review and practice modes
        let startX = 0;
        let startY = 0;
        let isSwiping = false;

        document.addEventListener('touchstart', (e) => {
            startX = e.touches[0].clientX;
            startY = e.touches[0].clientY;
            isSwiping = true;
        });

        document.addEventListener('touchmove', (e) => {
            if (!isSwiping) return;
            e.preventDefault();
        });

        document.addEventListener('touchend', (e) => {
            if (!isSwiping) return;
            
            const endX = e.changedTouches[0].clientX;
            const endY = e.changedTouches[0].clientY;
            const deltaX = endX - startX;
            const deltaY = endY - startY;
            
            // Check if it's a horizontal swipe (not vertical)
            if (Math.abs(deltaX) > Math.abs(deltaY) && Math.abs(deltaX) > 50) {
                this.resetFadeOut(); // Reset fade-out on swipe
                if (deltaX > 0) {
                    this.handleSwipeRight();
                } else {
                    this.handleSwipeLeft();
                }
            }
            
            isSwiping = false;
        });

        // Mouse events for desktop
        document.addEventListener('mousedown', (e) => {
            startX = e.clientX;
            startY = e.clientY;
            isSwiping = true;
        });

        document.addEventListener('mouseup', (e) => {
            if (!isSwiping) return;
            
            const endX = e.clientX;
            const endY = e.clientY;
            const deltaX = endX - startX;
            const deltaY = endY - startY;
            
            if (Math.abs(deltaX) > Math.abs(deltaY) && Math.abs(deltaX) > 50) {
                this.resetFadeOut(); // Reset fade-out on swipe
                if (deltaX > 0) {
                    this.handleSwipeRight();
                } else {
                    this.handleSwipeLeft();
                }
            }
            
            isSwiping = false;
        });

        // Keyboard events for desktop
        document.addEventListener('keydown', (e) => {
            if (this.currentMode === 2 || this.currentMode === 3) {
                if (e.key === 'ArrowLeft') {
                    this.resetFadeOut(); // Reset fade-out on keyboard swipe
                    this.handleSwipeLeft();
                } else if (e.key === 'ArrowRight') {
                    this.resetFadeOut(); // Reset fade-out on keyboard swipe
                    this.handleSwipeRight();
                }
            }
            
            // Secret fullscreen shortcut (only during title screen)
            if (e.key.toLowerCase() === 'f' && this.titleScreenActive) {
                this.resetFadeOut(); // Reset fade-out on fullscreen toggle
                this.toggleFullscreen();
            }
        });
    }

    setupInactivityTracking() {
        let lastActivityTime = Date.now();
        let fadeOutActive = false;

        const trackActivity = () => {
            lastActivityTime = Date.now();
            if (fadeOutActive) {
                this.resetFadeOut();
                fadeOutActive = false;
            }
        };

        // Track various user activities
        document.addEventListener('mousemove', trackActivity);
        document.addEventListener('keydown', trackActivity);
        document.addEventListener('touchstart', trackActivity);
        document.addEventListener('click', trackActivity);
        document.addEventListener('scroll', trackActivity);

        // Check for inactivity every second
        this.inactivityTimer = setInterval(() => {
            if (Date.now() - lastActivityTime > this.fadeOutDelay && !fadeOutActive) {
                this.triggerFadeOut();
                fadeOutActive = true;
            }
        }, 1000);
    }

    triggerFadeOut() {
        // Get all elements that should fade out
        const counters = document.querySelectorAll('.card-counter');
        const instructions = document.querySelectorAll('#swipe-instructions, #practice-swipe-instructions');
        const arrows = document.querySelectorAll('.arrow');
        const icons = document.querySelectorAll('.icon');

        // Add fade-out class to all elements
        counters.forEach(counter => counter.classList.add('fade-out'));
        instructions.forEach(instruction => instruction.classList.add('fade-out'));
        arrows.forEach(arrow => arrow.classList.add('fade-out'));
        icons.forEach(icon => icon.classList.add('fade-out'));
    }

    resetFadeOut() {
        // Remove fade-out class from all elements
        const counters = document.querySelectorAll('.card-counter');
        const instructions = document.querySelectorAll('#swipe-instructions, #practice-swipe-instructions');
        const arrows = document.querySelectorAll('.arrow');
        const icons = document.querySelectorAll('.icon');

        counters.forEach(counter => counter.classList.remove('fade-out'));
        instructions.forEach(instruction => instruction.classList.remove('fade-out'));
        arrows.forEach(arrow => arrow.classList.remove('fade-out'));
        icons.forEach(icon => icon.classList.remove('fade-out'));
    }

    initializeColorScheme() {
        // Start with a random color scheme
        this.currentColorSchemeIndex = Math.floor(Math.random() * this.colorSchemes.length);
        this.applyColorScheme();
    }

    applyColorScheme() {
        const scheme = this.colorSchemes[this.currentColorSchemeIndex];
        document.documentElement.removeAttribute('data-theme');
        
        if (scheme !== 'default') {
            document.documentElement.setAttribute('data-theme', scheme);
        }
    }

    showTitleScreen() {
        // Show watermark after title screen fade in (0.4s)
        setTimeout(() => {
            if (this.watermark) {
                this.watermark.style.opacity = '1';
            }
        }, 400);
        
        // Title screen timing: fade in (0.4s) + brief linger (0.2s) + fade out (1.2s) = 1.8s total
        setTimeout(() => {
            if (this.titleScreen) {
                this.titleScreen.classList.add('fade-out');
            }
            
            // Remove title screen from DOM after fade out
            setTimeout(() => {
                if (this.titleScreen && this.titleScreen.parentNode) {
                    this.titleScreen.parentNode.removeChild(this.titleScreen);
                }
                // Disable fullscreen shortcut after title screen is completely gone
                this.titleScreenActive = false;
            }, 1200);
        }, 600); // 0.4s fade in + 0.2s linger = 0.6s before starting fade out
        
        // Watermark stays visible permanently (no fade out)
    }

    updateCursorPosition(text) {
        // Update cursor position based on text length
        const currentFontSize = getComputedStyle(this.cursor).fontSize;
        const textWidth = this.getTextWidth(text, currentFontSize);
        this.cursor.style.left = `calc(50% + ${textWidth / 2}px)`;
    }

    getTextWidth(text, fontSize) {
        const canvas = document.createElement('canvas');
        const context = canvas.getContext('2d');
        context.font = fontSize + ' Arial';
        return context.measureText(text).width;
    }

    handleInputEnter() {
        const text = this.cardInput.value.trim();
        
        if (text === '') {
            this.emptyInputCount++;
            if (this.emptyInputCount >= 3) {
                this.advanceToReviewMode();
                return;
            }
        } else {
            // Check if the text contains semicolons (bulk input)
            if (text.includes(';')) {
                const cards = text.split(';')
                    .map(card => card.trim())
                    .filter(card => card.length > 0); // Remove empty cards
                
                if (cards.length > 1) {
                    // Add all cards to the deck
                    this.deckInit.push(...cards);
                    this.emptyInputCount = 0;
                    this.saveToLocalStorage();
                    this.updateCardCounters();
                    
                    // Show feedback about how many cards were added
                    this.showBulkInputFeedback(cards.length);
                    
                    // Clear the input and reset font size
                    this.cardInput.value = '';
                    this.updateCursorPosition('');
                    // Reset to base font size
                    this.cardInput.style.fontSize = '';
                    return;
                }
            }
            
            // Single card input
            this.emptyInputCount = 0;
            this.deckInit.push(text);
            this.saveToLocalStorage();
            this.updateCardCounters(); // Update counters when card is added
        }
        
        this.cardInput.value = '';
        this.updateCursorPosition('');
        // Reset to base font size
        this.cardInput.style.fontSize = '';
    }

    handleBulkInput() {
        const text = this.cardInput.value.trim();
        
        // Check if the text contains semicolons (bulk input)
        if (text.includes(';')) {
            const cards = text.split(';')
                .map(card => card.trim())
                .filter(card => card.length > 0); // Remove empty cards
            
            if (cards.length > 1) {
                // Add all cards to the deck
                this.deckInit.push(...cards);
                this.emptyInputCount = 0;
                this.saveToLocalStorage();
                this.updateCardCounters();
                
                // Show feedback about how many cards were added
                this.showBulkInputFeedback(cards.length);
                
                // Clear the input and reset font size
                this.cardInput.value = '';
                this.updateCursorPosition('');
                // Reset to base font size
                this.cardInput.style.fontSize = '';
                return;
            }
        }
        
        // If no semicolons or only one card, handle as normal input
        this.handleInputEnter();
    }

    showBulkInputFeedback(cardCount) {
        // Create a temporary feedback element
        const feedback = document.createElement('div');
        feedback.textContent = `Added ${cardCount} cards`;
        feedback.style.cssText = `
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            background: var(--text-primary);
            color: var(--bg-primary);
            padding: 12px 24px;
            border-radius: 8px;
            font-size: 18px;
            font-weight: 500;
            z-index: 1000;
            opacity: 0;
            transition: opacity 0.3s ease;
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
        `;
        
        document.body.appendChild(feedback);
        
        // Fade in
        setTimeout(() => {
            feedback.style.opacity = '1';
        }, 10);
        
        // Fade out and remove
        setTimeout(() => {
            feedback.style.opacity = '0';
            setTimeout(() => {
                if (feedback.parentNode) {
                    feedback.parentNode.removeChild(feedback);
                }
            }, 300);
        }, 2000);
    }

    advanceToReviewMode() {
        if (this.deckInit.length === 0) {
            alert('Please add at least one card before proceeding.');
            this.emptyInputCount = 0;
            return;
        }
        
        this.currentMode = 2;
        this.currentCardIndex = 0;
        this.practiceRemovedCount = 0; // Reset practice removed count when entering review mode
        this.reviewRightCount = 0; // Reset review right count when entering review mode
        this.showMode(2);
        this.displayCurrentCard();
        this.updateCardCounters(); // Update counters when entering review mode
    }

    displayCurrentCard() {
        if (this.currentMode === 2) {
            if (this.currentCardIndex < this.deckInit.length) {
                this.cardText.textContent = this.deckInit[this.currentCardIndex];
                // Apply text scaling to the card text
                updateTextScaling(this.cardText, this.deckInit[this.currentCardIndex]);
            } else {
                this.advanceToPracticeMode();
            }
        } else if (this.currentMode === 3) {
            if (this.deckNext.length > 0) {
                const randomIndex = Math.floor(Math.random() * this.deckNext.length);
                this.practiceCardText.textContent = this.deckNext[randomIndex];
                this.currentCardIndex = randomIndex;
                // Apply text scaling to the practice card text
                updateTextScaling(this.practiceCardText, this.deckNext[randomIndex]);
            } else {
                this.advanceToResetMode();
            }
        }
    }

    handleSwipeLeft() {
        if (this.currentMode === 2) {
            // Review mode: swipe left = store
            const card = this.deckInit[this.currentCardIndex];
            this.deckStorage.push(card);
            this.animateSwipe('left');
            this.currentCardIndex++;
            setTimeout(() => this.displayCurrentCard(), 300);
        } else if (this.currentMode === 3) {
            // Practice mode: swipe left = store
            const card = this.deckNext[this.currentCardIndex];
            this.deckStorage.push(card);
            this.deckNext.splice(this.currentCardIndex, 1);
            this.practiceRemovedCount++; // Increment practice removed count
            this.updateCardCounters(); // Update counters
            this.animateSwipe('left');
            setTimeout(() => this.displayCurrentCard(), 300);
        }
    }

    handleSwipeRight() {
        if (this.currentMode === 2) {
            // Review mode: swipe right = next
            const card = this.deckInit[this.currentCardIndex];
            this.deckNext.push(card);
            this.reviewRightCount++; // Increment review right count
            this.updateCardCounters(); // Update counters when card moves to next mode
            this.animateSwipe('right');
            this.currentCardIndex++;
            setTimeout(() => this.displayCurrentCard(), 300);
        } else if (this.currentMode === 3) {
            // Practice mode: swipe right = keep in deck
            this.animateSwipe('right');
            setTimeout(() => this.displayCurrentCard(), 300);
        }
    }

    animateSwipe(direction) {
        const cardElement = this.currentMode === 2 ? this.cardText : this.practiceCardText;
        cardElement.classList.add(`swipe-${direction}`);
        
        setTimeout(() => {
            cardElement.classList.remove(`swipe-${direction}`);
        }, 300);
    }

    advanceToPracticeMode() {
        this.currentMode = 3;
        this.currentCardIndex = 0;
        this.practiceRemovedCount = 0; // Reset practice removed count when entering practice mode
        this.showMode(3);
        this.displayCurrentCard();
        this.updateCardCounters(); // Update counters when entering practice mode
    }

    advanceToResetMode() {
        this.currentMode = 4;
        this.showMode(4);
        
        setTimeout(() => {
            this.resetToInputMode();
        }, 2000);
    }

    resetToInputMode() {
        // Move all cards from storage back to init
        this.deckInit = [...this.deckStorage];
        this.deckNext = [];
        this.deckStorage = [];
        this.currentMode = 1;
        this.currentCardIndex = 0;
        this.emptyInputCount = 0;
        this.practiceRemovedCount = 0; // Reset practice removed count
        this.reviewRightCount = 0; // Reset review right count
        
        this.saveToLocalStorage();
        this.showMode(1);
        this.updateCardCounters(); // Update counters after reset
    }

    showMode(mode) {
        // Hide all modes
        this.inputMode.classList.remove('active');
        this.reviewMode.classList.remove('active');
        this.practiceMode.classList.remove('active');
        this.resetMode.classList.remove('active');
        
        // Reset fade-out when switching modes
        this.resetFadeOut();
        
        // Show current mode
        switch (mode) {
            case 1:
                this.inputMode.classList.add('active');
                // Use setTimeout to ensure focus happens after DOM update
                setTimeout(() => {
                    this.cardInput.focus();
                    // Ensure cursor stays hidden when switching to input mode (only if user has interacted)
                    if (this.cursorHidden && this.cursor) {
                        this.cursor.style.display = 'none';
                    }
                }, 0);
                break;
            case 2:
                this.reviewMode.classList.add('active');
                break;
            case 3:
                this.practiceMode.classList.add('active');
                break;
            case 4:
                this.resetMode.classList.add('active');
                break;
        }
    }

    saveToLocalStorage() {
        localStorage.setItem('cardLearningSystem', JSON.stringify({
            deckInit: this.deckInit,
            deckNext: this.deckNext,
            deckStorage: this.deckStorage,
            practiceRemovedCount: this.practiceRemovedCount
        }));
    }

    loadFromLocalStorage() {
        const saved = localStorage.getItem('cardLearningSystem');
        if (saved) {
            const data = JSON.parse(saved);
            this.deckInit = data.deckInit || [];
            this.deckNext = data.deckNext || [];
            this.deckStorage = data.deckStorage || [];
            this.practiceRemovedCount = data.practiceRemovedCount || 0; // Load practice removed count
        }
        this.updateCardCounters(); // Update counters after loading data
    }

    clearMemory() {
        // Clear all decks
        this.deckInit = [];
        this.deckNext = [];
        this.deckStorage = [];
        this.currentCardIndex = 0;
        this.emptyInputCount = 0;
        this.practiceRemovedCount = 0; // Clear practice removed count
        this.reviewRightCount = 0; // Clear review right count
        
        // Clear localStorage
        localStorage.removeItem('cardLearningSystem');
        this.updateCardCounters(); // Update counters after clearing
    }

    updateCardCounters() {
        if (this.deckCountElement) {
            // In review mode (mode 2), show count of cards moved right during current session
            // In practice mode (mode 3), show current practice deck size
            // In other modes, show total deck size
            if (this.currentMode === 2) {
                this.deckCountElement.textContent = this.reviewRightCount;
            } else if (this.currentMode === 3) {
                this.deckCountElement.textContent = this.deckNext.length;
            } else {
                this.deckCountElement.textContent = this.deckInit.length;
            }
        }
        if (this.practiceRemovedElement) {
            this.practiceRemovedElement.textContent = this.practiceRemovedCount;
        }
    }

    toggleFullscreen() {
        if (!document.fullscreenElement) {
            // Enter fullscreen
            if (document.documentElement.requestFullscreen) {
                document.documentElement.requestFullscreen();
            } else if (document.documentElement.webkitRequestFullscreen) {
                document.documentElement.webkitRequestFullscreen();
            } else if (document.documentElement.msRequestFullscreen) {
                document.documentElement.msRequestFullscreen();
            }
        } else {
            // Exit fullscreen
            if (document.exitFullscreen) {
                document.exitFullscreen();
            } else if (document.webkitExitFullscreen) {
                document.webkitExitFullscreen();
            } else if (document.msExitFullscreen) {
                document.msExitFullscreen();
            }
        }
    }
}

// Debounced text scaling for better performance
let textScalingTimeout;
function debouncedTextScaling(element, text) {
    clearTimeout(textScalingTimeout);
    textScalingTimeout = setTimeout(() => {
        updateTextScaling(element, text);
    }, 100); // 100ms delay
}

// Dynamic text scaling based on content length and window size
function updateTextScaling(element, text) {
    if (!element || !text) return;
    
    const windowWidth = window.innerWidth;
    const windowHeight = window.innerHeight;
    const maxWidth = windowWidth * 0.9; // 90% of window width
    const maxHeight = windowHeight * 0.8; // 80% of window height
    
    // Start with the base font size from dynamic scaling
    const baseFontSize = getComputedStyle(element).fontSize;
    const baseSize = parseFloat(baseFontSize);
    
    // Create a temporary element to measure text dimensions
    const tempElement = document.createElement('div');
    tempElement.style.cssText = `
        position: absolute;
        visibility: hidden;
        white-space: pre-wrap;
        word-wrap: break-word;
        font-family: ${getComputedStyle(element).fontFamily};
        font-weight: ${getComputedStyle(element).fontWeight};
        line-height: ${getComputedStyle(element).lineHeight};
        padding: ${getComputedStyle(element).padding};
        margin: ${getComputedStyle(element).margin};
    `;
    tempElement.textContent = text;
    document.body.appendChild(tempElement);
    
    // Binary search for the optimal font size
    let minSize = 8; // Minimum font size
    let maxSize = baseSize;
    let optimalSize = baseSize;
    
    while (minSize <= maxSize) {
        const testSize = (minSize + maxSize) / 2;
        tempElement.style.fontSize = `${testSize}px`;
        
        const textWidth = tempElement.offsetWidth;
        const textHeight = tempElement.offsetHeight;
        
        if (textWidth <= maxWidth && textHeight <= maxHeight) {
            optimalSize = testSize;
            minSize = testSize + 1;
        } else {
            maxSize = testSize - 1;
        }
    }
    
    // Clean up temporary element
    document.body.removeChild(tempElement);
    
    // Apply the optimal font size with smooth transition
    element.style.fontSize = `${optimalSize}px`;
}

// Enhanced dynamic scaling function that includes text content scaling
function updateDynamicScaling() {
    const windowWidth = window.innerWidth;
    const windowHeight = window.innerHeight;
    const windowArea = windowWidth * windowHeight;
    
    // Base sizes for reference (160x80 = 12800 pixels)
    const baseArea = 160 * 80;
    const scaleFactor = Math.sqrt(windowArea / baseArea);
    
    // Counter scaling - scale down as window gets smaller
    const counterElements = document.querySelectorAll('.card-counter span');
    const baseCounterSize = 24; // Base font size
    const minCounterSize = 8; // Minimum font size
    const maxCounterSize = 32; // Maximum font size
    
    // Inverse scaling for counters - smaller window = smaller counters
    const counterScale = Math.max(minCounterSize, Math.min(maxCounterSize, baseCounterSize / scaleFactor));
    
    counterElements.forEach(element => {
        element.style.fontSize = `${counterScale}px`;
    });
    
    // Card text scaling - scale up as window gets smaller to maintain prominence
    const cardTextElements = document.querySelectorAll('#card-text, #practice-card-text, #card-input, #cursor');
    const baseCardSize = 6; // Base vw size
    const minCardSize = 8; // Minimum vw size
    
    // Maximum size should never exceed the title font size
    // Title uses: 5vw base, 7vw mobile, 9vw small screens
    let maxCardSize;
    if (windowWidth <= 480) {
        maxCardSize = 9; // Small screens: 9vw
    } else if (windowWidth <= 768) {
        maxCardSize = 7; // Mobile: 7vw
    } else {
        maxCardSize = 5; // Desktop: 5vw
    }
    
    // Direct scaling for card text - smaller window = larger text
    const cardScale = Math.max(minCardSize, Math.min(maxCardSize, baseCardSize * scaleFactor));
    
    cardTextElements.forEach(element => {
        // Set base font size first
        element.style.fontSize = `${cardScale}vw`;
        
        // Then apply content-based scaling if there's text (but not for cursor)
        if (element.textContent && element.textContent.trim() && element.id !== 'cursor') {
            updateTextScaling(element, element.textContent);
        }
    });
    
    // Watermark opacity - fade out as window gets smaller
    const watermark = document.querySelector('.watermark');
    const baseOpacity = 0.6; // Base opacity
    const minOpacity = 0.1; // Minimum opacity
    const maxOpacity = 0.8; // Maximum opacity
    
    // Inverse scaling for watermark - smaller window = lower opacity
    const watermarkOpacity = Math.max(minOpacity, Math.min(maxOpacity, baseOpacity / scaleFactor));
    
    if (watermark) {
        watermark.style.opacity = watermarkOpacity;
    }
    
    // Adjust counter positions based on window size
    const leftCounter = document.getElementById('left-counter');
    const rightCounter = document.getElementById('right-counter');
    
    if (leftCounter && rightCounter) {
        const baseMargin = 30;
        const minMargin = 10;
        const maxMargin = 50;
        const marginScale = Math.max(minMargin, Math.min(maxMargin, baseMargin / scaleFactor));
        
        leftCounter.style.left = `${marginScale}px`;
        rightCounter.style.right = `${marginScale}px`;
    }
}

// Initialize scaling on load
document.addEventListener('DOMContentLoaded', () => {
    updateDynamicScaling();
    
    // Update scaling on window resize
    let resizeTimeout;
    window.addEventListener('resize', () => {
        clearTimeout(resizeTimeout);
        resizeTimeout = setTimeout(updateDynamicScaling, 100);
    });
    
    // Listen for scaling updates from main process
    if (typeof require !== 'undefined') {
        const { ipcRenderer } = require('electron');
        ipcRenderer.on('update-scaling', () => {
            setTimeout(updateDynamicScaling, 50);
        });
    }
    
    const cardSystem = new CardLearningSystem();
    
    // Ensure focus on input field and reset fade-out after title screen (1.8s total)
    setTimeout(() => {
        const cardInput = document.getElementById('card-input');
        if (cardInput) {
            cardInput.focus();
        }
        // Reset fade-out on page load
        cardSystem.resetFadeOut();
    }, 1800); // Wait for title screen to complete
});
