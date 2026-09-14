"use strict";
const {preguntar} = require('./io.js');
//revisar que este todo 
const listaDeTareas = [];

function crearTarea(titulo, descripcion, vencimiento, dificultad) {
    return {
        Id: listaDeTareas.length + 1,
        Titulo: titulo,
        Descripcion: descripcion,
        Estado: "Pendiente",
        Fecha: new Date(),
        UltimaEdicion: new Date(),
        Vencimiento: vencimiento,
        Dificultad: dificultad
    };
}

function convertirFecha(fechaIngresada) {
    if (fechaIngresada.trim() === "") {
        return null;
    }

    const partes = fechaIngresada.split("/");
    if (partes.length !== 3) {
        return undefined;
    }

    const dia = Number(partes[0]);
    const mes = Number(partes[1]) - 1;
    const anio = Number(partes[2]);
    const fecha = new Date(anio, mes, dia);

    if (fecha.getFullYear() !== anio || fecha.getMonth() !== mes || fecha.getDate() !== dia) {
        return undefined;
    }

    return fecha;
}

function mostrarFecha(fecha) {
    if (!fecha) {
        return "Sin datos";
    }

    return new Date(fecha).toLocaleDateString();
}

async function agregarTarea() {
    
    console.log(`Estas creando una nueva tarea.`);


    let titulo = await preguntar("1.Ingrese el titulo:");
    while (titulo.trim().length === 0 || titulo.length > 100) {
        console.log("ERROR. El titulo es obligatorio y debe tener hasta 100 caracteres.\n");
        titulo = await preguntar("1.Ingrese el titulo:");
    }

    let descripcion = await preguntar("2. Ingrese la descripcion:");
    while (descripcion.length > 500) {
        console.log("ERROR. La descripcion debe tener hasta 500 caracteres.\n");
        descripcion = await preguntar("2. Ingrese la descripcion:");
    }

    let dificultad = await seleccionarDificultad();

    let vencimiento = await preguntar("Fecha de vencimiento DD/MM/AAAA (Enter para omitir): ");
    vencimiento = convertirFecha(vencimiento);
    while (vencimiento === undefined) {
        vencimiento = await preguntar("Fecha invalida. Ingrese DD/MM/AAAA o presione Enter: ");
        vencimiento = convertirFecha(vencimiento);
    }

    listaDeTareas.push(crearTarea(titulo, descripcion, vencimiento, dificultad));
    console.log('¡Datos guardados!.');
    
}

async function seleccionarDificultad(dificultadAnterior) {
    
    let respuesta = await preguntar("Dificultad [1] Fácil [2] Medio [3] Difícil (Enter para mantener):");
    if (respuesta.trim() === "") {
        return dificultadAnterior || "⭐";
    }

    let opcion = parseInt(respuesta, 10);

    while (Number.isNaN(opcion) || opcion < 1 || opcion > 3) {
        console.log("ERROR. Opcion incorrecta! Vuelva a intentarlo:");
        respuesta = await preguntar("Dificultad [1] Fácil [2] Medio [3] Difícil:");
        opcion = parseInt(respuesta, 10);
    }

    switch (opcion) {
        case 1: return "⭐";
        case 2: return "⭐⭐";
        case 3: return "⭐⭐⭐";
    }
}

async function seleccionarEstado()
{
    let opcion = parseInt(await preguntar("Estado ([1] Pendiente / [2] En curso / [3] Terminada / [4] Cancelada):"), 10);
    
        while(Number.isNaN(opcion) || opcion <1 || opcion>4)
        {
            console.log("ERROR. Opcion incorrecta! Vuelva a intentarlo: \n");
            opcion = parseInt(await preguntar("Estado ([1] Pendiente / [2] En curso / [3] Terminada / [4] Cancelada):"), 10);
        }

        switch(opcion)
        {
            case 1:
                return "Pendiente";
            case 2:
                return "En curso";
            case 3:
                return "Terminada";
            case 4:
                return "Cancelada";   
        }
}


async function mostrarTareas(filtro)
{
    let verTareas = listaDeTareas;
    if(listaDeTareas.length === 0)
    {
        console.log("ERROR. Debe agregar al menos una tarea. \n");
    }
    else
    {
        if(filtro !== 1)
        {
            verTareas = listaDeTareas.filter(tarea => tarea.Estado === filtro);
        }

        if (verTareas.length === 0) {
            console.log("No hay tareas que coincidan con ese filtro.\n");
            return;
        }

        console.log("Estas son tus tareas.");
        verTareas.forEach(tarea => 
        {
            console.log(`${tarea.Id} ${tarea.Titulo}\n`); 
        });

        await verTareaEspecifica(verTareas);
    }
}

