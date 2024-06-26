/*
 * Irakur - Learn languages through immersion
 * Copyright (C) 2023-2024 Ander "Laquin" Aginaga San Sebastián
 * Licensed under version 3 of the GNU Affero General Public License
 */

import fs from 'fs';
import path from 'path';
import sqlite3 from 'sqlite3';

import { queries } from './queries';

class DatabaseManager
{
	private static instance: DatabaseManager;
	database: sqlite3.Database;

	constructor(folderPath: string, fileName: string)
	{
		if (DatabaseManager.instance)
		{
			this.database = DatabaseManager.instance.database;
			return DatabaseManager.instance;
		}

		const dataFolderPath: string = folderPath;
		const databaseFilePath: string = path.join(dataFolderPath, fileName);

		if (!fs.existsSync(dataFolderPath))
		{
			fs.mkdirSync(dataFolderPath);
		}

		if (!fs.existsSync(databaseFilePath))
		{
			console.log('Database not found. Creating empty database.');
			try
			{
				fs.writeFileSync(databaseFilePath, '');
				console.log('Created empty database.');
			}
			catch(error)
			{
				console.error(error);
			}
		}

		this.database = new sqlite3.Database(
			databaseFilePath,
			(error: Error | null): void => {
				if (error)
				{
					console.error(error.message);
				}
				else
				{
					console.log('Connected to the Irakur database.');
				}
			}
		);

		this.createTables();

		DatabaseManager.instance = this;
	}

	createTables(): void
	{
		this.database.run(queries.createConfigurationTable);
		this.database.run(queries.createLanguageTable);
		this.database.run(queries.createTextTable);
		this.database.run(queries.createPageTable);
		this.database.run(queries.createWordTable);
	}

	executeQuery(query: string, parameters: any[] = []): Promise<any>
	{
		return new Promise(
			(resolve: (value: any) => void, reject: (reason?: any) => void): void => {
				this.database.all(
					query,
					parameters,
					(error: Error | null, rows: unknown[]) => {
						if (error)
						{
							reject(error);
						}
						else
						{
							resolve(rows);
						}
					}
				);
			}
		);
	}

	getFirstRow(query: string, parameters: any[] = []): Promise<any>
	{
		return new Promise(
			(resolve: (value: any) => void, reject: (reason?: any) => void): void => {
				this.database.all(
					query,
					parameters,
					(error: Error | null, rows: unknown[]) => {
						if (error)
						{
							reject(error);
						}
						else
						{
							resolve(rows[0]);
						}
					}
				);
			}
		);
	}

	getLastInsertId(): Promise<any>
	{
		return this.getFirstRow(queries.getLastInsertId);
	}
}

const databaseManager = new DatabaseManager('data', 'irakur.db');
export { databaseManager };
