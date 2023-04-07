import { wogger } from '../../../worker/wogger';

export type EntityAction = {
  entityPath: string;
  componentName: string;
  actionName: string;
  args: unknown[];
};
export const parseActionCode = (actionCode: string): undefined | EntityAction => {
  // Example actions:
  // moveToTarget.setRelativeTarget([0,-${itemHeight},0],0.5)
  // ../menu-scroller/moveToTarget.setRelativeTarget([0,-${itemHeight},0],0.5)

  // regex to parse action code
  const match = actionCode.trim().match(/^(\.?\.\/(?:[a-zA-Z0-9_-]+\/)*)?([a-zA-Z0-9_-]+)\.([a-zA-Z0-9_-]+)\((.*)\)$/);

  if (!match) {
    wogger.error(`action could not be parsed`, { actionCode });
    return;
  }

  const [_, entityPath, componentName, actionName, actionArgs] = match;

  //   // parse args to array
  //   const regexPattern_quotedString = `("[^"]*")|('[^']*')|(\`[^\`]*\`)`;
  //   const regexPattern_number = `([0-9\\.]+)`;
  //   const regexPattern_boolean = `(true|false)`;
  //   const regexPattern_scalar = `\\s*(${regexPattern_quotedString}|${regexPattern_number}|${regexPattern_boolean}|null|undefined)\\s*`;
  //   const regexPattern_arrayEmpty = `\\[\\s*\\]`;
  //   const regexPattern_arraySimple = `\\s*\\[\\s*(${regexPattern_scalar},\\s*)*\\s*${regexPattern_scalar}\\s*,?\\s*\\]\\s*`;
  //   const regexPattern_objectField = `\\s*(${regexPattern_scalar}|${regexPattern_arraySimple})\\s*:\\s*${regexPattern_scalar}\\s*`;
  //   const regexPattern_objectEmpty = `\\{\\s*\\}`;
  //   const regexPattern_objectSimple = `\\{(${regexPattern_objectField},)*${regexPattern_objectField},?\\}`;
  //   const regexPattern_arg = `\\s*(${regexPattern_scalar}|${regexPattern_arrayEmpty}|${regexPattern_arraySimple}|${regexPattern_objectEmpty}|${regexPattern_objectSimple})\\s*`;
  //   const regexPattern_args = `(${regexPattern_arg},)*${regexPattern_arg},?`;

  //   const parseArgPart = (argPart: string): unknown => {
  //     argPart = argPart.trim();
  //     // null
  //     if (argPart === `null`) {
  //       return null;
  //     }
  //     // undefined
  //     if (argPart === `undefined`) {
  //       return undefined;
  //     }
  //     // object
  //     if (argPart.startsWith(`{`)) {
  //       const contents = argPart.replace(/^\{/, ``).replace(/\}$/, ``);
  //       const fields = parseArgList(contents);

  //       const obj = {} as Record<string, unknown>;
  //       fields.forEach((field) => {
  //         const [keyRaw, valueRaw] = field.split(`:`);
  //         const key = parseArgPart(keyRaw.trim()) as string;
  //         obj[key] = parseArgPart(valueRaw);
  //       });
  //       return obj;
  //     }
  //     // array
  //     if (argPart.startsWith(`[`)) {
  //       const contents = argPart.replace(/^\[/, ``).replace(/\]$/, ``);
  //       return parseArgList(contents);
  //     }
  //     // number
  //     if (!isNaN(Number(argPart))) {
  //       return Number(argPart);
  //     }
  //     // boolean
  //     if (argPart === `true`) {
  //       return true;
  //     }
  //     if (argPart === `false`) {
  //       return false;
  //     }
  //     // string
  //     return argPart;
  //   };

  //   const parseArgList = (argList: string): unknown[] => {
  //     argList = argList.trim();
  //     if (argList === ``) {
  //       return [];
  //     }
  //   };

  //   const args = parseArgList(actionArgs);

  // eslint-disable-next-line no-eval
  const args = eval(`[${actionArgs}]`) as unknown[];

  wogger.log(`action parsed`, { actionCode, entityPath, componentName, actionName, args });
  return {
    entityPath,
    componentName,
    actionName,
    args,
  };
};

type EntityInstanceWithPathInfo = {
  instanceId: number;
  parent: EntityInstanceWithPathInfo;
  children: EntityInstanceWithPathInfo[];
  desc: { name: string };
};
export const findEntityInstanceByPath = (entity: EntityInstanceWithPathInfo, path: string) => {
  wogger.log(`findEntityInstanceByPath`, { entity, path });

  if (!path) {
    return entity;
  }

  const pathParts = path.split(`/`);
  let currentEntity = entity;
  for (const pathPart of pathParts) {
    if (!pathPart) {
      continue;
    }
    if (pathPart === `.`) {
      continue;
    }
    if (pathPart === `..`) {
      currentEntity = currentEntity.parent;
      continue;
    }

    const childByNameOrId = currentEntity.children.find(
      (child) => child.desc.name === pathPart || child.instanceId === Number(pathPart),
    );
    if (!childByNameOrId) {
      wogger.error(`entity with path not found`, { path, entity, pathPart, currentEntity });
      return;
    }
    currentEntity = childByNameOrId;
  }
  return currentEntity;
};
