
const router = require('express').Router();
const db = require('./postgres');

router.get('/', (req, res) => {
  res.status(200).json('hello!')
})

router.get('/qa/questions', (req, res) => {
  const page = parseInt(req.query.page) || 1
  const count = parseInt(req.query.count) || 5
  const offset = (page-1) * count

  const query =`
    SELECT json_build_object(
      'product_id', ${req.query.product_id},
      'results', (
        WITH ques AS ( SELECT * FROM questions WHERE product_id = $1 AND reported = false LIMIT $2 OFFSET $3 )
        SELECT json_agg(json_build_object(
          'question_id', id,
          'question_body', body,
          'question_date', date_written,
          'asker_name', asker_name,
          'question_helpfulness', helpful,
          'reported', ${false},
          'answers', (SELECT COALESCE (json_object_agg(
            id, json_build_object(
            'id', id,
            'body', body,
            'date', date_written,
            'answerer_name', answerer_name,
            'helpfulness', helpful,
            'photos', (SELECT COALESCE(json_agg(photos.url), '[]'::json) FROM photos WHERE answer_id = answers.id)
          )), '{}'::json) FROM answers WHERE question_id = ques.id AND reported = false)
        )) FROM ques)
    )`

  db.query(query, [req.query.product_id, count, offset])
    .then(data => {res.status(200).send(data.rows[0].json_build_object)})
    .catch(e => {console.log('get /qa/questions error', e); res.status(500).send(e)})
})

router.post('/qa/questions', (req, res) => {
  console.log(req.body)
  const query = 'INSERT INTO questions (product_id, body, date_written, asker_name, asker_email, reported, helpful) VALUES ($1, $2, $3, $4, $5, $6, $7)'
  db.query(query, [parseInt(req.body.product_id), req.body.body, new Date().toISOString(), req.body.name, req.body.email, false, 0])
    .then(data => {res.status(201).send('CREATED')})
    .catch(e => {console.log('post /qa/questions error', e); res.status(500).send(e)})
})

router.get('/qa/questions/:question_id/answers', (req, res) => {
  const page = parseInt(req.query.page) || 1
  const count = parseInt(req.query.count) || 5
  const offset = (page-1) * count

  const query = `
    WITH ans AS ( SELECT * FROM answers WHERE question_id = $1 AND reported = false LIMIT $2 OFFSET $3 )
    SELECT json_build_object(
      'question', ${req.params.question_id},
      'page', ${page},
      'count', ${count},
      'results', (SELECT COALESCE (json_agg(json_build_object(
        'answer_id', id,
        'body', body,
        'date', date_written,
        'answerer_name', answerer_name,
        'helpfulness', helpful,
        'photos', (SELECT COALESCE (json_agg(json_build_object(
          'id', id,
          'url', url
        )), '[]'::json) FROM photos WHERE answer_id = ans.id)
        )), '{}'::json) FROM ans)
  )`

  db.query(query, [req.params.question_id, count, offset])
  .then(data => {res.status(200).send(data.rows[0].json_build_object)})
  .catch(e => {console.log('get /qa/:question_id/answers error', e); res.status(500).send(e)})
})

router.post('/qa/questions/:question_id/answers', (req, res) => {
  let query = ''
  let parameters = []

  if (req.body.photos.length !== 2){
    query = `
      WITH ins1 AS (INSERT INTO answers (question_id, body, date_written, answerer_name, answerer_email, reported, helpful) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING id)
      INSERT INTO photos (answer_id,url) VALUES ((SELECT id FROM ins1), unnest(cast($8 as text[])))
    `
    parameters = [req.params.question_id, req.body.body, new Date().toISOString(), req.body.name, req.body.email, false, 0, req.body.photos]
  } else {
    query = 'INSERT INTO answers (question_id, body, date_written, answerer_name, answerer_email, reported, helpful) VALUES ($1, $2, $3, $4, $5, $6, $7)'
    parameters = [req.params.question_id, req.body.body, new Date().toISOString(), req.body.name, req.body.email, false, 0]
  }

  db.query(query,parameters)
    .then(data => {res.status(201).send('CREATED')})
    .catch(e => {console.log('post /qa/:question_id/answers error', e); res.status(500).send(e)})
})

router.put('/qa/questions/:question_id/helpful', (req, res) => {
  const query = `
    UPDATE questions
    SET helpful = helpful+1
    WHERE id = $1
  `

  db.query(query, [req.params.question_id])
  .then(data => {res.status(204).send()})
  .catch(e => {console.log('put /qa/questions/:question_id/helpful error', e); res.status(500).send(e)})
})

router.put('/qa/questions/:question_id/report', (req, res) => {
  const query = `
    UPDATE questions
    SET reported = true
    WHERE id = $1
  `

  db.query(query, [req.params.question_id])
  .then(data => {res.status(204).send()})
  .catch(e => {console.log('put /qa/questions/:question_id/report error', e); res.status(500).send(e)})
})

router.put('/qa/answers/:answer_id/helpful', (req, res) => {
  const query = `
    UPDATE answers
    SET helpful = helpful+1
    WHERE id = $1
  `

  db.query(query, [req.params.answer_id])
  .then(data => {res.status(204).send()})
  .catch(e => {console.log('put /qa/answers/:answer_id/helpful error', e); res.status(500).send(e)})
})

router.put('/qa/answers/:answer_id/report', (req, res) => {
  const query = `
    UPDATE answers
    SET reported = true
    WHERE id = $1
  `

  db.query(query, [req.params.answer_id])
  .then(data => {res.status(204).send()})
  .catch(e => {console.log('put /qa/answers/:answer_id/report error', e); res.status(500).send(e)})
})

module.exports = router;