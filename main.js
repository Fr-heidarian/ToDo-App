import { categories, tasks } from "./module.js";

const addModal = document.getElementById("add-task-modal");
const addForm = document.getElementById("add-form");
const editModal = document.getElementById("edit-task-modal");
const editForm = document.getElementById("edit-form");

let isSearchPanelOpen = false;
let showDeleteCheckboxes = false;

let filteredTasks = tasks;
let deleteTaskList = [];

const filteredTodaysTasks = () => {
  return tasks.filter(
    (task) => new Date(task.date).getDate() === new Date().getDate()
  );
};

const showTodaysTaskCount = () => {
  document.querySelector(".heading--bottom").textContent = `Today you have ${
    filteredTodaysTasks().length
  } tasks`;
};
const showTasksSummary = () => {
  const tasksDiv = document.getElementById("box--tasks");
  const tasks = filteredTodaysTasks();
  tasksDiv.innerHTML = "";
  tasksDiv.innerHTML += `<div class="task-card"><div class="badge">${
    tasks.filter((task) => task.done).length
  }</div><span>tasks done</span></div>`;

  tasksDiv.innerHTML += `<div class="task-card"><div class="badge">${
    tasks.filter((task) => !task.done).length
  }</div><span>tasks left</span></div>`;
};

const showTasksCategories = () => {
  document.getElementById("box--categories").innerHTML = "";
  categories.forEach((c) => {
    const taskCount = filteredTodaysTasks().filter(
      (t) => t.categoryId === c.id
    ).length;

    if (taskCount > 0) {
      const card = `<div class="category-card"><div class="category-color-badge" style=background-color:${
        c.color
      }></div><div class="badge">${c.name}</div><span>${taskCount} ${
        taskCount > 1 ? `tasks` : `task`
      }</span></div>`;
      document.getElementById("box--categories").innerHTML += card;
    }
  });
};

const showTasksInTimeline = () => {
  const timeline = document.querySelector(".box--timeline");

  const tasks = filteredTodaysTasks();

  tasks.sort((a, b) => a.startTime - b.startTime);
  timeline.innerHTML = "";
  const start = new Date(new Date().setHours(8, 0));
  const end = new Date(new Date().setHours(17, 0));

  while (start.getTime() <= end.getTime()) {
    timeline.innerHTML += `<div class="timeline--row"><div class="hour">${moment(
      start
    ).format("HH:mm")}</div><div class="line"></div>`;

    let stepInMinutes = 30;
    const task = tasks.find(
      (t) =>
        moment(t.startTime).format("HH:mm") ===
        moment(start.getTime()).format("HH:mm")
    );
    if (task) {
      timeline.innerHTML += `<div class="todo-card"><div class="badge">${task.title}</div><span>${task.description}</span></div>`;
      stepInMinutes = (task.endTime - task.startTime) / 60000;
    }

    start.setMinutes(start.getMinutes() + stepInMinutes);
  }
};

const updateUI = () => {
  showTodaysTaskCount();
  showTasksSummary();
  showTasksCategories();
  showTasksInTimeline();
  showTasksList();
};
const documentReady = () => {
  updateUI();
};
document.addEventListener("DOMContentLoaded", documentReady);

