// Mascotas postuladas (en proceso de adopción)
function getMascotasPostuladas() {
    return JSON.parse(localStorage.getItem('mascotasPostuladas')) || [];
}

function marcarMascotaComoPostulada(idMascota) {
    let postuladas = getMascotasPostuladas();
    if (!postuladas.includes(idMascota)) {
        postuladas.push(idMascota);
        localStorage.setItem('mascotasPostuladas', JSON.stringify(postuladas));
    }
}

function eliminarMascotaPostulada(idMascota) {
    let postuladas = getMascotasPostuladas();
    postuladas = postuladas.filter(id => id !== idMascota);
    localStorage.setItem('mascotasPostuladas', JSON.stringify(postuladas));
}

// Historial de solicitudes
function getHistorialAdopciones() {
    return JSON.parse(localStorage.getItem('historialAdopciones')) || [];
}

function guardarHistorialAdopciones(historial) {
    localStorage.setItem('historialAdopciones', JSON.stringify(historial));
}

function agregarAlHistorial(solicitud) {
    let historial = getHistorialAdopciones();
    solicitud.idUnico = Date.now();
    historial.push(solicitud);
    guardarHistorialAdopciones(historial);
}

function vaciarHistorial() {
    localStorage.removeItem('historialAdopciones');
    localStorage.removeItem('mascotasPostuladas');
}

// Mascotas del catálogo local
function getMascotasCatalogo() {
    return JSON.parse(localStorage.getItem('mascotasCatalogo')) || [];
}

function guardarMascotasCatalogo(mascotas) {
    localStorage.setItem('mascotasCatalogo', JSON.stringify(mascotas));
}

function agregarMascotaCatalogo(mascota) {
    let mascotasLocal = getMascotasCatalogo();
    mascotasLocal.push(mascota);
    guardarMascotasCatalogo(mascotasLocal);
}

function eliminarMascotaDelCatalogo(idMascota) {
    let mascotasLocal = getMascotasCatalogo();
    mascotasLocal = mascotasLocal.filter(p => p.id !== idMascota);
    guardarMascotasCatalogo(mascotasLocal);
}