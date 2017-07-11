const express = require('express');
const bodyParser = require('body-parser');
const session = require('express-session');
const app = express();

app.set('view engine', 'pug');
app.use(bodyParser.urlencoded({ extended: false }))

app.use(session({
  secret: 'keyboard cat',
  resave: false,
  saveUninitialized: true
}))

app.get('/', (req, res) => {
  let username = req.session.username;
  res.render('index', { username });
})

app.get('/login', (req, res) => {
  res.sendFile('login.html', {root: 'public'});
})

app.post('/login', (req, res) => {
  let username = req.body.username;
  req.session.username = username;
  res.redirect('/');
})

app.get('/logout', (req, res) => {
  req.session.destroy();
  res.redirect('/');
})

app.listen(3000, (req, res) => {
  console.log('running on port 3000...');
})