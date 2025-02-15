import * as assert from 'assert';
import * as vscode from 'vscode';
import * as myExtension from '../extension';

suite('Extension Test Suite', () => {
	vscode.window.showInformationMessage('Start all tests.');

	//todo how do i activate the extension?
	test.skip('Check for Commands', async () => {
		const newCommand = 'deepseek-code.start';
		const commands = await vscode.commands.getCommands();
		assert.strictEqual(commands.includes(newCommand), true, `${newCommand} not found in Command List: ${commands}`);
	});
});

