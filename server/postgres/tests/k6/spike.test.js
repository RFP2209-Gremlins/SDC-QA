import http from 'k6/http';
import { sleep } from 'k6';

const URL = `http://localhost:4000`;

export let options = {
  insecureskipTLSVerify: true,
  noConnectionReuse: false,
  stages: [
    { duration: '10s', target: 100 } // below normal load
    { duration: '1m', target: 100 }
    { duration: '10s', target: 1400 } // spike to 1400 users
    { duration: '3m', target: 1400 } // stay at 1400 for 3 minutes
    { duration: '10s', target: 100 } // scale down, recovery stage.
    { duration: '3m', target: 100 }
    { duration: '10s', target: 0 }
  ]
};

export default () => {
  http.batch([
    ['GET', `${URL}/qa/questions?product_id=1`],
    ['GET', `${URL}/qa/questions/1/answers` ]
    ]);

  sleep(1); // see how many requests per second that database can handle
};