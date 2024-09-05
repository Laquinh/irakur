/*
 * Irakur - Learn languages through immersion
 * Copyright (C) 2023-2024 Ander Aginaga San Sebastián (a.k.a. Laquin or Laquinh)
 * Licensed under version 3 of the GNU Affero General Public License
 */

type DictionaryEntry = {
	reading: string;
	meaning: string;
};

type DictionaryWordData = {
	wordContent: string;
	entries: DictionaryEntry[];
};

interface Plugin
{
	name: string;
	start?: () => Promise<void>;
};

interface TextProcessor
{
	name: string;
	languages: string[] | null;
	processText: (text: string) => Promise<string>;
};

interface WordDataProvider
{
	name: string;
	targetLanguage: string;
	auxiliaryLanguage: string;
	getWordData: (wordContent: string) => Promise<DictionaryWordData>;
};

interface IrakurApi
{
	plugins: {
		register: (plugin: Plugin) => void;
		registerTextProcessor: (textProcessor: TextProcessor) => void;
		registerWordDataProvider: (wordDataProvider: WordDataProvider) => void;
	};
};

const irakur: IrakurApi = global.irakur;

export { Plugin, IrakurApi, TextProcessor, WordDataProvider, irakur };
