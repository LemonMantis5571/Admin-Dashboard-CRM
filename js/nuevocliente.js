(function () {
    let DB;

    const formulario = document.querySelector('#formulario');

    document.addEventListener('DOMContentLoaded', () => {
        conectarDB();

        formulario.addEventListener('submit', validarCliente);
    });

    function conectarDB() {
        // ABRIR CONEXIÓN EN LA BD:

        let abrirConexion = window.indexedDB.open('crm', 1);

        // si hay un error, lanzarlo
        abrirConexion.onerror = function () {
            console.log('Hubo un error');
        };

        // si todo esta bien, asignar a database el resultado
        abrirConexion.onsuccess = function () {
            // guardamos el resultado
            DB = abrirConexion.result;
        };
    }


    function validarCliente(e) {
        e.preventDefault();

        console.log('validando');

        const nombre = document.querySelector('#nombre').value;
        const email = document.querySelector('#email').value;
        const telefono = document.querySelector('#telefono').value;
        const empresa = document.querySelector('#empresa').value;

        if (nombre === '' || email === '' || telefono === '' || empresa === '') {
            imprimirAlerta('Todos los campos son obligatorios', 'error');

            return;
        }

        if (isNaN(telefono)) {
            imprimirAlerta('Ingresa un numero de teléfono valido', 'error');

            return;
        }

        const cliente = {
            nombre: nombre,
            email: email,
            telefono: telefono,
            empresa: empresa,

        }
        cliente.id = Date.now();


        crearNuevoCliente(cliente);


    }

    function crearNuevoCliente(cliente) {
        const transaction = DB.transaction(['crm'], 'readwrite');

        const objectStore = transaction.objectStore('crm');


        objectStore.add(cliente);


        transaction.onerror = () => {

            if (objectStore.count(cliente.email)) {
                imprimirAlerta('Ese email ya esta en uso', 'error');
                return
            }
            else {
                imprimirAlerta('Hubo un error', 'error');
            }




        }


        transaction.oncomplete = () => {
            imprimirAlerta('El cliente se agrego correctamente');


            setTimeout(() => {
                window.location.href = 'index.html';
            }, 3000);
        }
    }


})();