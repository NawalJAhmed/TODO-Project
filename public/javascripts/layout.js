let reload;
window.addEventListener("DOMContentLoaded", (event) => {
  let dash = document.querySelector(".dashbutton");
  let groups = document.querySelectorAll(".groupButton > div > a");
  let links = [dash, ...groups];
  let groupCounter = 1;
  let groupHead = document.querySelector(".groupHeader > h1");

  links.forEach((link) => {
    if (window.location.pathname === link.id) {
      link.style.color = "white";
    } else if (window.location.pathname.startsWith(`${link.id}/`)) {
      link.style.color = "white";
    } else {
      link.style.color = "black";
    }
  });
  let groupHeader = document.querySelector(".groupTop");
  let groupIcon = document.querySelector(".material-icons");
  let groupDivs = document.querySelectorAll(".groupButton > div");
  groupHeader.addEventListener("click", (e) => {
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

  // Search functionality
  const search = document.getElementById("search");

  const tasks = document.querySelectorAll(".taskList > li");
  search.addEventListener("input", (e) => {
    tasks.forEach((el) => {
      const aEl = el.querySelector("a");
      if (
        aEl.innerText.toLowerCase().startsWith(e.target.value.toLowerCase())
      ) {
        el.style.display = "flex";
      } else {
        el.style.display = "none";
      }
    });
  });
});
