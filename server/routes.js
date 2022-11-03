const router = require('express').Router();
const db = require('./postgres');

router.get('/', (req, res) => {
  res.status(200).json('hello!')
})

router.get('/qa/questions', (req, res) => {
  const page = req.query.page || 1
  const count = req.query.count || 5
  // ${req.query.product_id}
  const query =`
    SELECT json_build_object(
      'product_id', ${req.query.product_id},
      'results', (SELECT json_agg(
        json_build_object(
          'question_id', id,
          'question_body', body
        )) FROM questions WHERE product_id = ${req.query.product_id} AND reported = false)
    )`

  db.query(query)
    .then(data => {res.status(200).send(data.rows)})
    .catch(e => {console.log('get /qa/questions error', e); res.status(500).send(e)})
})

router.post('/qa/questions', (req, res) => {
  const query = 'INSERT INTO questions (product_id, body, date_written, asker_name, asker_email, reported, helpful) VALUES ($1, $2, $3, $4, $5, $6, $7)'
  db.query(query, [parseInt(req.body.product_id), req.body.body, new Date().getTime(), req.body.asker_name, req.body.asker_email, false, 0])
    .then(data => {res.status(201).send({message: 'Created'})})
    .catch(e => {console.log('post /qa/questions error', e); res.status(500).send(e)})
})



module.exports = router;

// router.get('/qa/:question_id/answers')
// router.post('/qa/:question_id/answers')
// router.put('/qa/:question_id/helpful')
// router.put('/qa/:question_id/report')
// router.put('/qa/answers/:answer_id/helpful')
// router.put('/qa/answers/:answer_id/report')