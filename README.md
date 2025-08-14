# FOCUS CARDS

A minimalist, fullscreen web application for managing tasks, chores, exercises, and any other items you want to focus on. Built with a clean black and white design that helps you stay focused on what matters.

## 👋 A Personal Note from the Creator

Hi there! This is my first app, and I'm excited to share it with you. 

The idea for FOCUS CARDS came from my own daily struggles with getting things done. I found myself using physical study cards to break down my morning routines, workout sessions, and daily chores into manageable pieces. When I couldn't get into my morning groove, I'd pull out my "morning motivation" cards. When I needed to work out, I had a dedicated set for that too.

I wanted to capture that hands-on, tactile feeling of flipping through physical cards in a digital tool that's simple, intuitive, and actually helps you focus. No overwhelming features, no complex interfaces—just the essential workflow that makes study cards so effective. However, there are a lot of invisible features, that you can read about in the documentation or just find out by using the thing.

The app is available both as a simple HTML file you can open in any browser and as a Windows 11 executable, so you can use it however works best for your workflow.

I hope this tool helps you tackle your daily tasks with the same clarity and focus that those physical cards gave me!

## 🎯 What is FOCUS CARDS?

FOCUS CARDS is a productivity tool that helps you organize and tackle your tasks through a simple three-mode workflow. Whether you have chores to do, breathing exercises to practice, or any other items you want to focus on, this app helps you prioritize and complete them systematically.

## ✨ Features

- **Minimalist Design**: Clean black and white interface for distraction-free focus
- **Three-Mode Workflow**: Input → Review → Focus
- **Touch & Keyboard Support**: Works seamlessly on mobile and desktop
- **Local Storage**: Your cards persist between sessions
- **Auto-Fade UI**: Interface elements fade out during inactivity for cleaner focus
- **Color Schemes**: Multiple calming color themes that start randomly on each load
- **Responsive Design**: Optimized for any screen size
- **Bulk Card Input**: Paste lists of cards separated by semicolons (;) for quick input
- **Fullscreen Mode**: Press F during startup to enter fullscreen mode in browsers
- **Dynamic Color Refresh**: Refresh the page to get a new random color scheme

## 🔍 All Input Features & Hidden Functionality

### **🎯 Core Input Features**

1. **Text Input Field**
   - Type any task, chore, exercise, or focus item
   - Press **Enter** to save each card
   - Real-time cursor positioning that follows text length

2. **Bulk Card Input (Hidden Feature)**
   - Paste multiple cards separated by semicolons (`;`)
   - Automatically splits and adds all cards at once
   - Shows feedback: "Added X cards" notification
   - Example: `"Task 1; Task 2; Task 3"` adds 3 cards instantly

3. **Mode Advancement**
   - Press **Enter three times** on empty input to finish input mode
   - Moves to review mode automatically

### **🗑️ Memory Management (Hidden Features)**

4. **Clear All Memory**
   - Press **Backspace** on empty input field
   - Completely clears all cards from all decks
   - Removes data from localStorage

### **🎮 Navigation & Controls**

5. **Touch/Mobile Controls**
   - **Tap and swipe** left/right on cards
   - **Tap and hold** to see swipe instructions
   - **Tap** input field to focus

6. **Desktop Controls**
   - **Arrow keys** (←/→) for swiping cards
   - **Enter** key for input confirmation
   - **Mouse click and drag** for swiping
   - **Backspace** on empty input to clear memory

7. **Secret Fullscreen Shortcut (Hidden Feature)**
   - Press **F key** during title screen (first 1.8 seconds)
   - Toggles fullscreen mode in browser
   - Only works during startup animation

### **🎨 Visual & UI Features**

8. **Auto-Fade UI (Hidden Feature)**
   - Interface elements fade out after 3 seconds of inactivity
   - Counters, instructions, arrows, and icons disappear
   - Any activity (mouse, keyboard, touch) resets the fade timer
   - Creates distraction-free focus environment

9. **Dynamic Color Schemes (Hidden Feature)**
   - 6 different color themes: default, warm, ocean, lavender, sage, minimal
   - Randomly selected on each page load/refresh
   - Refresh page to get new random color scheme

10. **Title Screen Animation**
    - 1.8-second startup animation with fade in/out
    - Watermark appears after 0.4 seconds
    - Fullscreen shortcut only available during this period

### **📊 Progress Tracking**

11. **Smart Card Counters**
    - **Left counter**: Shows different values based on current mode
      - Input mode: Total cards in deck
      - Review mode: Cards moved to focus pile (current session)
      - Practice mode: Remaining cards in focus pile
    - **Right counter**: Cards completed/removed in practice mode

12. **Session Tracking**
    - Tracks cards moved right during review session
    - Tracks cards removed during practice session
    - Resets counters appropriately when switching modes

### **💾 Data Persistence**

