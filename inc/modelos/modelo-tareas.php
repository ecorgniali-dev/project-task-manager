<?php

$accion = isset($_POST['accion']) ? $_POST['accion'] : false;
$id_proyecto = isset($_POST['id_proyecto']) ? (int) $_POST['id_proyecto'] : false;
$tarea = isset($_POST['tarea']) ? $_POST['tarea'] : false;
$estado = isset($_POST['estado']) ? $_POST['estado'] : false;
$id_tarea = isset($_POST['id']) ? (int) $_POST['id'] : false;

if ($accion === 'crear') {
    // Importar la conexion
    include '../funciones/conexion.php';

    try {
        // Realizar la consulta a la base de datos
        $stmt = $conn->prepare("INSERT INTO tareas (nombre, id_proyecto) VALUES (?, ?) ");
        $stmt->bind_param('si', $tarea, $id_proyecto);
        $stmt->execute();
        if ($stmt->affected_rows > 0) {
            $respuesta = array(
                'respuesta' => 'correcto',
                'id_insertado' => $stmt->insert_id,
                'tipo' => $accion,
                'tarea' => $tarea
            );
        } else {
            $respuesta = array(
                'respuesta' => 'error'
            );
        }     
        $stmt->close();
        $conn->close();
    } catch (Exception $e) {
        // En caso de un error, tomar la excepcion
        $respuesta = array(
            'error' => $e->getMessage()
        );
    }    

    echo json_encode($respuesta);
}


if ($accion === 'actualizar') {
    // Importar la conexion
    include '../funciones/conexion.php';

    try {
        // Realizar la consulta a la base de datos
        $stmt = $conn->prepare("UPDATE tareas set estado = ? WHERE id = ? ");
        $stmt->bind_param('ii', $estado, $id_tarea);
        $stmt->execute();
        if ($stmt->affected_rows > 0) {
            $respuesta = array(
                'respuesta' => 'correcto'
            );
        } else {
            $respuesta = array(
                'respuesta' => 'error'
            );
        }     
        $stmt->close();
        $conn->close();
    } catch (Exception $e) {
        // En caso de un error, tomar la excepcion
        $respuesta = array(
            'error' => $e->getMessage()
        );
    }    

    echo json_encode($respuesta);
}


if ($accion === 'eliminar') {
    // Importar la conexion
    include '../funciones/conexion.php';

    try {
        // Realizar la consulta a la base de datos
        $stmt = $conn->prepare("DELETE from tareas WHERE id = ? ");
        $stmt->bind_param('i', $id_tarea);
        $stmt->execute();
        if ($stmt->affected_rows > 0) {
            $respuesta = array(
                'respuesta' => 'correcto'
            );
        } else {
            $respuesta = array(
                'respuesta' => 'error'
            );
        }     
        $stmt->close();
        $conn->close();
    } catch (Exception $e) {
        // En caso de un error, tomar la excepcion
        $respuesta = array(
            'error' => $e->getMessage()
        );
    }    

    echo json_encode($respuesta);
}