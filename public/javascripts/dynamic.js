(function (history) {
  const pushState = history.pushState;
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
