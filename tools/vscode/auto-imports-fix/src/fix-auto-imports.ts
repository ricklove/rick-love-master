import * as vscode from 'vscode';
import { findAutoImportsCorrections } from '@ricklove/rush-packages';

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
    // showMessage(`Languange not supported: ${doc.languageId}`);
    return;
  }

  const corrections = await findAutoImportsCorrections(doc);
  if (!corrections) {
    return;
  }

  for (const c of corrections) {
    // showMessage(`DEBUG: correction: ${c.from} => ${c.to}`);
    await editor.edit((b) => {
      b.replace(new vscode.Range(doc.positionAt(c.index), doc.positionAt(c.index + c.fromText.length)), c.toText);
    });
  }

  await editor.document.save();
};
