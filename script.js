class Mascota {
    constructor(nombre, imagen, descripcion, user) {
        this.nombre = nombre;
        this.imagen = imagen;
        this.descripcion = descripcion;
        this.user = user;
        this.fecha = new Date().toLocaleString(); // Agregar fecha y hora
        this.comentarios = [];
    }
}

// Cargar usuarios y publicaciones del localStorage
const usuarios = JSON.parse(localStorage.getItem('usuarios')) || {};
const publicaciones = JSON.parse(localStorage.getItem('publicaciones')) || [];

// Mostrar el contenedor de inicio de sesión
document.getElementById('loginContainer').style.display = 'block';

document.getElementById('loginButton').addEventListener('click', () => {
    const username = document.getElementById('username').value.trim();
    const password = document.getElementById('password').value;

    if (username === "" || password === "") {
        document.getElementById('loginMessage').innerText = 'Por favor completa todos los campos.';
        return;
    }

    if (usuarios[username] && usuarios[username] === password) {
        document.getElementById('loginContainer').style.display = 'none';
        document.getElementById('mainContainer').style.display = 'block';
        mostrarPublicaciones();
    } else {
        document.getElementById('loginMessage').innerText = 'Usuario o contraseña incorrectos';
    }
});

document.getElementById('registerButton').addEventListener('click', () => {
    const newUsername = document.getElementById('newUsername').value.trim();
    const newPassword = document.getElementById('newPassword').value;

    if (newUsername === "" || newPassword === "") {
        document.getElementById('registerMessage').innerText = 'Por favor completa todos los campos.';
        return;
    }

    if (newUsername in usuarios) {
        document.getElementById('registerMessage').innerText = 'El usuario ya existe';
    } else {
        usuarios[newUsername] = newPassword;
        localStorage.setItem('usuarios', JSON.stringify(usuarios));
        document.getElementById('registerMessage').innerText = 'Registro exitoso. Puedes iniciar sesión ahora.';
        document.getElementById('registerContainer').style.display = 'none';
        document.getElementById('loginContainer').style.display = 'block';
    }
});

document.getElementById('showRegister').addEventListener('click', () => {
    document.getElementById('loginContainer').style.display = 'none';
    document.getElementById('registerContainer').style.display = 'block';
});

document.getElementById('showLogin').addEventListener('click', () => {
    document.getElementById('registerContainer').style.display = 'none';
    document.getElementById('loginContainer').style.display = 'block';
});

document.getElementById('createPost').addEventListener('click', () => {
    document.getElementById('postContainer').style.display = 'block';
});

document.getElementById('submitPost').addEventListener('click', () => {
    const nombre = document.getElementById('petName').value.trim();
    const imagenFile = document.getElementById('petImage').files[0];
    const contenido = document.getElementById('postContent').value;
    const username = document.getElementById('username').value;

    if (!nombre || !contenido) {
        document.getElementById('postMessage').innerText = 'Por favor, completa todos los campos.';
        return;
    }

    if (imagenFile) {
        const reader = new FileReader();
        reader.onloadend = () => {
            const mascota = new Mascota(nombre, reader.result, contenido, username);
            publicaciones.push(mascota);
            localStorage.setItem('publicaciones', JSON.stringify(publicaciones));
            document.getElementById('petName').value = '';
            document.getElementById('petImage').value = '';
            document.getElementById('postContent').value = '';
            document.getElementById('postContainer').style.display = 'none';
            document.getElementById('successContainer').style.display = 'block';
        };
        reader.readAsDataURL(imagenFile);
    } else {
        document.getElementById('postMessage').innerText = 'Por favor, selecciona una imagen.';
    }
});

document.getElementById('returnButton').addEventListener('click', () => {
    document.getElementById('successContainer').style.display = 'none';
    document.getElementById('mainContainer').style.display = 'block';
    mostrarPublicaciones();
});

document.getElementById('viewPets').addEventListener('click', () => {
    mostrarPublicaciones();
    document.getElementById('mainContainer').style.display = 'none';
    document.getElementById('feedContainer').style.display = 'block';
});

document.getElementById('backToMainButton').addEventListener('click', () => {
    document.getElementById('feedContainer').style.display = 'none';
    document.getElementById('mainContainer').style.display = 'block';
});

function mostrarPublicaciones() {
    const feed = document.getElementById('feed');
    feed.innerHTML = '';
    publicaciones.forEach(pub => {
        if (pub && pub.nombre && pub.imagen && pub.descripcion) {
            feed.innerHTML += `
                <div class="pet-post">
                    <h3>${pub.nombre} (Publicado por: ${pub.user})</h3>
                    <p><small>Fecha y hora: ${pub.fecha}</small></p>
                    <img src="${pub.imagen}" alt="${pub.nombre}" style="width:100%; height:auto;">
                    <p>${pub.descripcion}</p>
                    <div class="comments">
                        <input type="text" placeholder="Escribe un comentario..." id="commentInput${pub.nombre}">
                        <button onclick="addComment('${pub.nombre}')">Comentar</button>
                        <div class="commentList" id="commentList${pub.nombre}">${pub.comentarios.map(c => `<div><strong>${c.user}</strong>: ${c.text}</div>`).join('')}</div>
                    </div>
                </div>`;
        } else {
            console.error("Publicación no válida:", pub);
        }
    });
}

function addComment(nombre) {
    const commentInput = document.getElementById(`commentInput${nombre}`);
    const commentText = commentInput.value.trim();
    const username = document.getElementById('username').value;

    if (commentText) {
        const index = publicaciones.findIndex(pub => pub.nombre === nombre);
        if (index !== -1) {
            publicaciones[index].comentarios.push({ user: username, text: commentText });
            localStorage.setItem('publicaciones', JSON.stringify(publicaciones));
            mostrarPublicaciones();
            commentInput.value = '';
        }
    }
}

function buscarMascotas() {
    const input = document.getElementById('searchInput').value.toLowerCase();
    const feed = document.getElementById('feed');
    feed.innerHTML = '';
    publicaciones.forEach(pub => {
        if (pub.nombre.toLowerCase().includes(input)) {
            feed.innerHTML += `
                <div class="pet-post">
                    <h3>${pub.nombre} (Publicado por: ${pub.user})</h3>
                    <p><small>Fecha y hora: ${pub.fecha}</small></p>
                    <img src="${pub.imagen}" alt="${pub.nombre}" style="width:100%; height:auto;">
                    <p>${pub.descripcion}</p>
                    <div class="comments">
                        <input type="text" placeholder="Escribe un comentario..." id="commentInput${pub.nombre}">
                        <button onclick="addComment('${pub.nombre}')">Comentar</button>
                        <div class="commentList" id="commentList${pub.nombre}">${pub.comentarios.map(c => `<div><strong>${c.user}</strong>: ${c.text}</div>`).join('')}</div>
                    </div>
                </div>`;
        }
    });
}