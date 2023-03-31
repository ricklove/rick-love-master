type Ecs = {
  entity: (name: string) => EcsEntityFactory;
};

type EcsEntityFactory = {
  build: () => EcsEntity;
  addChild: (child: EcsEntity) => EcsEntityFactory;
  // components
  rigidBody: (args: {}) => EcsEntityFactory;
  sphere: (args: { radius: number; position: [number, number, number] }) => EcsEntityFactory;
  ballCollider: (args: {}) => EcsEntityFactory;
  material: (args: { color: string }) => EcsEntityFactory;
  selectable: (args: { actionKey: string }) => EcsEntityFactory;
  selectableMaterialColor: (args: { hover: { color: string }; active: { color: string } }) => EcsEntityFactory;
  // each possible action is a component
  actionChangeScene: (args: { sceneKey: string }) => EcsEntityFactory;
};

type EcsEntity = {
  actionKey: string;
};

const ecs = null as unknown as Ecs;

const buildChangeSceneAction = (sceneKey: string) =>
  ecs.entity(`actionChangeScene`).actionChangeScene({ sceneKey }).build();

const buildAlienEgg = (actionKey: string) =>
  ecs
    .entity(`alienEgg`)
    .rigidBody({ position: [0, 0.5, 0], sensor: true })
    .selectable({ actionKey })
    .addChild(
      ecs
        .entity(`shell`)
        .sphere({ radius: 0.5, position: [0, 0.5, 0] })
        .material({ color: `#00ff00` })
        .selectableMaterialColor({ hover: { color: `#ffff00` }, active: { color: `#ff0000` } })
        .ballCollider({})
        .build(),
    )
    .addChild(
      ecs
        .entity(`foot1`)
        .sphere({ radius: 0.1, position: [+0.25, 0.05, +0.25] })
        .material({ color: `#00ff00` })
        .ballCollider({})
        .build(),
    )
    .addChild(
      ecs
        .entity(`foot2`)
        .sphere({ radius: 0.1, position: [+0.25, 0.05, -0.25] })
        .material({ color: `#00ff00` })
        .ballCollider({})
        .build(),
    )
    .addChild(
      ecs
        .entity(`foot3`)
        .sphere({ radius: 0.1, position: [-0.25, 0.05, +0.25] })
        .material({ color: `#00ff00` })
        .ballCollider({})
        .build(),
    )
    .addChild(
      ecs
        .entity(`foot4`)
        .sphere({ radius: 0.1, position: [-0.25, 0.05, -0.25] })
        .material({ color: `#00ff00` })
        .ballCollider({})
        .build(),
    )
    .build();

const scenes = [`scene01`, `scene02`, `scene03`, `scene04`];

const sceneEntities = scenes.map((x) => buildChangeSceneAction(x));
const alienEggs = sceneEntities.map((x) => buildAlienEgg(x.actionKey));
