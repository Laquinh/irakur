/*
 * Irakur - Learn languages through immersion
 * Copyright (C) 2023-2024 Ander Aginaga San Sebastián (a.k.a. Laquin or Laquinh)
 * Licensed under version 3 of the GNU Affero General Public License
 */

import { Page, Text } from '@common/types';
import { databaseManager } from "../database/database-manager";
import { queries } from "../database/queries";

class TextsController
{
	addText(
		languageId: number,
		title: string,
		content: string,
		sourceUrl: string,
		numberOfPages: number
	): void
	{
		databaseManager.runQuery(
			queries.addText,
			[languageId, title, sourceUrl]
		);

		const textId: number = databaseManager.getLastInsertId().id;

		this.updatePage(textId, numberOfPages, content);
	}

	getAllTexts(): Text[]
	{
		const texts: Text[] = databaseManager.getAllRows(queries.getAllTexts);

		return texts;
	}

	getTextsByLanguage(languageId: number): Text[]
	{
		const texts: Text[] = databaseManager.getAllRows(
			queries.getTextsByLanguage,
			[languageId]
		);

		return texts;
	}

	getText(textId: number): Text
	{
		const text: Text = databaseManager.getFirstRow(
			queries.getText,
			[textId]
		);

		return text;
	}

	getNumberOfPages(textId: number): number
	{
		const numberOfPages: number = databaseManager.getAllRows(
			queries.getPagesByText,
			[textId]
		).length;

		return numberOfPages;
	}

	deleteText(textId: number): void
	{
		databaseManager.runQuery(
			queries.deletePagesByText,
			[textId]
		);

		databaseManager.runQuery(
			queries.deleteText,
			[textId]
		);
	}

	editText(
		languageId: number,
		title: string,
		sourceUrl: string,
		numberOfPages: number,
		content: string,
		textId: number,
		timeOpened: number,
		timeFinished: number,
		progress: number
	): void
	{
		const queryParams: any[] = [];
		const updates: string[] = [];
	
		if (languageId !== undefined)
		{
			const language = databaseManager.getFirstRow(
				queries.getLanguage,
				[languageId]
			);
			if (!language)
			{
				console.error('Language does not exist.');
				return;
			}
			updates.push('language_id = ?');
			queryParams.push(languageId);
		}
		if (title !== undefined)
		{
			updates.push('title = ?');
			queryParams.push(title);
		}
		if (sourceUrl !== undefined)
		{
			updates.push('source_url = ?');
			queryParams.push(sourceUrl);
		}
		if (timeOpened !== undefined)
		{
			updates.push('time_opened = ?');
			queryParams.push(timeOpened);
		}
		if (timeFinished !== undefined)
		{
			updates.push('time_finished = ?');
			queryParams.push(timeFinished);
		}
		if (progress !== undefined)
		{
			updates.push('progress = ?');
			queryParams.push(progress);
		}
		if (numberOfPages !== undefined || content !== undefined)
		{
			this.updatePage(textId, numberOfPages, content);
		}

		if (updates.length > 0)
		{
			queryParams.push(textId);

			const dynamicQuery: string = queries.editText.replace(
				/\%DYNAMIC\%/,
				(): string => {
					return updates.join(', ');
				}
			);

			databaseManager.runQuery(dynamicQuery, queryParams);
		}
	}

	private updatePage(textId: number, numberOfPages: number, content: string)
	{
		const pages: Page[] = databaseManager.getAllRows(
			queries.getPagesByText,
			[textId]
		);

		const newNumberOfPages: number = (numberOfPages !== undefined) ? numberOfPages : pages.length;

		let newContent: string;
		if (content !== undefined)
		{
			newContent = content;
		}
		else
		{
			newContent = pages.map((page: Page) => page.content).join('');
		}

		const sentences: string[] = newContent.split(/([^.?!。！？…]*[.?!。！？…\s\r\n]+)/u)
			.filter((sentence: string) => sentence !== '');
		const sentencesPerPage: number = Math.floor(sentences.length / newNumberOfPages);

		const newPageContents: string[] = [];

		let firstPageIndex: number = 0;
		let lastPageIndex: number = sentencesPerPage + (sentences.length % newNumberOfPages > 0 ? 0 : -1);
		for (let i = 0; i < newNumberOfPages; i++)
		{
			// Do not trim the following string! Separators must be preserved in case the number of pages is changed
			newPageContents[i] = sentences.slice(firstPageIndex, lastPageIndex+1).join('');
			if (i < pages.length)
			{
				databaseManager.runQuery(
					queries.editPage,
					[newPageContents[i], textId, i + 1]
				);
			}

			firstPageIndex = lastPageIndex + 1;
			lastPageIndex = firstPageIndex
				+ sentencesPerPage
				+ ((i + 1) < sentences.length % numberOfPages ? 0 : -1);
		}
		if (newNumberOfPages > pages.length)
		{
			const dynamicQuery: string = queries.addPagesInBatch.replace(
				/\%DYNAMIC\%/,
				(): string => {
					return newPageContents.slice(pages.length).map(
						(token: string, index: number): string => {
							return `(${textId}, ${index + pages.length + 1}, '${token.replace(/'/g, "''")}')`;
						}
					).join(', ');
				}
			);

			databaseManager.runQuery(dynamicQuery);
		}
		if (newNumberOfPages < pages.length)
		{
			databaseManager.runQuery(
				queries.deletePagesInBatch,
				[textId, newNumberOfPages + 1]
			);
		}
	}
}

export { TextsController };
