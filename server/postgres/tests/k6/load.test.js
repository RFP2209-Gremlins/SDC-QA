import http from 'k6/http';
import { sleep, check } from 'k6';

const URL = `http://localhost:4000`;

export let options = {
  insecureskipTLSVerify: true,
  noConnectionReuse: false,
  stages: [ //221 rps
    { duration: '2m', target: 100 }, // below normal load
    { duration: '5m', target: 100 },
    { duration: '2m', target: 200 }, // normal load
    { duration: '5m', target: 200 },
    { duration: '2m', target: 300 }, // around the breaking point
    { duration: '5m', target: 300 },
    { duration: '2m', target: 400 }, // beyond the breaking point
    { duration: '5m', target: 400 },
    { duration: '10m', target: 0 } // scale down, recovery stage.
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