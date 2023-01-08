window.onload = function () {
  //button for viewing incompletedTasks
  const showCompletedTasksButton = document.getElementById(
    'completeTaskListButton'
  );
  const header = document.querySelector('.content1Header > h2');
  header.innerText = window.location.href.endsWith('completed')
    ? 'Completed tasks'
    : 'Incomplete tasks List';
  showCompletedTasksButton.innerText = window.location.href.endsWith(
    'completed'
  )
    ? 'Show Incomplete tasks'
    : 'Show Complete tasks';

  // delete button
  const buttons = document.querySelectorAll('.delete-btn');

  for (let i = 0; i < buttons.length; i++) {
    const button = buttons[i];
    button.addEventListener('click', async (e) => {
      e.preventDefault();
      const postId = e.target.id.split('-')[1];
      const res = await fetch(`/posts/${postId}`, {
        method: 'DELETE',
      });
    });
  }
};

const deleteTaskButtn = document.getElementById('deleteTaskButtn');

function SomeDeleteRowFunction() {
  // event.target will be the input element.
  let td = deleteTaskButtn.parentNode;
  let tr = td.parentNode; // the row to be removed
  tr.parentNode.removeChild(tr);
}
