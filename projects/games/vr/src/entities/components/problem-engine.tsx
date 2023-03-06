import React, { Ref, useMemo, useRef, useState } from 'react';
import { Triplet, useSphere, useSpring } from '@react-three/cannon';
import { Text } from '@react-three/drei';
import { useFrame } from '@react-three/fiber';
import { Box, Flex } from '@react-three/flex';
import { Mesh, Vector3 } from 'three';
import { createProblemEngine, ProblemEngine, ProblemEnginePlayerState } from '@ricklove/study-subjects';
import { delay } from '@ricklove/utils-core';
import { Hud } from '../../components/hud';
import { useIsomorphicLayoutEffect } from '../../utils/layoutEffect';
import { logger } from '../../utils/logger';
import { defineComponent, EntityBase } from '../core';

export type EntityProblemEngine = EntityBase & {
  problemEngine: {
    problemEngine: ProblemEngine;
    playerState?: ProblemEnginePlayerState;
  };
  view: {
    Component: (props: { entity: EntityBase }) => JSX.Element;
  };
};
export const EntityProblemEngine = defineComponent<EntityProblemEngine>()
  .with(`problemEngine`, () => ({
    problemEngine: createProblemEngine({
      clearInterval,
      clearTimeout,
      setInterval,
      setTimeout,
      delay,
      logger,
    }),
  }))
  .with(`view`, () => ({
    Component: (x) => <EntityProblemEngineComponent entity={x.entity as EntityProblemEngine} />,
  }));

export const EntityProblemEngineComponent = ({ entity }: { entity: EntityProblemEngine }) => {
  const [ui, setUi] = useState({
    key: String(Math.random()),
    visible: false,
    kind: `message`,
  } as {
    key: string;
    visible: boolean;
    kind: `message` | `answer` | `options`;
    title?: string;
    message?: string;
    choices?: string[];
    answerCallback?: (key: string, answer: string) => void;
    selectionCallback?: (key: string, choices: string[]) => void;
  });

  useIsomorphicLayoutEffect(() => {
    const playerState = (entity.problemEngine.playerState =
      entity.problemEngine.problemEngine.createPlayer(`Player 1`));

    logger.log(`Starting study game`);
    // eslint-disable-next-line no-void
    void entity.problemEngine.problemEngine.startStudyGame({
      playerState,
      options: {
        nextProblemIntervalTimeMs: 10,
      },
      presenter: {
        presentMessage: async (p, message) => {
          setUi({
            key: String(Math.random()),
            visible: true,
            kind: `message`,
            message,
          });
          await delay(3000);
          setUi((s) => (s.message !== message ? s : { ...s, visible: false }));
        },
        presentQuestionPreview: async (p, args) => {
          setUi({
            key: String(Math.random()),
            kind: `message`,
            visible: true,
            title: args.subjectTitle,
            message: args.questionPreview,
          });
          await delay(args.questionPreviewTimeMs);
          setUi((s) => (s.message !== args.questionPreview ? s : { ...s, visible: false }));
        },
        presentOptions: async (p, { title, label, options }) => {
          return await new Promise((resolve, reject) => {
            const key = String(Math.random());
            setUi({
              key,
              kind: `options`,
              visible: true,
              title,
              message: label,
              choices: options,
              selectionCallback: (k, choices) => {
                if (key !== k) {
                  return;
                }
                resolve({ choices });
              },
            });
          });
        },
        presentMultipleChoiceProblem: async (p, { subjectTitle, question, choices }) => {
          return await new Promise((resolve, reject) => {
            const key = String(Math.random());
            setUi({
              key,
              kind: `answer`,
              visible: true,
              title: subjectTitle,
              message: question,
              choices: choices,
              answerCallback: (k, answer) => {
                if (key !== k) {
                  return;
                }
                resolve({ answer });
              },
            });
          });
        },
        presentShortAnswerProblem: async (p, { subjectTitle, question, correctAnswer }) => {
          return await new Promise((resolve, reject) => {
            const key = String(Math.random());
            setUi({
              key,
              kind: `answer`,
              visible: true,
              title: subjectTitle,
              message: question,
              answerCallback: (k, answer) => {
                if (key !== k) {
                  return;
                }
                resolve({ answer });
              },
            });
          });
        },
      },
    });
  }, []);

  // TODO: Answer questions in hud

  logger.log(`EntityProblemEngineComponent: render`);

  return (
    <>
      {ui.visible && (
        <Hud position={[-0.3, 0.3, 2]}>
          <Flex scale={[0.6 / 200, 0.6 / 200, 0]} size={[200, 200, 0]}>
            <Box dir='column' justifyContent='flex-start' alignItems='flex-start'>
              <Box height={20}>
                <Text anchorX='left' anchorY='top' fontSize={20}>
                  {ui.title ?? ``}
                </Text>
              </Box>
              <Box height={18}>
                <Text anchorX='left' anchorY='top' fontSize={16}>
                  {ui.message ?? ``}
                </Text>
              </Box>
              {ui.choices?.map((c, i) => (
                <Box key={i} dir='row' justifyContent='flex-start' alignItems='center'>
                  <Box centerAnchor height={20} width={20}>
                    <PhysicsBulletPoint size={20} />
                  </Box>
                  <Box height={16} margin={4}>
                    <Text anchorX='left' anchorY='top' fontSize={16}>
                      {c}
                    </Text>
                  </Box>
                </Box>
              ))}
            </Box>
          </Flex>
        </Hud>
      )}
    </>
  );
};

