import * as assert from 'assert';
import * as vscode from 'vscode';
import * as myExtension from '../extension';
import ollama from 'ollama';


suite('Functional Tests', () => {
	vscode.window.showInformationMessage('Start all tests.');
	const testConfig = {
		defaultModel: "model2",
		models: [
			{
				"label": "Model 1",
				"value": "model1"
			},
			{
				"label": "Model 2",
				"value": "model2"
			}
		]
	};
	const modelOptions = myExtension.buildModelOptions(testConfig);


	test('buildModelOptions should return the correct html given appConfiguration', () => {
		assert.strictEqual(
			modelOptions.includes(`<option value="model2">Model 2(default)</option>`), 
			true, 
			"Model 2(default) is not in modelOptions"
		);
		assert.strictEqual(
			modelOptions.includes(`<option value="model1">Model 1</option>`),
			true,
			"Model 1 is not in modelOptions"
		);
	});

	test('Ollama models are pulled in correctly', async () => {
		 myExtension.buildWebPanel(testConfig).then( async (webPanel) => {
			await ollama.list().then((ollamaModels) => {	
				const modelList = ollamaModels.models;
				for (let i = 0; i < modelList.length; i++) {
					const model = modelList[i];
					assert.strictEqual(webPanel.webview.html.includes(model.name),
					true,
					`${model.name} not found in webPanel`
					);
					assert.strictEqual(webPanel.webview.html.includes(model.model),
					true,
					`${model.model} not found in webPanel`
					);
				}
			});
		});
	});

	
});

