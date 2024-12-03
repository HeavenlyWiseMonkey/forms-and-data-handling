const usersStorage = require("../storage/usersStorage");

exports.usersListGet = (req, res) => {
  res.render("index", {
    title: "User list",
    users: usersStorage.getUsers(),
  });
};

exports.usersCreateGet = (req, res) => {
  res.render("createUser", {
    title: "Create user",
  });
};

const { body, validationResult } = require('express-validator');

const alphaErr = 'must contain only contain letters.';
const lengthErr = 'must be between 1 and 10 characters.';
const emailErr = `Must be a valid email`;
const ageErr = `Age must be between 18 and 120`;
const bioErr = `Bio must be below or at 200 characters`;

const validateUser = [
    body("firstName").trim()
        .isAlpha().withMessage(`First name ${alphaErr}`)
        .isLength({ min: 1, max: 10 }).withMessage(`First name ${lengthErr}`),
    body("lastName").trim()
        .isAlpha().withMessage(`Last name ${alphaErr}`)
        .isLength({ min: 1, max: 10 }).withMessage(`Last name ${lengthErr}`),
    body('email').trim()
        .isEmail().withMessage(emailErr),
    body('age').trim()
        .optional({ values: 'falsy' })
        .isInt({ min: 18, max: 120 }).withMessage(ageErr),
    body('bio').trim()
        .optional({ values: 'falsy' })
        .isLength({ max: 200 }).withMessage(bioErr),
];

exports.usersCreatePost = [
    validateUser,
    (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).render('createUser', {
                title: 'Create user',
                errors: errors.array(),
            });
        }
        const { firstName, lastName, email, age, bio } = req.body;
        usersStorage.addUser({ firstName, lastName, email, age, bio});
        res.redirect('/');
    }
];

exports.usersUpdateGet = (req, res) => {
    const user = usersStorage.getUser(req.params.id);
    res.render('updateUser', {
        title: 'Update user',
        user: user,
    });
}

exports.usersUpdatePost = [
    validateUser,
    (req, res) => {
        const user = usersStorage.getUser(req.params.id);
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).render('updateUser', {
                title: 'Update user',
                user: user,
                errors: errors.array(),
            });
        }
        const { firstName, lastName, email, age, bio } = req.body;
        usersStorage.updateUser(req.params.id, { firstName, lastName, email, age, bio});
        res.redirect('/');
    }
];

exports.usersDeletePost = (req, res) => {
    usersStorage.deleteUser(req.params.id);
    res.redirect('/');
}

exports.usersSearch = (req, res) => {
    res.render('searchUser', {
        title: 'Search user',
    });
}

exports.usersSearchGet = (req, res) => {
    const { name, email } = req.query;
    const searchUsers = usersStorage.getUsers().filter((user) => {
        return (`${user.firstName} ${user.lastName}` === name || user.email === email);
    });
    res.render('search', {
        title: 'Search results',
        searchUsers: searchUsers,
    });
}