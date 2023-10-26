const databaseManager = require('../database/databaseManager');
const languageQueries = require('../database/queries/languageQueries');

class Languages
{
    constructor()
    {
        this.title = "Lingua Immerse — Languages";
    }

    getLanguages()
    {
        return databaseManager.executeQuery(languageQueries.getLanguages);
    }

    addLanguage(name, dictionaryUrl, shouldShowSpaces)
    {
        return databaseManager.executeQuery(languageQueries.addLanguage,
            [name, dictionaryUrl, shouldShowSpaces]
        );
    }
}

module.exports = Languages;