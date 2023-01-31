const express = require('express');
const hbs = require('express-handlebars');
const cookieParser = require('cookie-parser');

// set app
const app = express();

// set hbs
app.engine('hbs', hbs.engine({
    extname: 'hbs'
}));
app.set('view engine', 'hbs');

// set urlencoded, coockie parser
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

app.get('/', (req, res) => {
    res.render('home');
});

app.get('/login', (req, res) => {
    res.render('login');
})

app.post('/login', (req, res) => {
    const { username, password } = req.body;

    if (username !== 'V1kata' && password !== '123') {
        res.status(401).end();
    }
    
    console.log(username, password);
});

app.get('/profile', (req, res) => {

})

app.listen(5000, () => console.log('Server is running on http://localhost:5000'));