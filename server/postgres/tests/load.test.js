import http from 'k6/http';
import { sleep } from 'k6';

const URL = `http://localhost:4000`;

export let options = {
  insecureskipTLSVerify: true,
  noConnectionReuse: false,
  vus: 1,
  duration: '10s'
};

export default () => {
  http.get(`${URL}/qa/questions?product_id=1`);
  sleep(1); // see how many requests per second that database can handle
};