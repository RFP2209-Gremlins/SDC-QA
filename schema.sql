DROP DATABASE IF EXISTS qna;
CREATE DATABASE qna;

\c qna;

CREATE TABLE IF NOT EXISTS questions(
  id integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  product_id integer NOT NULL,
  body text NOT NULL,
  date_written bigint,
  asker_name text NOT NULL,
  asker_email text NOT NULL,
  reported boolean,
  helpful integer
);

CREATE TABLE IF NOT EXISTS answers(
  id integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  question_id integer REFERENCES questions(id),
  body text NOT NULL,
  date_written bigint,
  answerer_name text NOT NULL,
  answerer_email text NOT NULL,
  reported boolean,
  helpful integer
);

CREATE TABLE IF NOT EXISTS photos(
  id integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  answer_id integer REFERENCES answers(id),
  url text
);

CREATE INDEX product_index ON questions(product_id);
CREATE INDEX question_index ON answers(question_id);
CREATE INDEX answer_index ON photos(answer_id);

\COPY questions FROM 'data/questions.csv' DELIMITER ',' csv header;
\COPY answers FROM 'data/answers.csv' DELIMITER ',' csv header;
\COPY photos FROM 'data/answers_photos.csv' DELIMITER ',' csv header;

