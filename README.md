# Card Learning System

A fullscreen web application for creating and reviewing learning cards with a minimalist black and white design.

## Features

- **Fullscreen Design**: Optimized for any web browser with responsive scaling
- **Minimalist Interface**: Stark black and white contrast with clean typography
- **Four Learning Modes**: Complete card management workflow
- **Touch & Keyboard Support**: Works on both mobile and desktop devices
- **Local Storage**: Cards persist between sessions

## How to Use

### Mode 1: Input Mode
- Type any text to create learning cards
- Text scales automatically based on length
- Press **Enter** to save each card
- Press **Enter** three times on empty input to advance to review mode
- Press **Backspace** on empty input to clear all memory

### Mode 2: Review Mode
- Review cards from your initial deck
- **Swipe Right** or press **→**: Move card to next deck
- **Swipe Left** or press **←**: Store card permanently
- Continue until all cards are sorted

### Mode 3: Practice Mode
- Practice with cards from the next deck (random selection)
- **Swipe Right** or press **→**: Keep card in deck for more practice
- **Swipe Left** or press **←**: Store card permanently
- Continues infinitely until all cards are stored

### Mode 4: Reset Mode
- Automatically moves all stored cards back to initial deck
- Returns to input mode to add more cards
- Cycle repeats for continuous learning

## Controls

### Mobile/Touch
- **Tap and swipe** left or right on cards
- **Tap** input field to type

### Desktop
- **Arrow keys** (←/→) for swiping
- **Enter** key for input confirmation
- **Backspace** key on empty input to clear memory
- **Mouse click and drag** for swiping

## Getting Started

1. Open `index.html` in any modern web browser
2. The application will open in fullscreen input mode
3. Start typing your learning cards
4. Follow the on-screen instructions for each mode

## Technical Details

- **No Dependencies**: Pure HTML, CSS, and JavaScript
- **Responsive Design**: Scales text appropriately for any screen size
- **Local Storage**: Data persists in browser's localStorage
- **Cross-Platform**: Works on desktop, tablet, and mobile devices

## File Structure

```
MUSICHOUSE/
├── index.html      # Main HTML file
├── styles.css      # CSS styling and animations
├── script.js       # JavaScript application logic
└── README.md       # This file
```

## Browser Compatibility

- Chrome/Chromium
- Firefox
- Safari
- Edge
- Mobile browsers (iOS Safari, Chrome Mobile)

The application uses modern web standards and should work in any browser that supports ES6 classes and localStorage.