13. **Local Storage**
    - All cards persist between browser sessions
    - Saves deck states, counters, and progress
    - Works offline without internet connection

### **🔄 Workflow Features**

14. **Three-Mode Workflow**
    - **Mode 1 (Input)**: Add cards with text input or bulk paste
    - **Mode 2 (Review)**: Swipe right to focus pile, left to storage
    - **Mode 3 (Practice)**: Work with focus pile, swipe left to complete
    - **Mode 4 (Reset)**: Auto-returns to input mode with stored cards restored

15. **Automatic Mode Transitions**
    - Input → Review: After 3 empty enters
    - Review → Practice: When all cards reviewed
    - Practice → Reset: When focus pile empty
    - Reset → Input: After 2 seconds with stored cards restored

### **🎯 Advanced Features**

16. **Random Card Display**
    - Practice mode shows cards in random order
    - Keeps scrolling until you find what you want to do

17. **Swipe Animations**
    - Visual feedback for left/right swipes
    - 300ms animation duration

18. **Responsive Design**
    - Works on any screen size
    - Touch-friendly on mobile devices
    - Keyboard-friendly on desktop

19. **Progressive Web App Ready**
    - Can be installed on mobile devices
    - Works offline
    - No dependencies or build process required

### **🔧 Technical Hidden Features**

20. **Activity Tracking**
    - Monitors mouse movement, keyboard input, touch events, clicks, and scrolling
    - Used for fade-out timer management

21. **Text Width Calculation**
    - Dynamically calculates cursor position based on text length
    - Uses canvas for precise text measurement

22. **Cross-Browser Fullscreen Support**
    - Supports multiple browser fullscreen APIs
    - Webkit, Mozilla, and standard implementations

## 🚀 How to Use

### Mode 1: Input Cards
- **Type anything** you want to focus on: chores, exercises, todo items, etc.
- Press **Enter** to save each card
- **Bulk Input**: Paste multiple cards separated by semicolons (;) for quick input
- Press **Enter three times** on empty input to finish and move to review mode
- Press **Backspace** on empty input to clear all memory

### Mode 2: Review & Prioritize
- See all your cards one by one
- **Swipe Right** (→) or press **→**: Move card to your "focus pile" (cards you want to tackle now)
- **Swipe Left** (←) or press **←**: Store card for later (keeps it in memory for next session)
- Continue until all cards are sorted

### Mode 3: Focus & Complete
- Work with only your preselected "focus pile" cards
- Cards appear in random order - keep scrolling until you find what you want to do
- **Swipe Right** (→) or press **→**: Keep card in pile (for more practice or later)
- **Swipe Left** (←) or press **←**: Remove card from pile (mark as completed)
- When counter reaches 0, you've completed all your focus items!
- App automatically returns to Mode 1 with your stored cards still in memory

## 🎮 Controls

### Mobile/Touch
- **Tap and swipe** left or right on cards
- **Tap** input field to type
- **Tap and hold** to see swipe instructions

### Desktop
- **Arrow keys** (←/→) for swiping cards
- **Enter** key for input confirmation
- **Backspace** key on empty input to clear memory
- **Mouse click and drag** for swiping
- **F key** during startup to enter fullscreen mode

## 💡 Use Cases

- **Daily Chores**: Input all your household tasks, prioritize the important ones, then tackle them systematically
- **Breathing Exercises**: Create cards for different breathing techniques and practice them randomly
- **Study Topics**: Input subjects you need to review, prioritize the most important ones
- **Work Tasks**: Organize your work items and focus on the highest priority ones
- **Personal Goals**: Break down larger goals into smaller, manageable cards

## 🛠️ Getting Started

1. **Download** or clone this repository
2. **Open** `index.html` in any modern web browser
3. **Start typing** your first card
4. **Follow the on-screen instructions** for each mode

No installation, no dependencies, no setup required!

## 📱 Browser Compatibility

- ✅ Chrome/Chromium
- ✅ Firefox
- ✅ Safari
- ✅ Edge
- ✅ Mobile browsers (iOS Safari, Chrome Mobile)

## 🏗️ Technical Details

- **Pure Web Technologies**: HTML, CSS, and JavaScript only
- **No Dependencies**: Works offline without any external libraries
- **Local Storage**: Your data stays private and local to your browser
- **Responsive Design**: Automatically scales for any screen size
- **Modern Web Standards**: Uses ES6 classes and modern CSS features

## 📁 File Structure

```
focus-cards/
├── index.html      # Main HTML file
├── styles.css      # CSS styling and animations
├── script.js       # JavaScript application logic
└── README.md       # This documentation
```

## 🤝 Contributing

This is a simple, focused tool. If you have ideas for improvements that maintain the minimalist philosophy, feel free to:

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

## 🙏 Acknowledgments

Built with focus and simplicity in mind. Perfect for anyone who wants to stay organized without the complexity of modern productivity apps.

---

**Stay focused. Get things done.**
