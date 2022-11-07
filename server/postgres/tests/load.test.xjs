import http from 'k6/http';
import { sleep } from 'k6';

const URL = `http://localhost:4000`;

export let options = {
  insecureskipTLSVerify: true,
  noConnectionReuse: false,
  stages: [
    { duration: '2m', target: 100 }, //below normal load
    { duration: '5m', target: 100 },
    { duration: '2m', target: 200 }, // normal load
    { duration: '5m', target: 200 },
    { duration: '2m', target: 300 }, // around the breaking point
    { duration: '5m', target: 300 },
    { duration: '2m', target: 400 }, // beyond the breaking point
    { duration: '5m', target: 400 },
    { duration: '10m', target: 0 } // scale down.Recovery stage.
  ]
};

export default () => {
  http.batch([
    ['GET', `${URL}/qa/questions?product_id=1`],
    ['GET', `${URL}/qa/questions/1/answers` ]
    ]);

  sleep(1); // see how many requests per second that database can handle
};