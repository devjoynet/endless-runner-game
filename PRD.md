# Planning Guide

A simple, addictive side-scrolling runner game where players jump over obstacles to survive as long as possible, rack up their high score, earn points, and purchase power-ups from the shop to enhance their gameplay.

**Experience Qualities**:
1. **Immediate** - Players should be able to start playing within seconds with zero learning curve
2. **Responsive** - Every jump and collision should feel tight and satisfying with no input lag
3. **Progressive** - Difficulty ramps through structured levels, with an economy system that rewards continued play and strategic power-up usage

**Complexity Level**: Light Application (multiple features with basic state)
  - A focused runner game with structured progression across 10 levels, persistent high score tracking, point economy system, and shop with purchasable power-ups

## Essential Features

### Jump Mechanic
- **Functionality**: Player character jumps when spacebar is pressed or screen is tapped
- **Purpose**: Core interaction that determines success or failure
- **Trigger**: Spacebar key press or touch input
- **Progression**: Player sees obstacle → presses spacebar → character jumps in arc → lands back on ground → repeats
- **Success criteria**: Jump feels responsive (<100ms), arc feels natural with gravity, player can chain jumps

### Obstacle System
- **Functionality**: Obstacles spawn at random intervals and scroll toward the player
- **Purpose**: Creates challenge and tests player timing
- **Trigger**: Game loop automatically spawns obstacles based on elapsed time
- **Progression**: Obstacle spawns off-screen right → scrolls left toward player → player jumps or collides → obstacle exits left side
- **Success criteria**: Obstacles appear random but fair, spacing allows skilled players to survive indefinitely

### Collision Detection
- **Functionality**: Game detects when player hits an obstacle and ends the game (unless shield is active)
- **Purpose**: Provides consequence and drives replay loop
- **Trigger**: Player character overlaps with obstacle hitbox
- **Progression**: Collision detected → shield absorbs (if active) OR game stops → final score displayed → restart prompt shown
- **Success criteria**: Collisions feel fair and predictable, no false positives

### Score System
- **Functionality**: Tracks current score and persistent high score, with 2x multiplier when active
- **Purpose**: Provides progression and motivation to improve
- **Trigger**: Score increments continuously while alive
- **Progression**: Game starts → score counts up (x2 if multiplier active) → player dies → score compared to high score → high score updated if beaten
- **Success criteria**: Score is clearly visible, high score persists between sessions, multiplier effect is obvious

### Point Accumulation System
- **Functionality**: Players earn points equal to 50% of their score after each game
- **Purpose**: Creates long-term progression and motivation to keep playing
- **Trigger**: Game over or level 10 completion
- **Progression**: Game ends → points calculated (score / 2) → points added to total → notification shown → can be spent in shop
- **Success criteria**: Point calculation is clear, points persist between sessions, points balance always visible

### Shop System
- **Functionality**: Modal shop interface where players spend points on power-ups
- **Purpose**: Provides strategic choices and goals beyond high score
- **Trigger**: Click/tap shop button in header
- **Progression**: Open shop → view available power-ups → purchase with points → owned items shown in inventory
- **Success criteria**: Clear pricing, purchase confirmation, inventory tracking, cannot buy without sufficient points

### Power-Up System
- **Functionality**: Five distinct power-ups that modify gameplay when activated
- **Purpose**: Adds strategic depth and variety to gameplay
- **Trigger**: Activate power-ups from start screen before beginning game
- **Progression**: Purchase in shop → activate on start screen → power-up takes effect during game → consumed after use
- **Success criteria**: Power-ups work as described, visual indicators during gameplay, clear activation interface

#### Extra Life (150 points)
- Resume from where you died once instead of game over
- Shows "Extra Life Active" badge during gameplay
- Consumed when player would die

#### Low Gravity (100 points)
- Jump 30% higher and fall 40% slower for one game
- Shows "Low Gravity" badge during gameplay
- Active for entire game, consumed after game ends

#### Slow Motion (120 points)
- Reduce game speed by 30% for one game
- Shows "Slow Motion" badge during gameplay
- Active for entire game, consumed after game ends

