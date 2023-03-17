import React from 'react';
import { useThree } from '@react-three/fiber';
import { BehaviorSubject, Observable, Subject } from 'rxjs';
import { AudioListener, AudioLoader } from 'three';
import { useIsomorphicLayoutEffect } from '../../utils/layoutEffect';
import { loadOnce } from '../../utils/loadOnce';
import { logger } from '../../utils/logger';
import { defineComponent, EntityBase } from '../core';

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
    playTrigger: Subject<string>;
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
    playTrigger: new BehaviorSubject<string>(``),
  }))
  .with(`view`, () => ({
    Component: ({ entity }) => (
      <>
        <EntityAudioPlayerComponent entity={entity as EntityAudioPlayer} />
      </>
    ),
  }))
  .attach({
    playSound: (entity: EntityAudioPlayer, soundKey: string) => {
      logger.log(`playSound`, { soundKey });
      entity.audioPlayer.playTrigger.next(soundKey);
    },
  });

export const EntityAudioPlayerComponent = ({ entity }: { entity: EntityAudioPlayer }) => {
  const sound = React.useRef<THREE.PositionalAudio>(null);
  useIsomorphicLayoutEffect(() => {
    entity.audioPlayer.listener.ready.subscribe(() => {
      entity.ready.next(true);

      const sub = entity.audioPlayer.playTrigger.subscribe((soundKey: string) => {
        logger.log(`playTrigger`, { sound });

        const soundItem = entity.audioPlayer.listener.audioListener.sounds[soundKey];
        if (!soundItem) {
          return;
        }

        const subBuffer = soundItem.buffer.subscribe((b) => {
          if (!sound.current) {
            return;
          }
          sound.current.setBuffer(b);
          sound.current.setRefDistance(1);
          sound.current.setLoop(false);
          sound.current.play();
          subBuffer.unsubscribe();
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
