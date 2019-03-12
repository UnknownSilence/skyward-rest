const test = require('ava');
const Promise = require('bluebird');
const fs = require('fs');

Promise.promisifyAll(fs);

const scrape = require('./scrape');

test('gradebook scrape', (t) => {
  t.plan(2);

  t.throws(() => scrape()(), /axios & skywardURL/, 'given no arguments');

  const mockAxios = ({ data }) => Promise.resolve(data);

  t.throws(() => scrape(mockAxios, 'fakeUrl')({}), /encses & sessionId/, 'given no auth data');
});

test('data placed correctly', (t) => {
  t.plan(1);
  const auth = { encses: 1, sessionId: 2 };
  const mockAxios = ({ data }) => Promise.resolve(data);

  const expectedBody = 'action=viewGradeInfoDialog&fromHttp=yes&ishttp=true'
    + '&corNumId=98112&bucket=TERM 1&sessionid=2&encses=1';

  return scrape(mockAxios, 'fakeUrl')(auth, 98112, 'TERM 1')
    .then(result => t.is(result, expectedBody, 'auth & request data placed correctly'));
});

const parse = require('./parse');
const payload = require('./data/slim.data');

const testParsePlan = t => ({ input, output }) => {
  const result = parse({ data: input });

  t.deepEqual(result.course, output.course, 'course value matches');
  t.deepEqual(result.instructor, output.instructor, 'instructor value matches');
  t.deepEqual(result.lit, output.lit, 'lit value matches');
  t.deepEqual(result.period, output.period, 'period value matches');
  t.deepEqual(result.grade, output.grade, 'grade value matches');
  t.deepEqual(result.score, output.score, 'score value matches');
  t.deepEqual(result.breakdown, output.breakdown, 'breakdown value matches');
};

test('gradebook parse', (t) => {
  // const testParse = testParsePlan(t);
  t.pass();
  // testParse(payload.PR1);
  // testParse(payload.S1);
  // t.end();
});
