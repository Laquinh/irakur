/*
 * Irakur - Learn languages through immersion
 * Copyright (C) 2023-2024 Ander Aginaga San Sebastián (a.k.a. Laquin or Laquinh)
 * Licensed under version 3 of the GNU Affero General Public License
 */

import React, { useEffect, useState } from 'react';
import { Helmet, HelmetProvider } from 'react-helmet-async';

import { Language, Page, Text } from '@common/types';
import { backendConnector } from '../../backend-connector';
import { Loading } from '../../components/loading';


const EditText = (): JSX.Element => {
	const [languages, setLanguages] = useState<Language[] | null>(null);
	const [text, setText] = useState<Text | null>(null);
	const [pages, setPages] = useState<Page[] | null>(null);
	const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

	const textId = Number(document.location.pathname.split('/').pop());

	useEffect(
		(): void => {
			backendConnector.getLanguages().then(
				(languages: Language[]): void => {
					setLanguages(languages);
				}
			);
		},
		[]
	);

	useEffect(
		(): void => {
			backendConnector.getText(textId).then(
				(text: Text): void => {
					setText(text);
					backendConnector.getPages(text.id).then(
						(pages: Page[]): void => {
							setPages(pages);
						}
					);
				}
			);
		},
		[textId]
	);

	const handleSubmit = async (event: React.FormEvent<HTMLFormElement>): Promise<void> => {
		event.preventDefault();

		setIsSubmitting(true);

		if (event.target === null)
		{
			return;
		}

		const form = new FormData(event.target as HTMLFormElement);

		const wasEdited: boolean = await backendConnector.editText(
			Number(form.get('id') as string),
			form.get('title') as string,
			Number(form.get('languageId') as string),
			form.get('content') as string,
			Number(form.get('numberOfPages') as string),
			form.get('sourceUrl') as string,
			undefined,
			undefined,
			undefined
		);

		if (wasEdited)
		{
			window.location.href = '/texts';
		}

		setIsSubmitting(false);
	};

	if (!text || !pages || !languages)
	{
		return <Loading />;
	}

	const textContent: string = pages.map((page: Page) => page.content).join('');

	return (
		<HelmetProvider>
			<Helmet>
				<title>Irakur - Edit text</title>
			</Helmet>
			<h1>Irakur - Edit text</h1>
			<form method="post" onSubmit={handleSubmit}>
				<input type="hidden" name="id" defaultValue={text.id}/>
				<label htmlFor="title">Title</label>
				<input type="text" name="title" id="title" defaultValue={text.title}/>
				<br />
				<label htmlFor="languageId">Language</label>
				<select name="languageId" id="languageId" defaultValue={text.languageId}>
					<option value="">Select language</option>
					{
						languages.map(
							(language: Language) =>(
								<option key={language.id} value={language.id}>{language.name}</option>
							)
						)
					}
				</select>
				<br />
				<label htmlFor="content">Content</label>
				<textarea name="content" id="content" defaultValue={textContent}/>
				<br />
				<label htmlFor="numberOfPages">Number of pages</label>
				<input type="text" name="numberOfPages" id="numberOfPages" defaultValue={pages.length}/>
				<br />
				<label htmlFor="sourceUrl">Source URL</label>
				<input type="text" name="sourceUrl" id="sourceUrl" defaultValue={text.sourceUrl}/>
				<br />
				<button type="submit" disabled={isSubmitting}>Update</button>
			</form>
		</HelmetProvider>
	);
};

export { EditText };