#### Shield (180 points)
- Survive one collision without dying
- Shows "Shield" badge during gameplay
- Consumed immediately when collision occurs

#### Point Multiplier (200 points)
- Earn 2x points for one game
- Shows "2x Points" badge during gameplay
- Active for entire game, consumed after game ends

### Game States
- **Functionality**: Manages start screen (with power-up activation), playing state, level complete state, and game over state
- **Purpose**: Provides structure, progression, and restart capability
- **Trigger**: Start button or spacebar to start, collision to end, 30 seconds survival to complete level
- **Progression**: Start screen (activate power-ups) → start game → playing → 30 seconds → level complete screen → next level → playing (repeat up to level 10) → game over (earn points)
- **Success criteria**: Transitions are clear, power-up activation is intuitive, controls are consistent

### Level Progression
- **Functionality**: Players progress through 10 levels, each lasting 30 seconds with 5% speed increase
- **Purpose**: Provides structured difficulty progression and sense of achievement
- **Trigger**: Surviving 30 seconds without collision advances to next level
- **Progression**: Level 1 → survive 30s → Level 2 (+5% speed) → survive 30s → ... → Level 10 → complete game (earn bonus points)
- **Success criteria**: Speed increase is noticeable but not overwhelming, level indicator is clearly visible

### Statistics Tracking
- **Functionality**: Tracks and displays comprehensive game statistics
- **Purpose**: Provides players with insights into their performance
- **Trigger**: Click stats button in header
- **Progression**: Click button → modal opens → view stats (high score, total games, average score, levels completed, total jumps, games won, win rate)
- **Success criteria**: All stats accurately tracked, clearly presented, persist between sessions

### Theme Toggle
- **Functionality**: Switch between light and dark themes
- **Purpose**: Provides visual customization and comfort for different lighting conditions
- **Trigger**: Click theme toggle button in bottom left corner
- **Progression**: Click button → theme switches → preference saved → applies immediately to all UI components and game canvas
- **Success criteria**: Theme persists between sessions, all components remain visually accessible in both themes, default to dark theme

## Edge Case Handling
- **Multiple simultaneous obstacles** - Ensure spacing never makes it impossible to survive
- **Held spacebar** - Prevent infinite jumping; require key release between jumps
- **Tab blur** - Pause game when window loses focus to prevent unfair deaths
- **Rapid restarts** - Reset all game state properly including level counter and active power-ups
- **Ultra-high scores** - Display large numbers readably
- **Level 10 completion** - Clear victory state when all levels complete, award points
- **Power-up conflicts** - Cannot activate same power-up twice, clear messaging
- **Insufficient points** - Cannot purchase without enough points, show how many more needed
- **Extra life during extra life** - Cannot activate second extra life while one is active
- **Shop during gameplay** - Can open shop anytime, but power-ups only activate on start screen

## Design Direction
The design should feel energetic and playful with retro arcade influences, featuring bold geometric shapes, high contrast colors, and smooth animations that make the simple jumping mechanic feel satisfying and responsive - minimal interface that keeps focus on the action while prominently displaying progression systems (points, shop, power-ups).

## Color Selection
Complementary (opposite colors) - Using a vibrant blue/orange scheme to create high energy and clear visual distinction between player and obstacles, evoking classic arcade games while feeling modern. Includes both light and dark themes with a toggle in the bottom left corner, defaulting to dark mode.

- **Primary Color**: Deep cyan blue (oklch(0.55 0.15 230) light / oklch(0.60 0.18 230) dark) - represents the player character, communicates trust and control
- **Secondary Colors**: Rich navy (oklch(0.25 0.08 240) light / oklch(0.28 0.04 240) dark) for UI elements and ground, creates depth without competing for attention
- **Accent Color**: Vibrant orange (oklch(0.68 0.18 45) light / oklch(0.72 0.20 45) dark) - used for obstacles, power-ups, and points display, immediately grabs attention

