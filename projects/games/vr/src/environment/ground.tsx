import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { BufferAttribute, DynamicDrawUsage, Mesh, PlaneGeometry, Raycaster, Vector3 } from 'three';
import { usePlayer } from '../components/camera';
import { useIsomorphicLayoutEffect } from '../utils/layoutEffect';

export const RandomGround = ({
  segmentWidth = 32,
  segments = 16,
  movePlayerToGroundHeight = true,
}: {
  segmentWidth?: number;
  segments?: number;
  movePlayerToGroundHeight?: boolean;
}) => {
  const ref = useRef<Mesh>(null);

  const MAX_HEIGHT = 5;

  useIsomorphicLayoutEffect(() => {
    const geometry = ref.current?.geometry as PlaneGeometry;
    if (!geometry) {
      return;
    }

    geometry.rotateX(-Math.PI / 2);
    const position = geometry.getAttribute(`position`) as BufferAttribute;
    position.usage = DynamicDrawUsage;

    for (let i = 0; i < position.count; i++) {
      const y = MAX_HEIGHT * Math.sin(i / 2);
      position.setY(i, y);
    }

    position.needsUpdate = true;
  }, []);

  const raycasterRef = useRef(new Raycaster());

  const player = usePlayer();

  useFrame(() => {
    if (!movePlayerToGroundHeight) {
      return;
    }
    const ground = ref.current;
    if (!ground) {
      return;
    }

    const raycaster = raycasterRef.current;

    raycaster.set(player.position.clone().setY(MAX_HEIGHT + 2), new Vector3(0, -1, 0));
    const [intersection] = raycasterRef.current.intersectObject(ground, false);
    if (!intersection) {
      return;
    }

    player.position.setY(intersection.point.y);
  });

  return (
    <mesh ref={ref}>
      <planeGeometry args={[segmentWidth * (segments + 1), segmentWidth * (segments + 1), segments, segments]} />
      <meshStandardMaterial color={`#565656`} />
    </mesh>
  );
};
