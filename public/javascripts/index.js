window.addEventListener("load", (event) => {
  console.log("hello from javascript!");
});

window.onload = function () {
  //button for viewing incompletedTasks
  const showCompletedTasksButton = document.getElementById(
    "completeTaskListButton"
  );
  const header = document.querySelector(".content1Header > h2");
  header.innerText = window.location.href.endsWith("completed")
    ? "Completed Tasks"
    : "Incomplete Tasks List";
  showCompletedTasksButton.innerText = window.location.href.endsWith(
    "completed"
  )
    ? "Show Incomplete Tasks"
    : "Show Complete Tasks";
  showCompletedTasksButton.addEventListener("click", async (e) => {
    let urls = window.location.href.split("/users/");
    let params = urls[1].split("/");
    let userId = params[0];
    let groupId = params[1];
    console.log(window.location.href);

    if (!window.location.href.endsWith("completed")) {
      header.innerText = "Completed Tasks";
      showCompletedTasksButton.innerText = "Show Incomplete Tasks";
      fetch(`/users/${userId}/${groupId}/completed/taskList`)
        .then(function (response) {
          return response.text();
        })
        .then(function (html) {
          let listContainer = document.querySelector(".taskListContainer");
          listContainer.innerHTML = html;
        });

      history.pushState({}, "", window.location.href + "/completed");
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

      history.back();
    }
  });

  // delete button
  const buttons = document.querySelectorAll(".delete-btn");

  for (let i = 0; i < buttons.length; i++) {
    const button = buttons[i];
    button.addEventListener("click", async (e) => {
      e.preventDefault();
      const postId = e.target.id.split("-")[1];
      const res = await fetch(`/posts/${postId}`, {
        method: "DELETE",
      });
    });
  }
};

const deleteTaskButtn = document.getElementById("deleteTaskButtn");

function SomeDeleteRowFunction() {
  // event.target will be the input element.
  let td = deleteTaskButtn.parentNode;
  let tr = td.parentNode; // the row to be removed
  tr.parentNode.removeChild(tr);
}
