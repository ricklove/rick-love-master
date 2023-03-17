import { Triplet } from '@react-three/cannon';
import { randomItem } from '@ricklove/utils-core';
import { ambientSoundFiles, popSoundFiles } from '../assets/sounds';
import { EntityAudioListener, EntityAudioPlayer } from '../entities/components/audio';
import { EntityGround } from '../entities/components/ground';
import { EntityGroundView } from '../entities/components/ground-view';
import { Entity, SceneDefinition } from '../entities/entity';

const ambientMusic = ambientSoundFiles.map((x, i) => ({ key: `ambient-${i}`, url: x }));
const popSounds = popSoundFiles.map((x, i) => ({ key: `pop-${i}`, url: x }));

const audioListener = Entity.create(`audioListener`)
  .addComponent(EntityAudioListener, {
    sounds: Object.fromEntries([...ambientMusic, ...popSounds].map((x) => [x.key, { ...x }])),
  })
  .build();
const audioMusic1 = Entity.create(`audioListener`)
  .addComponent(EntityAudioPlayer, { listener: audioListener })
  .extend((e) => {
    const playRandomMusic = () => {
      EntityAudioPlayer.playSound(e, randomItem(ambientMusic).key, { onDone: () => playRandomMusic() });
    };
    playRandomMusic();
  })
  .build();
const audioMusic2 = Entity.create(`audioListener`)
  .addComponent(EntityAudioPlayer, { listener: audioListener })
  .extend((e) => {
    setTimeout(() => {
      const playRandomMusic = () => {
        EntityAudioPlayer.playSound(e, randomItem(ambientMusic).key, { onDone: () => playRandomMusic() });
      };
      playRandomMusic();
    }, 10000);
  })
  .build();

const ground = Entity.create(`ground`)
  .addComponent(EntityGround, {
    segmentCount: 16,
    segmentSize: 16,
    // Physics needs ground to have some height
    minHeight: -0.1,
    maxHeight: 0,
  })
  .addComponent(EntityGroundView, {})
  .build();

export const scene04: SceneDefinition = {
  debugPhysics: true,
  iterations: 15,
  rootEntities: [audioListener, audioMusic1, audioMusic2, ground],
  gravity: [0, 0.1 * -9.8, 0] as Triplet,
  // gravity: [0, 0, 0] as Triplet,
};
