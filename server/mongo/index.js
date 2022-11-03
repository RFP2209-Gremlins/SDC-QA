import mongoose from 'mongoose'

mongoose.connect('mongodb://localhost/qna');

const answersSchema = new mongoose.Schema({
  id: Number,
  question_id: Number,
  body: String,
  date_written: Date,
  answerer_name: String,
  answerer_email: String,
  reported: Boolean,
  helpful: Number,
  photos: [{ id: Number, url: String }]
})

const questionsSchema = new mongoose.Schema({
  product_id: Number,
  question_id: Number,
  body: String,
  date_written: Date,
  asker_name: String,
  asker_email: String,
  reported: Boolean,
  helpful: Number,
  answers: [answerSchema]
});

const Answers = mongoose.model('Answers', answersSchema);
const Questions = mongoose.model('Questions', questionSchema);

module.exports.Answers = Answers;
module.exports.Questions = Questions;