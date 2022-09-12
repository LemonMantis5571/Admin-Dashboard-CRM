function imprimirAlerta(mensaje, tipo) {
    //

    const alerta = document.querySelector('.alerta');
    if (!alerta){
        const divMensaje = document.createElement('div')

        divMensaje.classList.add('px-4', 'py-3', 'rounded', 'max-w-lg', 'mx-auto', 'mt-6', 'text-center', 'border');

        if(tipo == 'error'){
            divMensaje.classList.add('bg-red-100', 'border-red-400', 'text-red-700', 'alerta');
        }

        else {
            divMensaje.classList.add('bg-green-100', 'border-green-400', 'text-green-700');
        }

        divMensaje.textContent = mensaje;

        formulario.appendChild(divMensaje);


        setTimeout(() => {
            divMensaje.remove();
        }, 3000);
    }
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
}
