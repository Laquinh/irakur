/*
 * Irakur - Learn languages through immersion
 * Copyright (C) 2023-2024 Ander Aginaga San Sebastián (a.k.a. Laquin or Laquinh)
 * Licensed under version 3 of the GNU Affero General Public License
 */

import styles from './progress-bar.module.css';

const ProgressBar = ({ progress }: { progress: number }): JSX.Element => {
	return (
		<div className={styles.container}>
			<div className={styles.filler} style={{ width: `${progress * 100}%` }} />
		</div>
	);
};

export { ProgressBar };
