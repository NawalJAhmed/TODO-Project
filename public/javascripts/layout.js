window.addEventListener("DOMContentLoaded", (event) => {
  let links = document.querySelectorAll("a");
  links.forEach((link) => {
    if (link.href === window.location.href) link.style.color = "white";
  });

  let groupHeader = document.querySelector(".groupTop");
  let groupIcon = document.querySelector(".material-icons");
  let groupDivs = document.querySelectorAll(".groupButton > div");
  let groupCounter = 1;
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
});
