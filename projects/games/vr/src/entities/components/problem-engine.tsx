import React, { Ref, RefObject, useRef, useState } from 'react';
import { useSphere, useSpring } from '@react-three/cannon';
import { Text } from '@react-three/drei';
import { createPortal, useFrame } from '@react-three/fiber';
import { Box, Flex } from '@react-three/flex';
import { Group, Matrix4, Mesh, Object3D, Vector3 } from 'three';
import { createProblemEngine, ProblemEngine, ProblemEnginePlayerState } from '@ricklove/study-subjects';
import { delay } from '@ricklove/utils-core';
import { Hud } from '../../components/hud';
import { formatVector } from '../../utils/formatters';
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

  const portalTargetRef = useRef<Group>(null);

  const flexScale = 0.6 / 200;

  return (
    <>
      <group ref={portalTargetRef} />
      {ui.visible && (
        <Hud position={[-0.3, 0.3, 2]}>
          <Flex scale={flexScale} size={[200, 200, 0]}>
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
                    <PhysicsBulletPoint size={20 * flexScale} worldPortal={portalTargetRef} />
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

// Using a portal
const WorldSpacePortal = ({
  worldPortal,
  children,
}: {
  worldPortal: RefObject<Object3D>;
  children: ({ worldMatrixRef }: { worldMatrixRef: RefObject<Matrix4> }) => JSX.Element;
}) => {
  // return <Sphere args={[size * 0.5]} />;

  const flexSpaceRef = useRef<Group>(null);
  const worldMatrixRef = useRef<Matrix4>(new Matrix4());

  useIsomorphicLayoutEffect(() => {
    if (!flexSpaceRef.current) {
      return;
    }
    worldMatrixRef.current = flexSpaceRef.current.matrixWorld;
  }, [!flexSpaceRef.current]);
  return (
    <>
      <group ref={flexSpaceRef} />
      {!!worldPortal.current && createPortal(<>{children({ worldMatrixRef })}</>, worldPortal.current)}
    </>
  );
};

const PhysicsBulletPoint = ({ size, worldPortal }: { size: number; worldPortal: RefObject<Object3D> }) => {
  return (
    <>
      <WorldSpacePortal worldPortal={worldPortal}>
        {({ worldMatrixRef }) => <PhysicsBulletPointInner worldMatrixRef={worldMatrixRef} size={size} />}
      </WorldSpacePortal>
    </>
  );
};

const PhysicsBulletPointInnerSimple = ({
  size,
  worldMatrixRef,
}: {
  size: number;
  worldMatrixRef: RefObject<Matrix4>;
}) => {
  const ref = useRef<Mesh>(null);

  useFrame(() => {
    if (!ref.current || !worldMatrixRef.current) {
      return;
    }

    ref.current.position.setFromMatrixPosition(worldMatrixRef.current);
    logger.log(`bullet pos`, formatVector(ref.current.position));
  });

  return (
    <>
      <mesh ref={ref}>
        <sphereGeometry args={[size * 0.5]} />
        <meshBasicMaterial color={`#00ff00`} transparent={true} opacity={1} />
      </mesh>
    </>
  );
};

export const PhysicsBulletPointInner = ({
  size,
  worldMatrixRef,
}: {
  size: number;
  worldMatrixRef: RefObject<Matrix4>;
}) => {
  const radius = size * 0.5;
  const [ref, api] = useSphere(() => ({
    args: [radius * 0.8],
    mass: 1,
    linearDamping: 0.9,
  }));
  const [refAnchor, apiAnchor] = useSphere(() => ({
    type: `Static`,
    args: [radius * 0.01],
  }));

  useSpring(ref, refAnchor, {
    restLength: radius * 0.1,
    damping: 0,
    stiffness: 1000,
  });

  const working = useRef({
    w: new Vector3(),
    a: new Vector3(),
    b: new Vector3(),
  });
  useFrame(() => {
    if (!ref.current || !refAnchor.current || !worldMatrixRef.current) {
      return;
    }
    const { w, a, b } = working.current;

    logger.log(`anchor wor`, formatVector(refAnchor.current.getWorldPosition(w)));

    a.setFromMatrixPosition(worldMatrixRef.current);

    // b.copy(a).sub(refAnchor.current.getWorldPosition(w));
    // if (b.lengthSq() < 0.001) {
    //   return;
    // }

    apiAnchor.position.copy(a);

    // logger.log(`anchor pos`, formatVector(refAnchor.current.position));
    // logger.log(`anchor wor`, formatVector(refAnchor.current.getWorldPosition(b)));

    b.copy(a).sub(ref.current.getWorldPosition(w));
    if (b.lengthSq() > 0.1) {
      api.position.copy(a);
    }

    logger.log(`ref pos`, formatVector(ref.current.getWorldPosition(w)));
  });

  return (
    <>
      <mesh ref={refAnchor as Ref<Mesh>}>
        <sphereGeometry args={[radius * 0.1]} />
        <meshStandardMaterial color={`#00ff00`} transparent={true} opacity={1} />
      </mesh>
      <mesh ref={ref as Ref<Mesh>}>
        <sphereGeometry args={[radius * 0.8]} />
        <meshBasicMaterial color={`#00ff00`} />
      </mesh>
    </>
  );
};
