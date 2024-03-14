/* 
 * Irakur - Learn languages through immersion
 * Copyright (C) 2023-2024 Ander "Laquin" Aginaga San Sebastián
 * Licensed under version 3 of the GNU Affero General Public License
 */

class BackendConnector
{
	private static instance: BackendConnector;

	constructor()
	{
		if(BackendConnector.instance)
		{
			return BackendConnector.instance;
		}
	}

	async addLanguage(name: string, dictionaryUrl: string, shouldShowSpaces: boolean)
	{
		const response = await fetch('/api/languages', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify({
				name,
				dictionaryUrl,
				shouldShowSpaces
			})
		});
		
		if (!response.ok) {
			throw new Error('Failed to add language');
		} else {
			console.log('Language added');
		}

		return response.ok;
	}

	async deleteLanguage(languageId: number)
	{
		const response = await fetch('/api/languages/' + languageId, {
			method: 'DELETE'
		});

		if (!response.ok) {
			throw new Error('Failed to delete language');
		} else {
			console.log('Language deleted');
		}

		return response.ok;
	}

	async editLanguage(languageId: number, name: string, dictionaryUrl: string, shouldShowSpaces: boolean)
	{
		const response = await fetch('/api/languages/' + languageId, {
			method: 'PATCH',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify({
				name,
				dictionaryUrl,
				shouldShowSpaces
			})
		})

		if (!response.ok) {
			throw new Error('Failed to edit language');
		} else {
			console.log('Language edited');
		}

		return response.ok;
	}

	async getLanguage(languageId: number)
	{
		const response = await fetch('/api/languages/' + languageId);
		const data = await response.json();
		return data.language;
	}

	async getLanguages()
	{
		const response = await fetch('/api/languages/');
		const data = await response.json();
		return data.languages;
	}

	async addText(title: string, languageId: number, content: string, numberOfPages: number, sourceUrl: string)
	{
		const response = await fetch('/api/texts', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify({
				title,
				languageId,
				content,
				numberOfPages,
				sourceUrl
			})
		});
		
		if (!response.ok) {
			throw new Error('Failed to add text');
		} else {
			console.log('Text added');
		}

		return response.ok;
	}

	async editText(id: number, title: string, languageId: number, content: string, numberOfPages: number, sourceUrl: string)
	{
		const response = await fetch('/api/texts/' + id, {
			method: 'PATCH',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify({
				title,
				languageId,
				content,
				numberOfPages,
				sourceUrl
			})
		});

		if (!response.ok) {
			throw new Error('Failed to edit text');
		} else {
			console.log('Text edited');
		}

		return response.ok;
	}

	async getText(textId: number)
	{
		const response = await fetch('/api/texts/' + textId);
		const data = await response.json();
		return data.text;
	}

	async getTexts(languageId: number)
	{
		const response = await fetch('/api/texts?languageId=' + languageId);
		const data = await response.json();
		return data.texts;
	}

	async getPages(textId: number)
	{
		const response = await fetch('/api/texts/' + textId + '/pages');
		const data = await response.json();
		return data.pages;
	}
}

const backendConnector = new BackendConnector();
export { backendConnector };