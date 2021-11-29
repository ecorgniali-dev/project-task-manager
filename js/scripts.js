eventListeners();
// lista de proyectos
var listaProyectos = document.querySelector('ul#proyectos');

function eventListeners() {

    // Document Ready
    document.addEventListener('DOMContentLoaded', function () {
        actualizarProgreso();
    });

    // Boton para crear proyecto
    document.querySelector('.crear-proyecto a').addEventListener('click', nuevoProyecto);

    // Boton para nueva tarea
    let nueva_tarea = document.querySelector('.nueva-tarea');
    if (nueva_tarea) {
        nueva_tarea.addEventListener('click', agregarTarea);
    }

    // Botones para las acciones de las tareas
    document.querySelector('.listado-pendientes').addEventListener('click', accionesTareas);
}

function nuevoProyecto(e) {
    e.preventDefault();

    // Crea un input para el nombre del nuevo proyecto
    var nuevoProyecto = document.createElement('li');
    nuevoProyecto.innerHTML = '<input type="text" id="nuevo-proyecto">';
    listaProyectos.appendChild(nuevoProyecto);

    // seleccionar el ID con el nuevo proyecto
    var inputNuevoProyecto = document.querySelector('#nuevo-proyecto');

    // al presionar enter crea el nuevo proyecto
    inputNuevoProyecto.addEventListener('keypress', function (e) {
        var tecla = e.which || e.keyCode;

        if (tecla === 13) {
            guardarProyectoDB(inputNuevoProyecto.value);
            listaProyectos.removeChild(nuevoProyecto);
        }
    });
}

function guardarProyectoDB(nombreProyecto) {
    // Crear el llamado a ajax
    var xhr = new XMLHttpRequest();

    // Enviar datos por formdata
    var datos = new FormData();
    datos.append('proyecto', nombreProyecto);
    datos.append('accion', 'crear');
    
    // Abrir la conexion
    xhr.open('POST', 'inc/modelos/modelo-proyecto.php', true);

    // En la carga
    xhr.onload = function() {
        if (this.status === 200) {
            // Obtener los datos de la respuesta
            var respuesta = JSON.parse(xhr.responseText);
            var proyecto = respuesta.nombre_proyecto,
                id_proyecto = respuesta.id_insertado,
                tipo = respuesta.tipo,
                resultado = respuesta.respuesta;
            
            if (resultado === 'correcto') {
                // Fue exitoso
                if (tipo === 'crear') {
                    // Se creo un nuevo proyecto
                    // Inyectar en el HTML
                    var nuevoProyecto = document.createElement('li');
                    nuevoProyecto.innerHTML = `
                        <a href="index.php?id_proyecto=${id_proyecto}" id="proyecto:${id_proyecto}">
                            ${proyecto}
                        </a>
                    `;
                    // Agregar al HTML
                    listaProyectos.appendChild(nuevoProyecto);

                    // Enviar alerta
                    Swal({
                        title: 'Proyecto Creado',
                        text: 'El Proyecto: ' + proyecto + ' se creó correctamente',
                        type: 'success'
                    })
                    .then(resultado => {
                        // Redireccionar a la nueva url
                        if (resultado.value) {
                            window.location.href = 'index.php?id_proyecto=' + id_proyecto;
                        }    
                    })    
                    
                } else {
                    // Se actualizó o elimino
                }
            } else {
                // Hubo un error
                Swal.fire({
                    type: 'error',
                    title: 'Error!',
                    text: 'Hubo un error!'
                })
            }
        }
    }

    // Enviar el Request
    xhr.send(datos);
}

