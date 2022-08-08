document.addEventListener('DOMContentLoaded', function () {
   const submitButton = document.getElementById('input-buku');

   submitButton.addEventListener('submit', function (event) {
    event.preventDefault();
    addTodo();
   });

   function addTodo() {
    const judulBuku = document.getElementById('input-judul-buku').value;
    const penulisBuku = document.getElementById('input-penulis-buku').value;
    const tahunBuku = document.getElementById('input-tahun-buku').value;
    const checked = document.getElementById('selesai-dibaca-check').checked;

    const generateID = generateId();

    const toDoObject = generateToDoObject(generateID, judulBuku, penulisBuku, tahunBuku, checked);
    todos.push(toDoObject);

    document.dispatchEvent(new Event(RENDER_EVENT));
    saveData();
   }

   function generateId() {
    return +new Date();
   }

   function generateToDoObject(id, title, author, year, isComplated) {
    return{ id, title, author, year, isComplated };
   }

   const todos = [];
   const RENDER_EVENT = 'render-todo';

   document.addEventListener(RENDER_EVENT, function() {
    const uncomplatedTODOList = document.getElementById('todos');
    uncomplatedTODOList.innerHTML = '';

    for (const todoItem of todos) {
        const createElement = makeTodo(todoItem);
        uncomplatedTODOList.append(createElement);
    }
   });

   function makeTodo(toDoObject) {
    const judulBuku = document.createElement('h2');
    judulBuku.classList.add('namaBuku');
    judulBuku.innerHTML = toDoObject.title;

    const penulisBuku = document.createElement('p');
    penulisBuku.innerHTML = "Penulis: " + toDoObject.author;

    const tahunBuku = document.createElement('p');
    tahunBuku.innerHTML = "Tahun: " + toDoObject.year;

    const textcontainer = document.createElement('div');
    textcontainer.classList.add('inner');
    textcontainer.append(judulBuku, penulisBuku, tahunBuku);

    const container = document.createElement('div');
    container.classList.add('isinya','shadow');
    container.append(textcontainer);
    container.setAttribute('id', `todo-${toDoObject.id}`);

    if (toDoObject.isComplated) {
        const undoButton = document.createElement('button');
        undoButton.classList.add('undo-button');
        undoButton.innerText = "Belum selesai dibaca";

        undoButton.addEventListener('click', function () {
            undoTaskFromComplated(toDoObject.id);
        });

        const trashButton = document.createElement('button');
        trashButton.classList.add('trash-button');
        trashButton.innerText = 'Hapus';

        trashButton.addEventListener('click', function(){
            RemoveTaskFromComplated(toDoObject.id);
        });

        container.append(undoButton, trashButton);
    }else{
        const checkButton = document.createElement('button');
        checkButton.classList.add('check-button');
        checkButton.innerText = "Selesai dibaca";

        checkButton.addEventListener('click', function () {
            addTaskToCompleted(toDoObject.id);
        });
        container.append(checkButton);

        const trashButton = document.createElement('button');
        trashButton.classList.add('trash-button');
        trashButton.innerText = 'Hapus';

        trashButton.addEventListener('click', function(){
            RemoveTaskFromComplated(toDoObject.id);
        });
        container.append(trashButton);
    }
    return container

   }


   function addTaskToCompleted(todoId) {
    const todoTarget = findTodo(todoId);
    if (todoTarget == null) {
        return;
    }
    todoTarget.isComplated = true;
    document.dispatchEvent(new Event(RENDER_EVENT));
    saveData();
   }

   function findTodo(todoId) {
    for(const todoItem of todos){
        if(todoItem.id === todoId){
            return todoItem;
        }
    }
    return null;
   }

   
   document.addEventListener(RENDER_EVENT, function () {
    const uncomplatedTODOList = document.getElementById('todos');
    uncomplatedTODOList.innerHTML = '';
    
    const complateTodoList = document.getElementById('complated-todos');
    complateTodoList.innerHTML = '';

    for (let todoItem of todos) {
        const todoElement = makeTodo(todoItem);
        if (!todoItem.isComplated) {
            uncomplatedTODOList.append(todoElement);
        }else{
            complateTodoList.append(todoElement);
        }
    }
   });

   function RemoveTaskFromComplated(todoId) {
    const todoTarget = findTodoIndex(todoId);

    if(todoTarget === -1)return;

    todos.splice(todoTarget, 1);
    document.dispatchEvent(new Event(RENDER_EVENT));
    saveData();
   }

   function undoTaskFromComplated(todoId) {
    const todoTarget = findTodo(todoId);

    if (todoTarget == null)return;

    todoTarget.isComplated = false;
    document.dispatchEvent(new Event(RENDER_EVENT));
    saveData();
   }

   function findTodoIndex(todoId) {
    for (const index in todos) {
        if (todos[index].id === todoId) {
            return index;
            
        }
    }
    return -1;
   }

   const cariBuku = document.getElementById('cari-buku');

   cariBuku.addEventListener('submit', function (e) {
    e.preventDefault();
    searchBook();
   });

   function searchBook() {
    const inputJudul = document.getElementById('cari-judul').value.toLowerCase();
    const isinya = document.querySelectorAll('.isinya > .inner');

    for (const isi of isinya) {
        if(inputJudul === isi.childNodes[0].innerText.toLowerCase()){
            isi.parentElement.removeAttribute('style');
        }else if(inputJudul == ''){
            isi.parentElement.removeAttribute('style');
        }else if(inputJudul !== isi.childNodes[0].innerText.toLowerCase()){
            isi.parentElement.style.display = 'none';
        }
    }
   }



   function saveData() {
    if (isStorageExist()) {
        const parsed = JSON.stringify(todos);
        localStorage.setItem(STORAGE_KEY, parsed);
        document.dispatchEvent(new Event(SAVED_EVENT));
    }
   }

   const SAVED_EVENT = 'saved-todos';
   const STORAGE_KEY = 'TODOS_APPS';

   function isStorageExist() {
    if (typeof(Storage) === undefined) {
        alert("Browser Kamu Tidak Support");
        return false;
    }
    return true;
   }

   document.addEventListener(SAVED_EVENT, function () {
    alert('Berhasil diproses');
   });

   function loadDataFromStorage() {
    const serializedData = localStorage.getItem(STORAGE_KEY);
    let data = JSON.parse(serializedData);

    if (data !== null) {
        for (const todo of data) {
            todos.push(todo);
        }
    }

    document.dispatchEvent(new Event(RENDER_EVENT));
   }

   if (isStorageExist()) {
    loadDataFromStorage();
   }

});
