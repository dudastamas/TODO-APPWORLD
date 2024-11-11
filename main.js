const content = document.querySelector("#content");

let TODOS = [];

function uuidv4() {
  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, function (c) {
    const r = (Math.random() * 16) | 0,
      v = c == "x" ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}

// A localStorage-ba mentés függvénye
// - localStorage.setItem(): Adatok mentése a localStorage-ba
// - Első paraméter ('todos'): Ez a kulcs, amin tárolni fogjuk az adatokat
// - JSON.stringify(): A JavaScript objektumot (TODOS tömb) átalakítja szöveggé,
//   mivel a localStorage csak szöveget tud tárolni
function saveToLocalStorage() {
  localStorage.setItem("todos", JSON.stringify(TODOS));
}

// Adatok betöltése a localStorage-ból
// - localStorage.getItem(): Kiolvasás a localStorage-ból a 'todos' kulcs alapján
// - JSON.parse(): A localStorage-ban tárolt szöveget visszaalakítja JavaScript objektummá
// - Ha nincs még adat a storage-ban (null), akkor üres tömböt használunk
function loadFromLocalStorage() {
  const saveTodos = localStorage.getItem("todos");
  TODOS = saveTodos ? JSON.parse(saveTodos) : [];
}

function createModal() {
  const modalHTML = `
    <div class="modal fade" id="todoModal" tabindex="-1" >
      <div class="modal-dialog">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title" id="modalLabel">Feladat</h5>
            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
          </div>
          <div class="modal-body">
            <form id="newTodoForm">
              <div class="mb-3">
                <label for="priority" class="form-label">Prioritás:</label>
                <select class="form-select" id="priority">
                  <option selected>Válaszd ki a prioritást</option>
                  <option value="Fontos">Fontos</option>
                  <option value="Nem fontos">Nem fontos</option>
                  <option value="Átlagos">Átlagos</option>
                </select>
              </div>
              <div class="mb-3">
                <label for="date" class="form-label">Dátum:</label>
                <input type="datetime-local" class="form-control" id="date">
              </div>
              <div class="mb-3">
                <label for="description" class="form-label">Leírás:</label>
                <textarea class="form-control" id="description"></textarea>
              </div>
              <button type="button" class="btn btn-primary" id="saveNewTodoButton">Mentés</button>
            </form>
            <form id="editTodoForm" style="display:none;">
              <div class="mb-3">
                <label for="editPriority" class="form-label">Prioritás:</label>
                <select class="form-select" id="editPriority">
                  <option selected>Válaszd ki a prioritást</option>
                  <option value="Fontos">Fontos</option>
                  <option value="Nem fontos">Nem fontos</option>
                  <option value="Átlagos">Átlagos</option>
                </select>
              </div>
              <div class="mb-3">
                <label for="editDate" class="form-label">Dátum:</label>
                <input type="datetime-local" class="form-control" id="editDate">
              </div>
              <div class="mb-3">
                <label for="editDescription" class="form-label">Leírás:</label>
                <textarea class="form-control" id="editDescription"></textarea>
              </div>
              <button type="button" class="btn btn-primary" id="saveEditTodoButton">Mentés</button>
            </form>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Mégse</button>
          </div>
        </div>
      </div>
    </div>`;

  content.insertAdjacentHTML("beforeend", modalHTML);
}

createModal();

const todoModal = new bootstrap.Modal(document.getElementById("todoModal"));

document.getElementById("saveNewTodoButton").onclick = addTodo;
document.getElementById("saveEditTodoButton").onclick = (e) => saveEdit(e);

function newTodo() {
  // Reset the new todo form if it exists
  const newTodoForm = document.getElementById("newTodoForm");
  if (newTodoForm) {
    newTodoForm.reset();
  }
  // Hide edit form and show new todo form
  const editTodoForm = document.getElementById("editTodoForm");
  if (editTodoForm) {
    editTodoForm.style.display = "none";
  }
  if (newTodoForm) {
    newTodoForm.style.display = "block";
  }
  todoModal.show();
}

function addTodo() {
  const description = document.getElementById("description").value;
  const priority = document.getElementById("priority").value;
  const date = new Date(document.getElementById("date").value).toLocaleString(
    "hu-HU"
  );
  const newItem = {
    id: uuidv4(),
    priority: priority,
    date: date,
    description: description,
    sign: priority[0],
  };
  TODOS = [...TODOS, newItem];
  saveToLocalStorage();
  tasksRender();
  todoModal.hide();
}

function editItem(id) {
  const itemToEdit = TODOS.find((todo) => todo.id === id);
  if (itemToEdit) {
    document.getElementById("editPriority").value = itemToEdit.priority;
    const date = new Date(itemToEdit.date);
    const offset = date.getTimezoneOffset();
    date.setMinutes(date.getMinutes() - offset);
    document.getElementById("editDate").value = date.toISOString().slice(0, 16);
    document.getElementById("editDescription").value = itemToEdit.description;

    const newTodoForm = document.getElementById("newTodoForm");
    const editTodoForm = document.getElementById("editTodoForm");

    if (newTodoForm) {
      newTodoForm.style.display = "none";
    }
    if (editTodoForm) {
      editTodoForm.style.display = "block";
    }

    todoModal.show();

    // Save edit
    document.getElementById("saveEditTodoButton").onclick = function (e) {
      e.preventDefault();
      const updatedItem = {
        id: itemToEdit.id,
        priority: document.getElementById("editPriority").value,
        date: new Date(
          document.getElementById("editDate").value
        ).toLocaleString("hu-HU"),
        description: document.getElementById("editDescription").value,
        sign: document.getElementById("editPriority").value[0],
      };
      TODOS = TODOS.map((item) => (item.id === id ? updatedItem : item));
      saveToLocalStorage();
      tasksRender();
      todoModal.hide();
    };
  }
}

// Task-ok törlése
function deleteItem(id) {
  TODOS = TODOS.filter((item) => item.id !== id);
  saveToLocalStorage();
  tasksRender();
}

function headRender() {
  content.innerHTML = `<div class="container">
    <div class="row p-3">
      <div class="col-10">
        <h3>Teendők Listája</h3>
      </div>
      <div class="col-2 d-flex justify-content-end">
        <button class="btn btn-primary rounded-pill" onclick="newTodo()">+Új feladat</button>
      </div>
    </div>
  </div>`;
}
loadFromLocalStorage();
headRender();
tasksRender();

// Task-ok megjelenítése
function tasksRender() {
  const contentItems = TODOS.map((todo) => {
    const colorClass =
      todo.sign === "F"
        ? "bg-danger"
        : todo.sign === "N"
        ? "bg-primary"
        : "bg-secondary";
    return `<div class="container mt-3">
        <div class="row">
          <div class="col-10 d-flex align-itmes-center">
            <div>
              <h5 class="mx-2 px-3 py-2 ${colorClass} border rounded-pill">${todo.sign}</h5>
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
            <button class="btn btn-danger border rounded-pill px-4 py-2" onclick="deleteItem('${todo.id}')">D</button>
            <button class="btn btn-primary border rounded-pill px-4 py-2" onclick="editItem('${todo.id}')">E</button>
          </div>
        </div>
      </div>`;
  });

  headRender();
  content.innerHTML += contentItems.join("");
}
