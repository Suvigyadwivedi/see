const express = require('express');
const path = require('path');
const sqlite3 = require('sqlite3').verbose();
const { open } = require('sqlite');

const app = express();
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, '../views'));
app.use(express.urlencoded({ extended: true }));

let db;

(async () => {
  db = await open({
    filename: path.join(__dirname, 'database.sqlite'),
    driver: sqlite3.Database
  });

  await db.exec('CREATE TABLE IF NOT EXISTS messages (id INTEGER PRIMARY KEY, content TEXT)');
})();

app.get('/', async (req, res) => {
  const messages = await db.all('SELECT * FROM messages');
  res.render('index', { messages });
});

app.post('/add', async (req, res) => {
  const { message } = req.body;
  if (message) {
    await db.run('INSERT INTO messages (content) VALUES (?)', [message]);
  }
  res.redirect('/');
});

module.exports = app;