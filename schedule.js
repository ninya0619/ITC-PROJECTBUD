const months = ["January","February","March","April","May",
"June","July","August","September","October","November","December"];

const now = new Date();
let year = now.getFullYear();
let month = now.getMonth();
let selected = new Date(now.getFullYear(), now.getMonth(), now.getDate());

let events = JSON.parse(localStorage.getItem("calendarEvents") || "{}");

// Who is logged in (leader sees all tasks, member sees only their own)
let me = null;
try { me = JSON.parse(localStorage.getItem("currentUser")); } catch (e) {}

// Tasks assigned by the leader (saved by tasks.html), grouped by deadline date
function getTasksByDate() {
  let all = [];
  try { all = JSON.parse(localStorage.getItem("tasks")) || []; } catch (e) {}

  const byDate = {};
  all.forEach(function (t) {
    if (!t.deadline) return;
    if (me && me.role !== "leader" && t.member !== me.email) return;

    // deadline is "YYYY-MM-DD" -> convert to the same key format as dateKey()
    const p = t.deadline.split("-");
    const key = Number(p[0]) + "-" + (Number(p[1]) - 1) + "-" + Number(p[2]);

    if (!byDate[key]) byDate[key] = [];
    byDate[key].push(t);
  });
  return byDate;
}

let tasksByDate = getTasksByDate();

const monthSelect = document.getElementById("month");
const yearSelect = document.getElementById("year");

months.forEach((m,i) => {
  monthSelect.add(new Option(m,i));
});

for(let y = year-10; y <= year+10; y++)
  yearSelect.add(new Option(y,y));

function render() {
  monthSelect.value = month;
  yearSelect.value = year;

  const first = new Date(year,month,1).getDay();
  const total = new Date(year,month+1,0).getDate();
  const cells = Math.ceil((first+total)/7)*7;

  document.getElementById("dates").innerHTML = "";
  tasksByDate = getTasksByDate();

  for(let i=0;i<cells;i++) {
    const day = new Date(year,month,1-first+i);
    const key = dateKey(day);
    const cell = document.createElement("div");

    cell.textContent = day.getDate();

    if(day.getMonth() !== month) cell.classList.add("other");
    if(key === dateKey(selected)) cell.classList.add("selected");
    if(key === dateKey(now)) cell.classList.add("today");
    if(tasksByDate[key]) cell.classList.add("has-task");

    cell.onclick = () => {
      selected = day;
      render();
      showEvents();
    };

    document.getElementById("dates").appendChild(cell);
  }

  showEvents();
}

function dateKey(d) {
  return `${d.getFullYear()}-${d.getMonth()}-${d.getDate()}`;
}

function changeMonth(n) {
  month += n;

  if (month < 0) {
    month = 11;
    year--;
  }

  if (month > 11) {
    month = 0;
    year++;
  }

  selected = new Date(year, month, 1);
  render();
}

function goToday() {
  year = now.getFullYear();
  month = now.getMonth();
  selected = new Date(now.getFullYear(),now.getMonth(),now.getDate());
  render();
}

function addEvent() {
  const input = document.getElementById("eventInput");
  const text = input.value.trim();
  if(!text) return;

  const key = dateKey(selected);
  if(!events[key]) events[key] = [];

  events[key].push(text);
  localStorage.setItem("calendarEvents",JSON.stringify(events));

  input.value = "";
  showEvents();
}

function deleteEvent(index) {
  const key = dateKey(selected);

  events[key].splice(index, 1);

  if (events[key].length === 0) {
    delete events[key];
  }

  localStorage.setItem("calendarEvents", JSON.stringify(events));
  showEvents();
}

function showEvents() {
  document.getElementById("selectedDate").textContent =
    selected.toLocaleDateString("en-US", {
      weekday:"long", month:"long", day:"numeric"
    });

  // Tasks assigned by the leader on this day
  const taskBox = document.getElementById("taskItems");
  taskBox.innerHTML = "";
  const dayTasks = tasksByDate[dateKey(selected)] || [];

  if (dayTasks.length) {
    const title = document.createElement("h4");
    title.textContent = "Assigned tasks";
    taskBox.appendChild(title);

    dayTasks.forEach(function (t) {
      const card = document.createElement("div");
      card.className = "sched-task" + (t.status === "Done" ? " done" : "");

      const name = document.createElement("strong");
      name.textContent = t.name;

      const info = document.createElement("p");
      info.textContent = "Activity: " + (t.activity || "None");

      const who = document.createElement("p");
      who.textContent = "Assigned to: " + t.member;

      const status = document.createElement("span");
      status.className = "sched-status";
      status.textContent = t.status || "In Progress";

      card.append(name, info, who, status);
      taskBox.appendChild(card);
    });
  }

  const list = document.getElementById("eventList");
  list.innerHTML = "";

  const items = events[dateKey(selected)] || [];

  document.getElementById("empty").style.display =
    (items.length || dayTasks.length) ? "none" : "block";

  items.forEach((item,i) => {
    const li = document.createElement("li");
    const span = document.createElement("span");
    const btn = document.createElement("button");

    span.textContent = item;
    btn.textContent = "✕";
    btn.className = "delete";
    btn.onclick = () => deleteEvent(i);

    li.append(span,btn);
    list.appendChild(li);
  });
}

monthSelect.onchange = () => {
  month = Number(monthSelect.value);
  selected = new Date(year, month, 1);
  render();
};

yearSelect.onchange = () => {
  year = Number(yearSelect.value);
  selected = new Date(year, month, 1);
  render();
};

document.getElementById("eventInput").addEventListener("keydown",e => {
  if(e.key === "Enter") addEvent();
});

const logoutBtn = document.getElementById("logoutBtn");
        const logoutOverlay = document.getElementById("logoutOverlay");
        const logoutYes = document.getElementById("logoutYes");
        const logoutNo = document.getElementById("logoutNo");

        // Open the confirmation
        logoutBtn.addEventListener("click", function (event) {
            event.preventDefault();
            logoutOverlay.classList.add("show");
            logoutNo.focus();
        });

        // No: close the confirmation and stay
        function closeLogout() {
            logoutOverlay.classList.remove("show");
            logoutBtn.focus();
        }

        logoutNo.addEventListener("click", closeLogout);

        // Clicking outside the box or pressing Esc also closes it
        logoutOverlay.addEventListener("click", function (event) {
            if (event.target === logoutOverlay) {
                closeLogout();
            }
        });

        document.addEventListener("keydown", function (event) {
            if (event.key === "Escape" && logoutOverlay.classList.contains("show")) {
                closeLogout();
            }
        });

        // Yes: clear the logged in user and go to the login page
        logoutYes.addEventListener("click", function () {
            localStorage.removeItem("currentUser");
            window.location.href = "login.html";
        });

render();