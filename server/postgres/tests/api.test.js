const axios = require('axios');
const dotenv = require('dotenv').config()

const URL = `http://localhost:${process.env.PORT}`;

describe('/qa/questions?product_id=1 returns an array of results', () => {
  it('returns data and not null', () => {
    axios.get(`${URL}/qa/questions?product_id=1`)
      .then(res => { expect(res.data.length).not.toBe(0) })
      .catch(err => { throw (err); });
  });

  it('a question object is comprised of the following keys', () => {
    axios.get(`${URL}/qa/questions?product_id=1`)
      .then(res => {
        let question = res.data.results[0]
        expect(question.question_id).toBeTruthy();
        expect(question.question_body).toBeTruthy();
        expect(question.question_date).toBeTruthy();
        expect(question.asker_name).toBeTruthy();
        expect(question.question_helpfulness).toBeTruthy();
        expect(question.reported).not.toBeTruthy();
        expect(question.answers).toBeTruthy();
      })
      .catch(err => { throw (err); });
  });

  it('when count is specified, return (count) number of results', () => {
    axios.get(`${URL}/qa/questions?product_id=1&count=1`)
      .then(res => { expect(res.data.results.length).toBe(1) })
      .catch(err => { throw (err); });
  });
});

describe('/qa/questions/1/answers returns an object containing the question answers', () => {
  it('results returns data and not null', () => {
    axios.get(`${URL}/qa/questions/1/answers`)
      .then(res => { expect(res.data.results).not.toBe(0) })
      .catch(err => { throw (err); });
  });

  it('an answer object is comprised of the following keys', () => {
    axios.get(`${URL}/qa/questions/1/answers`)
      .then(res => {
        let answer = res.data.results[0]
        expect(answer.answer_id).toBeTruthy();
        expect(answer.body).toBeTruthy();
        expect(answer.date).toBeTruthy();
        expect(answer.answerer_name).toBeTruthy();
        expect(answer.helpfulness).toBeTruthy();
        expect(answer.photos).toBeTruthy();
      })
      .catch(err => { throw (err); });
  });

  it('when count is specified, return (count) number of results', () => {
    axios.get(`${URL}/qa/questions/1/answers?count=1`)
      .then(res => { expect(res.data.results.length).toBe(1) })
      .catch(err => { throw (err); });
  });

});

