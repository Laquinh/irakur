/*
 * Irakur - Learn languages through immersion
 * Copyright (C) 2023-2024 Ander Aginaga San Sebastián (a.k.a. Laquin or Laquinh)
 * Licensed under version 3 of the GNU Affero General Public License
 */

import React, { useEffect, useState } from 'react';
import { v4 as uuid } from 'uuid';

import { Entry, Language } from '@common/types';
import styles from './edit-word.module.css';
import globalStyles from './../../styles/globals.module.css';
import { getUnixTime } from '../../../../common/utils';
import { backendConnector } from '../../backend-connector';
import { Loading } from '../loading';
import { EntryElement } from './entry-element';

const statusNames: Record<string, string> = {
	'0': 'New',
	'1': '1',
	'2': '2',
	'3': '3',
	'4': '4',
	'5': '5',
	'99': 'Known',
	'98': 'Ignore',
}

const emptyEntry: Entry = {
	meaning: '',
	reading: '',
};

const EditWord = (
	{
		content,
		languageData,
		onWordUpdate
	}: {
		content: string | null,
		languageData: Language,
		onWordUpdate: (content: string, status: number) => void
	}
): JSX.Element => {
	const [isNewWord, setIsNewWord] = useState<boolean>(content === null);
	const [isLoading, setIsLoading] = useState<boolean>(false);
	const [notification, setNotification] = useState<string | null>(null);

	const [id, setId] = useState<number | null>(null);
	const [entries, setEntries] = useState<Entry[]>([emptyEntry]);
	const [notes, setNotes] = useState<string | null>(null);
	const [status, setStatus] = useState<number>(0);
	const [areButtonsDisabled, setAreButtonsDisabled] = useState<boolean>(false);

	useEffect(
		(): void => {
			const loadWord = async (): Promise<void> => {
				setIsLoading(true);
				setNotification(null);
				if (content === null)
				{
					return;
				}
				const word = await backendConnector.findWord(content, languageData.id);
				if (word)
				{
					setIsNewWord(false);
					setId(word.id);
					setNotes(word.notes);
					setEntries((word.entries.length === 0) ? [{...emptyEntry}] : word.entries);
					setStatus(word.status);
				}
				else
				{
					setIsNewWord(true);
					setId(null);
					setStatus(0);

					const wordData = await backendConnector.getWordData(
						languageData.id,
						languageData.shouldShowSpaces
							? content
							: content.replace(new RegExp(languageData.whitespaces, 'ug'), '')
					);
					if (wordData)
					{
						setNotes(wordData.notes || null);
						setEntries(
							(wordData.entries && wordData.entries.length > 0)
								? wordData.entries.map(
									(entry) => (
										{
											meaning: entry.meaning || '',
											reading: entry.reading || '',
										}
									)
								)
								: [{...emptyEntry}]
						);
					}
					else
					{
						setNotes(null);
						setEntries([{...emptyEntry}]);
					}
				}
				setIsLoading(false);
			}

			loadWord();
		},
		[content]
	);

	const addEntry = (): void => {
		setEntries([...entries, {...emptyEntry}]);
	};

	const deleteEntry = (index: number): void => {
		if (entries !== null)
		{
			const newEntries = [...entries];
			console.log(newEntries);
			newEntries.splice(index, 1);
			console.log(newEntries);
			setEntries(newEntries);
		}
	};

	const handleSubmit = async (e: React.SyntheticEvent<HTMLFormElement, SubmitEvent>): Promise<void> => {
		setAreButtonsDisabled(true);
		e.preventDefault();
		
		const newStatus: number = parseInt((e.nativeEvent.submitter as HTMLButtonElement).value);

		const entriesToAdd: Entry[] = (entries ?? []).filter(
			(entry: Entry): boolean => entry.meaning !== '' || entry.reading !== ''
		);

		entriesToAdd.forEach(
			(entry: Entry): void => {
				entry.meaning = entry.meaning.trim();
				entry.reading = entry.reading.trim();
			}
		);

		if (isNewWord)
		{
			await backendConnector.addWord(
				languageData.id,
				content as string,
				newStatus,
				entriesToAdd,
				notes ?? '',
				getUnixTime(),
				getUnixTime()
			);
		}
		else
		{
			await backendConnector.editWord(
				id as number,
				newStatus,
				entriesToAdd,
				notes ?? '',
				getUnixTime()
			);
		}

		setAreButtonsDisabled(false);
		setNotification('Word ' + (isNewWord ? 'added' : 'updated'));

		setIsNewWord(false);
		setStatus(newStatus);

		onWordUpdate(content!, newStatus);
	};

	if (isLoading)
	{
		return <Loading />;
	}

	return (
		<form onSubmit={handleSubmit}>
			<input
				className={styles.wordContent}
				type="text"
				name="form-content"
				placeholder="Word content"
				value={
					(content !== null)
						? languageData.shouldShowSpaces
							? content
							: content.replace(new RegExp(languageData.whitespaces, 'ug'), '')
						: ''
				}
				readOnly
			/>
			<span className={styles.entriesHeader}>Dictionary entries:</span>
			<div className={styles.entriesContainer}>
				{
					(entries !== null) &&
					entries.map(
						(entry: Entry, index: number) => (
							<React.Fragment key={uuid()}>
								<div
									className={styles.entryContainer}
								>
									<div className={styles.entryElement}>
										<EntryElement
											key={uuid()}
											entry={entry}
										/>
									</div>
									<div className={styles.entryButtons}>
										<button
											className={styles.deleteEntryButton}
											type="button"
											onClick={() => deleteEntry(index)}
										>X</button>
										{
											(index === (entries.length - 1))
											? (
												<button
													className={styles.addEntryButton}
													type="button"
													onClick={addEntry}
												>+</button>
											)
											: (
												<button
													className={styles.hiddenButton}
													type="button"
												></button>
											)
										}
									</div>
								</div>
								<br />
							</React.Fragment>
						)
					)
				}
			</div>
			<textarea
				className={styles.notes}
				name="notes"
				placeholder="Notes"
				value={
					(notes !== null) ? notes : ''
				}
				onChange={e => setNotes(e.target.value)}
			/>
			<br />
			<div className={styles.statusButtonsContainer}>
			{
				[1, 2, 3, 4, 5, 99, 98].map(
					(buttonStatus: number) => (
						<button
							className={
								styles.statusButton
									+ ' '
									+ (
										(buttonStatus === status)
										? styles.statusButtonActive
										: (buttonStatus === 99 || buttonStatus === 98)
											? styles.statusButtonInactiveDefault
											: styles.statusButtonInactiveTransparent
									)
							}
							style={{
								'--status': `var(--status${buttonStatus})`
							} as React.CSSProperties}
							key={uuid()}
							disabled={areButtonsDisabled}
							type="submit"
							value={buttonStatus.toString()}
						>{statusNames[buttonStatus]}</button>
					)
				)
			}
			</div>
			{notification && <p>{notification}</p>}
		</form>
	);
};

export { EditWord };

