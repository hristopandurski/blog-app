const Stats = require('../models/stats');

getDates = () => {
  const dateNow = new Date();
  const currYear = dateNow.getFullYear();
  const currMonth = dateNow.getMonth();
  const lastMonth = currMonth - 1;
  const currDay = dateNow.getDate();

  // convert to UTC
  const oldDate = Date.UTC(currYear, lastMonth, currDay);
  const currentDate = Date.UTC(currYear, currMonth, currDay);

  return {
    oldDate,
    currentDate
  }
}

exports.createStats = (req, res, next) => {
  const date = getDates();
  const stats = new Stats({
    date: date.currentDate,
    user: req.body.email,
    entries: 0
  });

  stats
    .save()
    .then(createdStats => {
      res.status(201).json({
        message: 'Stats added successfully.'
      });
    })
    .catch(error => {
      res.status(500).json({
        message: 'Creating stats failed.'
      })
    });
};

exports.updateStats = (req, res, next) => {
  const date = getDates();

  Stats
    .findOne({
      user: req.body.email,
      date: {
        $gte: date.oldDate,
        $lte: date.currentDate
      }
    })
    .then(result => {
      const newStat = {
        user: req.body.email,
        date: result.date,
        entries: ++result.entries
      };

      Stats
        .updateOne({
          user: req.body.email,
          date: result.date
        }, newStat)
        .then(result => {
          res.status(200).json(result);
        })
        .catch(error => {
          res.status(500).json({
            message: 'Could not update stats.'
          });
        });
    })
    .catch(error => {
      res.status(500).json({
        message: 'Could not find stats.'
      });
    });
};

exports.getStats = (req, res, next) => {
  const date = getDates();

  Stats
    .find({
      user: req.query.email,
      date: {
        $gte: date.oldDate,
        $lte: date.currentDate
      }
    })
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
};