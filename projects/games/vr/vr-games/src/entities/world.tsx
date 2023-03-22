import React, { useEffect, useMemo, useState } from 'react';
import { Debug, Physics, useContactMaterial } from '@react-three/cannon';
import { useFrame } from '@react-three/fiber';
import { of, Subject } from 'rxjs';
import { EntityForce } from './components/force';
import { EntityAdjustToGround, EntityGround } from './components/ground';
import { EntityPlayer } from './components/player';
import { calculateActiveEntities, EntityList as EntityList } from './core';
import { Entity, SceneDefinition, World } from './entity';

const world: World = {
  ...Entity.create(`world`).build(),
  children: new EntityList([] as Entity[]),
};
world.ready.next(true);
world.ready.setFrameTrigger(of(true));

const worldState = {
  world,
  activeEntities: calculateActiveEntities<Entity>(world),
  frameTrigger: new Subject<void>(),
};

worldState.activeEntities.added.subscribe((entities) => {
  entities.forEach((e) => {
    e.ready.setFrameTrigger(worldState.frameTrigger);
    e.ready.subscribe(() => {
      // // logger.log(`entity ready ${e.name} ${e.key}`);
      // const old = e.frameTrigger as Subject<void>;
      // e.frameTrigger = worldState.frameTrigger;
      // if (old.observed) {
      //   // TODO: this might cause a memory leak
      //   e.frameTrigger.subscribe(() => old.next());
      // }

      const perf = { key: e.key, name: e.name, callCount: 0, timeElapsedMs: 0 };
      performanceData.entities.push(perf);
      worldState.frameTrigger.subscribe(() => {
        const timeStart = window.performance.now();

        e.frameTrigger.next();

        perf.callCount++;
        const timeElapsedMs = window.performance.now() - timeStart;
        perf.timeElapsedMs += timeElapsedMs;
      });
    });
  });
});

const performanceData = {
  worldFrame: {
    key: `worldFrame`,
    name: `worldFrame`,
    callCount: 0,
    timeElapsedMs: 0,
    timeStart: window.performance.now(),
  },
  entities: [] as { name: string; callCount: number; timeElapsedMs: number }[],
};
(window as unknown as Record<string, unknown>).__getPerformanceReport = () => {
  const totals = [performanceData.worldFrame, ...performanceData.entities].reduce((out, x) => {
    const p = (out[x.name] ??= { name: x.name, entityCount: 0, callCount: 0, timeElapsedMs: 0, timePerCallMs: 0 });
    p.entityCount++;
    p.callCount += x.callCount;
    p.timeElapsedMs += x.timeElapsedMs;
    p.timePerCallMs = p.timeElapsedMs / p.callCount;
    return out;
  }, {} as { [name: string]: { name: string; entityCount: number; callCount: number; timeElapsedMs: number; timePerCallMs: number } });

  const timeSinceStartMs = window.performance.now() - performanceData.worldFrame.timeStart;
  console.log(`performanceData`, {
    timeSinceStartMs,
    averageFps: (performanceData.worldFrame.callCount * 1000) / timeSinceStartMs,
    totalsByTotalTime: Object.values(totals).sort((a, b) => -(a.timeElapsedMs - b.timeElapsedMs)),
    totalsByAveTime: Object.values(totals).sort((a, b) => -(a.timePerCallMs - b.timePerCallMs)),
  });
};

const useWorldFilter = <T extends Entity>(filter: (item: Entity) => boolean, groupKey?: (item: Entity) => string) => {
  const groupItems = useMemo(
    () => (items: Entity[]) => {
      const grouped = !groupKey
        ? { items }
        : items.reduce((out, x) => {
            const k = groupKey(x);
            (out[k] ?? (out[k] = [])).push(x);
            return out;
          }, {} as { [key: string]: Entity[] });

      // if (groupKey) {
      //   console.log(`useWorldFilter`, { items, grouped });
      // }
      return {
        items: items as T[],
        grouped: [
          ...Object.entries(grouped).map(([k, v]) => ({
            key: k,
            first: v[0] as T,
            items: v as T[],
          })),
        ],
      };
    },
    [],
  );

  const [activeEntities, setActiveEntities] = useState(
    groupItems(worldState.activeEntities.items.filter((x) => x.active && filter(x))),
  );

  useEffect(() => {
    const sub = worldState.activeEntities.itemsSubject.subscribe((a) => {
      const filtered = groupItems(worldState.activeEntities.items.filter((x) => x.active && filter(x)));
      setActiveEntities(filtered);

      // logger.log(`useWorldFilter updated`, {
      //   items: a.length,
      //   filtered: filtered.items.length,
      // });
    });
    return () => sub.unsubscribe();
  }, []);

  // useFrame(() => {
  //   const items = world.entities.filter((x) => x.active).filter(filter);
  //   setActiveEntities((s) => {
  //     if (s.items.length !== items.length) {
  //       return groupItems(items);
  //     }
  //     for (let i = 0; i < items.length; i++) {
  //       if (s.items[i] !== items[i]) {
  //         return groupItems(items);
  //       }
  //     }

  //     return s;
  //   });
  // });

  return activeEntities;
};

