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

function generarIdMascota() {
    // El JSON base llega hasta PET010, empezamos desde PET011
    const BASE_INICIO = 11;
    let ultimo = parseInt(localStorage.getItem('ultimoIdMascota') || (BASE_INICIO - 1).toString(), 10);
    let siguiente = ultimo + 1;
    localStorage.setItem('ultimoIdMascota', siguiente.toString());
    return 'PET' + String(siguiente).padStart(3, '0');
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
    let historial = getHistorialAdopciones();
    let postuladas = getMascotasPostuladas();
    
    // IDs de mascotas que actualmente están en proceso de adopción (postulado)
    let idsPostulados = historial
        .filter(s => s.tipo === 'adopcion' && s.estado === 'postulado')
        .map(s => s.id);
        
    // Filtramos las postuladas para quitar las que acabamos de cancelar al vaciar el historial,
    // pero mantenemos las que ya habían sido aceptadas (para que sigan ocultas del catálogo).
    let nuevasPostuladas = postuladas.filter(id => !idsPostulados.includes(id));
    
    localStorage.setItem('mascotasPostuladas', JSON.stringify(nuevasPostuladas));
    localStorage.removeItem('historialAdopciones');
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