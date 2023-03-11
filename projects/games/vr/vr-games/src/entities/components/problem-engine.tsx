import React, { Ref, RefObject, useRef, useState } from 'react';
import { useSphere, useSpring } from '@react-three/cannon';
import { Text } from '@react-three/drei';
import { createPortal, useFrame } from '@react-three/fiber';
import { Box, Flex } from '@react-three/flex';
import { Subject } from 'rxjs';
import { Group, Matrix4, Mesh, Object3D, Vector3 } from 'three';
import { createProblemEngine, ProblemEngine, ProblemEnginePlayerState } from '@ricklove/study-subjects';
import { delay, randomItem, randomOrder } from '@ricklove/utils-core';
import { Hud } from '../../components/hud';
import { formatVector } from '../../utils/formatters';
import { useIsomorphicLayoutEffect } from '../../utils/layoutEffect';
import { logger } from '../../utils/logger';
import { defineComponent, EntityBase } from '../core';
import { Choice, ChoiceEvent, EntityChooser } from './chooser';

export type EntityProblemEngine = EntityBase & {
  problemEngine: {
    problemEngine: ProblemEngine;
    playerState?: ProblemEnginePlayerState;
    choicesObserver: Subject<{ choices: Choice[]; event: ChoiceEvent }>;
    feedbackSubject: Subject<{ wasCorrect: boolean }>;
    _chooser?: EntityChooser;
    _choices?: { choices: Choice[]; isMultiChoice: boolean };
    _sub?: { unsubscribe: () => void };
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
    choicesObserver: new Subject(),
    feedbackSubject: new Subject(),
  }))
  .with(`view`, () => ({
    Component: (x) => <EntityProblemEngineComponent entity={x.entity as EntityProblemEngine} />,
  }))
  .attach({
    setChooser: (entity: EntityProblemEngine, chooser: EntityChooser) => {
      const oldChoices = entity.problemEngine._choices;
      if (entity.problemEngine._sub) {
        entity.problemEngine._sub?.unsubscribe();
      }
      entity.problemEngine._chooser = chooser;
      entity.problemEngine._sub = chooser.chooser.choicesSubject.subscribe((x) => {
        entity.problemEngine.choicesObserver.next(x);
      });
      if (oldChoices?.choices.length) {
        EntityChooser.setChoices(chooser, oldChoices.choices, oldChoices.isMultiChoice);
      }
    },
    setChoices: (entity: EntityProblemEngine, choiceTexts: string[], isMultiChoice = false) => {
      const choices = choiceTexts.map((x) => ({ text: x, active: false }));
      entity.problemEngine._choices = {
        choices,
        isMultiChoice,
      };
      if (entity.problemEngine._chooser) {
        EntityChooser.setChoices(entity.problemEngine._chooser, choices, isMultiChoice);
      }
    },
    clearChoices: (entity: EntityProblemEngine) => {
      entity.problemEngine._choices = {
        choices: [],
        isMultiChoice: false,
      };
      if (entity.problemEngine._chooser) {
        EntityChooser.clearChoices(entity.problemEngine._chooser);
      }
    },
  });

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
    choices?: { text: string; active: boolean }[];
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
        nextProblemIntervalTimeMs: 1000,
      },
      presenter: {
        presentAnswerFeedback: async (result) => {
          entity.problemEngine.feedbackSubject.next(result);
          if (!result.wasCorrect) {
            setUi({
              key: String(Math.random()),
              visible: true,
              kind: `message`,
              message: `NO!\n${result.responseMessage ?? ``}`,
            });
            await delay(3000);
            setUi((s) => ({ ...s, visible: false }));
          }
        },
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
          let sub = {
            unsubscribe: () => {
              /* empty */
            },
          };
          const result = await new Promise<{ choices: string[] }>((resolve, reject) => {
            sub = entity.problemEngine.choicesObserver.subscribe((c) => {
              if (c.event !== `done`) {
                setUi((s) => ({ ...s, choices: [...c.choices] }));
                return;
              }
              const choices = c.choices.filter((x) => x.active).map((x) => x.text);
              resolve({ choices });
            });
            EntityProblemEngine.setChoices(entity, options, true);

            const key = String(Math.random());
            setUi({
              key,
              kind: `options`,
              visible: true,
              title,
              message: label,
              choices: options.map((x) => ({ text: x, active: false })),
              selectionCallback: (k, choices) => {
                if (key !== k) {
                  return;
                }
                resolve({ choices });
              },
            });
          });

          logger.log(`opt`, { result });
          sub.unsubscribe();
          EntityProblemEngine.clearChoices(entity);
          setUi({
            key: String(Math.random()),
            kind: `message`,
            visible: false,
          });
          return result;
        },
        presentMultipleChoiceProblem: async (p, { subjectTitle, question, choices, correctAnswer }) => {
          let sub = {
            unsubscribe: () => {
              /* empty */
            },
          };
          const result = await new Promise<{ answer: string }>((resolve, reject) => {
            sub = entity.problemEngine.choicesObserver.subscribe((c) => {
              if (c.event !== `toggle`) {
                setUi((s) => ({ ...s, choices: [...c.choices] }));
                return;
              }
              const choices = c.choices.filter((x) => x.active).map((x) => x.text);
              resolve({ answer: choices[0] });
            });
            EntityProblemEngine.setChoices(entity, choices);

            const key = String(Math.random());
            setUi({
              key,
              kind: `answer`,
              visible: true,
              title: subjectTitle,
              message: question,
              choices: choices.map((x) => ({ text: x, active: false })),
              answerCallback: (k, answer) => {
                if (key !== k) {
                  return;
                }
                resolve({ answer });
              },
            });
          });
          logger.log(`multi`, { answer: result.answer, correct: correctAnswer });
          sub.unsubscribe();
          EntityProblemEngine.clearChoices(entity);
          setUi({
            key: String(Math.random()),
            kind: `message`,
            visible: false,
          });
          return result;
        },
        presentShortAnswerProblem: async (p, { subjectTitle, question, correctAnswer }) => {
          let sub = {
            unsubscribe: () => {
              /* empty */
            },
          };
          const result = await new Promise<{ answer: string }>((resolve, reject) => {
            // TODO: Choice via:
            // First letters(1-3)?
            // Every letter?
            // Whole answer (needs wordbank)?
            // Full choice keyboard (not suitable for most games)?
            const firstLetter = correctAnswer.substring(0, 1);

            const altOptions = [...new Array(10)].map((x) => {
              if (Number.isInteger(firstLetter)) {
                return String(Math.abs(Math.round(Number(firstLetter) * (1.5 - Math.random()))));
              }
              const altLetter = randomItem(`rrrssstttlllnnneeeabcdefghijklmnopqrstuvwxyz`.split(``));
              return firstLetter === firstLetter.toLowerCase() ? altLetter.toLowerCase() : altLetter.toUpperCase();
            });
            const falseOptions = altOptions.filter((x) => !correctAnswer.startsWith(x)).slice(3);
            const options = randomOrder([firstLetter, ...falseOptions]);

            sub = entity.problemEngine.choicesObserver.subscribe((c) => {
              if (c.event !== `toggle`) {
                // setUi((s) => ({ ...s, choices: [...c.choices] }));
                return;
              }
              const choices = c.choices.filter((x) => x.active).map((x) => x.text);
              resolve({ answer: correctAnswer.startsWith(choices[0]) ? correctAnswer : choices[0] });
            });
            EntityProblemEngine.setChoices(entity, options);

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
          sub.unsubscribe();
          EntityProblemEngine.clearChoices(entity);
          setUi({
            key: String(Math.random()),
            kind: `message`,
            visible: false,
          });
          return result;
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
                    <PhysicsBulletPoint
                      size={20 * flexScale}
                      worldPortal={portalTargetRef}
                      color={c.active ? 0x00ff00 : 0xff0000}
                    />
                  </Box>
                  <Box height={16} margin={4}>
                    <Text anchorX='left' anchorY='top' fontSize={16}>
                      {c.text}
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

const PhysicsBulletPoint = ({
  size,
  color,
  worldPortal,
}: {
  size: number;
  color: number;
  worldPortal: RefObject<Object3D>;
}) => {
  return (
    <>
      <WorldSpacePortal worldPortal={worldPortal}>
        {({ worldMatrixRef }) => <PhysicsBulletPointInner worldMatrixRef={worldMatrixRef} size={size} color={color} />}
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
  color,
  worldMatrixRef,
}: {
  size: number;
  color: number;
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

    // logger.log(`anchor wor`, formatVector(refAnchor.current.getWorldPosition(w)));

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

    // logger.log(`ref pos`, formatVector(ref.current.getWorldPosition(w)));
  });

  return (
    <>
      <mesh ref={refAnchor as Ref<Mesh>}>
        <sphereGeometry args={[radius * 0.1]} />
        <meshStandardMaterial color={color} transparent={true} opacity={1} />
      </mesh>
      <mesh ref={ref as Ref<Mesh>}>
        <sphereGeometry args={[radius * 0.8]} />
        <meshBasicMaterial color={color} />
      </mesh>
    </>
  );
};
