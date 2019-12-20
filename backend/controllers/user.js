const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const User = require('../models/user');

exports.createUser = (req, res, next) => {
  bcrypt
    .hash(req.body.password, 10)
    .then(hash => {
      const user = new User({
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        email: req.body.email,
        password: hash
      });
      user.save()
        .then(result => {
          res.status(201).json(result);
        })
        .catch(err => {
          res.status(500).json({
            message: 'Invalid authentication credentials.'
          })
        })
    });
}

exports.userInfo = (req, res, next) => {
  User
    .findById(req.body.id)
    .then(user => {
      if (!user) {
        return res.status(401).json({
          message: 'No user data found.'
        })
      }
      res.status(200).json(user);
    })
    .catch(err => {
      res.status(500).json({
        message: 'Fetching user data failed.'
      });
    })
}

exports.userUpdate = (req, res, next) => {
  const updated = {
    firstName: req.body.firstName,
    lastName: req.body.lastName
  }

  User
    .updateOne({ _id: req.body.id }, updated)
    .then(result => {
      if (result.n > 0) {
        res.status(200).json({ message: 'Update successful.' });
      } else {
        res.status(401).json({ message: 'Not authorized.' });
      }
    })
    .catch(error => {
      res.status(500).json({
        message: 'Could not update user.'
      });
    });
}

exports.userLogin = (req, res, next) => {
  let fetchedUser;

  User
    .findOne({ email: req.body.email })
    .then( user => {
      if (!user) {
        return res.status(401).json({
          message: 'Auth failed.'
        })
      }
      fetchedUser = user;
      return bcrypt.compare(req.body.password, user.password);
    })
    .then(result => {
      if(!result) {
        return res.status(401).json({
          message: 'Auth failed.'
        })
      }

      const token = jwt.sign(
        { email: fetchedUser.email, userId: fetchedUser._id },
        process.env.JWT_KEY,
        { expiresIn: '1h'}
      );

      res.status(200).json({
        token,
        expiresIn: 3600,
        userId: fetchedUser._id
      })
    })
    .catch(err => {
      return res.status(401).json({
        message: 'Invalid authentication credentials.'
      })
    });
}

exports.facebookLogin = (req, res, next) => {

  User
    .findOne({ email: req.body.email })
    .then(user => {
      console.log('user::', user);

      if (!user) {
        return res.status(401).json({
          message: 'Auth failed.'
        })
      }

      const token = jwt.sign(
        { email: user.email, userId: user._id },
        process.env.JWT_KEY,
        { expiresIn: '1h'}
      );

      res.status(200).json({
        token,
        expiresIn: 3600,
        userId: user._id
      })
    })
    .catch(err => {
      return res.status(401).json({
        message: 'Invalid authentication credentials.'
      })
    });
}