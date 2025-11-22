# Planning Guide

A simple, addictive side-scrolling runner game where players jump over obstacles to survive as long as possible and rack up their high score.

**Experience Qualities**:
1. **Immediate** - Players should be able to start playing within seconds with zero learning curve
2. **Responsive** - Every jump and collision should feel tight and satisfying with no input lag
3. **Progressive** - Difficulty ramps through structured levels, rewarding skill and persistence with clear milestones

**Complexity Level**: Light Application (multiple features with basic state)
  - A focused runner game with structured progression across 10 levels, persistent high score tracking, and state management for level advancement

## Essential Features

### Jump Mechanic
- **Functionality**: Player character jumps when spacebar is pressed
- **Purpose**: Core interaction that determines success or failure
- **Trigger**: Spacebar key press
- **Progression**: Player sees obstacle → presses spacebar → character jumps in arc → lands back on ground → repeats
- **Success criteria**: Jump feels responsive (<100ms), arc feels natural with gravity, player can chain jumps

### Obstacle System
- **Functionality**: Obstacles spawn at random intervals and scroll toward the player
- **Purpose**: Creates challenge and tests player timing
- **Trigger**: Game loop automatically spawns obstacles based on elapsed time
- **Progression**: Obstacle spawns off-screen right → scrolls left toward player → player jumps or collides → obstacle exits left side
- **Success criteria**: Obstacles appear random but fair, spacing allows skilled players to survive indefinitely

### Collision Detection
- **Functionality**: Game detects when player hits an obstacle and ends the game
- **Purpose**: Provides consequence and drives replay loop
- **Trigger**: Player character overlaps with obstacle hitbox
- **Progression**: Collision detected → game stops → final score displayed → restart prompt shown
- **Success criteria**: Collisions feel fair and predictable, no false positives

### Score System
- **Functionality**: Tracks current score and persistent high score
- **Purpose**: Provides progression and motivation to improve
- **Trigger**: Score increments continuously while alive
- **Progression**: Game starts → score counts up → player dies → score compared to high score → high score updated if beaten
- **Success criteria**: Score is clearly visible, high score persists between sessions, gives sense of achievement

### Game States
- **Functionality**: Manages start screen, playing state, level complete state, and game over state
- **Purpose**: Provides structure, progression, and restart capability
- **Trigger**: Spacebar to start, collision to end, 30 seconds survival to complete level
- **Progression**: Start screen → press spacebar → playing → 30 seconds → level complete screen → next level → playing (repeat up to level 10) → game over
- **Success criteria**: Transitions are clear, controls are consistent, easy to continue/restart

### Level Progression
- **Functionality**: Players progress through 10 levels, each lasting 30 seconds with 5% speed increase
- **Purpose**: Provides structured difficulty progression and sense of achievement
- **Trigger**: Surviving 30 seconds without collision advances to next level
- **Progression**: Level 1 → survive 30s → Level 2 (+5% speed) → survive 30s → ... → Level 10 → complete game
- **Success criteria**: Speed increase is noticeable but not overwhelming, level indicator is clearly visible, victory celebration for completing all levels

## Edge Case Handling
- **Multiple simultaneous obstacles** - Ensure spacing never makes it impossible to survive
- **Held spacebar** - Prevent infinite jumping; require key release between jumps
- **Tab blur** - Pause game when window loses focus to prevent unfair deaths
- **Rapid restarts** - Reset all game state properly including level counter
- **Ultra-high scores** - Display large numbers readably
- **Level 10 completion** - Clear victory state when all levels complete
- **Mid-level restart** - Restarting resets to level 1

## Design Direction
The design should feel energetic and playful with retro arcade influences, featuring bold geometric shapes, high contrast colors, and smooth animations that make the simple jumping mechanic feel satisfying and responsive - minimal interface that keeps focus on the action.

## Color Selection
Complementary (opposite colors) - Using a vibrant blue/orange scheme to create high energy and clear visual distinction between player and obstacles, evoking classic arcade games while feeling modern.

- **Primary Color**: Deep cyan blue (oklch(0.55 0.15 230)) - represents the player character, communicates trust and control
- **Secondary Colors**: Rich navy (oklch(0.25 0.08 240)) for UI elements and ground, creates depth without competing for attention
- **Accent Color**: Vibrant orange (oklch(0.68 0.18 45)) - used for obstacles and danger elements, immediately grabs attention
- **Foreground/Background Pairings**:
  - Background (Light cream oklch(0.97 0.01 85)): Dark navy text (oklch(0.25 0.08 240)) - Ratio 12.1:1 ✓
  - Card (White oklch(0.99 0 0)): Dark navy text (oklch(0.25 0.08 240)) - Ratio 13.5:1 ✓
  - Primary (Deep cyan oklch(0.55 0.15 230)): White text (oklch(0.99 0 0)) - Ratio 5.2:1 ✓
  - Accent (Vibrant orange oklch(0.68 0.18 45)): Dark navy text (oklch(0.25 0.08 240)) - Ratio 6.8:1 ✓
  - Muted (Soft gray oklch(0.88 0.01 240)): Dark navy text (oklch(0.25 0.08 240)) - Ratio 9.2:1 ✓

## Font Selection
The typeface should feel bold, geometric, and slightly rounded to match the playful arcade aesthetic while maintaining excellent readability for score displays - using Inter for its clean geometric forms and excellent number legibility.

- **Typographic Hierarchy**:
  - H1 (Score Display): Inter Bold/48px/tight letter-spacing - dominant and instantly readable
  - H2 (Game Over): Inter Bold/36px/normal letter-spacing - clear end state messaging
  - Body (Instructions): Inter Medium/18px/relaxed letter-spacing - subtle but legible guidance
  - Small (High Score Label): Inter SemiBold/14px/wide letter-spacing - persistent context

## Animations
Animations should feel snappy and arcade-like with slight anticipation and follow-through on the jump to make it feel weighty and satisfying, while obstacles maintain steady linear motion for predictability.

- **Purposeful Meaning**: The jump arc should feel physically grounded with proper acceleration, while game over should have a brief dramatic pause before showing results to let the moment land
- **Hierarchy of Movement**: Player jump is the hero animation with easing, obstacles move with constant velocity for predictability, UI transitions are quick fades to avoid disrupting focus

## Component Selection
- **Components**: 
  - Card component for game over and level complete overlays with centered displays
  - Button component styled as text link for restart/continue actions
  - Custom canvas element for game rendering (player, obstacles, ground)
  - Badge component for high score and level indicators
  
- **Customizations**: 
  - Custom game canvas component managing animation loop and input
  - Styled player square with rounded corners matching --radius
  - Geometric obstacle shapes (rectangles/triangles) in accent color
  
- **States**: 
  - Buttons: Only restart text, simple hover with color shift to accent
  - Game canvas: Visual feedback for jump (slight squash/stretch), collision flash
  - Score display: Smooth number increment, highlight when beating high score
  
- **Icon Selection**: 
  - Space key icon (Command from phosphor-icons) for start instruction
  - Trophy icon (Trophy from phosphor-icons) for high score display
  - Play icon (Play from phosphor-icons) for restart action
  
- **Spacing**: 
  - Game container: p-8 on desktop, p-4 on mobile
  - UI elements: gap-4 for related items, gap-8 for major sections
  - Canvas padding: 20px internal padding for game boundaries
  
- **Mobile**: 
  - Canvas scales to fill viewport width while maintaining aspect ratio
  - Tap anywhere on screen acts as jump input in addition to spacebar
  - Score display repositions to top-left corner on small screens
  - Instructions simplified to "TAP TO JUMP" on touch devices
