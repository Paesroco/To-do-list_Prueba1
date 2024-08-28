// ------- LÓGICA DE PROGRAMACIÓN ------------

const TODO_LIST_KEY = "todoList";
let todoList = [];

function addToList(item) {
  let todoListItem = {
    id: new Date().getTime(),
    title: item,
    isCheck: false,
  };

  todoList.push(todoListItem);
  const $newTask = createTask(todoListItem);
  $todoList.append($newTask);
}

function persistTodoList() {
  localStorage.setItem(TODO_LIST_KEY, JSON.stringify(todoList));
}

// Ver toda mi lista de tareas
function showTasks(list) {
  try {
    console.log("-".repeat(20));
    for (item of list) {
      let isCompleted = item.isCheck ? "Completed" : "Not completed";
      // console.log(item.id + ": " + item.title + " [" + isCompleted + " ]")
      console.log(`${item.id}: ${item.title} [${isCompleted}]`);
    }
    console.log("-".repeat(20));
  } catch (error) {
    console.log("ocurrió un error agregando la tarea");
  }
}

// Buscar tarea
function findTask(taskId) {
  let id = todoList.findIndex((item) => item.id === taskId);
  if (id >= 0) {
    return id;
  } else {
    console.error("No existe el elemento en la lista");
  }
}

// Eliminar de una lista
function deleteTask(taskId) {
  try {
    let id = findTask(taskId);
    if (id !== undefined) {
      todoList.splice(id, 1);
      console.log("Se eliminó correctamente la tarea con id: " + taskId);
    }
  } catch (error) {
    console.error(error);
  }
}

// Marcar como completada una tarea
function toggleTask(taskId) {
  try {
    let id = findTask(taskId);

    if (id !== undefined) {
      todoList[id].isCheck = !todoList[id].isCheck;
      console.log("Se actualizó el estado de la tarea con id: " + taskId);
    }
  } catch (error) {
    console.error(error);
  }
}

// Obtener la lista del storage
function getTodoList() {
  let storage = localStorage.getItem(TODO_LIST_KEY);
  if (storage) {
    todoList = JSON.parse(storage);
  }
}

// Por el metodo DOM.

const $todoList = document.querySelector("#todo-list"); // DOM
const $todoInput = document.querySelector("#todo-input"); // DOM
const $todoButton = document.querySelector("#todo-button"); // DOM

// // $todoList.innerHTML =
//  <li class="todo-list_item">
//           <div class="todo-list_checkbox-label">
//           <input type="checkbox" />
//             <p></p>
//           </div>
//           <button class="todo-list_delete-button" type="button">❌</button> */

function createTask(task) {
  // Fase de creación
  const $task = document.createElement("li");
  $task.className = "todo-list_item";
  $task.id = task.id;

  const $taskDeleteButton = document.createElement("button");
  $taskDeleteButton.className = "todo-list_delete-button";
  $taskDeleteButton.type = "button";
  $taskDeleteButton.innerText = "❌";

  const $taskInput = document.createElement("input");
  $taskInput.type = "checkbox";
  $taskInput.checked = task.isCheck;

  const $taskTitle = document.createElement("p");
  $taskTitle.innerText = task.title;

  if (task.isCheck) {
    $taskTitle.className = "todo-list--completed";
  }

  const $taskDivContainer = document.createElement("div");
  $taskDivContainer.className = "todo-list_checkbox-label";

  // Fase de anidamiento
  $taskDivContainer.append($taskInput, $taskTitle);
  $task.append($taskDivContainer, $taskDeleteButton);

  // Fase de eventos
  function handleDelete() {
    const response = confirm("¿Esta seguro que desea eliminar el elemento?");
    if (response) {
      deleteTask(task.id);
      $task.remove();
      persistTodoList();
    }
  }

  function handleCheck() {
    toggleTask(task.id);
    $taskTitle.classList.toggle("todo-list--completed");
    persistTodoList();
  }

  $taskDeleteButton.addEventListener("click", handleDelete);
  $taskInput.addEventListener("click", handleCheck);
  return $task;
}

function handleAddToList() {
  const value = $todoInput.value;
  if (value !== "") {
    addToList(value);
    persistTodoList();
    showTasks(todoList);
  } else {
    alert("Falta contenido");
  }
}

function render() {
  const $tasks = [];
  for (task of todoList) {
    $tasks.push(createTask(task));
  }

  $todoList.append(...$tasks);
  // console.log($tasks)
}

function handleInit() {
  getTodoList();
  showTasks(todoList);
  render();
}

$todoButton.addEventListener("click", handleAddToList);
document.addEventListener("DOMContentLoaded", handleInit);
