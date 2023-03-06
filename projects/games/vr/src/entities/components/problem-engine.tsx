import React, { useState } from 'react';
import { Text } from '@react-three/drei';
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
        <Hud position={[0, 0.3, 2]}>
          <Text fontSize={0.08} position={[0, 0, 0]}>
            {ui.title ?? ``}
          </Text>
          <Text fontSize={0.06} position={[0, -0.1, 0]}>
            {ui.message ?? ``}
          </Text>
          {ui.choices?.map((c, i) => (
            <Text key={i} fontSize={0.05} position={[0, -0.2 + -0.06 * i, 0]}>
              {c}
            </Text>
          ))}
        </Hud>
      )}
    </>
  );
};
