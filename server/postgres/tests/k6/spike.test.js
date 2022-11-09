import http from 'k6/http';
import { sleep, check } from 'k6';

const URL = `http://localhost:3000`;

export let options = {
  insecureskipTLSVerify: true,
  noConnectionReuse: false,
  stages: [ //1032 rps
    { duration: '10s', target: 100 }, // below normal load
    { duration: '1m', target: 100 },
    { duration: '10s', target: 2400 }, // spike to 2400 users
    { duration: '3m', target: 2400 }, // stay at 2400 for 3 minutes
    { duration: '10s', target: 100 }, // scale down, recovery stage.
    { duration: '3m', target: 100 },
    { duration: '10s', target: 0 }
  ]
};

export default () => {
  let random = Math.floor(Math.random() * 1000000) + 1;

  const requests = http.batch([
    ['GET', `${URL}/qa/questions?product_id=${random}`],
    ['GET', `${URL}/qa/questions/${random}/answers` ]
    ]);

  check(requests[0], {
    'get questions status was 200': (res) => res.status === 200,
  });

  check(requests[1], {
    'get answers status was 200': (res) => res.status === 200,
  });

  sleep(1); // see how many requests per second that database can handle
};