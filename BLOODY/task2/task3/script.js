const taskInput = document.getElementById("taskInput");
const addBtn = document.getElementById("addBtn");
const taskList = document.getElementById("taskList");
const totalTasks = document.getElementById("totalTasks");
const completedTasks = document.getElementById("completedTasks");

let tasks = JSON.parse(localStorage.getItem("tasks")) || [];

function saveTasks() {
    localStorage.setItem("tasks", JSON.stringify(tasks));
}

function updateCounter() {
    totalTasks.textContent = tasks.length;
    completedTasks.textContent = tasks.filter(task => task.completed).length;
}

function renderTasks() {
    taskList.innerHTML = "";

    tasks.forEach((task, index) => {

        const li = document.createElement("li");
        li.className = "task";

        li.innerHTML = `
            <div class="left">
                <input type="checkbox" ${task.completed ? "checked" : ""}>
                <span class="task-text ${task.completed ? "completed" : ""}">
                    ${task.text}
                </span>
            </div>

            <div class="actions">
                <button class="edit">
                    <i class="fa-solid fa-pen"></i>
                </button>

                <button class="delete">
                    <i class="fa-solid fa-trash"></i>
                </button>
            </div>
        `;

        const checkbox = li.querySelector("input");
        const editBtn = li.querySelector(".edit");
        const deleteBtn = li.querySelector(".delete");

        checkbox.addEventListener("change", () => {
            tasks[index].completed = checkbox.checked;
            saveTasks();
            renderTasks();
        });

        editBtn.addEventListener("click", () => {

            const updatedTask = prompt("Edit Task", task.text);

            if (updatedTask !== null && updatedTask.trim() !== "") {
                tasks[index].text = updatedTask.trim();
                saveTasks();
                renderTasks();
            }

        });

        deleteBtn.addEventListener("click", () => {

            if (confirm("Delete this task?")) {
                tasks.splice(index, 1);
                saveTasks();
                renderTasks();
            }

        });

        taskList.appendChild(li);

    });

    updateCounter();
}

function addTask() {

    const text = taskInput.value.trim();

    if (text === "") {
        alert("Please enter a task.");
        return;
    }

    tasks.push({
        text: text,
        completed: false
    });

    saveTasks();
    renderTasks();

    taskInput.value = "";
    taskInput.focus();

}

addBtn.addEventListener("click", addTask);

taskInput.addEventListener("keypress", function (e) {

    if (e.key === "Enter") {
        addTask();
    }

});

renderTasks();