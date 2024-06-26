/*
 * Irakur - Learn languages through immersion
 * Copyright (C) 2023-2024 Ander "Laquin" Aginaga San Sebastián
 * Licensed under version 3 of the GNU Affero General Public License
 */

type Language = {
	id: number;
	name: string;
	shouldShowSpaces: boolean;
	dictionaryUrl: string;
};

type Text = {
	id: number;
	languageId: number;
	title: string;
	sourceUrl: string;
};

type Page = {
	textId: number;
	number: number;
	content: string;
};

type ReducedWordData = {
	content: string;
	status?: number;
	type: string;
};

type Entry = {
	meaning: string,
	reading: string
};

type Word = {
	id: number;
	languageId: number;
	content: string;
	status: number;
	entries: Entry[];
	notes: string;
	datetimeAdded: string;
	datetimeUpdated: string;
};

type RawWord = {
	id: number;
	languageId: number;
	content: string;
	status: number;
	entries: string,
	notes: string;
	datetimeAdded: string;
	datetimeUpdated: string;
};

export type { Language, Text, Page, ReducedWordData, Entry, Word, RawWord };
