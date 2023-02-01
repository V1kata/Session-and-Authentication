const db = require('./db.json');
const fs = require('fs/promises');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const secret = 'myveryverysecret';

async function saveDb() {
    const data = JSON.stringify(db, null, 2);

    await fs.writeFile('./db.json', data);
}

exports.registerUser = async (username, password) => {
    if (db.users.some(el => el.username == username)) {
        throw new Error('User not registered');
    }

    const salt = await bcrypt.genSalt();
    const hash = await bcrypt.hash(password, salt);

    db.users.push({
        username,
        password: hash
    });

    await saveDb();
}

exports.loginUser = async (username, password) => {
    const user = db.users.find(x => x.username == username);

    if (!user) {
        throw new Error('There is no username or password');
    }

    const passMatch = await bcrypt.compare(password, user.password);

    if (!passMatch) {
        throw new Error('There is no username or password');
    }

    const payload = { username: user.username }
    const options = { expiresIn: '1h' };

    const token = jwt.sign(payload, secret, options);

    console.log(token)
    return token;
}