// 1. IMPORTACIONES CORRECTAS (Usando CDN para que funcione en XAMPP)
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { 
    getFirestore, collection, addDoc, getDocs, 
    deleteDoc, doc, updateDoc 
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

// 2. TUS CREDENCIALES (Copiadas tal cual me las pasaste)
const firebaseConfig = {
  apiKey: "AIzaSyDFPO0rA3ypXhdExUJQDSoVfgayZdmwjiM",
  authDomain: "martinbedolla-firebase-app.firebaseapp.com",
  projectId: "martinbedolla-firebase-app",
  storageBucket: "martinbedolla-firebase-app.firebasestorage.app",
  messagingSenderId: "86411094347",
  appId: "1:86411094347:web:e588b1774abd08171920ce"
};

// Inicializar Firebase (Solo una vez)
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// Variable para la búsqueda
let datos = [];

// --- SOLUCIÓN AL ERROR "IS NOT DEFINED" ---
// Usamos window.nombreFuncion para que el HTML pueda "ver" la función dentro del módulo

// AGREGAR PRODUCTO [cite: 4]
window.agregar = async function() {
    const nombre = document.getElementById("nombre").value;
    const precio = document.getElementById("precio").value;

    if (nombre === "" || precio === "") {
        alert("Completa todos los campos");
        return;
    }

    try {
        await addDoc(collection(db, "productos"), {
            nombre: nombre,
            precio: precio
        });
        alert("Producto agregado");
        document.getElementById("nombre").value = "";
        document.getElementById("precio").value = "";
        leer();
    } catch (error) {
        console.error("Error al agregar: ", error);
    }
};

// LEER PRODUCTOS
async function leer() {
    datos = [];
    const querySnapshot = await getDocs(collection(db, "productos"));
    querySnapshot.forEach((doc) => {
        datos.push({ id: doc.id, ...doc.data() });
    });
    mostrar(datos);
}

// MOSTRAR EN TABLA
function mostrar(lista) {
    const tabla = document.getElementById("tabla");
    tabla.innerHTML = "";
    lista.forEach((p) => {
        tabla.innerHTML += `
            <tr>
                <td>${p.nombre}</td>
                <td>${p.precio}</td>
                <td>
                    <button onclick="eliminar('${p.id}')" style="background:red;">Eliminar</button>
                    <button onclick="editar('${p.id}')">Editar</button>
                </td>
            </tr>
        `;
    });
}

// ELIMINAR
window.eliminar = async function(id) {
    if(confirm("¿Eliminar este registro?")) {
        await deleteDoc(doc(db, "productos", id));
        leer();
    }
};

// EDITAR
window.editar = async function(id) {
    const nuevoNombre = prompt("Nuevo nombre:");
    const nuevoPrecio = prompt("Nuevo precio:");
    if (nuevoNombre && nuevoPrecio) {
        await updateDoc(doc(db, "productos", id), {
            nombre: nuevoNombre,
            precio: nuevoPrecio
        });
        leer();
    }
};

// FILTRAR (Búsqueda) [cite: 4]
window.filtrar = function() {
    const texto = document.getElementById("buscar").value.toLowerCase();
    const filtrados = datos.filter(p => p.nombre.toLowerCase().includes(texto));
    mostrar(filtrados);
};

// Carga inicial
leer();