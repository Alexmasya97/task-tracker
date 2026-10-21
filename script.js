const modal = document.querySelector('#modal');
const list = document.querySelector('#list');
const backdrop = document.querySelector('#backdrop');
const progress = document.querySelector('#progress');
const progressValue = document.querySelector('#value');
const form = document.querySelector('#form');
const APP_TITLE = document.title;
const LS_KEY = 'MY_TASK';


list.addEventListener('click', openCard);
backdrop.addEventListener('click', closeModal);
modal.addEventListener('change', toggleTask);
form.addEventListener('submit', createTask)

const tasks = getState()

function openCard(event) {
  const data = event.target.dataset
  const task = tasks.find(t => t.type === data.type)
  if (!task) return
  openModal(task, task.title)
}
function openModal(html, title = APP_TITLE) {
  document.title = `${title} | ${APP_TITLE}`
  modal.classList.add('open');
  modal.innerHTML = toModal(html)
}
function closeModal() {
  document.title = APP_TITLE
  modal.classList.remove('open')
}
function toModal(task) {
  const checked = task.done ? 'checked' : ''
  return `
    <h2>${task.title}</h2>
    <p>${task.description}</p>
    <label class="checkbox">
            <input class="checkbox__input" type="checkbox" name="done" ${checked} data-type="${task.type}">
            <span class="checkbox__box" aria-hidden="true"></span>
            <span class="checkbox__text">Done</span>
    </label>
    `
}
function renderCards() {
  if (tasks.length === 0) {
    list.innerHTML = `<li class="empty">Add the first task</li>`
  } else {
    list.innerHTML = tasks.map(toTask).join('')
  }
}
function renderProgress() {
  const percent = computeProgressPercent()
  progress.style.width = percent + '%'
  value.innerHTML = percent + '%';
}
function computeProgressPercent() {
  if (tasks.length === 0) {
    return 0
  }
  let doneCount = 0
  for (let i = 0; i < tasks.length; i++) {
    if (tasks[i].done) doneCount++
  }
  return Math.round((100 * doneCount) / tasks.length)
}
function toTask(task) {
  const doneClass = task.done ? 'done' : ''
  return `
      <li class="item ${doneClass}" data-type="${task.type}">
        <span class="item__text" data-type="${task.type}">${task.title}</span>
      </li>
      `
}
function toggleTask(event) {
  const type = event.target.dataset.type
  const task = tasks.find(t => t.type === type)
  task.done = event.target.checked
  saveState()
  init()
}
function init() {
  renderCards()
  renderProgress()
}
function isInvalid(title, desc) {
  return !title.value || !desc.value
}
function createTask(event) {
  event.preventDefault()
  const { title, desc } = event.target

  if (isInvalid(title, desc)) {
    if (!title.value) title.classList.add('invalid')
    if (!desc.value) desc.classList.add('invalid')
    setTimeout(() => {
      title.classList.remove('invalid')
      desc.classList.remove('invalid')
    }, 2000)
    return
  }
  const newTask = {
    title: title.value,
    description: desc.value,
    done: false,
    type: title.value.toLowerCase()
  }
  tasks.push(newTask)
  title.value = ''
  desc.value = ''
  saveState()
  init()
}
function saveState() {
  localStorage.setItem(LS_KEY, JSON.stringify(tasks))
}
function getState() {
  const raw = localStorage.getItem(LS_KEY)
  return raw ? JSON.parse(raw) : []
}
init()
