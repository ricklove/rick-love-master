import path from 'path';
import { AppError } from '@ricklove/utils-core';
import { loadPackageRegistration } from './package-registration';

/** Find auto imports corrections
 *
 * @returns corrections in reverse order (so they can be applied without affecting original index)
 */
export const findAutoImportsCorrections = async (doc: {
  fileName: string;
  getText: () => string;
}): Promise<
  | {
      index: number;
      fromText: string;
      toText: string;
    }[]
  | undefined
> => {
  const docText = doc.getText();
  const packageRegs = await loadPackageRegistration(doc.fileName);
  if (!packageRegs) {
    throw new AppError(`Package Registrations not found`, { doc: doc.fileName });
  }

  // showMessage(`DEBUG: loadPackageRegistration result: ${JSON.stringify(packageRegs, null, 2)}`);

  const relativeImportsMatches = docText.matchAll(/from\s+['"](\.[^'"]+)['"]/g);
  const relativeImports = [...relativeImportsMatches].map((m) => ({
    text: m[1],
    index: docText.indexOf(m[1], m.index),
  }));

  // showMessage(`DEBUG: relativeImports: ${relativeImports.join(`, `)}`);

  const corrections = relativeImports
    .map((x) => {
      const importFullPath = path.resolve(path.join(path.dirname(doc.fileName), x.text));
      const p = packageRegs.find((x) => importFullPath.startsWith(x.packagePath));
      if (!p) {
        return;
      }

      // Skip if current package
      if (path.resolve(doc.fileName).startsWith(p.packagePath)) {
        return;
      }

      return { index: x.index, fromText: x.text, toText: p.packageName };
    })
    .filter((x) => x)
    .map((x) => x!);

  if (!corrections.length) {
    return;
  }

  // Return in reverse order so replacements will not affect index
  return corrections.reverse().sort((a, b) => -(a.index - b.index));
};
