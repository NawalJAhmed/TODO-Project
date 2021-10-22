window.addEventListener("load", (event)=>{
    console.log("hello from javascript!")
})

window.onload=function(){
    //console.log();
    //button for viewing incompletedTasks
    const showCompletedTasksButton = document.getElementById('completeTaskListButton')
    const showIncompletedTasksButton = document.getElementById('showIncompletedTasksButton')

    if ((!window.location.href.endsWith('completed')) ) {
        showCompletedTasksButton.addEventListener('click', async (e) => {
            //   e.preventDefault();
              let toCompletedUrl = "";
              if(window.location.href.endsWith('/')) {
                 toCompletedUrl = `${window.location.href}completed`
                 console.log("Button Clicked");
                 console.log(toCompletedUrl);
              } else {
                  toCompletedUrl = `${window.location.href}/completed`
                  console.log("Button Clicked");
                  console.log(toCompletedUrl);
              }

              window.location.href = toCompletedUrl
          })
    }

    if (window.location.href.endsWith('completed') || window.location.href.endsWith('completed/')) {
        showIncompletedTasksButton.addEventListener('click', async (e) => {
            // e.preventDefault();
            let toCompletedUrl = "";
            if(window.location.href.endsWith('/')) {
                toCompletedUrl = window.location.href.replace(/completed/, "")
                console.log("Button Clicked");
                console.log("!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!");
                console.log(toCompletedUrl);
             } else {
                toCompletedUrl = window.location.href.replace(/\/completed/, "")
                 console.log("Button Clicked");
                 console.log(toCompletedUrl);
             }

            window.location.href = toCompletedUrl
        })
    }





    // const groupDetailsButton = document.getElementById('groupDetailsBttn')
    // groupDetailsButton.addEventListener('click', async (e) => {
    //     //e.preventDefault();
    //     window.history.back()
    //   })








//select currentTaskField
// const currentTaskFields = document.getElementsByClassName("currentTask");

// for (let i = 0; i < currentTaskFields.length; i++) {
//     const currentTaskField = currentTaskFields[i];
//     currentTaskField.addEventListener('click', async (e) => {
//         e.preventDefault();
//         console.log("currentTaskField Clicked");
//     })
// }





    // delete button
    const buttons = document.querySelectorAll('.delete-btn')

    for (let i = 0; i < buttons.length; i++) {
        const button = buttons[i];
        button.addEventListener('click', async (e) => {
            e.preventDefault();
            const postId = e.target.id.split('-')[1]
            const res = await fetch(`/posts/${postId}`, {
                method: 'DELETE'
            })


        })
    }
  }


  const deleteTaskButtn = document.getElementById('deleteTaskButtn')

  function SomeDeleteRowFunction() {
    // event.target will be the input element.
    let td = deleteTaskButtn.parentNode;
    let tr = td.parentNode; // the row to be removed
    tr.parentNode.removeChild(tr);
}
