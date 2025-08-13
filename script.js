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
        
        this.initializeElements();
        this.setupEventListeners();
        this.setupInactivityTracking();
        this.loadFromLocalStorage();
        this.updateCardCounters(); // Initialize counters
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
    }

    setupEventListeners() {
        // Input mode events
        this.cardInput.addEventListener('input', (e) => {
            this.updateCursorPosition(e.target.value);
            this.resetFadeOut(); // Reset fade-out on input
        });

        this.cardInput.addEventListener('keydown', (e) => {
            this.resetFadeOut(); // Reset fade-out on keydown
            if (e.key === 'Enter') {
                e.preventDefault();
                this.handleInputEnter();
            } else if (e.key === 'Backspace' && this.cardInput.value === '') {
                e.preventDefault();
                this.clearMemory();
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

    updateCursorPosition(text) {
        // Update cursor position based on text length
        const textWidth = this.getTextWidth(text, '4vw');
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
            this.emptyInputCount = 0;
            this.deckInit.push(text);
            this.saveToLocalStorage();
            this.updateCardCounters(); // Update counters when card is added
        }
        
        this.cardInput.value = '';
        this.updateCursorPosition('');
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
            } else {
                this.advanceToPracticeMode();
            }
        } else if (this.currentMode === 3) {
            if (this.deckNext.length > 0) {
                const randomIndex = Math.floor(Math.random() * this.deckNext.length);
                this.practiceCardText.textContent = this.deckNext[randomIndex];
                this.currentCardIndex = randomIndex;
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
                setTimeout(() => this.cardInput.focus(), 0);
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
}

// Initialize the application when the page loads
document.addEventListener('DOMContentLoaded', () => {
    const cardSystem = new CardLearningSystem();
    
    // Ensure focus on input field when page loads
    setTimeout(() => {
        const cardInput = document.getElementById('card-input');
        if (cardInput) {
            cardInput.focus();
        }
        // Reset fade-out on page load
        cardSystem.resetFadeOut();
    }, 100);
});
