// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';
import ollama from 'ollama';
import appConfigJson from '../appconfig.json';


interface Model {
    label: string;
    value: string;
};

type AppConfig = {
    defaultModel: string;
    models: Model[];
};


// This method is called when your extension is activated
// Your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {
	// Use the console to output diagnostic information (console.log) and errors (console.error)
	// This line of code will only be executed once when your extension is activated
	const defaultModel: string = appConfigJson.defaultModel;
	console.log(`default model is set to: ${defaultModel}`);
	
	// The command has been defined in the package.json file
	// Now provide the implementation of the command with registerCommand
	// The commandId parameter must match the command field in package.json
	const disposable = vscode.commands.registerCommand('deepseek-code.start', () => {
		const panel = vscode.window.createWebviewPanel(
			'deepChat',
			'AI Chatbot',
			vscode.ViewColumn.One,
			{enableScripts:true}
		);

		panel.webview.html = getWebviewContent(appConfigJson);
		panel.webview.onDidReceiveMessage(async (message:any) => {
			if (message.command = 'chat') {
				const userPrompt = message.text;
				const model = message.modelToUse;
				let responseText = '';
				try {
					const streamResponse = await ollama.chat({
						model: model,
						messages: [{role: 'user', content: userPrompt}],
						stream: true
				});
				for await (const part of streamResponse) {
					responseText += part.message.content;
					panel.webview.postMessage({
						command: 'chatResponse', 
						text: responseText
					});
				}
				} catch (err) {
					panel.webview.postMessage({command: 'chatResponse', text: `Error: $(String(err))`});
				}
			}
		});
	});

	context.subscriptions.push(disposable);
}

function getWebviewContent(appConfigJson: AppConfig): string {
	const modelOptions = buildModelOptions(appConfigJson);
	const defaultModel = appConfigJson.defaultModel;
	console.log(modelOptions);
	return /*html*/`
	<!DOCTYPE html>
	<html lang="en">
	<head>
		<meta charset="UTF-8" />
		<style>
			body { 
				font-family: 'TERMINAL','ANSI', monospace;
				margin: 1rem;
				color: #00ff88;
				background-color:hsl(0, 0.00%, 0.00%);
			}
			#prompt { 
				width: 100%; 
				box-sizing: border-box;
				font-family: Arial, sans-serif;
				height: 50px;
				background-color: #1a1a1a;
				color: rgba(0, 255, 55, 0.93);
				border: 2px solid #000;
				border-radius: 5px;
				padding: 15px;
			}

			#response { 
				border: 1px solid #ccc;
				margin-top: 1rem;
				padding: 0.5rem;
				min-height: 80%;
			}
			#askBtn {
			background-color: #2c3e50;
			color: #000000
			padding: 15px 30px;
			border-radius: 15px;
			transition: all 0.3s ease;
			cursor: pointer;
			position: relative;
			}
			#askBtn:hover {
			transform: scale(1.05);
			box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
			}
			#askBtn.active {
			transform: scale(1.02);
			}
			#askBtn.disabled {
			opacity: 0.7;
			cursor: not-allowed;
			transition: all 0.3s ease;
			}
		</style>
	</head>
	<body>
		<h2>AI Model Chat VS Code Extension</h2>
		<textarea id="prompt" rows="3" placeholder="How can I help?"></textarea><br />
		<select id="model-dropdown" style="width: 200px;">
			${modelOptions}
    	</select>
	 	<button id="askBtn">Ask</button>
		<div id="response"></div>
		<script>
			
			const vscode = acquireVsCodeApi();

			const submitResponse = () => {
				const text = document.getElementById('prompt').value;
				const modelToUse = document.getElementById('model-dropdown').value
				vscode.postMessage({
					command: 'chat', 
					text,
					modelToUse
				});
			}

			document.getElementById('askBtn').addEventListener('click', submitResponse);

			window.addEventListener('message', event => {
				const { command, text } = event.data;
				if ( command == "chatResponse" ) {
					document.getElementById('response').innerText = text;
				};
			})
		
		</script>
	</body>
	`;
}


function buildModelOptions(appConfigJson: AppConfig ) {
	const defaultModel: string = appConfigJson.defaultModel;
	const models = appConfigJson.models;
	let opts: string[] = [];
	for(let i: number = 0; i < models.length; i++) {
		let model: Model = models[i];
		if ( defaultModel !== model.value ) {
			opts.push(`<option value="${model.value}">${model.label}</option>`);
		} else {
			opts.unshift(`<option value="${model.value}">${model.label}(default))</option>`);
		}	
	}
	const dropdownOptions: string = opts.join('\n');
	return dropdownOptions;
}

// This method is called when your extension is deactivated
export function deactivate() {}
