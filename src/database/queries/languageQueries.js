const languageQueries =
{
    getLanguages: 'SELECT * FROM language',
    addLanguage: 'INSERT INTO language (name, dictionary_url, should_show_spaces) VALUES (?, ?, ?)',
}

module.exports = languageQueries;