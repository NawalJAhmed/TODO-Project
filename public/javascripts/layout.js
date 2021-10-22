let reload;
window.addEventListener("DOMContentLoaded", (event) => {
  reload = function () {
    let dash = document.querySelector(".dashbutton");
    let groups = document.querySelectorAll(".groupButton > div > a");
    let links = [dash, ...groups];
    links.forEach((link) => {
      if (link.href === window.location.href) link.style.color = "white";
    });

    let groupHeader = document.querySelector(".groupTop");
    let groupIcon = document.querySelector(".material-icons");
    let groupDivs = document.querySelectorAll(".groupButton > div");
    let groupCounter = 1;
    groupHeader.addEventListener("click", (e) => {
      window.history.pushState("page2", "Title", "/users/1/2");
      groupCounter++;
      if (groupCounter % 2 === 0) {
        groupIcon.innerText = "navigate_next";
        groupDivs.forEach((div) => {
          div.className = "hide";
        });
        return;
      }
      groupIcon.innerText = "expand_more";
      groupDivs.forEach((div) => {
        div.className = "";
      });
    });
    window.onpopstate = function () {
      console.log("location changed!");
    };
  };
  reload();

  // Search functionality
  const search = document.getElementById("search");

  const tasks = document.querySelectorAll(".taskList > li");
  search.addEventListener("input", (e) => {
    tasks.forEach((el) => {
      const aEl = el.querySelector("a");
      if (
        aEl.innerText.toLowerCase().startsWith(e.target.value.toLowerCase())
      ) {
        el.style.display = "inherit";
      } else {
        el.style.display = "none";
      }
    });
  });
});
(function (history) {
  var pushState = history.pushState;
  history.pushState = async function (state) {
    // YOUR CUSTOM HOOK / FUNCTION
    pushState.apply(history, arguments);
    let regex = /http:\/\/localhost:8080\/users\/\d+\/\d+/;
    if (regex.test(window.location.href)) {
      console.log(window.location.href);

      fetch("/users/1/2")
        .then(function (response) {
          return response.text();
        })
        .then(function (string) {
          let body = document.querySelector("body");
          let htmlArr = string.split("body");
          let html = "<body" + htmlArr[1] + "body/></html>";
          console.log(html);
          body.innerHTML = html;
        });
    }
  };
})(window.history);