- **Light Theme Foreground/Background Pairings**:
  - Background (Light cream oklch(0.97 0.01 85)): Dark navy text (oklch(0.25 0.08 240)) - Ratio 12.1:1 ✓
  - Card (White oklch(0.99 0 0)): Dark navy text (oklch(0.25 0.08 240)) - Ratio 13.5:1 ✓
  - Primary (Deep cyan oklch(0.55 0.15 230)): White text (oklch(0.99 0 0)) - Ratio 5.2:1 ✓
  - Accent (Vibrant orange oklch(0.68 0.18 45)): White text (oklch(0.99 0 0)) - Ratio 5.5:1 ✓
  - Muted (Soft gray oklch(0.88 0.01 240)): Medium navy text (oklch(0.45 0.05 240)) - Ratio 6.5:1 ✓

- **Dark Theme Foreground/Background Pairings**:
  - Background (Dark blue oklch(0.15 0.02 240)): Light text (oklch(0.95 0.01 240)) - Ratio 13.2:1 ✓
  - Card (Dark blue-gray oklch(0.20 0.02 240)): Light text (oklch(0.95 0.01 240)) - Ratio 11.8:1 ✓
  - Primary (Bright cyan oklch(0.60 0.18 230)): White text (oklch(0.99 0 0)) - Ratio 4.8:1 ✓
  - Accent (Bright orange oklch(0.72 0.20 45)): Dark background (oklch(0.15 0.02 240)) - Ratio 7.2:1 ✓
  - Muted (Medium gray oklch(0.25 0.03 240)): Light gray text (oklch(0.65 0.02 240)) - Ratio 5.8:1 ✓

## Font Selection
The typeface should feel bold, geometric, and slightly rounded to match the playful arcade aesthetic while maintaining excellent readability for score displays - using Inter for its clean geometric forms and excellent number legibility.

- **Typographic Hierarchy**:
  - H1 (Score Display): Inter Bold/48px/tight letter-spacing - dominant and instantly readable
  - H2 (Game Over/Shop): Inter Bold/24px/normal letter-spacing - clear messaging
  - Body (Instructions/Descriptions): Inter Medium/16px/relaxed letter-spacing - subtle but legible guidance
  - Small (Labels/Prices): Inter SemiBold/14px/normal letter-spacing - clear pricing and stats

## Animations
Animations should feel snappy and arcade-like with slight anticipation and follow-through on the jump to make it feel weighty and satisfying, while obstacles maintain steady linear motion for predictability. Toast notifications appear with smooth slide-in animations.

- **Purposeful Meaning**: The jump arc should feel physically grounded with proper acceleration, power-up activation should have satisfying feedback, purchase confirmations should be celebratory
- **Hierarchy of Movement**: Player jump is the hero animation with easing, obstacles move with constant velocity, UI transitions are quick fades, toast notifications slide in from top

## Component Selection
- **Components**: 
  - Dialog component for shop modal and stats modal
  - Card component for game over, level complete, and shop items
  - Button component for shop trigger and purchases
  - Badge component for high score, level, points, and active power-ups
  - Custom canvas element for game rendering
  - Toast notifications (sonner) for feedback
  
- **Customizations**: 
  - Custom game canvas component managing animation loop, input, and power-up effects
  - Custom shop modal with power-up grid layout
  - Power-up activation interface on start screen
  - Active power-up indicators during gameplay
  
- **States**: 
  - Buttons: Primary for shop and purchases, text-style for restart, disabled state for insufficient points
  - Power-up cards: Owned count badges, affordable/unaffordable visual distinction
  - Active power-ups: Colored badges with icons showing what's currently active
  
- **Icon Selection**: 
  - ShoppingBag (phosphor-icons) for shop button
  - Heart for extra life
  - Parachute for low gravity
  - Lightning for slow motion
  - Shield for shield power-up
  - Sparkle for points and point multiplier
  - Trophy for high score
  - Play for start/restart
  - ChartBar for statistics
  - Sun for light theme
  - Moon for dark theme
  
- **Spacing**: 
  - Shop grid: 2 columns on desktop, 1 on mobile with gap-4
  - Power-up activation: Flexbox with gap-2, wrapping on small screens
  - Active indicators: Vertical stack with gap-2 in top-right during gameplay
  
- **Mobile**: 
  - Shop modal scrollable on small screens
  - Power-up activation buttons wrap and stack
  - Header items wrap to multiple rows if needed
  - All touch targets minimum 44x44px