export const WorldContainer = ({ rootEntities, gravity, iterations, debugPhysics, materials }: SceneDefinition) => {
  useMemo(() => {
    world.children.add(...rootEntities);
    performanceData.worldFrame.timeStart = window.performance.now();
  }, []);
  const activeViews = useWorldFilter((x) => !!x.view && !x.view.BatchComponent).items;
  const activeTextViews = useWorldFilter((x) => !!x.textView).items;
  const activeBatchViews = useWorldFilter(
    (x) => !!x.view && !!x.view.BatchComponent && !!x.view.batchKey,
    (x) => x.view?.batchKey!,
  ).grouped;
  // const activeSelectables = useWorldFilter<EntitySelectable>((x) => !!x.selectable).items;
  // const activeSelectors = useWorldFilter<EntityRaycastSelector>((x) => !!x.raycastSelector).items;
  // activeSelectors.forEach((e) => EntitySelector.changeTargets(e as EntitySelector, activeSelectables));

  materials?.forEach((m) => {
    useContactMaterial(m.a, m.b, m.options);
  });

  useFrame(() => {
    // logger.log(`WorldContainer useFrame`, {
    //   entitiesCount: game.activeEntities.items.length,
    //   worldChildrenCount: world.children.items.length,
    // });
    const active = worldState.activeEntities.items;

    const player = active.find((x) => !!x.player) as EntityPlayer;
    if (player) {
      EntityPlayer.updateInput(player);
    }

    const ground = active.find((x) => x.ground) as EntityGround;

    for (const e of active) {
      if (e.transform && !e.transform.position) {
        // Make sure views are ready
        continue;
      }

      if (e.force) {
        EntityForce.applyForces(e as EntityForce);
      }
      // if (e.gravity) {
      //   EntityGravity.fall(e as EntityGravity);
      // }
      if (e.adjustToGround) {
        EntityAdjustToGround.adjustToGround(e as EntityAdjustToGround, ground);
      }

      // if (e.raycastSelectorThree && e.selector?.mode !== `none`) {
      //   EntityRaycastSelectorThree.raycast(e as EntityRaycastSelectorThree);
      // }
      // if (e.raycastSelectorPhysics && e.raycastSelector?.mode !== `none`) {
      //   EntityRaycastSelectorPhysics.raycast(e as EntityRaycastSelectorPhysics);
      // }
    }

    const timeStart = window.performance.now();
    worldState.frameTrigger.next();
    performanceData.worldFrame.callCount++;
    const timeElapsedMs = window.performance.now() - timeStart;
    performanceData.worldFrame.timeElapsedMs += timeElapsedMs;

    worldState.activeEntities.frozen = false;
    worldState.activeEntities.frozen = true;
  });

  // logger.log(`WorldContainer RENDER`, {
  //   debugPhysics,
  //   entitiesCount: worldState.activeEntities.items.map((x) => x.key),
  //   worldChildrenCount: world.children.items.map((x) => x.key),
  //   activeViews: activeViews.map((x) => x.key),
  //   activeTextViews: activeTextViews.map((x) => x.key),
  //   activeBatchViews: activeBatchViews.map((x) => x.key),
  // });

  if (debugPhysics) {
    <>
      <Physics allowSleep={false} iterations={iterations ?? 15} gravity={gravity ?? [0, -9.8, 0]}>
        <Debug color='red' scale={1.1}>
          {activeViews.map((x) => (
            <React.Fragment key={x.key}>{x.view && <x.view.Component entity={x} />}</React.Fragment>
          ))}
          {activeTextViews.map((x) => (
            <React.Fragment key={x.key}>{x.textView && <x.textView.Component entity={x} />}</React.Fragment>
          ))}
          {activeBatchViews.map((g) => (
            <React.Fragment key={`${g.key}`}>
              {g.first.view?.BatchComponent && <g.first.view.BatchComponent entities={g.items} />}
            </React.Fragment>
          ))}
        </Debug>
      </Physics>
    </>;
  }

  return (
    <>
      <Physics allowSleep={false} iterations={iterations ?? 15} gravity={gravity ?? [0, -9.8, 0]}>
        {activeViews.map((x) => (
          <React.Fragment key={x.key}>{x.view && <x.view.Component entity={x} />}</React.Fragment>
        ))}
        {activeTextViews.map((x) => (
          <React.Fragment key={x.key}>{x.textView && <x.textView.Component entity={x} />}</React.Fragment>
        ))}
        {activeBatchViews.map((g) => (
          <React.Fragment key={g.key}>
            {g.first.view?.BatchComponent && <g.first.view.BatchComponent entities={g.items} />}
          </React.Fragment>
        ))}
      </Physics>
    </>
  );
};