const PhysicsBulletPoint_debug = ({ size }: { size: number }) => {
  // return <Sphere args={[size * 0.5]} />;
  return (
    <mesh>
      <sphereGeometry args={[size * 0.5]} />
      <meshBasicMaterial color={`#00ff00`} transparent={true} opacity={1} />
    </mesh>
  );
};

export const PhysicsBulletPoint = ({
  size,
  position,
  physicsPosition: physicsPositionRaw,
}: {
  size: number;
  position?: Triplet;
  physicsPosition?: Triplet;
}) => {
  const physicsPosition = useMemo(
    () => physicsPositionRaw ?? ([1000 * Math.random(), 100, 1000 * Math.random()] as Triplet),
    [],
  );
  const radius = size * 0.5;
  const [ref, api] = useSphere(() => ({
    args: [radius * 0.8],
    mass: 1,
    position: [...physicsPosition].map((x) => x + 1 * Math.random()) as Triplet,
    linearDamping: 0.5,
  }));
  const [refAnchor] = useSphere(() => ({
    type: `Static`,
    args: [radius * 0.01],
    position: physicsPosition,
  }));

  useSpring(ref, refAnchor, {
    restLength: radius * 0.1,
    damping: 0,
    stiffness: 100,
  });

  const working = useRef({
    worldPos: new Vector3(),
    lastWorldPos: new Vector3(),
    delta: new Vector3(),
    impulse: new Vector3(),
  });
  useFrame(() => {
    if (!refAnchor.current || !ref.current) {
      return;
    }
    const { worldPos, lastWorldPos, delta, impulse } = working.current;
    refAnchor.current.getWorldPosition(worldPos);
    delta.copy(worldPos).sub(lastWorldPos);
    lastWorldPos.copy(worldPos);

    impulse
      .set(0, 0, 0)
      .sub(delta)
      .multiplyScalar((10000 * 1) / 60);
    api.applyImpulse(impulse.toArray(), ref.current.position.toArray());
    // ref.current.position.add(delta.multiplyScalar(-100));

    // refAnchor.current.position.copy(worldPos);
    // mainRef.current.position.copy(b.set(0, 0, 0).sub(worldPos));

    // // if (delta.lengthSq() > 1) {
    // // }
  });

  return (
    <group position={position}>
      <group position={[...physicsPosition].map((x) => -x) as Triplet}>
        <mesh ref={refAnchor as Ref<Mesh>}>
          <sphereGeometry args={[radius * 0.05]} />
          <meshStandardMaterial color={`#00ff00`} transparent={false} opacity={0} />
        </mesh>
        <mesh ref={ref as Ref<Mesh>}>
          <sphereGeometry args={[radius * 0.8]} />
          <meshBasicMaterial color={`#00ff00`} />
        </mesh>
      </group>
    </group>
  );
};
