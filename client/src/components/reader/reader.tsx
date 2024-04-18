/*
 * Irakur - Learn languages through immersion
 * Copyright (C) 2023-2024 Ander "Laquin" Aginaga San Sebastián
 * Licensed under version 3 of the GNU Affero General Public License
 */

import React, { useEffect, useState } from 'react';
import { Helmet, HelmetProvider } from 'react-helmet-async';
import { Outlet } from 'react-router-dom';

import { ReducedWordData, Text } from '@common/types';
import { backendConnector } from '../../backend-connector';
import { Loading } from '../../components/loading';

const statusStyles: Record<string, string> = {
	'0': '#ADDFF4FF',
	'1': '#F5B8A9FF',
	'2': '#F5CCA9E5',
	'3': '#F5E1A9BF',
	'4': '#F5F3A99F',
	'5': '#DDFFDD7F',
	'99': '#FFFFFF00',
	'98': '#FFFFFF00',
}

const getStyle = (status: number): string => {
	return statusStyles[status.toString()] || '#FFFFFF00';
}

const Reader = ({ onWordClick }: { onWordClick: (content: string) => void }): JSX.Element => {
	const [currentPage, setCurrentPage] = useState<number>(1);
	const [words, setWords] = useState<ReducedWordData[]|null>(null);

	const textId = Number(document.location.pathname.split('/').pop());
	const [numberOfPages, setNumberOfPages] = useState<number|null>(null);

	const loadPage = (textId: number, pageId: number): void => {
		backendConnector.getWords(textId, pageId).then(
			(words: ReducedWordData[]): void => {
				setWords(words);
			}
		);
		setCurrentPage(pageId);
	}

	useEffect(
		(): void => {
			backendConnector.getText(textId).then(
				(text: Text): void => {
					setNumberOfPages(text.numberOfPages??null);
				}
			)
			loadPage(textId, currentPage);
		},
		[]
	);

	if (!words || !numberOfPages)
	{
		return <Loading />;
	}

	return (
		<div>
			<div>
				{
					words.map(
						(word: ReducedWordData, index: number) => {
							let renderedElement;
							if (word.content === '\n')
							{
								renderedElement = (
									<br key={index} style={{ marginBottom: "1rem" }}/>
								)
							}
							else if (word.type === 'punctuation')
							{
								renderedElement = (
									<span key={index}>{word.content}</span>
								)
							}
							else
							{
								renderedElement = (
									<span
										key={index}
										className={"word-" + word.content.toLowerCase()}
										style={{
											backgroundColor: getStyle(word.status??98),
											borderRadius: ".25rem",
											cursor: "pointer",
										}}
										onClick={(): void => {onWordClick(word.content)}}
									>{word.content}</span>
								)
							}
							return renderedElement;
						}
					)
				}
			</div>
			<div>
				<button
					disabled={currentPage === 1}
					onClick={(): void => {loadPage(textId, currentPage-1)}}
				>Previous page</button>
				<button
					disabled={currentPage === numberOfPages}
					onClick={(): void => {loadPage(textId, currentPage+1)}}
				>Next page</button>
			</div>
		</div>
	);
};

export { Reader };