const createCategoryLabels = (containerId) => {
  const categoryContainer = document.getElementById(containerId);
  categoryContainer.innerHTML = "";

  categories.forEach((c) => {
    const categoryLabelDiv = document.createElement("div");
    categoryLabelDiv.classList.add("task-type-label");
    categoryLabelDiv.dataset.id = c.id;
    categoryLabelDiv.style.backgroundColor = c.color;
    categoryLabelDiv.textContent = c.name;

    categoryLabelDiv.addEventListener("click", (e) => {
      addForm["categoryId"].value = e.target.dataset.id;
    });
    categoryContainer.append(categoryLabelDiv);
  });
};
// Add Task
const saveTask = (e) => {
  e.preventDefault();

  const title = e.target["title"].value;
  const date = new Date(e.target["date"].value);
  const startTime = new Date(date);
  startTime.setHours(
    e.target["start-time"].value.toString().split(":")[0],
    e.target["start-time"].value.toString().split(":")[1]
  );
  const endTime = new Date(date);
  endTime.setHours(
    e.target["end-time"].value.toString().split(":")[0],
    e.target["end-time"].value.toString().split(":")[1]
  );
  const categoryId = Number(e.target["categoryId"].value);
  const description = e.target["description"].value;

  if (endTime.getTime() < startTime.getTime()) {
    alert("End time shoulb be greater than start Time");
    return;
  }
  const newTask = {
    id: Date.now().toString(),
    title,
    date,
    startTime,
    endTime,
    description,
    categoryId,
    done: false,
  };

  tasks.push(newTask);
  updateUI();
};
// EVENT LISTENERS
document.getElementById("btn--addTask").addEventListener("click", () => {
  addModal.showModal();
  createCategoryLabels("task-category-container");
});

// window.addEventListener("click", (e) => {
//   if (e.target == addModal) {
//     addModal.close();
//     localStorage.setItem("tasks", JSON.stringify(tasks));
//     updateUI();
//   }
// });

document.getElementById("btn-submit").addEventListener("click", (e) => {
  addModal.close();
  localStorage.setItem("tasks", JSON.stringify(tasks));
  updateUI();
});
// taskList--DeleteAllCheckBox--Edit MOdal
const showTasksList = () => {
  document.getElementById("box--taskList").innerHTML = "";

  filteredTasks.forEach((t) => {
    const category = categories.find((c) => c.id === t.categoryId);

    document.getElementById(
      "box--taskList"
    ).innerHTML += `<button id="btn--editTask"  data-id="${t.id}"><i class="fas fa-edit"></i></button><div class="taskList--item">${t.title}<div class="set--position--indicator"><div class="task-color-indicator" style="background-color: ${category.color}"></div><input type="checkbox" value=${t.id} class="delete--item--checkbox"/></div></div>`;
  });

  // "Delete All" checkbox
  document.getElementById("box--taskList").innerHTML += `
    <div class="taskList--item hide">
      <label >
        <input type="checkbox" id="delete-all-checkbox" />
        Delete All
      </label>
    </div>`;

  // Edit modal
  document.querySelectorAll("#btn--editTask").forEach((button) => {
    button.addEventListener("click", (e) => {
      const taskId = button.dataset.id;

      const task = tasks.find((t) => t.id === taskId);

      const category = categories.find((cat) => task.categoryId === cat.id);

      document.getElementById("edit-modal-title").value = task.title;

      document.getElementById("edit-modal-date").value = moment(
        task.date
      ).format("YYYY-MM-DD");

      Array.from(document.getElementById("edit-start-time").children).find(
        (op) => op.innerText === moment(task.startTime).format("HH:mm")
      ).selected = true;

      Array.from(document.getElementById("edit-end-time").children).find(
        (op) => op.innerText === moment(task.endTime).format("HH:mm")
      ).selected = true;

      document.getElementById("edit-modal-description").value =
        task.description;

      document.getElementById("done").checked = task.done;

      document.querySelector("#btn-edit").dataset.id = task.id;

      editModal.showModal();
      createEditCategoryLabels();

      // Highlight the category box of the task
      const categoryLabels = document.querySelectorAll(".task-type-label");

      let clicked = false;

      categoryLabels.forEach((label) => {
        console.log(category.id);

        label.style.textDecoration =
          category.id == label.dataset.id ? "underline" : "none";

        label.addEventListener("click", (e) => {
          categoryLabels.forEach(
            (label) => (label.style.textDecoration = "none")
          );
          e.target.style.textDecoration = "underline";
          clicked = true;
          document.getElementById("edit--categoryId").value =
            e.target.dataset.id;
        });
      });

      if (!clicked) {
        document.getElementById("edit--categoryId").value = category.id;
      }
    });
  });
};

