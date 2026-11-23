/* Shows "email (role)" next to the profile icon in the top header. */
(function () {
  var el = document.getElementById("userInfo");
  if (!el) return;
  try {
    var u = JSON.parse(localStorage.getItem("currentUser"));
    if (u && u.email) {
      el.textContent = u.email + " (" + (u.role === "leader" ? "leader" : "member") + ")";
    }
  } catch (e) {}
})();
