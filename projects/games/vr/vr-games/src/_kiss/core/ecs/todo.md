# EntityDesc vs EntityInstance

- EntityDesc
  - Template
    - Simple to use as a prefab to generate multiple entity instances
  - Serializable (savable/loadable)
    - Contains full world initial state
    - With a persist function, it would be possible to save all active world state
  - Cross platform
    - It is implementation agnostic, so can run on any implementation of the component set

# Games to clone to test out game system

## Tools

- [ ] Debug Menu
  - [ ] Can easily visualize anything
    - [ ] debug.showPoint
  - [x] Can easily create test scene to test small units
    - [x] test scene can show points
    - [x] test scene can show text
    - [x] test scene can have actions
      - [x] actions can modify point position
      - [x] actions can modify point visibility
      - [x] actions can modify point text
  - [x] Can navigate test scenes
    - [x] can reload specific scene (set url)
    - [x] compile goes directly back to last test scene
    - [x] Can view menu of scenes
    - [ ] Can search menu of scenes

## Code Quality

- [x] No coupling of logic everything is flat Types, data, functions
- [x] Pure Functions setup
  - [x] All logic in pure function
  - [x] Functions have no state, dependencies, or side effects (only args and result)
  - [x] Functions have a single concern
  - [ ] Functions are tested
  - [x] Functions are visualized
  - [x] Functions are efficient (no creating objects, a working state container is provided)
- [ ] Components/Systems are simple (no boilerplate, no logic, just a call to a function)

## Beat Saber

- minimal game

  - [x] player in fixed position at origin
    - [x] player is holding saber
  - [x] blocks are spawned
    - [x] from a single point in the distance
    - [x] with an x-z offset
    - [x] hard coded sequence
  - [x] blocks move toward player at a constant speed
  - [ ] player can hit block with visual feedback
    - [x] hitting block will cause block to disappear
    - [ ] hitting block will play sound
    - [ ] hitting block will vibrate controller
    - [ ] missing block will ?
  - [ ] display score / chain

- additional game features

  - [x] enemy has weak spots
  - [x] alternate left/right hand
  - [ ] sync note timing
    - [ ] flash on beat
  - [ ] enemy sounds
  - [ ] missed enemy damages the platform
  - [ ] player can fall off platform

- level selection

  - [ ] display song menu
    - [x] text component can display text with position offset to parent
    - [x] vertical menu can display unlimited items
    - [x] scroll buttons to move menu up/down
    - [x] menu item is selectable
    - [x] load game on item selection
    - [ ] menu button during game to go back to menu
    - [x] virtualize menu items
  - [ ] convert music to wave sequence
    - [x] Detect beats from any sound file
      - [ ] Generate notes from any music
    - [x] Use stepmania simfiles
      - [ ] Can use double levels to get 8 note signals, or combine 2 difficulties for 8
      - https://github.com/noahm/simfile-parser
    - [ ] Midi files
      - https://github.com/Tonejs/Midi

- Controller Input

  - [x] Support controller input (instead of hands)

- Bible reader

  - [ ] endless mode (randomized song selection)
  - [ ] select passage
  - [ ] attach one word at a time to each note
  - [ ] play read verse at end of verse
    - https://api.esv.org/docs/passage-audio/
  - [ ] quick buttons for back/forward verse, change passage, etc

## Space Pirate Trainer

- minimal game

  - player at fixed origin
  - enemies are spawned
    - from random locations
  - enemies follow a path sequence around player
  - enemies shoot at player with projectiles
  - player can shoot enemies with projectiles

## Space Pirate Beat Saber Hybrid

- minimal game

  - player at fixed origin
  - enemies are spawned that generate note projectiles
  - projectiles are shot at player so they arrive at player hit zone at beat time
  - good timing will cause projectile to bounce back towards enemy
  - hud radar will show 360 view of enemies/notes

## Nock

- minimal game

  - field is enclosed by walls and ceiling
  - ball can be hit in the field
  - goals at the ends of the fields
  - player can move in field using gestures
  - player can shoot arrows at ball using two handed pull back launcher

## Boxing (fast hand tracking)

## Last Clockwinder (recorded motions)

## Incredible Machine (physics builder)

## Bad Piggies (physics builder)

## Minecraft Creative (world builder)

## Angry Birds & Moss (stable physics, 2d in 3d)

## Worms (destructible environment)

## Acron (multiplayer w/ phones)

## Among Us (multiplayer w/ phones)

## Rain World (Ecosystem)
