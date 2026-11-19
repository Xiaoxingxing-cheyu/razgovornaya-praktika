import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { validateAnswer, normalizeAnswer } from '../js/validator.js';
import { attemptGuidance } from '../js/progress.js';
import { startSession, saveSession, getRecords, exportablePending } from '../js/storage.js';

const lesson=JSON.parse(await readFile(new URL('../config/lesson1.json',import.meta.url),'utf8'));

test('normalizes spaces and common Chinese punctuation',()=>{
  assert.equal(normalizeAnswer('  我，今天 吃了米饭！  '),'我今天吃了米饭');
});
test('accepts only explicitly configured answer variants',()=>{
  const answers=lesson.questions[0].correct_answers;
  assert.equal(validateAnswer(' 我今天吃了米饭。 ',answers),true);
  assert.equal(validateAnswer('我今天吃米饭',answers),true);
  assert.equal(validateAnswer('我今天吃面条',answers),false);
  assert.equal(validateAnswer('我今天吃了一碗米饭',answers),false);
  assert.equal(validateAnswer('',answers),false);
});
test('first error retries, then three hints, then a teacher follow-up',()=>{
  assert.deepEqual(attemptGuidance(1),{kind:'retry'});
  assert.deepEqual([2,3,4].map(attemptGuidance),[
    {kind:'hint',level:1},{kind:'hint',level:2},{kind:'hint',level:3}
  ]);
  assert.deepEqual(attemptGuidance(5),{kind:'pending',hintsUsed:3});
});
test('sample course has five bilingual questions and three bilingual hints each',()=>{
  assert.equal(lesson.lesson_id,'lesson1');
  assert.ok(lesson.questions.length>=5);
  for(const q of lesson.questions){
    assert.ok(q.question_ru&&q.question_zh);
    assert.ok(Array.isArray(q.correct_answers)&&q.correct_answers.length>0);
    assert.equal(q.hints.length,3);
    for(const hint of q.hints)assert.ok(hint.ru&&hint.zh);
    assert.ok(q.wrong_message.ru&&q.wrong_message.zh);
    assert.ok(q.success_message.ru&&q.success_message.zh);
  }
});
test('sessions and pending question export retain the requested fields',()=>{
  const values=new Map();
  globalThis.localStorage={getItem:key=>values.get(key)||null,setItem:(key,value)=>values.set(key,value)};
  const session=startSession(lesson);
  session.pending_questions.push({lesson_id:lesson.lesson_id,lesson_title_ru:lesson.lesson_title_ru,lesson_title_zh:lesson.lesson_title_zh,question_id:'q001',question_ru:'q ru',question_zh:'q zh',correct_answers:['答'],student_answers:['错'],wrong_count:5,hints_used:3,time:'2026-01-01T00:00:00.000Z'});
  saveSession(session);
  assert.equal(getRecords().length,1);
  assert.equal(exportablePending(session)[0].hints_used,3);
  assert.deepEqual(exportablePending(session)[0].student_answers,['错']);
  delete globalThis.localStorage;
});
