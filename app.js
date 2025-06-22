let state = { profile: {}, exp:0, level:1, days:{}, exercises:[] };

function load() {
  Object.assign(state, JSON.parse(localStorage.getItem('state')||'{}'));
}
function save() {
  localStorage.setItem('state', JSON.stringify(state));
}
function calcLevel() {
  state.level = Math.floor(Math.sqrt(state.exp/10))+1;
}
function renderProfile() {
  document.getElementById('level').textContent = state.level;
  document.getElementById('exp').textContent = state.exp;
}
function loadExercises() {
  fetch('exercises.json').then(r=>r.json()).then(data=>{
    state.exercises = data;
    renderExercises();
  });
}
function renderExercises(filter='') {
  let html = '';
  state.exercises.filter(e=>e.id.includes(filter)).forEach(e=>{
    html += `<div>${e.id} – ${e.name} [${e.type}] <button onclick="addExp(${e.difficulty})">+EXP</button></div>`;
  });
  document.getElementById('exerciseList').innerHTML = html;
}
function addExp(d) {
  state.exp+=d;
  calcLevel();
  renderProfile();
  save();
}
function setupSearch() {
  document.getElementById('exerciseSearch').oninput = e=>renderExercises(e.target.value);
}
function setupProfileForm() {
  document.getElementById('profileForm').onsubmit = e=>{
    e.preventDefault();
    state.profile = {
      gender: e.target.gender.value,
      height: +e.target.height.value,
      weight: +e.target.weight.value,
      goal: e.target.goal.value
    };
    save(); alert('Профіль збережено!');
  };
}
function initCalendar() {
  let grid = document.getElementById('calendarGrid');
  for(let i=1;i<=30;i++){
    let d = i;
    let div = document.createElement('div');
    div.className='dayCell';
    div.textContent=d;
    div.onclick =()=>alert(`Натиснуто день ${d}`);
    grid.append(div);
  }
}
window.onload = ()=>{
  load(); calcLevel(); renderProfile();
  loadExercises(); setupSearch(); setupProfileForm(); initCalendar();
};