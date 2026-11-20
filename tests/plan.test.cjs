'use strict';
const { test } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');

function planContext() {
  const context = vm.createContext({
    BK: { ROM: { n: 'Римлянам', c: 16 } },
    PLAN: { demo: { d: 'ROM.8:1-17|ROM.9', t: 'Тестовый план' } },
    entries: [],
    dnum: s => Math.floor(Date.parse(s + 'T00:00:00Z') / 86400000),
    dstr: n => new Date(n * 86400000).toISOString().slice(0, 10),
    todayStr: () => '2026-11-20',
    plur: () => 'чтений'
  });
  const source = fs.readFileSync(path.join(__dirname, '../src/plan.js'), 'utf8');
  vm.runInContext(source, context, { filename: 'src/plan.js' });
  return context;
}
const entry = (date, refs) => ({ date, refs });

test('planDays parses verse segments and whole chapters', () => {
  const c = planContext();
  const days = c.planDays(c.PLAN.demo);
  assert.equal(days.length, 2);
  assert.equal(days[0][0].v, '1-17');
  assert.equal(days[1][0].v, '');
});

test('vOverlap detects disjoint and intersecting ranges', () => {
  const c = planContext();
  assert.equal(c.vOverlap('1-5', '6-17'), false);
  assert.equal(c.vOverlap('1-5', '5-17'), true);
});

test('whole-chapter reading satisfies a verse-based assignment', () => {
  const c = planContext();
  const state = c.planState({ plan: 'demo', start: '2026-11-01' }, [
    entry('2026-11-02', [{ b: 'ROM', c: 8, v: '' }])
  ], '2026-11-03');
  assert.equal(state.mk[0][0], true);
  assert.equal(state.mk[1][0], false);
});

test('reading before plan start is excluded', () => {
  const c = planContext();
  const state = c.planState({ plan: 'demo', start: '2026-11-01' }, [
    entry('2026-10-31', [{ b: 'ROM', c: 8, v: '' }])
  ], '2026-11-03');
  assert.equal(state.done, 0);
});

// Regression tests for full verse coverage will be added with the
// reading-coverage fix. The current implementation uses overlap only.
