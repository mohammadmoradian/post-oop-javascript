class Post{
    constructor(title, author, body){
        this.title = title; 
        this.author = author; 
        this.body = body; 
    }
}

class UI{
    addPostToList(post) {
        const div = document.createElement('div'); 
        div.className = "col-12 col-md-4"; 
        div.innerHTML = 
                    `<div class="card">
                        <div class="card-body">
                            <h5 class="card-title">${post.title}</h5>
                            <div class="card-subtitle mb-2 badge text-bg-secondary"> ${post.author} </div>
                            <p class="card-text"> ${post.body} </p>

                            <button class="post-delete btn btn-link text-danger ps-0"> Delete post </button>
                        </div>
                    </div> `

        const list = document.getElementById('postList'); 
        list.appendChild(div); 
    }


    clearInputs(){
        const title = document.getElementById('title').value = ''; 
        const author = document.getElementById('author').value = ''; 
        const body = document.getElementById('body').value = '';
    }

    showAlert(message, className) {
        const alert = document.getElementById('alert'); 
        alert.innerHTML = ''; 

        const div = document.createElement('div'); 
        div.className = `col-md-4 alert alert-${className}`;
        div.innerHTML = message;  

        alert.appendChild(div); 

        setTimeout(function() {
            alert.innerHTML = ''; 
        }, 3000)
    }

    deletePost(target){
        target.parentElement.parentElement.parentElement.remove(); 
    }
}

class Store {
    static getPosts(){
        let posts; 
        if(localStorage.getItem('posts') === null) {
            posts = []; 
        } else {
            posts = JSON.parse(localStorage.getItem('posts')); 
        }

        return posts; 
    }
    static addPost(post) {
        const posts = Store.getPosts(); 

        posts.push(post); 
        localStorage.setItem('posts', JSON.stringify(posts)); 
    }

    static displayPosts() {
        const posts = Store.getPosts(); 
        const ui = new UI(); 

        posts.forEach(post => {
            ui.addPostToList(post); 
        })
    }

    static removePost(title){
        let posts = Store.getPosts(); 
        posts = posts.filter((post) => post.title !== title);

        localStorage.setItem('posts', JSON.stringify(posts)); 
    }
}

document.addEventListener('DOMContentLoaded', Store.displayPosts)

document.getElementById('postForm').addEventListener('submit', function(e) {
    e.preventDefault(); 
    console.log('submit event');
    
    const title = document.getElementById('title').value; 
    const author = document.getElementById('author').value; 
    const body = document.getElementById('body').value; 

    const post = new Post(title, author, body); 
    const ui = new UI(); 

    if(title === '' || author === '' || body === '') {
        ui.showAlert('All fields are required!', 'danger'); 
    } else {
        ui.addPostToList(post); 
        Store.addPost(post); 
        ui.clearInputs(); 
        ui.showAlert('Post successfully created!', 'success'); 
    } 
})

document.getElementById('postList').addEventListener('click', function(e) {
    e.preventDefault(); 
    const ui = new UI(); 

    if(e.target.classList.contains('post-delete')){
        ui.deletePost(e.target); 

        const h5 = e.target.parentElement.firstElementChild; 
        const title = h5.textContent; 
        Store.removePost(title); 

        ui.showAlert('the Post has successfully deleted!', 'warning'); 
    }
})