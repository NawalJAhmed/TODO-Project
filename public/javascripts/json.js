document.addEventListener("DOMContentLoaded", (event) => {
  const upload = document.getElementById("json");
  let jsonText = document.getElementById("jsonText");

  if (upload) {
    upload.addEventListener("change", function () {
      if (upload.files.length > 0) {
        const reader = new FileReader();

        reader.addEventListener("load", function () {
          const result = JSON.parse(reader.result); // Parse the result into an object
          let stats = JSON.stringify(result.tests);
          jsonText.value = stats;
          upload.value = null;
        });

        reader.readAsText(upload.files[upload.files.length - 1]);
      }
    });
  }
});
