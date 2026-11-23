let activities = JSON.parse(localStorage.getItem("activities")) || [];

const activityList = document.getElementById("activityList");
const activityForm = document.getElementById("activityForm");

function saveActivities() {
  localStorage.setItem("activities", JSON.stringify(activities));
}

function showActivities() {
  activityList.innerHTML = "";

  if (activities.length === 0) {
    activityList.textContent = "No activities yet.";
    return;
  }

  activities.forEach(function (a, index) {
    let deleteHtml = "";
    if (currentUser.role === "leader") {
      deleteHtml = `<button class="delete-btn" onclick="deleteActivity(${index})">Delete</button>`;
    }

    const card = document.createElement("div");
    card.className = "activity-item";
    card.innerHTML = `
      <h3>${a.name}</h3>
      <p>${a.description}</p>
      <p>Deadline: ${a.deadline}</p>
      ${deleteHtml}
    `;
    activityList.appendChild(card);
  });
}

function deleteActivity(index) {
  if (currentUser.role !== "leader") return;

  const name = activities[index].name;
  const ok = confirm('Delete "' + name + '"? Its tasks will stay, but they will no longer be linked to it.');
  if (!ok) return;

  const tasks = JSON.parse(localStorage.getItem("tasks")) || [];
  tasks.forEach(function (t) {
    if (t.activity === name) {
      t.activity = "";
    }
  });
  localStorage.setItem("tasks", JSON.stringify(tasks));

  activities.splice(index, 1);
  saveActivities();
  showActivities();
}

activityForm.addEventListener("submit", function (event) {
  event.preventDefault();
  if (currentUser.role !== "leader") return;

  activities.push({
    name: document.getElementById("activityName").value,
    description: document.getElementById("activityDesc").value,
    deadline: document.getElementById("activityDeadline").value
  });
  saveActivities();
  showActivities();
  activityForm.reset();
});

if (currentUser) {
  // Members cannot see the "Add an Activity" box
  if (currentUser.role !== "leader") {
    document.querySelectorAll(".leader-only").forEach(function (el) {
      el.style.display = "none";
    });
  }
  showActivities();
}