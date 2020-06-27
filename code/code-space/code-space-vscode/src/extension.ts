import * as vscode from 'vscode';
import { getAllDirectories } from 'utils/files';

export function activate(context: vscode.ExtensionContext) {
    context.subscriptions.push(
        vscode.commands.registerCommand(`codeSpace.start`, () => {
            // Create and show a new webview
            const panel = vscode.window.createWebviewPanel(
                `codeSpace`,
                `Code Space`,
                vscode.ViewColumn.One,
                {},
            );
            panel.webview.html = getWebviewContent();

            (async () => {
                panel.webview.html = await loadData(vscode.workspace.workspaceFolders?.[0].uri.fsPath ?? null);
            })();

        }),
    );
}

async function loadData(rootDir: string | null) {
    if (!rootDir) { return getWebviewContent({ rootDir }); }
    // Get List of Dirs
    const allDirs = await getAllDirectories(rootDir);

    return getWebviewContent({ allDirs });
}

function getWebviewContent(data?: unknown) {
    return `<!DOCTYPE html>
  <html lang="en">
  <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Cat Coding - Test</title>
  </head>
  <body>
      <span>Look at the cat!</span>
      <img src="https://media.giphy.com/media/JIX9t2j0ZTN9S/giphy.gif" width="300" />
      <dir>${JSON.stringify(data, null, 2)}</dir>
  </body>
  </html>`;
}
