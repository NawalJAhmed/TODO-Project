function completed() {
  let eComp = !window.location.href.endsWith("completed");
  history.pushState(
    {},
    "",
    eComp
      ? window.location.href + "/completed"
      : window.location.href.slice(0, -10)
  );
}

(function (history) {
  const pushState = history.pushState;
  history.pushState = async function (state) {
    // YOUR CUSTOM HOOK / FUNCTION
    pushState.apply(history, arguments);
    console.log(e.status);
    let urls = window.location.href.split("/users/");
    let params = urls[1].split("/");
    let userId = params[0];
    let groupId = params[1];
    const showCompletedTasksButton = document.getElementById(
      "completeTaskListButton"
    );
    const header = document.querySelector(".content1Header > h2");

    if (!window.location.href.endsWith("completed")) {
      header.innerText = "Completed Tasks";
      showCompletedTasksButton.innerText = "Show Incomplete Tasks";
      fetch(window.location.href)
        .then(function (response) {
          return response.text();
        })
        .then(function (html) {
          let listContainer = document.querySelector(".taskListContainer");
          listContainer.innerHTML = html;
        });
    } else {
      showCompletedTasksButton.innerText = "Show Complete Tasks";
      header.innerText = "Incomplete Tasks List";
      fetch(`/users/${userId}/${groupId}/taskList`)
        .then(function (response) {
          return response.text();
        })
        .then(function (html) {
          let listContainer = document.querySelector(".taskListContainer");
          listContainer.innerHTML = html;
        });
    }
  };
})(window.history);
