function showPage(pageid){
    document.querySelectorAll(".page").forEach(p=> p.classList.remove("active"))
    document.getElementById(pageid).classList.add("active")
}

function register() {
  const username = document.getElementById("username").value.trim();
  const password = document.getElementById("password").value.trim();
  const msg = document.getElementById("authMsg");

  if (!username || !password) {
    msg.innerText = "⚠️ Please enter both username & password.";
    return;
  }

  if (localStorage.getItem(username)) {
    msg.innerText = "❌ User already exists. Try logging in.";
  } else {
    localStorage.setItem(username, password); // store user
    msg.innerText = "✅ Registered successfully! Now login.";
  }
}


function login() {
  const username = document.getElementById("username").value.trim();
  const password = document.getElementById("password").value.trim();
  const msg = document.getElementById("authMsg");

  if (!username || !password) {
    msg.innerText = "⚠️ Please enter both username & password.";
    return;
  }

  const storedPassword = localStorage.getItem(username);

  if (storedPassword && storedPassword === password) {
    // Save login state
    localStorage.setItem("loggedIn", "true");
    localStorage.setItem("currentUser", username);

    // Go to dashboard
    document.getElementById("userDisplay").innerText = username;
    showPage("dashboard");
  } else {
    msg.innerText = "❌ Invalid credentials!";
  }
}

window.onload = function () {
  if (localStorage.getItem("loggedIn") === "true") {
    const user = localStorage.getItem("currentUser");
    document.getElementById("userDisplay").innerText = user;
    showPage("dashboard");
  } else {
    showPage("loginpage");
  }
};

// Logout
function logout() {
  localStorage.removeItem("loggedIn");
  localStorage.removeItem("currentUser");
  showPage("loginpage");
}

// ------------------------------------------------------------------------------------------------------------------------//

// Add Task
function addTask() {
  const title = document.getElementById("taskTitle").value.trim();
  const desc = document.getElementById("taskDesc").value.trim();
  const date = document.getElementById("taskDate").value;
  const user = localStorage.getItem("currentUser");

  if (!title) {
    alert("Task title is required!");
    return;
  }

  // Get existing tasks for this user
  let tasks = JSON.parse(localStorage.getItem(user + "_tasks")) || [];

  // Create a new task object
  const newTask = {
    id: Date.now(),  // unique id
    title,
    desc,
    date,
    completed: false
  };

  tasks.push(newTask);

  // Save back to localStorage
  localStorage.setItem(user + "_tasks", JSON.stringify(tasks));

  // Clear input fields
  document.getElementById("taskTitle").value = "";
  document.getElementById("taskDesc").value = "";
  document.getElementById("taskDate").value = "";

  // Refresh task list
  renderTasks();
}

// Render Tasks
function renderTasks() {
  const user = localStorage.getItem("currentUser");
  const taskListDiv = document.getElementById("taskList");

  let tasks = JSON.parse(localStorage.getItem(user + "_tasks")) || [];

  // Clear old UI
  taskListDiv.innerHTML = "";

  // Build task elements
  tasks.forEach(task => {
    const taskDiv = document.createElement("div");
    taskDiv.className = "task " + (task.completed ? "completed" : "");

    taskDiv.innerHTML = `
      <strong>${task.title}</strong> - ${task.desc} 
      <br>📅 ${task.date || "No due date"} 
      <br>
      <button onclick="toggleComplete(${task.id})">
        ${task.completed ? "Undo" : "Complete"}
      </button>
      <button onclick="deleteTask(${task.id})">Delete</button>
    `;

    taskListDiv.appendChild(taskDiv);
  });
}

// Toggle Complete
function toggleComplete(id) {
  const user = localStorage.getItem("currentUser");
  let tasks = JSON.parse(localStorage.getItem(user + "_tasks")) || [];

  tasks = tasks.map(task => {
    if (task.id === id) {
      task.completed = !task.completed;
    }
    return task;
  });

  localStorage.setItem(user + "_tasks", JSON.stringify(tasks));
  renderTasks();
}

// Delete Task
function deleteTask(id) {
  const user = localStorage.getItem("currentUser");
  let tasks = JSON.parse(localStorage.getItem(user + "_tasks")) || [];

  tasks = tasks.filter(task => task.id !== id);

  localStorage.setItem(user + "_tasks", JSON.stringify(tasks));
  renderTasks();
}

// Render tasks when dashboard opens
window.onload = function () {
  if (localStorage.getItem("loggedIn") === "true") {
    const user = localStorage.getItem("currentUser");
    document.getElementById("userDisplay").innerText = user;
    showPage("dashboard");
    renderTasks(); // load tasks
  } else {
    showPage("loginpage");
  }
};
