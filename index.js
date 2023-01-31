const express = require('express');
const hbs = require('express-handlebars');
const expressSession = require('express-session');
const cookieParser = require('cookie-parser');

// set app
const app = express();

// set hbs
app.engine('hbs', hbs.engine({
    extname: 'hbs'
}));
app.set('view engine', 'hbs');

// set urlencoded, coockie parser, session (directly from npm)
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(expressSession({
    secret: 'keyboard cat',
    resave: false,
    saveUninitialized: true,
    cookie: { secure: true }
}));

app.get('/', (req, res) => {
    res.render('home');
});

app.get('/login', (req, res) => {
    res.render('login');
})

app.post('/login', (req, res) => {
    const { username, password } = req.body;

    if (username !== 'V1kata' && password !== '123') {
        res.redirect('/404');
    }

    const data = {
        username,
        privateInfo: 'some private info'
    }

    res.cookie('auth', JSON.stringify(data));
    req.session.username = username;
    req.session.secret = data.privateInfo;
    res.redirect('/');
});

app.get('/profile', (req, res) => {
    const authData = req.cookies['auth'];

    if (!authData) {
        return res.redirect('/404');
    }

    const data = JSON.parse(authData);

    res.render('profile', data);
});

app.get('*', (req, res) => {
    res.render('404');
})

app.listen(5000, () => console.log('Server is running on http://localhost:5000'));