document.getElementById("btn-edit").addEventListener("click", (e) => {
  editModal.close();
});

addForm.addEventListener("submit", saveTask);
document.getElementById("btn--searchTask").addEventListener("click", () => {
  isSearchPanelOpen = !isSearchPanelOpen;
  if (isSearchPanelOpen) {
    document.querySelector(".box--summary").style.display = "none";
    document.querySelector(".box--timeline").style.display = "none";
    document.getElementById("box--searchTask").style.display = "block";
    showTasksList();
  } else {
    document.querySelector(".box--summary").style.display = "block";
    document.querySelector(".box--timeline").style.display = "block";
    document.getElementById("box--searchTask").style.display = "none";
  }
});

// search input
document.getElementById("input--searchTask").addEventListener("input", (e) => {
  filteredTasks = tasks.filter((t) =>
    t.title.toLowerCase().trim().includes(e.target.value.toLowerCase())
  );
  showTasksList();
});

const deleteTasks = () => {
  deleteTaskList.forEach((del) => {
    const index = tasks.findIndex((t) => t.id === del);
    tasks.splice(index, 1);
  });
  localStorage.setItem("tasks", JSON.stringify(tasks));
  updateUI();
};

document.getElementById("btn--deleteTask").addEventListener("click", () => {
  showDeleteCheckboxes = !showDeleteCheckboxes;
  const checkboxes = document.querySelectorAll(".delete--item--checkbox");

  // "Delete All" checkbox
  const deleteAllCheckbox = document.getElementById("delete-all-checkbox");

  //  "Delete All" checkbox
  if (showDeleteCheckboxes) {
    const delAllElement = document.querySelector(".taskList--item.hide");
    delAllElement.style.display = "block";
    deleteAllCheckbox.addEventListener("change", (e) => {
      if (deleteAllCheckbox.checked) {
        checkboxes.forEach((ch) => {
          ch.checked = true;
          deleteTaskList.push(ch.value);
        });
      } else {
        checkboxes.forEach((ch) => {
          ch.checked = false;
          deleteTaskList = deleteTaskList.filter((d) => d != ch.value);
        });
      }
    });
  } else {
    deleteTasks();
  }

  if (showDeleteCheckboxes) {
    checkboxes.forEach((ch) => {
      ch.classList.add("show");
      ch.addEventListener("change", (e) => {
        if (ch.checked) {
          deleteTaskList.push(ch.value);
        } else {
          deleteTaskList = deleteTaskList.filter((d) => d != ch.value);
        }
      });
    });
  } else {
    checkboxes.forEach((ch) => ch.classList.remove("show"));
  }
});

// edit modal category
const createEditCategoryLabels = () => {
  createCategoryLabels("taskEdit-category-container");
};

// edit task
const updateTask = (taskIndex, updatedTask) => {
  tasks[taskIndex] = updatedTask;
  localStorage.setItem("tasks", JSON.stringify(tasks));
  updateUI();
};

const editTask = (e) => {
  e.preventDefault();

  const taskId = document.getElementById("btn-edit").dataset.id;

  const taskIndex = tasks.findIndex((t) => t.id === taskId);

  const title = document.getElementById("edit-modal-title").value;
  const date = new Date(document.getElementById("edit-modal-date").value);
  const startTime = new Date(date).setHours(
    document.getElementById("edit-start-time").value.split(":")[0],
    document.getElementById("edit-start-time").value.split(":")[1]
  );
  const endTime = new Date(date).setHours(
    document.getElementById("edit-end-time").value.split(":")[0],
    document.getElementById("edit-end-time").value.split(":")[1]
  );

  const categoryId = Number(document.getElementById("edit--categoryId").value);
  console.log(categoryId);
  const description = document.getElementById("edit-modal-description").value;

  const done = document.getElementById("done").checked;

  const editedTask = {
    id: taskId,
    title,
    date,
    startTime,
    endTime,
    categoryId,
    description,
    done,
  };

  updateTask(taskIndex, editedTask);
};

editForm.addEventListener("submit", editTask);
