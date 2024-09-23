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
	id: string;
	name: string;
	start?: () => Promise<void>;
};

interface TextProcessor
{
	id: string;
	name: string;
	languages: string[] | Symbol;
	processText: (text: string) => Promise<string>;
};

interface WordDataProvider
{
	id: string;
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
	symbols: {
		anyLanguage: Symbol;
	};
};

declare var irakur: IrakurApi;

export { Plugin, IrakurApi, TextProcessor, WordDataProvider, irakur };