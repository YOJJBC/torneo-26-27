async function cargarDatos() {
    const respuesta = await fetch("data.json");
    const datos = await respuesta.json();
    generarClasificacion(datos);
    generarJornadas(datos);
    generarResultados(datos);
}

function mostrarSeccion(id) {
    document.querySelectorAll(".seccion").forEach(sec => sec.style.display = "none");
    document.getElementById(id).style.display = "block";
}

function generarClasificacion(datos) {
    const tabla = document.getElementById("tabla-clasificacion");
    tabla.innerHTML = `
        <tr>
            <th>Equipillos</th>
            <th>Puntos</th>
            <th>GF</th>
            <th>GC</th>
        </tr>
    `;

    const stats = {};

    datos.equipos.forEach(e => stats[e] = { puntos: 0, gf: 0, gc: 0 });

    datos.jornadas.forEach(j => {
        j.partidos.forEach(p => {
            stats[p.local].gf += p.golesLocal;
            stats[p.local].gc += p.golesVisitante;

            stats[p.visitante].gf += p.golesVisitante;
            stats[p.visitante].gc += p.golesLocal;

            if (p.golesLocal > p.golesVisitante) stats[p.local].puntos += 3;
            else if (p.golesLocal < p.golesVisitante) stats[p.visitante].puntos += 3;
            else {
                stats[p.local].puntos += 1;
                stats[p.visitante].puntos += 1;
            }
        });
    });

    datos.equipos.forEach(e => {
        tabla.innerHTML += `
            <tr>
                <td>${e}</td>
                <td>${stats[e].puntos}</td>
                <td>${stats[e].gf}</td>
                <td>${stats[e].gc}</td>
            </tr>
        `;
    });
}

function generarJornadas(datos) {
    const cont = document.getElementById("lista-jornadas");
    datos.jornadas.forEach(j => {
        cont.innerHTML += `<h3>Jornada ${j.numero}</h3>`;
        j.partidos.forEach(p => {
            cont.innerHTML += `<p>${p.local} ${p.golesLocal} - ${p.golesVisitante} ${p.visitante}</p>`;
        });
    });
}

function generarResultados(datos) {
    const cont = document.getElementById("lista-resultados");
    datos.jornadas.forEach(j => {
        j.partidos.forEach(p => {
            cont.innerHTML += `<p>${p.local} ${p.golesLocal} - ${p.golesVisitante} ${p.visitante}</p>`;
        });
    });
}

cargarDatos();
