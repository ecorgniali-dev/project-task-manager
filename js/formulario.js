EventListener();

function EventListener() {
    document.querySelector('#formulario').addEventListener('submit', validarRegistro);
}

function validarRegistro(e) {
    e.preventDefault();

    var usuario = document.querySelector('#usuario').value,
        password = document.querySelector('#password').value,
        tipo = document.querySelector('#tipo').value;


    if (usuario === '' || password === '') {
        // la validación falló
        Swal.fire({
            type: 'error',
            title: 'Error!',
            text: 'Ambos campos son obligatorios!'
        })
    } else {
        // Ambos campos son correctos

        // datos que se envian al servidor
        var datos = new FormData();
        datos.append('usuario', usuario);
        datos.append('password', password);
        datos.append('accion', tipo);

        // crear el llamado a ajax
        var xhr = new XMLHttpRequest();

        // abrir la conexion
        xhr.open('POST', 'inc/modelos/modelo-admin.php', true);

        // retorno de datos
        xhr.onload = function () {
            if (this.status === 200) {
                var respuesta = JSON.parse(xhr.responseText);

                console.log(respuesta);
                
                // Si la respuesta es correcta
                if(respuesta.respuesta === 'correcto') {
                    // si es nuevo usuario
                    if (respuesta.tipo === 'crear') {
                        Swal({
                            title: 'Usuario Creado',
                            text: 'El usuario se creó correctamente',
                            type: 'success'
                        });
                    } else if(respuesta.tipo === 'login') {
                        Swal({
                            title: 'Login correcto',
                            text: 'Presiona OK para abrir el dashboard',
                            type: 'success'
                        })
                        .then(resultado => {
                            if (resultado.value) {
                                window.location.href = 'index.php';
                            }    
                        })
                    }
                } else {
                    // Hubo un error
                    Swal({
                        title: 'Error',
                        text: 'Hubo un error',
                        type: 'error'
                    });
                }
            } 
        }

        // enviar la peticion
        xhr.send(datos);
        
    }    
}