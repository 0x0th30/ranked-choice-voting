import { group, check } from 'k6';
import http from 'k6/http';

const BASE_URL = 'http://localhost:3000';

export const options = {
  maxRedirects: 4,
  vus: 50,
  duration: '30s',
};

function makeRequest(name, method, address, data, headers) {
  const response = http.request(method, `${BASE_URL}${address}`, data, { headers });
  check(response, { [`Successful ${name} request`]: (r) => r.status === 200 });
}

// eslint-disable-next-line func-names
export default function () {
  group('user actions', () => {
    makeRequest(
      'auth',
      'POST',
      '/api/v1/users/auth',
      '{"email": "theodorotheodore@gmail.com", "password": "rockyou.txt"}',
      {},
    );

    makeRequest(
      'register',
      'POST',
      '/api/v1/users/register',
      '{"name": "theo", "email": "theodorotheodore@gmail.combr",'
      + ' "password": "rockyou.txt"}',
      {},
    );

    makeRequest(
      'send token',
      'GET',
      '/api/v1/users/theodorotheodore@gmail.com/account-activation/send-token',
      null,
      {},
    );

    makeRequest(
      'activate account',
      'GET',
      '/api/v1/users/<user>/<token>/activate-account',
      null,
      {},
    );

    makeRequest(
      'password recover',
      'POST',
      '/api/v1/users/<token>/password-recover',
      '{"email": "theo.silva@gmail.com", "password": "vaxxco"}',
      {},
    );
  });

  group('voting actions', () => {
    makeRequest(
      'vote',
      'POST',
      '/api/v1/votings/f07f4615-019a-40d1-8133-362799bc4b23/vote',
      '{"sequence": ["baz", "bar"]}',
      { 'auth-token': 'YOUR_AUTH_TOKEN' },
    );

    makeRequest(
      'close voting',
      'POST',
      '/api/v1/votings/5f1ca892-ac15-4fc1-92cd-2e303f547226/close',
      '{"sequence": ["bar", "baz"]}',
      { 'auth-token': 'YOUR_AUTH_TOKEN' },
    );

    makeRequest(
      'create voting',
      'POST',
      '/api/v1/votings/create',
      '{"name": "foo3", "options": ["baz", "bar"]}',
      { 'auth-token': 'YOUR_AUTH_TOKEN' },
    );

    makeRequest(
      'results',
      'GET',
      '/api/v1/votings/f07f4615-019a-40d1-8133-362799bc4b23/results',
      null,
      { 'auth-token': 'YOUR_AUTH_TOKEN' },
    );
  });
}
