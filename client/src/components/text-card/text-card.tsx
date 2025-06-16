/*
 * Irakur - Learn languages through immersion
 * Copyright (C) 2023-2024 Ander Aginaga San Sebastián (a.k.a. Laquin or Laquinh)
 * Licensed under version 3 of the GNU Affero General Public License
 */

import { Link } from 'react-router-dom';

import { Text } from '@common/types';
import { backendConnector } from '../../backend-connector';
import styles from './text-card.module.css';
import gearIcon from '../../assets/icons/Gear_icon_svg.svg';
import trashIcon from '../../assets/icons/Font_Awesome_5_solid_trash-alt.svg';
import { ProgressBar } from '../progress-bar';

const TextCard = ({ text }: { text: Text }): JSX.Element => {
	const handleDelete = async (): Promise<void> => {
		const enteredText: string | null = prompt(
			"Do you really want to delete text '" + text.title
				+ "' (ID: " + text.id + ")?\n"
				+ "Type 'DELETE' to confirm."
		);
		if (enteredText !== "DELETE")
		{
			alert("Deletion canceled. Incorrect confirmation text.");
			return;
		}

		const wasDeleted: boolean = await backendConnector.deleteText(text.id);
		if (wasDeleted)
		{
			window.location.reload();
		}
	};

	return (
		<div className={styles.textCard}>
			<div className={styles.buttonStack}>
				<Link className={styles.iconButton} to={`/texts/edit/${text.id}`}>
					<img className={styles.icon} src={gearIcon}/>
				</Link>
				<button className={styles.iconButton} onClick={handleDelete}>
					<img className={styles.icon} src={trashIcon}/>
				</button>
			</div>
			<h3 className={styles.title}>
				{text.title.length > 40
					? text.title.substring(0, 40) + '...'
					: text.title}
			</h3>
			<p className={styles.language}>Language: {text.languageId}</p>
			<ProgressBar progress={text.progress} />
			<Link className={styles.readButton} to={`/texts/read/${text.id}`}>Read</Link>
		</div>
	);
};

export { TextCard };
