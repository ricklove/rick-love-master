import React from 'react';
import { useThree } from '@react-three/fiber';
import { BehaviorSubject, Observable } from 'rxjs';
import { AudioListener, AudioLoader } from 'three';
import { useIsomorphicLayoutEffect } from '../../utils/layoutEffect';
import { loadOnce } from '../../utils/loadOnce';
import { logger } from '../../utils/logger';
import { defineComponent, EntityBase, EntityWithTransform } from '../core';

export type EntityAudioListener = EntityBase & {
  audioListener: {
    listener: AudioListener;
    sounds: Record<
      string,
      {
        url: string;
        buffer: Observable<AudioBuffer>;
      }
    >;
  };
  view: {
    debugColorRgba?: number;
    Component: (props: { entity: EntityBase }) => JSX.Element;
    batchKey?: string;
    BatchComponent?: (props: { entities: EntityBase[] }) => JSX.Element;
  };
};

export const EntityAudioListener = defineComponent<EntityAudioListener>()
  .with(`audioListener`, ({ sounds }: { sounds: Record<string, { url: string }> }) => ({
    sounds: Object.fromEntries(
      Object.entries(sounds).map(([key, v]) => {
        return [key, { ...v, buffer: loadOnce(() => loadAudio(v.url)) }];
      }),
    ),
    listener: new AudioListener(),
    // listener: undefined as unknown as AudioListener,
  }))
  .with(`view`, () => ({
    Component: ({ entity }) => (
      <>
        <EntityAudioListenerComponent entity={entity as EntityAudioListener} />
      </>
    ),
  }));

const loadAudio = async (url: string) => {
  logger.log(`loadAudio`, { url });
  const loader = new AudioLoader();
  return await new Promise<AudioBuffer>((resolve) => {
    loader.load(url, (buffer) => {
      logger.log(`loadAudio - LOADED`, { url });
      resolve(buffer);
    });
  });
};

export const EntityAudioListenerComponent = ({ entity }: { entity: EntityAudioListener }) => {
  const { camera } = useThree();

  useIsomorphicLayoutEffect(() => {
    camera.add(entity.audioListener.listener);

    // eslint-disable-next-line no-void
    // void EntityAudioListener.loadSoundFiles(entity);
    const load = () => {
      // entity.audioListener.listener = new AudioListener();
      entity.ready.next(true);
    };
    document.addEventListener(`touchstart`, load);
    document.addEventListener(`mousedown`, load);

    return () => {
      camera.remove(entity.audioListener.listener);
      document.removeEventListener(`touchstart`, load);
      document.removeEventListener(`mousedown`, load);
    };
  }, []);

  return <></>;
};

export type EntityAudioPlayer = EntityBase & {
  audioPlayer: {
    listener: EntityAudioListener;
    playTrigger: BehaviorSubject<{ soundKey: string; onDone?: () => void }>;
    soundPositionTarget?: EntityWithTransform;
  };
  view: {
    debugColorRgba?: number;
    Component: (props: { entity: EntityBase }) => JSX.Element;
    batchKey?: string;
    BatchComponent?: (props: { entities: EntityBase[] }) => JSX.Element;
  };
};

export const EntityAudioPlayer = defineComponent<EntityAudioPlayer>()
  .with(`audioPlayer`, ({ listener }: { listener: EntityAudioListener }) => ({
    listener,
    playTrigger: new BehaviorSubject<{ soundKey: string; onDone?: () => void }>({ soundKey: `` }),
  }))
  .with(`view`, () => ({
    Component: ({ entity }) => (
      <>
        <EntityAudioPlayerComponent entity={entity as EntityAudioPlayer} />
      </>
    ),
  }))
  .attach({
    playSound: (
      entity: EntityAudioPlayer,
      soundKey: string,
      options?: { soundPositionTarget?: EntityWithTransform; onDone?: () => void },
    ) => {
      logger.log(`playSound`, { soundKey, onDone: options?.onDone });
      entity.audioPlayer.soundPositionTarget = options?.soundPositionTarget;
      entity.audioPlayer.playTrigger.next({ soundKey, onDone: options?.onDone });
    },
  });

export const EntityAudioPlayerComponent = ({ entity }: { entity: EntityAudioPlayer }) => {
  const sound = React.useRef<THREE.PositionalAudio>(null);
  useIsomorphicLayoutEffect(() => {
    entity.audioPlayer.listener.ready.subscribe(() => {
      entity.ready.next(true);

      const sub = entity.audioPlayer.playTrigger.subscribe(({ soundKey, onDone }) => {
        logger.log(`playTrigger`, { sound });

        const soundItem = entity.audioPlayer.listener.audioListener.sounds[soundKey];
        if (!soundItem) {
          return;
        }

        const subBuffer = soundItem.buffer.subscribe((b) => {
          if (!sound.current) {
            return;
          }
          const s = sound.current;

          const target = entity.audioPlayer.soundPositionTarget;
          const subs = [] as { unsubscribe: () => void }[];
          if (target) {
            subs.push(
              target.frameTrigger.subscribe(() => {
                s.position.copy(target.transform.position);
              }),
            );
          }
          s.setBuffer(b);
          s.setRefDistance(1);
          s.setLoop(false);
          s.play();
          const isDoneCheckId = setInterval(() => {
            if (s.isPlaying) {
              return;
            }
            clearInterval(isDoneCheckId);
            subs.forEach((x) => x.unsubscribe());
            onDone?.();
          }, 100);

          setTimeout(() => {
            subBuffer.unsubscribe();
          });
        });
      });
    });

    // return () => sub.unsubscribe();
  }, []);

  return (
    <>
      <positionalAudio ref={sound} args={[entity.audioPlayer.listener.audioListener.listener]} />
    </>
  );
};
