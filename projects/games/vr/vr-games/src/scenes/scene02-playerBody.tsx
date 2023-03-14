import { Vector3 } from 'three';
import { EntityGround } from '../entities/components/ground';
import { EntityGroundView } from '../entities/components/ground-view';
import { EntityPlayer } from '../entities/components/player';
import { EntityPlayerBody } from '../entities/components/player-body/player-body';
import { Entity } from '../entities/entity';

const player = Entity.create(`player`)
  .addComponent(EntityPlayer, {})
  .addComponent(EntityPlayerBody, { scale: 1, offset: new Vector3() })
  .build();
const ground = Entity.create(`ground`)
  .addComponent(EntityGround, {
    segmentCount: 16,
    segmentSize: 16,
    minHeight: 0,
    maxHeight: 0,
  })
  .addComponent(EntityGroundView, {})
  .build();

export const scene02 = { entities: [player, ground] };
