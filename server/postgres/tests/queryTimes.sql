\timing

-- get /qa/questions
SELECT json_build_object(
  'product_id', 1,
  'results', (SELECT json_agg(json_build_object(
      'question_id', id,
      'question_body', body,
      'question_date', date_written,
      'asker_name', asker_name,
      'question_helpfulness', helpful,
      'reported', false,
      'answers', (SELECT json_object_agg(
        id, json_build_object(
        'id', id,
        'body', body,
        'date', date_written,
        'answerer_name', answerer_name,
        'helpfulness', helpful,
        'photos', (SELECT COALESCE(json_agg(photos.url), '[]'::json) FROM photos WHERE answer_id = answers.id)
      )) FROM answers WHERE question_id = questions.id AND reported = false)
    )) FROM questions WHERE product_id = 1 AND reported = false)
);

-- get /qa/questions/:question_id/answers'
SELECT json_build_object(
  'question', 1,
  'page', 0,
  'count', 5,
  'results', (SELECT json_agg(json_build_object(
    'answer_id', id,
    'body', body,
    'date', date_written,
    'answerer_name', answerer_name,
    'helpfulness', helpful,
    'photos', (SELECT COALESCE (json_agg(json_build_object(
      'id', id,
      'url', url
    )), '[]'::json) FROM photos WHERE answer_id = answers.id)
    )) FROM answers WHERE question_id = 1 AND reported = false)
);


\timing