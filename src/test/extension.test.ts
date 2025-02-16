import * as assert from 'assert';
import * as vscode from 'vscode';
import * as myExtension from '../extension'

suite('Extension Test Suite', () => {
	vscode.window.showInformationMessage('Start all tests.');

	//todo how do i activate the extension?
	test('Check for Commands', async () => {
		const newCommand = 'deepseek-code.start';
		const commands = await vscode.commands.getCommands();
		assert.strictEqual(commands.includes(newCommand), true, `${newCommand} not found in Command List`);
	});

	test('buildModelOptions', () => {
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
});

