const User = require('../auth/auth-model');
const jwt = require('jsonwebtoken');
const { JWT_SECRET } = require('../secrets');

/*=========================
Check for User Registration
==========================*/
const checkUsernameUnique = async (req, res, next) => {
    const { username } = req.body;

    await User.findBy({username: username})
        .then(check => {
            if (!check.length) {
                next();
            } else {
                res.status(401).json('username taken');
            }
        })
        .catch(err => {
            res.status(500).json(`Server error: ${err}`);
        });
};

/*=================
Check User Payloads
==================*/

const checkPayload = (req, res, next) => {
    const { username, password } = req.body;

    if (!username || !password) {
        res.status(401).json({ message: 'username and password required' });
    } else {
        next();
    }
}

/*===================
Check for User Login
====================*/

const checkUserInDb = async (req, res, next) => {
    const { username } = req.body;

    await User.findBy({username: username})
        .then(check => {
            if (check.length) {
                req.user = check[0];
                next();
            } else {
                res.status(401).json('invalid credentials');
            }
        })
        .catch(err => {
            res.status(500).json(`Server error: ${err}`);
        });
};

/*========================
Reuseable Token Generation
=========================*/

const makeToken = (user) => {
    const payload = {
        subject: user.id,
        username: user.username,
        password: user.password
    };

    const options = {
        expiresIn: '6h'
    };

    return jwt.sign(payload, JWT_SECRET, options);
}

module.exports = {
    checkUsernameUnique,
    checkPayload,
    checkUserInDb,
    makeToken
}