async function verTareaEspecifica(tareasDisponibles = listaDeTareas)
{
    let idIngresado, opcion;

    console.log(`
            ¿Deseas ver los detalles de alguna?
            Introduce el numero para verla o 0 para volver.
            `);

                idIngresado = parseInt(await preguntar("Numero: "),10);
                    if(idIngresado === 0)
                    {
                        return;
                    }else
                    {

                            let tareaElegida = tareasDisponibles.find(tarea =>Number(tarea.Id) === idIngresado);

                            while(!tareaElegida)
                            {
                                console.log("ERROR. Ese numero no existe, vuelva a intentarlo: \n");
                                idIngresado = parseInt(await preguntar("Numero: "),10);
                                if(idIngresado === 0)
                                {
                                    return;
                                }
                                
                                tareaElegida = tareasDisponibles.find(tarea =>Number(tarea.Id) === idIngresado);
                            }

                            console.log('Esta es la tarea que elegiste.\n');

                            console.log("Titulo: ", tareaElegida.Titulo);
                            console.log("Descripcion: ", tareaElegida.Descripcion || "Sin datos");
                            console.log("Estado: ", tareaElegida.Estado);
                            console.log("Dificultad: ", tareaElegida.Dificultad);
                            console.log("Vencimiento: ", mostrarFecha(tareaElegida.Vencimiento));
                            console.log("Creacion: ", mostrarFecha(tareaElegida.Fecha));
                            console.log("Ultima edicion: ", mostrarFecha(tareaElegida.UltimaEdicion));

                            console.log("Si deseas editarla, presiona 1, o presiona 0 para volver.\n");

                            opcion = parseInt(await preguntar("Ingrese una opcion:"),10);
                                while(Number.isNaN(opcion) || opcion<0 || opcion>1)
                                {
                                    console.log("ERROR. Esa opcion no existe, vuelva a intentarlo: \n");
                                    opcion = parseInt(await preguntar("Ingrese una opcion:"),10);
                                }
                            if(opcion === 0)
                            {
                                return;
                            }
                            else
                            {
                                await modificarTarea(tareaElegida.Titulo, tareaElegida.Id);
                            }

                    }

                    

}


async function modificarTarea(tituloTarea, idTarea){

    let op=0;
    do
    {

        console.log('Estas editando la tarea ', tituloTarea);
        
            console.log(`
            ===================================
            ¿Que deseas modificar?
            [1] Titulo.
            [2] Descripcion.
            [3] Estado ([1] Pendiente / [2] En curso / [3] Terminada / [4] Cancelada).
            [4] Dificultad [1] Fácil [2] Medio [3] Difícil.
            [5] Vencimiento.
            [0] Salir.

            Nota: si deseas dejar en blanco un atributo, escribe un espacio y presiona Enter.
            ===================================`);

            op = parseInt(await preguntar("Ingrese una opcion:"), 10);

            while(Number.isNaN(op) || op<0 || op>5)
            {
                console.log("ERROR. Opcion incorrecta, vuelva a intentarlo: \n");
                op = parseInt(await preguntar("Ingrese la opción: "), 10);

            }

            let tareaEditada = listaDeTareas.find( tarea => Number(tarea.Id) === idTarea);

            switch(op)
            {

                case 1:
                    let nuevoTitulo = await preguntar("Ingrese el nuevo titulo (Enter para mantener): ");
                    if (nuevoTitulo.trim() !== "") {
                        while (nuevoTitulo.length > 100) {
                            console.log("ERROR. El titulo debe tener hasta 100 caracteres.");
                            nuevoTitulo = await preguntar("Ingrese el nuevo titulo: ");
                        }
                        tareaEditada.Titulo = nuevoTitulo;
                    }
                    tareaEditada.UltimaEdicion = new Date();
                    console.log('¡Datos guardados!.');
                break;
                case 2:
                    let nuevaDescripcion = await preguntar("Ingrese la nueva descripcion (Enter para mantener): ");
                    if (nuevaDescripcion === " ") {
                        tareaEditada.Descripcion = "";
                    } else if (nuevaDescripcion.trim() !== "") {
                        while (nuevaDescripcion.length > 500) {
                            console.log("ERROR. La descripcion debe tener hasta 500 caracteres.");
                            nuevaDescripcion = await preguntar("Ingrese la nueva descripcion: ");
                        }
                        tareaEditada.Descripcion = nuevaDescripcion;
                    }
                    tareaEditada.UltimaEdicion = new Date();
                    console.log('¡Datos guardados!.');
                break;
                case 3:
                    tareaEditada.Estado = await seleccionarEstado();
                    tareaEditada.UltimaEdicion = new Date();
                    console.log('¡Datos guardados!.');
                break;
                case 4:
                    tareaEditada.Dificultad = await seleccionarDificultad(tareaEditada.Dificultad);
                    tareaEditada.UltimaEdicion = new Date();
                    console.log('¡Datos guardados!.');
                break;
                case 5:
                    let nuevaFecha = await preguntar("Ingrese el vencimiento DD/MM/AAAA (Enter para mantener): ");
                    if (nuevaFecha === " ") {
                        tareaEditada.Vencimiento = null;
                    } else if (nuevaFecha.trim() !== "") {
                        let fechaConvertida = convertirFecha(nuevaFecha);
                        while (fechaConvertida === undefined) {
                            nuevaFecha = await preguntar("Fecha invalida. Ingrese DD/MM/AAAA: ");
                            fechaConvertida = convertirFecha(nuevaFecha);
                        }
                        tareaEditada.Vencimiento = fechaConvertida;
                    }
                    tareaEditada.UltimaEdicion = new Date();
                    console.log('¡Datos guardados!.');
                break;
            }
    }while(op!=0);

}

async function buscarTarea() {

    let tituloBuscado;

    if(listaDeTareas.length === 0)
    {
        console.log("ERROR. Debe ingresar al menos una tarea. \n");
        return;
    }
    else
    {

        tituloBuscado = await preguntar("Introduce una palabra del titulo para buscarla: ");

        const tareasEncontradas = listaDeTareas.filter(tarea =>
            tarea.Titulo.toLowerCase().includes(tituloBuscado.toLowerCase())
        );

        if (tareasEncontradas.length === 0) {
            console.log("No hay tareas relacionadas con la busqueda.\n");
            return;
        }

        console.log("Estas son las tareas relacionadas:\n");
        tareasEncontradas.forEach(tarea => {
            console.log(`${tarea.Id} ${tarea.Titulo}\n`);
        });

        await verTareaEspecifica(tareasEncontradas);
    }

}

module.exports = { agregarTarea, mostrarTareas, buscarTarea, listaDeTareas };