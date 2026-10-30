# Jump Runner

A browser-based jumping game built with HTML image elements, CSS positioning and JavaScript.

## Run
1. Keep `index.html`, `style.css` and `game.js` in the same folder.
2. Open `index.html` in a modern browser.
3. Press **Start game**.
4. Press **Space**, **Arrow Up**, click/tap the game area, or use the **JUMP** button to jump.

## Files
- `index.html`: game structure and controls.
- `style.css`: layout, image positioning and responsive styling.
- `game.js`: game state, jump physics, obstacle spawning, movement, scoring, collision detection and restart.

## Implementation notes
- Uses the requested IDs: `ground`, `player`, `ground_obstacle`, and `sky_obstacle`.
- Uses one `requestAnimationFrame` loop for all game updates.
- Uses elapsed frame time to make movement more consistent across refresh rates.
- Uses `getBoundingClientRect()` for collision detection.
- Best score is kept for the current page session; it resets after a page refresh.
- The three character/obstacle images are loaded from the external URLs supplied in the original HTML. An internet connection is required for those images.

## Tuning
In `game.js`, adjust `GRAVITY`, `JUMP_STRENGTH`, `BASE_SPEED`, `MIN_SPAWN_GAP` and `MAX_SPAWN_GAP` to change the game feel.
