/* 
 * Irakur - Learn languages through immersion
 * Copyright (C) 2023-2024 Ander "Laquin" Aginaga San Sebastián
 * Licensed under version 3 of the GNU Affero General Public License
 */

import express from 'express';

import { LanguagesController } from '../controllers/languages-controller';
import { TextsController } from '../controllers/texts-controller';

const languagesController = new LanguagesController();
const textsController = new TextsController();

const router = express.Router();

router.get('/languages/', languagesController.getAllLanguages.bind(languagesController));
router.get('/languages/:languageId', languagesController.getLanguage.bind(languagesController));
router.post('/languages/', languagesController.addLanguage.bind(languagesController));
router.delete('/languages/:languageId', languagesController.deleteLanguage.bind(languagesController));
router.patch('/languages/:languageId', languagesController.editLanguage.bind(languagesController));

router.get('/texts/', textsController.getAllTexts.bind(textsController));
router.get('/texts/:textId', textsController.getText.bind(textsController));
router.post('/texts/', textsController.addText.bind(textsController));
router.delete('/texts/:textId', textsController.deleteText.bind(textsController));
router.patch('/texts/:textId', textsController.editText.bind(textsController));

export { router };