import { promises as fs } from 'fs';
import * as path from 'path';
import * as vscode from 'vscode';

const showMessage = (message: string) => {
  // eslint-disable-next-line @typescript-eslint/no-floating-promises
  vscode.window.showInformationMessage(message);
};

export const fixAutoImports = async (_context: vscode.ExtensionContext) => {
  const doc = vscode.window.activeTextEditor?.document;
  if (!doc) {
    showMessage(`No Active Document`);
    return;
  }

  try {
    await fixAutoImports_doc(doc);
  } catch (err) {
    showMessage(`ERROR: ${err}`);
  }
};

export const fixAutoImports_doc = async (doc: vscode.TextDocument) => {
  // showMessage(`fixAutoImports_doc - START doc: ${doc.fileName}`);

  const editor = vscode.window.activeTextEditor;
  if (editor?.document !== doc) {
    showMessage(`Can only edit active document`);
    return;
  }

  const isSupported = [`typescript`, `typescriptreact`].includes(doc.languageId);
  if (!isSupported) {
    showMessage(`Languange not supported: ${doc.languageId}`);
    return;
  }

  const packageRegs = await loadPackageRegistration(doc.fileName);
  if (!packageRegs) {
    showMessage(`Package Registrations not found: ${doc.fileName}`);
    return;
  }

  // showMessage(`DEBUG: loadPackageRegistration result: ${JSON.stringify(packageRegs, null, 2)}`);

  const docText = doc.getText();
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

      return { index: x.index, from: x.text, to: p.packageName };
    })
    .filter((x) => x)
    .map((x) => x!);

  if (!corrections.length) {
    return;
  }

  // Make corrections (in reverse so index doesn't change)
  for (const c of corrections.reverse()) {
    // showMessage(`DEBUG: correction: ${c.from} => ${c.to}`);
    await editor.edit((b) => {
      b.replace(new vscode.Range(doc.positionAt(c.index), doc.positionAt(c.index + c.from.length)), c.to);
    });
  }

  await editor.document.save();
};

type PackageRegistration = { packageName: string; packagePath: string };
const loadPackageRegistration = async (currentPath: string): Promise<null | PackageRegistration[]> => {
  return await loadPackageRegistration_rush(currentPath);
};

const loadPackageRegistration_rush = async (currentPath: string) => {
  const result = await findFileInParentPath(currentPath, `rush.json`);
  if (!result) {
    return null;
  }

  // showMessage(`DEBUG: Found rush.json at projects: ${result.filePath}`);

  const { content, filePath } = result;
  const rushJsonObj = parseJsonc(content) as {
    projects: {
      packageName: string;
      projectFolder: string;
    }[];
  };
  const rushProjects = rushJsonObj.projects;

  // showMessage(`DEBUG: parsed rush.json: ${rushProjects.map((x) => x.packageName).join(`, `)}`);
  return rushProjects.map((x) => ({
    packageName: x.packageName,
    packagePath: path.resolve(path.join(path.dirname(filePath), x.projectFolder)),
  }));
};

const findFileInParentPath = async (
  currentPath: string,
  filename: string,
): Promise<null | { content: string; filePath: string }> => {
  const dirPath = path.dirname(currentPath);
  const filePath = path.join(dirPath, filename);
  try {
    const content = await fs.readFile(filePath, { encoding: `utf-8` });
    return { content, filePath };
  } catch {
    // Failed to find file
  }

  try {
    if (path.dirname(dirPath).length >= dirPath.length) {
      // No parent dir
      // showMessage(`DEBUG: No parent dir: ${dirPath} parent: ${path.dirname(dirPath)}`);

      return null;
    }
  } catch {
    // showMessage(`DEBUG: No parent dir (ERROR): ${dirPath}`);
    return null;
  }

  return await findFileInParentPath(dirPath, filename);
};

const parseJsonc = (content: string) => {
  const cleaned = content
    // Remove line comments
    .replace(/^\s*\/\/.*$/gm, ``)
    // Remove multi-line comments
    .replace(/\/\*([\s\S]*?)\*\//g, ``);
  return JSON.parse(cleaned);
};
