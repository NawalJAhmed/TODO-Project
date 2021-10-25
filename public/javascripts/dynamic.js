let urls;
let userId;
let groupId;
let taskId;
window.onload = function () {
  urls = window.location.href.split("/users/");
  params = urls[1].split("/");
  userId = params[0];
  groupId = params[1];
  taskId = parseInt(params[2]);
};

function completed() {
  urls = window.location.href.split("/users/");
  params = urls[1].split("/");
  userId = params[0];
  groupId = params[1];
  taskId = parseInt(params[2]);
  let eComp = !window.location.href.endsWith("completed");
  history.pushState(
    {},
    "",
    eComp
      ? window.location.href + "/completed"
      : window.location.href.slice(0, -10)
  );

  const header = document.querySelector(".content1Header > h2");
  if (window.location.href.endsWith("completed")) {
    header.innerText = "Completed Tasks";
    fetch(`/users/${userId}/${groupId}/completed/taskList`)
      .then(function (response) {
        return response.text();
      })
      .then(function (html) {
        let listContainer = document.querySelector(".taskListContainer");
        listContainer.innerHTML = html;
      });
  } else {
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
}
function taskView(taskIdView) {
  urls = window.location.href.split("/users/");
  params = urls[1].split("/");
  userId = params[0];
  groupId = params[1];
  if (window.location.href.endsWith("/completed")) {
    history.pushState(
      {},
      "",
      `/users/${userId}/${groupId}/${taskIdView}/completed`
    );
  } else {
    history.pushState({}, "", `/users/${userId}/${groupId}/${taskIdView}`);
  }
  fetch(`/users/${userId}/${groupId}/${taskIdView}/taskview`)
    .then(function (response) {
      return response.text();
    })
    .then(function (html) {
      let taskIdView = document.querySelector(".task");
      taskIdView.innerHTML = html;
    });
}

async function groupView(groupIdView, groupName) {
  urls = window.location.href.split("/users/");
  params = urls[1].split("/");
  userId = params[0];
  console.log();
  fetch(`/users/${userId}/${groupIdView}/groupView`)
    .then(function (response) {
      return response.text();
    })
    .then(function (html) {
      let groupContainer = document.querySelector(".task");
      groupContainer.innerHTML = html;
    });
  fetch(`/users/${userId}/${groupIdView}/update`)
    .then(function (response) {
      return response.text();
    })
    .then(function (html) {
      let updateMemberDrop = document.querySelector(".taskHeader");
      updateMemberDrop.innerHTML = html;
    })
    .then(() => {
      let groupHeader = document.querySelector(".groupHeader > h1");
      groupHeader.innerText = groupName;
      history.pushState({}, "", `/users/${userId}/${groupIdView}`);
    });
  fetch(`/users/${userId}/${groupIdView}/taskList`)
    .then(function (response) {
      return response.text();
    })
    .then(function (html) {
      let listContainer = document.querySelector(".taskListContainer");
      listContainer.innerHTML = html;
    })
    .then(() => {
      let groupHeader = document.querySelector(".groupHeader > h1");
      groupHeader.innerText = groupName;
      history.pushState({}, "", `/users/${userId}/${groupIdView}`);
    });
}

(function (history) {
  const pushState = history.pushState;
  history.pushState = async function (state) {
    // YOUR CUSTOM HOOK / FUNCTION
    pushState.apply(history, arguments);
    let dash = document.querySelector(".dashbutton");
    let groups = document.querySelectorAll(".groupButton > div > a");
    let links = [dash, ...groups];
    const showCompletedTasksButton = document.getElementById(
      "completeTaskListButton"
    );
    links.forEach((link) => {
      if (window.location.pathname.startsWith(link.id)) {
        link.style.color = "white";
      } else {
        link.style.color = "black";
      }
    });
    if (window.location.href.endsWith("completed")) {
      showCompletedTasksButton.innerText = "Show Incomplete Tasks";
    } else {
      showCompletedTasksButton.innerText = "Show Complete Tasks";
    }
  };
})(window.history);
