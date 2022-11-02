const router = require('express').Router();
// const db = require('./db');

// router.get('/qa/questions')
// router.post('/qa/questions')
// router.get('/qa/:question_id/answers')
// router.post('/qa/:question_id/answers')
// router.put('/qa/:question_id/helpful')
// router.put('/qa/:question_id/report')
// router.put('/qa/answers/:answer_id/helpful')
// router.put('/qa/answers/:answer_id/report')

router.get('/', function(req, res, next) {
  return res.status(200).json({ message: 'welcome!' });
})

module.exports = router;
