const KEY='clr_learning_records_v1';
const safeRead=()=>{try{return JSON.parse(localStorage.getItem(KEY)||'[]')}catch{return []}};
export function startSession(lesson){const s={session_id:`${lesson.lesson_id}-${Date.now()}`,lesson_id:lesson.lesson_id,lesson_title_ru:lesson.lesson_title_ru,lesson_title_zh:lesson.lesson_title_zh,started_at:new Date().toISOString(),ended_at:null,completed_questions:[],correct_questions:[],pending_questions:[],answers:[]};return s}
export function saveSession(session){const all=safeRead();const i=all.findIndex(x=>x.session_id===session.session_id);if(i<0)all.push(session);else all[i]=session;try{localStorage.setItem(KEY,JSON.stringify(all))}catch{} }
export function getRecords(){return safeRead()}
export function exportablePending(session){return session.pending_questions.map(q=>({...q,lesson_title_ru:session.lesson_title_ru,lesson_title_zh:session.lesson_title_zh}))}
