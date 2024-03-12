/* 
 * Irakur - Learn languages through immersion
 * Copyright (C) 2023-2024 Ander "Laquin" Aginaga San Sebastián
 * Licensed under version 3 of the GNU Affero General Public License
 */

import { Request, Response } from 'express';

import { DatabaseLanguage } from '../types/database';

import { databaseManager } from '../database/database-manager';
import { queries } from '../database/queries';

class LanguagesController
{
	async addLanguage(req:Request, res:Response)
	{
		await databaseManager.executeQuery(queries.addLanguage,
			[req.body.name, req.body.dictionaryUrl, req.body.shouldShowSpaces]
		);

		res.sendStatus(200);
	}

	async deleteLanguage(req:Request, res:Response)
	{
		await databaseManager.executeQuery(queries.deleteLanguage,
			[req.params.languageId]
		);

		res.sendStatus(200);
	}

	async editLanguage(req:Request, res:Response)
	{
		const queryParams: any[] = [];
		const updates: string[] = [];
	
		if (req.body.name)
		{
			updates.push('name = ?');
			queryParams.push(req.body.name);
		}
		if (req.body.dictionaryUrl)
		{
			updates.push('dictionary_url = ?');
			queryParams.push(req.body.dictionaryUrl);
		}
		if (req.body.shouldShowSpaces)
		{
			updates.push('should_show_spaces = ?');
			queryParams.push(req.body.shouldShowSpaces);
		}

		if (updates.length > 0)
		{
			queryParams.push(req.params.languageId);
			console.log(queryParams);

			const dynamicQuery = queries.editLanguage.replace(/\%DYNAMIC\%/, () => {
				return updates.join(', ');
			});

			console.log(dynamicQuery);

			await databaseManager.executeQuery(dynamicQuery, queryParams);
		}

		res.sendStatus(200);
	}

	async getAllLanguages(req:Request, res:Response)
	{
		const languages = await databaseManager.executeQuery(queries.getAllLanguages);
		
		res.json({languages: languages});
	}

	async getLanguage(req:Request, res:Response)
	{
		let language = await databaseManager.getFirstRow(queries.getLanguage,
			[req.params.languageId]
		);

		language = language as DatabaseLanguage;
		
		res.json({language: language});
	}
}

export { LanguagesController };