const router = require('express').Router();
const db = require('./postgres');

// router.get('/qa/questions')
// router.post('/qa/questions')
// router.get('/qa/:question_id/answers')
// router.post('/qa/:question_id/answers')
// router.put('/qa/:question_id/helpful')
// router.put('/qa/:question_id/report')
// router.put('/qa/answers/:answer_id/helpful')
// router.put('/qa/answers/:answer_id/report')

router.get('/qa/questions', (req, res) => {
  db.query()
})

router.get('/test', (req, res) => {
  db.query('SELECT * FROM answers WHERE id=2')
    .then(data => {res.status(200).send(data.rows)})
    .catch(e => {console.log('error',e); res.status(500).send(e)})
});

module.exports = router;
