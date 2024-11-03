const content = document.querySelector('#content');

// const description = document.querySelector('#description');
const saveButton = document.querySelector('.save');

let TODOS = [
  // {
  //   id: '1',
  //   priority: 'Fontos',
  //   date: '2024.10.01',
  //   description: 'Adj hozzá css-t',
  //   sign: 'F',
  // },
  // {
  //   id: '2',
  //   priority: 'Nem fontos',
  //   date: '2025.11.01',
  //   description: 'Nézd át a kosár oldalt',
  //   sign: 'N',
  // },
  // {
  //   id: '3',
  //   priority: 'Átlagos',
  //   date: '2026.18.09',
  //   description: 'Nem reszponzív az oldal',
  //   sign: 'A',
  // },
];
function uuidv4() {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
    const r = (Math.random() * 16) | 0,
      v = c == 'x' ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}

//****Új feladat hozzáadása ****
saveButton.addEventListener('click', (e) => {
  e.preventDefault();
  const description = document.querySelector('#description').value;
  const priority = document.querySelector('#priority').value;
  const dateInput = document.querySelector('#date').value;
  const formattedDate = new Date(dateInput).toLocaleString('hu-HU');

  let newItem = {
    id: uuidv4(),
    priority: priority,
    date: formattedDate,
    description: description,
    sign: priority[0].toUpperCase(),
  };

  TODOS = [...TODOS, newItem];
  tasksRender();
  document.querySelector('#description').value = '';
  document.querySelector('#priority').value = '';
  document.querySelector('#date').value = '';
});

//****Task-ok törlése****/
function deleteItem(id) {
  TODOS = TODOS.filter((item) => item.id !== id);
  tasksRender();
}

//***Task-ok megjelenítése****/
function tasksRender() {
  content.innerHTML =
    // *****Fejléc*****
    `<div class="container">
        <div class="row p-3">
          <div class="col-10">
            <h3>Teendők Listája</h3>
          </div>
          <div class="col-2 d-flex justify-content-end">
            <button class="btn btn-primary rounded-pill">+Új feladat</button>
          </div>
        </div>
      </div>`;

  //***Fejléc vége */
  //***Tartalom kezdete */
  const contentItems = TODOS.map((todo) => {
    return `<div class="container mt-3">
        <div class="row">
          <div class="col-10 d-flex align-itmes-center">
            <div>
              <h5 class="mx-2 px-3 py-2 bg-danger border rounded-pill">${todo.sign}</h5>
            </div>
            <div>
              <h5 class="m-0">${todo.description}</h5>
              <div class="d-flex gap-2">
                <p class="m-0">${todo.priority}</p>
                <p class="m-0">${todo.date}</p>
              </div>
            </div>
          </div>
          <div class="col-2 d-flex gap-3 justify-content-end">
            <button class="btn btn-danger border rounded-pill px-4 py-2" onclick="deleteItem('${todo.id}')">
              D
            </button>
            <button class="btn btn-primary border rounded-pill px-4 py-2">
              E
            </button>
          </div>`;
  });
  content.innerHTML += contentItems.join('');
  //***Tartalom vége */
}
tasksRender();
