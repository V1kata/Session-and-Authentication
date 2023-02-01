const express = require('express');
const hbs = require('express-handlebars');
const expressSession = require('express-session');
const cookieParser = require('cookie-parser');

const dataServise = require('./dataServise');

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
    res.render('form', { name: 'Login', endpoint: 'login'});
})

app.post('/login', async (req, res) => {
    const { username, password } = req.body;

    try {
        const user = await dataServise.loginUser(username, password);

        const data = {
            username: user.username,
            password: user.password,
            privateInfo: 'some private info'
        }
    
        res.cookie('auth', JSON.stringify(data));
        req.session.username = username;
        req.session.secret = data.privateInfo;

        res.redirect('/');
        return;
    } catch(err) {
        console.log(err.message);
        res.status(401).end();
    }
});

app.get('/register', (req, res) => {
    res.render('form', { name: 'Register', endpoint: 'register'});
});

app.post('/register', async (req, res) => {
    const { username, password } = req.body;

    await dataServise.registerUser(username, password);

    res.redirect('/login');
})

app.get('/profile', (req, res) => {
    const authData = req.cookies['auth'];

    if (!authData) {
        return res.redirect('/404');
    }

    const data = JSON.parse(authData);
    // console.log(req.session)

    res.render('profile', data);
});

app.get('*', (req, res) => {
    res.render('404');
})

app.listen(5000, () => console.log('Server is running on http://localhost:5000'));