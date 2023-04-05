import { wogger } from '../../../worker/wogger';

export type EntityAction = {
  componentName: string;
  actionName: string;
  args: unknown[];
};
export const parseActionCode = (actionCode: string): undefined | EntityAction => {
  // regex to parse action code
  const match = actionCode.trim().match(/^([a-zA-Z0-9_]+)\.([a-zA-Z0-9_]+)\((.*)\)$/);

  if (!match) {
    wogger.error(`action could not be parsed`, { actionCode });
    return;
  }

  const [_, componentName, actionName, actionArgs] = match;

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

  return {
    componentName,
    actionName,
    args,
  };
};
