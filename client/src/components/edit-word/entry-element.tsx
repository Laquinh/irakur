/*
 * Irakur - Learn languages through immersion
 * Copyright (C) 2023-2024 Ander Aginaga San Sebastián (a.k.a. Laquin or Laquinh)
 * Licensed under version 3 of the GNU Affero General Public License
 */

import React from 'react';

import { Entry } from '@common/types';
import styles from './entry-element.module.css';

const EntryElement = ({ entry }: { entry: Entry }): JSX.Element => {
	return (
		<React.Fragment>
			<input
				className={styles.reading}
				type="text"
				name="reading"
				placeholder="Reading"
				defaultValue={entry.reading}
				onChange={(e) => entry.reading = e.target.value}
			/>
			<textarea
				className={styles.meaning}
				name="meaning"
				placeholder="Meaning"
				defaultValue={entry.meaning}
				onChange={(e) => entry.meaning = e.target.value}
			/>
		</React.Fragment>
	);
};

export { EntryElement };
