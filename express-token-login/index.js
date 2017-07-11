const express = require('express');
const mongoose = require('mongoose');
const User = require('./models/user');
const bodyParser = require('body-parser');
const jwt = require('jsonwebtoken');
const secret = require('./config').secret;

const app = express();

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))

// parse application/json
app.use(bodyParser.json())

mongoose.Promise = global.Promise;
mongoose.connect('mongodb://localhost/express-login');

let generateToken = function(user) {
  return jwt.sign(user, secret, {
    expiresIn: 3000
  })
}

const db = mongoose.connection;
db.on('error', console.log);
db.once('open', () => {
  console.log('success!');
  let user = new User({
    username: 'vhkdiy',
    password: '1234'
  })

  user.save(function(err) {
    if (err) console.log(err)
  })
});

app.get('/', (req, res) => {
  res.send('hello')
})

app.post('/auth/login', (req, res) => {
  User.findOne({username: req.body.username}, function(err, user) {
    if(!user) { return res.status(403).json({error: '用户名不存在！'}) }
    user.comparePassword(req.body.password, function(err, isMatch) {
      if (!isMatch) { return res.status(403).json({error: '密码错误'}) }
      return res.json({
        token: generateToken({name: user.username}),
        user: {name: user.username}
      })
    })
  })
})

app.listen(3000, () => {
  console.log('running on port 3000');
})