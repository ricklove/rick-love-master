import React, { ReactNode, Suspense } from 'react';
import { Physics, Vector3Array } from '@react-three/rapier';
import { Player, PlayerComponentContext } from '../components/player';
import { SelectableContext } from '../components/selectable';
import { SelectorFixedPointer } from '../components/selector-fixed-pointer';

export const SceneLayout = ({
  children,
  gravity = [0, -9.8, 0],
  includePlayer = true,
}: {
  children: ReactNode;
  gravity?: Vector3Array;
  includePlayer?: boolean;
}) => {
  return (
    <>
      <Suspense>
        <Physics colliders='ball' gravity={gravity}>
          <SelectableContext.Provider>
            <PlayerComponentContext.Provider>
              {includePlayer && <Player />}
              <SelectorFixedPointer />
              {children}
            </PlayerComponentContext.Provider>
          </SelectableContext.Provider>
        </Physics>
      </Suspense>
    </>
  );
};