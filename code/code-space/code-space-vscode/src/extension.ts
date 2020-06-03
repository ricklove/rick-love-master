import * as vscode from 'vscode';

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
        }),
    );
}

function getWebviewContent() {
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
  </body>
  </html>`;
}
