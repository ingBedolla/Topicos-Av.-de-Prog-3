// 1. IMPORTACIONES
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";

import {
  getFirestore,
  collection,
  addDoc,
  getDocs,
  deleteDoc,
  doc,
  updateDoc
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

// 2.Copiable.
// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDFPO0rA3ypXhdExUJQDSoVfgayZdmwjiM",
  authDomain: "martinbedolla-firebase-app.firebaseapp.com",
  projectId: "martinbedolla-firebase-app",
  storageBucket: "martinbedolla-firebase-app.firebasestorage.app",
  messagingSenderId: "86411094347",
  appId: "1:86411094347:web:e588b1774abd08171920ce"
};

// 3. Iniciar firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// 4. RESTO DEL CÓDIGO (CRUD)
let datos = [];

window.agregar = async function () {
    const nombre = document.getElementById("nombre").value;
    const precio = document.getElementById("precio").value;

    if (nombre === "" || precio === "") {
        alert("Completa todos los campos");
        return;
    }

    await addDoc(collection(db, "productos"), {
        nombre,
        precio
    });

    alert("Producto agregado");

    document.getElementById("nombre").value = "";
    document.getElementById("precio").value = "";

    leer();
};

async function leer() {
    datos = [];

    const querySnapshot = await getDocs(collection(db, "productos"));

    querySnapshot.forEach((docu) => {
        datos.push({
            id: docu.id,
            ...docu.data()
        });
    });

    mostrar(datos);
}

function mostrar(lista) {
  const tabla = document.getElementById("tabla");
  tabla.innerHTML = "";

  lista.forEach(d => {
    tabla.innerHTML += `
    <tr>
      <td>${d.nombre}</td>
      <td>${d.precio}</td>
      <td>
        <button onclick="eliminar('${d.id}')">Eliminar</button>
        <button onclick="editar('${d.id}')">Editar</button>
      </td>
    </tr>
    `;
  });
}

window.eliminar = async function (id) {
  await deleteDoc(doc(db, "productos", id));
  leer();
};

window.editar = async function (id) {
    const nuevoNombre = prompt("Nuevo nombre:");
    const nuevoPrecio = prompt("Nuevo precio:");

    if (!nuevoNombre || !nuevoPrecio) return;

    await updateDoc(doc(db, "productos", id), {
        nombre: nuevoNombre,
        precio: nuevoPrecio
    });

    leer();
};

window.filtrar = function () {
    const texto = document.getElementById("buscar").value.toLowerCase();

    const filtrados = datos.filter(d =>
        d.nombre.toLowerCase().includes(texto)
    );

    mostrar(filtrados);
};

leer();



