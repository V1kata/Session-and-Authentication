const db = require('./db.json');
const fs = require('fs/promises');
const bcrypt = require('bcrypt');

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