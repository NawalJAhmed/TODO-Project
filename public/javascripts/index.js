window.addEventListener("load", (event)=>{
    console.log("hello from javascript!")
})

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
