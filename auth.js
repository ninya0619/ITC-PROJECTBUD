/* Gets the logged in user for pages that load it (Activities).
   No one logged in means back to the login page. */
const currentUser = (function () {
  let user = null;
  try { user = JSON.parse(localStorage.getItem("currentUser")); } catch (e) {}
  if (!user || !user.email) {
    window.location.href = "login.html";
    return null;
  }
  return user;
})();

(function () {
  if (!currentUser) return;
  const welcome = document.getElementById("welcome");
  if (welcome) {
    welcome.textContent = currentUser.email + " (" + (currentUser.role === "leader" ? "leader" : "member") + ")";
  }
})();
