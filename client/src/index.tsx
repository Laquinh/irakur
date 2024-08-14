/*
 * Irakur - Learn languages through immersion
 * Copyright (C) 2023-2024 Ander Aginaga San Sebastián (a.k.a. Laquin or Laquinh)
 * Licensed under version 3 of the GNU Affero General Public License
 */

import React from 'react';
import ReactDOM from 'react-dom/client';

import { App } from './app';

const root: ReactDOM.Root = ReactDOM.createRoot(document.getElementById('root')!);
root.render(
	<React.StrictMode>
		<App />
	</React.StrictMode>
);
