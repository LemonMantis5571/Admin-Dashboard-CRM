(function() {
    let DB;

    const listadoClientes = document.querySelector('#listado-clientes');
    document.addEventListener('DOMContentLoaded', () =>{
        crearDB();


        if(window.indexedDB.open('crm', 1)){
            setTimeout(() => {
                obtenerClientes();
            }, 5000);
            
        }

        listadoClientes.addEventListener('click', eliminarRegistro);
    });

    function eliminarRegistro(e) {
        if(e.target.classList.contains('eliminar')){
            const idEliminar = Number(e.target.dataset.cliente);
           
            const confirmar = confirm('Deseas Eliminar este cliente?');

            if(confirmar){
                const transaction = DB.transaction(['crm'], 'readwrite');
                const objectStore = transaction.objectStore('crm');

                objectStore.delete(idEliminar);

                transaction.oncomplete = () => {
                    e.target.parentElement.parentElement.remove();
                    setTimeout(() => {
                        alert('Eliminado correctamente');
                    }, 500);
                }

                transaction.onerror = () => {
                    console.log('Error');


                    
                }
            }
        }
    }

    function crearDB() {
        const crearDB = window.indexedDB.open('crm', 1);

        crearDB.onerror = () => {
            console.log("hubo un error")
        };


        crearDB.onsuccess = () => {
            console.log("Exito");
            DB = crearDB.result;
        };

        crearDB.onupgradeneeded = (e) => {
            console.log("DB creada");
            const db = e.target.result;


            const objectStore = db.createObjectStore('crm', {keypath: 'id', autoIncrement: true})
            
            objectStore.createIndex('nombre', 'nombre', {unique: false});
            objectStore.createIndex('email', 'email', {unique: true});
            objectStore.createIndex('telefono', 'telefono', {unique: false});
            objectStore.createIndex('empresa', 'empresa', {unique: false});
            objectStore.createIndex('id', 'id', {unique: true});
        };
    }

    function obtenerClientes() {
        const abrirConexion = window.indexedDB.open('crm', 1);


        abrirConexion.onerror = () =>{
            console.log('hubo un error');
        }

        abrirConexion.onsuccess = () => {
            console.log('se abrio la conexion');

            DB = abrirConexion.result;

            const objectStore = DB.transaction('crm').objectStore('crm');

            objectStore.openCursor().onsuccess = function (e) {

                const cursor  = e.target.result;

                if(cursor) {
                    const { nombre , empresa, email, telefono, id} = cursor.value;

                    

                    listadoClientes.innerHTML += `
                    <tr>
                        <td class="px-6 py-4 whitespace-no-wrap border-b border-gray-200">
                            <p class="text-sm leading-5 font-medium text-gray-700 text-lg  font-bold"> ${nombre} </p>
                            <p class="text-sm leading-10 text-gray-700"> ${email} </p>
                        </td>
                        <td class="px-6 py-4 whitespace-no-wrap border-b border-gray-200 ">
                            <p class="text-gray-700">${telefono}</p>
                        </td>
                        <td class="px-6 py-4 whitespace-no-wrap border-b border-gray-200  leading-5 text-gray-700">    
                            <p class="text-gray-600">${empresa}</p>
                        </td>
                        <td class="px-6 py-4 whitespace-no-wrap border-b border-gray-200 text-sm leading-5">
                            <a href="editar-cliente.html?id=${id}" class="text-teal-600 hover:text-teal-900 mr-5">Editar</a>
                            <a href="#" data-cliente="${id}" class="text-red-600 hover:text-red-900 eliminar">Eliminar</a>
                        </td>
                    </tr>`;
                    
                    cursor.continue();
                }
    
                else {
                    console.log('no hay mas registros');
                }
            }

            


        }
    }
}) ();
