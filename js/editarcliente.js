(function() {
    let DB;
    let idCliente;
    const nombreInput = document.querySelector('#nombre');
    const empresaInput = document.querySelector('#empresa');
    const emailInput = document.querySelector('#email');
    const telefonoInput = document.querySelector('#telefono');

    const formulario = document.querySelector('#formulario');
    document.addEventListener('DOMContentLoaded', () =>{

        conectarDB();

        formulario.addEventListener('submit', actualizarCliente);

        const parametrosURL = new URLSearchParams(window.location.search);


        idCliente = parametrosURL.get('id');

        if(idCliente){
            setTimeout(() => {
                obtenerCliente(idCliente);
            }, 100);
            
        }
 
    });

    function actualizarCliente(e) {
        e.preventDefault();

        if(nombreInput.value === '' || emailInput.value === '' || telefonoInput.value === '' || empresaInput.value === '' ) {
            imprimirAlerta('Todos los campos son obligatorios', 'error');

            return;
        }

        if (isNaN(telefonoInput.value)){
            imprimirAlerta('Ingresa un numero de teléfono valido', 'error');

            return;
        }

        const clienteActualizado = {
            nombre: nombreInput.value,
            email: emailInput.value,
            empresa: empresaInput.value,
            telefono: telefonoInput.value,
            id: Number(idCliente)
        }

        const transaction = DB.transaction(['crm'], 'readwrite');
        const objectStore = transaction.objectStore('crm');

        objectStore.put(clienteActualizado);

        transaction.oncomplete = () => {
            imprimirAlerta('El cliente se actualizo correctamente');

            setTimeout(() => {
                window.location.href = 'index.html';
            }, 3000);
        }

        transaction.onerror = (error) => {
            const errorAlert = String(error.target.error);


            if(errorAlert.includes('email')){
                imprimirAlerta('Ese email ya esta en uso', 'error');
            }

            imprimirAlerta('Hubo un error', 'error');
            console.log(error);

        }

    }



    function obtenerCliente(id){
      const transaction = DB.transaction(['crm'], 'readwrite');

      const objectStore = transaction.objectStore('crm');
      
      const cliente = objectStore.openCursor();

      cliente.onsuccess = function(e) {
        const cursor = e.target.result;


        if(cursor) {

            if(cursor.value.id === Number(id)){
                
                llenarFormulario(cursor.value);
            }
            cursor.continue();
        }
      }
    }

    function llenarFormulario(datosCliente){
        const {nombre, email, empresa, telefono } = datosCliente;

        nombreInput.value = nombre;
        empresaInput.value = empresa;
        emailInput.value = email;
        telefonoInput.value = telefono;
       
    }

    function conectarDB() {
        const abrirConexion = window.indexedDB.open('crm', 1);

        abrirConexion.onerror = () => {
            console.log("hubo un error");
        }

        abrirConexion.onsuccess = () => {
            console.log("conectada correctamente");

            DB = abrirConexion.result;
        }
    };

}) ();