const db = require('../../data/dbConfig');

const findBy = (filter) => {
    return db('users as u')
        .select('u.id', 'u.username', 'u.password')
        .where(filter);
};

const findById = (id) => {
    return db('users as u')
        .select('u.id', 'u.username', 'u.password')
        .where('u.id', id)
        .first();
};

const add = async (user) => {
    const id = await db('users').insert(user);
    return findById(id);
};

module.exports = {
    findBy,
    findById,
    add
};