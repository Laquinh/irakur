/*
 * Irakur - Learn languages through immersion
 * Copyright (C) 2023-2024 Ander Aginaga San Sebastián (a.k.a. Laquin or Laquinh)
 * Licensed under version 3 of the GNU Affero General Public License
 */

import { Language } from '@common/types';
import styles from './dictionary.module.css';

const Dictionary = ({ languageData, content }: { languageData: Language, content: string }): JSX.Element => {
	return (
		<iframe
			className={styles.dictionary}
			src={
				languageData.dictionaryUrl.replace(
					'%s',
					(languageData.shouldShowSpaces
						? content
						: content.replace(new RegExp(languageData.whitespaces, 'ug'), '')
					) || ''
				)
			}
		/>
	);
};

export { Dictionary };