// Agregar una nueva tarea al proyecto actual
function agregarTarea(e) {
    e.preventDefault();
    
    var nombreTarea = document.querySelector('.nombre-tarea').value;
    // Validar que el campo tenga algo escrito
    if (nombreTarea === '') {
        Swal({
            title: 'Error',
            type: 'error',
            text: 'Una tarea no puede ir vacia'
        })
    } else {
        // El campo nombre tarea tiene algo, insertar en PHP

        // Crear el llamado a ajax
        var xhr = new XMLHttpRequest();

        // Enviar datos por formdata
        var datos = new FormData();
        datos.append('tarea', nombreTarea);
        datos.append('accion', 'crear');
        datos.append('id_proyecto', document.querySelector('#id_proyecto').value);
        
        // Abrir la conexion
        xhr.open('POST', 'inc/modelos/modelo-tareas.php', true);

        // Ejecutarlo y respuesta
        xhr.onload = function () {
            if (this.status === 200) {
                var respuesta = JSON.parse(xhr.responseText);
                // asignar valores
                var resultado = respuesta.respuesta,
                    tarea = respuesta.tarea,
                    id_insertado = respuesta.id_insertado,
                    tipo = respuesta.tipo;

                if (resultado === 'correcto') {
                    // se agregó correctamente
                    if (tipo === 'crear') {
                        // Seleccionar el parrafo con la lista vacia
                        var parrafoListaVacia = document.querySelectorAll('.lista-vacia');
                        if (parrafoListaVacia.length > 0) {
                            document.querySelector('.lista-vacia').remove();
                        }

                        // Se creo una nueva tarea
                        // Inyectar en el HTML
                        var nuevaTarea = document.createElement('li');

                        // Agregamos el ID
                        nuevaTarea.id = 'tarea:' + id_insertado;

                        // Agregar la clase tarea
                        nuevaTarea.classList.add('tarea');

                        // Costruir el HTML
                        nuevaTarea.innerHTML = `
                            <p>${tarea}</p>
                            <div class="acciones">
                                <i class="far fa-check-circle"></i>
                                <i class="fas fa-trash"></i>
                            </div>
                        `;
                        // Agregarlo al HTML
                        var listado = document.querySelector('.listado-pendientes ul');
                        listado.appendChild(nuevaTarea);

                        // Limpiar el formulario
                        document.querySelector('.agregar-tarea').reset();

                        // Actualizar el progreso
                        actualizarProgreso();

                        // lanzar alerta
                        Swal.fire({
                            type: 'success',
                            title: 'Tarea creada',
                            text: 'La tarea ' + tarea + ' se creo correctamente'
                        })

                    }
                } else {
                    // hubo un error
                    Swal.fire({
                        type: 'error',
                        title: 'Error!',
                        text: 'Hubo un error!'
                    })
                }
            }
        }
        // Enviar la consulta
        xhr.send(datos);
    }    
}

// Cambia el estado de las tareas o las elimina
function accionesTareas(e) {
    e.preventDefault();

    if (e.target.classList.contains('fa-check-circle')) {
        if (e.target.classList.contains('completo')) {
            e.target.classList.remove('completo');
            cambiarEstadoTarea(e.target, 0);
        } else {
            e.target.classList.add('completo');
            cambiarEstadoTarea(e.target, 1);
        }
    } 

    if (e.target.classList.contains('fa-trash')) {
        Swal.fire({
            title: 'Seguro(a)?',
            text: 'Esta acción no se puede deshacer',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Si, borrar!',
            cancelButtonText: 'Cancelar'
        }).then((result) => {
            if (result.value) {

                var tareaEliminar = e.target.parentElement.parentElement;
                // Borrar de la BD
                eliminarTareaBD(tareaEliminar);

                // Borrar del HTML
                tareaEliminar.remove();
                

                Swal.fire(
                'Eliminado!',
                'La tarea fue eliminada',
                'success'
                )
            }
        })
    } 
    
}

// Completa o descompleta una tarea
function cambiarEstadoTarea(tarea, estado) {
    var idTarea = tarea.parentElement.parentElement.id.split(':');
    
    // Crear llamado a ajax
    var xhr = new XMLHttpRequest();

    // Información
    var datos = new FormData();
    datos.append('id', idTarea[1]);
    datos.append('accion', 'actualizar');
    datos.append('estado', estado);    

    // Abrir la conexion
    xhr.open('POST', 'inc/modelos/modelo-tareas.php', true);

    // on load
    xhr.onload = function () {
        if (this.status === 200) {
            console.log(JSON.parse(xhr.responseText));
            // Actualizar el progreso
            actualizarProgreso();
        }
    }

    // Enviar la petición
    xhr.send(datos);
}


// Elimina las tareas de la base de datos
function eliminarTareaBD(tarea) {
    var idTarea = tarea.id.split(':');
    
    // Crear llamado a ajax
    var xhr = new XMLHttpRequest();

    // Información
    var datos = new FormData();
    datos.append('id', idTarea[1]);
    datos.append('accion', 'eliminar');  

    // Abrir la conexion
    xhr.open('POST', 'inc/modelos/modelo-tareas.php', true);

    // on load
    xhr.onload = function () {
        if (this.status === 200) {
            console.log(JSON.parse(xhr.responseText));

            // Comprobar que haya tareas restantes
            var listaTareasRestantes = document.querySelectorAll('li.tarea');
            if (listaTareasRestantes.length === 0) {
                document.querySelector('.listado-pendientes ul').innerHTML = "<p class='lista-vacia'>No hay tareas en este proyecto</p>";
            }

            // Actualizar el progreso
            actualizarProgreso();
        }
    }

    // Enviar la petición
    xhr.send(datos);    
}


// Actualiza el avance del proyecto
function actualizarProgreso() {
    // Obtener todas las tareas
    const tareas = document.querySelectorAll('li.tarea');

    // Obtener las tareas completadas
    const tareasCompletadas = document.querySelectorAll('i.completo');

    // Determinar el avance
    const avance = Math.round( (tareasCompletadas.length / tareas.length) * 100 );

    const porcentaje = document.querySelector('#porcentaje');
    porcentaje.style.width = avance+'%';

    if (avance === 100) {
        Swal.fire({
            type: 'success',
            title: 'Proyecto terminado',
            text: 'Ya no tienes tareas pendientes!'
        })
    }
}
