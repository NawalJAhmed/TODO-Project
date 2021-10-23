// (function (history) {
//   const pushState = history.pushState;
//   history.pushState = async function (state) {
//     // YOUR CUSTOM HOOK / FUNCTION
//     pushState.apply(history, arguments);
//     let urls = window.location.href.split("/users/");
//     let params = urls[1].split("/");
//     let userId = params[0];
//     let groupId = params[1];
//     console.log("HELLO!");
//     let regex = /\/users\/\d+\/\d+$/;
//     //completed task view
//     if (regex.test(window.location.href)) {
//       fetch(`/users/${userId}/${groupId}`)
//         .then(function (response) {
//           return response.text();
//         })
//         .then(function (string) {
//           let body = document.querySelector("body");
//           let htmlArr = string.split("body");
//           let html = "<body" + htmlArr[1] + "body/></html>";
//           let urls = window.location.href.split("/users/");

//           //body.innerHTML = html;
//         });
//     }
//   };
// })(window.history);
