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
    - [ ] missing block will ?
  - [ ] display score / chain

- level selection

  - [ ] display song menu
    - [x] text component can display text with position offset to parent
    - [x] vertical menu can display unlimited items
    - [x] scroll buttons to move menu up/down
    - [ ] menu item is selectable
    - [ ] load game on item selection
    - [ ] menu button during game to go back to menu
  - [ ] convert midi to wave sequence
    - https://github.com/Tonejs/Midi

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
