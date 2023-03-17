import { Triplet } from '@react-three/cannon';
import { ambientSoundFiles } from '../assets/sounds';
import { EntityAudioListener, EntityAudioPlayer } from '../entities/components/audio';
import { EntityGround } from '../entities/components/ground';
import { EntityGroundView } from '../entities/components/ground-view';
import { Entity, SceneDefinition } from '../entities/entity';

const audioListener = Entity.create(`audioListener`)
  .addComponent(EntityAudioListener, {
    sounds: Object.fromEntries(ambientSoundFiles.map((x, i) => [`ambient-${i}`, { url: x }])),
  })
  .build();
const audioMusic = Entity.create(`audioListener`)
  .addComponent(EntityAudioPlayer, { listener: audioListener })
  .extend((e) => {
    EntityAudioPlayer.playSound(e, `ambient-0`);
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
  rootEntities: [audioListener, audioMusic, ground],
  gravity: [0, 0.1 * -9.8, 0] as Triplet,
  // gravity: [0, 0, 0] as Triplet,
};
