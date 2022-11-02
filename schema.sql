CREATE DATABASE qna;

\c qna;

CREATE TABLE IF NOT EXISTS questions(
  id serial NOT NULL PRIMARY KEY,
  product_id integer NOT NULL,
  body text NOT NULL,
  date_written bigint,
  asker_name text NOT NULL,
  asker_email text NOT NULL,
  reported boolean,
  helpful integer
);

CREATE TABLE IF NOT EXISTS answers(
  id serial NOT NULL PRIMARY KEY,
  question_id integer REFERENCES questions(id),
  body text NOT NULL,
  date_written bigint,
  answerer_name text NOT NULL,
  answerer_email text NOT NULL,
  reported boolean,
  helpful integer
);

CREATE TABLE IF NOT EXISTS photos(
  id serial NOT NULL PRIMARY KEY,
  answer_id integer REFERENCES answers(id),
  url text
);

ALTER TABLE questions ADD INDEX product_index (product_id);
ALTER TABLE answers ADD INDEX question_index (question_id);
ALTER TABLE photos ADD INDEX answer_index (answer_id);

\COPY questions FROM 'data/questions.csv' DELIMITER ',' csv header;
\COPY answers FROM 'data/answers.csv' DELIMITER ',' csv header;
\COPY photos FROM 'data/answers_photos.csv' DELIMITER ',' csv header;