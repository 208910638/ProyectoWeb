document.addEventListener('DOMContentLoaded', function() {
    renderizarHistorial();

    const btnVaciar = document.getElementById('btnVaciarHistorial');
    if (btnVaciar) {
        btnVaciar.addEventListener('click', function() {
            Swal.fire({
                title: '¿Vaciar historial?',
                text: 'Esta acción eliminará todas las solicitudes del historial.',
                icon: 'warning',
                showCancelButton: true,
                confirmButtonColor: '#d33',
                cancelButtonColor: '#6c757d',
                confirmButtonText: 'Sí, vaciar',
                cancelButtonText: 'Cancelar'
            }).then((result) => {
                if (result.isConfirmed) {
                    vaciarHistorial();
                    renderizarHistorial();
                    Swal.fire({
                        icon: 'info',
                        title: 'Historial vaciado',
                        text: 'Todas las solicitudes han sido eliminadas.',
                        confirmButtonColor: '#2A5A46',
                        timer: 1500
                    });
                }
            });
        });
    }

    // Referencias del banner
    const banner = document.getElementById('mascotaBanner');
    const bannerNombre = document.getElementById('mascotaBannerNombre');
    const bannerId = document.getElementById('mascotaBannerId');
    const bannerEspecie = document.getElementById('mascotaBannerEspecie');
    const bannerSexo = document.getElementById('mascotaBannerSexo');
    const btnCancelar = document.getElementById('btnCancelarSeleccion');

    // Lee parámetros de la URL
    function getParams() {
        const params = new URLSearchParams(window.location.search);
        return {
            id: params.get('id'),
            nombre: params.get('nombre'),
            especie: params.get('especie'),
            sexo: params.get('sexo'),
            edad: params.get('edad'),
            peso: params.get('peso')
        };
    }

    const params = getParams();

    function mostrarBanner(datos) {
        if (!banner) return;
        
        if (bannerNombre) bannerNombre.textContent = datos.nombre || '';
        if (bannerId) bannerId.textContent = datos.id || '';
        if (bannerEspecie) bannerEspecie.textContent = datos.especie || '';
        if (bannerSexo) bannerSexo.textContent = datos.sexo || '';
        
        banner.hidden = false;
    }

    function cancelarSeleccion() {
        if (banner) banner.hidden = true;
        
        const form = document.getElementById('formPostulacion');
        if (form) {
            const idInput = document.getElementById('id-mascota-form-adopcion');
            const nombreInput = document.getElementById('nombre-mascota-form-adopcion');
            const especieSelect = document.getElementById('tipo-mascota-form-adopcion');
            const edadInput = document.getElementById('edad-form-adopcion');
            const pesoInput = document.getElementById('peso-form-adopcion');
            
            if (idInput) idInput.value = '';
            if (nombreInput) nombreInput.value = '';
            if (especieSelect) especieSelect.selectedIndex = 0;
            if (edadInput) edadInput.value = '';
            if (pesoInput) pesoInput.value = '';
            
            const radios = document.querySelectorAll('input[name="sexo_form_adopcion"]');
            radios.forEach(radio => radio.checked = false);
        }
        
        if (window.history && window.history.pushState) {
            const url = window.location.pathname;
            window.history.pushState({}, document.title, url);
        }
        
        Swal.fire({
            icon: 'info',
            title: 'Selección cancelada',
            text: 'Puedes volver al catálogo para elegir otra mascota.',
            confirmButtonColor: '#6c757d',
            confirmButtonText: 'Ir al catálogo',
            showCancelButton: true,
            cancelButtonColor: '#6c757d',
            cancelButtonText: 'Seguir aquí'
        }).then((result) => {
            if (result.isConfirmed) {
                window.location.href = 'catalogo.html';
            }
        });
    }

    if (btnCancelar) {
        btnCancelar.addEventListener('click', cancelarSeleccion);
    }

    // Si hay parámetros, llena el formulario
    if (params.id && params.nombre) {
        setTimeout(function() {
            const idInput = document.getElementById('id-mascota-form-adopcion');
            const nombreInput = document.getElementById('nombre-mascota-form-adopcion');
            if (idInput) idInput.value = params.id;
            if (nombreInput) nombreInput.value = params.nombre;
            
            // Buscar la mascota completa para auto-completar los demás campos
            fetch('data/mascotas.json')
                .then(response => response.json())
                .then(data => {
                    const mascotasLocal = getMascotasCatalogo();
                    const todasMascotas = [...data, ...mascotasLocal];
                    const mascota = todasMascotas.find(p => p.id === params.id);
                    
                    if (mascota) {
                        const especieSelect = document.getElementById('tipo-mascota-form-adopcion');
                        const edadInput = document.getElementById('edad-form-adopcion');
                        const pesoInput = document.getElementById('peso-form-adopcion');
                        
                        if (especieSelect) especieSelect.value = mascota.especie.toLowerCase() || '';
                        if (edadInput) edadInput.value = mascota.edad || '';
                        if (pesoInput) pesoInput.value = mascota.peso || '';
                        
                        if (mascota.sexo) {
                            const radios = document.querySelectorAll('input[name="sexo_form_adopcion"]');
                            radios.forEach(radio => {
                                if (radio.value.toLowerCase() === mascota.sexo.toLowerCase()) {
                                    radio.checked = true;
                                }
                            });
                        }
                        
                        mostrarBanner({
                            id: mascota.id,
                            nombre: mascota.nombre,
                            especie: mascota.especie,
                            sexo: mascota.sexo
                        });
                    } else {
                        // Si no la encuentra (raro), usa lo que venía en URL
                        mostrarBanner({
                            id: params.id,
                            nombre: params.nombre,
                            especie: params.especie,
                            sexo: params.sexo
                        });
                    }
                })
                .catch(error => {
                    console.error('Error buscando detalles de mascota:', error);
                    mostrarBanner({
                        id: params.id,
                        nombre: params.nombre
                    });
                });
            
        }, 150);
    }

    function parseEdadAños(str) {
        if (!str) return 0;
        str = str.toString().toLowerCase().trim();
        let m = 0;
        let years = str.match(/(\d+)\s*(año|a)/);
        if (years) m += parseInt(years[1]) * 12;
        let months = str.match(/(\d+)\s*(mes|m)/);
        if (months) m += parseInt(months[1]);
        if (years || months) return m / 12;
        let numMatch = str.match(/(\d+(\.\d+)?)/);
        if (numMatch) return parseFloat(numMatch[1]);
        return 0;
    }

    function parsePesoKg(str) {
        if (!str) return 0;
        str = str.toString().toLowerCase().trim();
        let numMatch = str.match(/(\d+(\.\d+)?)/);
        if (numMatch) return parseFloat(numMatch[1]);
        return 0;
    }

    window.validarMascota = function(id, nombre, especie, sexo, edad, peso) {
        return fetch('data/mascotas.json')
            .then(response => response.json())
            .then(data => {
                const mascotasLocal = getMascotasCatalogo();
                const todasMascotas = [...data, ...mascotasLocal];
                const postuladas = getMascotasPostuladas();
                const mascotasDisponibles = todasMascotas.filter(m => m.permanente || !postuladas.includes(m.id));
                
                if (!id) {
                    // Modo match (Recomendaciones)
                    let edadUser = parseEdadAños(edad);
                    let pesoUser = parsePesoKg(peso);
                    
                    let coincidencias = mascotasDisponibles.filter(m => {
                        let match = true;
                        if (especie && m.especie.toLowerCase() !== especie.toLowerCase()) match = false;
                        if (sexo && m.sexo.toLowerCase() !== sexo.toLowerCase()) match = false;
                        
                        let edadMascota = parseEdadAños(m.edad);
                        let pesoMascota = parsePesoKg(m.peso);
                        
                        // Tolerancia de 3 años y 10 kg para match
                        if (Math.abs(edadMascota - edadUser) > 3) match = false;
                        if (Math.abs(pesoMascota - pesoUser) > 10) match = false;
                        
                        return match;
                    });
                    
                    if (coincidencias.length === 0) {
                        return { 
                            valido: false, 
                            icon: 'info',
                            title: 'Sin coincidencias exactas',
                            mensaje: `No encontramos mascotas disponibles que coincidan exactamente con tus preferencias. ¡Pero te invitamos a revisar el catálogo completo!` 
                        };
                    }
                    
                    let htmlRecomendaciones = '<div style="text-align: left; max-height: 300px; overflow-y: auto;">';
                    coincidencias.forEach(m => {
                        htmlRecomendaciones += `
                            <div style="border: 1px solid #ddd; padding: 10px; margin-bottom: 10px; border-radius: 5px; display: flex; gap: 10px; align-items: center;">
                                <img src="${m.imagen}" alt="${m.nombre}" style="width: 60px; height: 60px; object-fit: cover; border-radius: 5px;">
                                <div>
                                    <strong style="color: #2A5A46">${m.nombre}</strong> (ID: <strong>${m.id}</strong>)<br>
                                    <small>${m.especie} · ${m.sexo} · ${m.edad} · ${m.peso}</small>
                                </div>
                            </div>
                        `;
                    });
                    htmlRecomendaciones += '</div><p style="margin-top: 10px; font-size: 0.9em;">Copia el <strong>ID</strong> de tu favorita y colócalo en el campo de Mascota Seleccionada.</p>';
                    
                    return {
                        valido: false,
                        icon: 'success',
                        title: '¡Encontramos posibles matches!',
                        mensaje: htmlRecomendaciones
                    };
                }
                
                // Validación con ID
                const mascota = todasMascotas.find(p => p.id === id);
                
                if (!mascota) {
                    return { 
                        valido: false, 
                        mensaje: `<i class=\"fa-solid fa-triangle-exclamation\"></i> No existe ninguna mascota con el ID: ${id}` 
                    };
                }
                
                const errores = [];
                
                if (nombre && mascota.nombre.trim().toLowerCase() !== nombre.trim().toLowerCase()) {
                    errores.push(`<i class=\"fa-solid fa-pen\"></i> Nombre: "${mascota.nombre.trim()}" ≠ "${nombre}"`);
                }
                
                if (mascota.especie.trim().toLowerCase() !== especie.trim().toLowerCase()) {
                    errores.push(`<i class=\"fa-solid fa-paw\"></i> Especie: "${mascota.especie}" ≠ "${especie}"`);
                }
                
                if (mascota.sexo.trim().toLowerCase() !== sexo.trim().toLowerCase()) {
                    errores.push(`<i class=\"fa-solid fa-venus-mars\"></i> Sexo: "${mascota.sexo}" ≠ "${sexo}"`);
                }
                
                const edadMascotaNum = parseEdadAños(mascota.edad);
                const edadInputNum = parseEdadAños(edad);
                // Tolerancia de redondeo para edad
                if (Math.abs(edadMascotaNum - edadInputNum) > 0.2) {
                    errores.push(`<i class=\"fa-solid fa-calendar\"></i> Edad: "${mascota.edad}" ≠ lo ingresado`);
                }
                
                const pesoMascotaNum = parsePesoKg(mascota.peso);
                const pesoInputNum = parsePesoKg(peso);
                if (pesoMascotaNum !== pesoInputNum) {
                    errores.push(`<i class=\"fa-solid fa-scale-balanced\"></i> Peso: "${mascota.peso}" ≠ lo ingresado`);
                }
                
                if (errores.length > 0) {
                    return {
                        valido: false,
                        mensaje: `<i class=\"fa-solid fa-circle-xmark\"></i> Los datos no coinciden con la mascota "${mascota.nombre}" (ID: ${mascota.id}):\n\n${errores.join('\n')}`,
                        errores: errores
                    };
                }
                
                return { valido: true, mascota: mascota };
            })
            .catch(error => {
                console.error('Error validando mascota:', error);
                return { valido: true, error: true };
            });
    }

    function reiniciarStepper(form) {
        const stepper = form.querySelector('.step-navigation');
        if (stepper) {
            const allFieldsets = form.querySelectorAll('fieldset.form-group');
            allFieldsets.forEach(f => f.style.display = 'none');
            
            const firstFieldset = form.querySelector('fieldset.form-group');
            if (firstFieldset) {
                firstFieldset.style.display = 'block';
                const counter = stepper.querySelector('.step-counter');
                if (counter) {
                    counter.textContent = 'Paso 1 de ' + allFieldsets.length;
                }
                const btnPrev = stepper.querySelector('.btn-step:first-child');
                const btnNext = stepper.querySelector('.btn-step:last-child');
                if (btnPrev) btnPrev.disabled = true;
                if (btnNext) {
                    btnNext.style.display = 'inline-flex';
                    btnNext.innerHTML = 'Siguiente <i class="fa-solid fa-arrow-right"></i>';
                    btnNext.className = 'btn-step btn-step-primary';
                }
                const btnSubmit = form.querySelector('.btn-submit');
                if (btnSubmit) btnSubmit.style.display = 'none';
            }
        }
    }

    function enviarSolicitudAdopcion(form) {
        const idMascota = document.getElementById('id-mascota-form-adopcion').value.trim();
        const nombreMascota = document.getElementById('nombre-mascota-form-adopcion').value.trim();
        const nombreAdoptante = document.getElementById('nombre-form-adopcion').value;
        const emailAdoptante = document.getElementById('email-form-adopcion').value;
        const telefonoAdoptante = document.getElementById('telefono-form-adopcion').value;
        
        const provinciaSelect = document.getElementById('provincia-form-adopcion');
        const provinciaMap = {
            'sanjose': 'San José',
            'alajuela': 'Alajuela',
            'cartago': 'Cartago',
            'heredia': 'Heredia',
            'guanacaste': 'Guanacaste',
            'puntarenas': 'Puntarenas',
            'limon': 'Limón'
        };
        const provinciaValue = provinciaSelect ? provinciaSelect.value : '';
        const provincia = provinciaMap[provinciaValue] || provinciaValue;
        
        const motivoAdopcion = document.getElementById('motivo-adopcion').value || 'Sin motivo especificado';
        
        const tienePatio = document.querySelector('input[name="tiene_patio"]:checked');
        const otrasMascotas = document.querySelector('input[name="otras_mascotas"]:checked');
        
        const especieSelect = document.getElementById('tipo-mascota-form-adopcion');
        const especie = especieSelect ? especieSelect.options[especieSelect.selectedIndex]?.text || '' : '';
        
        const sexoRadio = document.querySelector('input[name="sexo_form_adopcion"]:checked');
        const sexo = sexoRadio ? sexoRadio.value : '';
        
        marcarMascotaComoPostulada(idMascota);
        
        const datosAdopcion = {
            id: idMascota,
            nombre: nombreMascota,
            adoptante: nombreAdoptante,
            email: emailAdoptante,
            telefono: telefonoAdoptante,
            provincia: provincia,
            especie: especie,
            sexo: sexo,
            motivo: motivoAdopcion,
            tiene_patio: tienePatio ? tienePatio.value : 'no especificado',
            otras_mascotas: otrasMascotas ? otrasMascotas.value : 'no especificado',
            fecha: new Date().toLocaleString(),
            estado: 'postulado',
            tipo: 'adopcion'
        };
        
        agregarAlHistorial(datosAdopcion);
        renderizarHistorial();
        window.limpiarFormulario(form);
        
        if (banner) banner.hidden = true;
        
        if (window.history && window.history.pushState) {
            const url = window.location.pathname;
            window.history.pushState({}, document.title, url);
        }
        
        reiniciarStepper(form);
        if (window.resetStepper) window.resetStepper('formPostulacion');
        
        Swal.fire({
            icon: 'success',
            title: '¡Solicitud enviada!',
            text: `Tu solicitud de adopción para ${nombreMascota} ha sido enviada correctamente.`,
            confirmButtonColor: '#2A5A46'
        });
    }

    // Manejar envío del Formulario de Postulación
    const formPostulacion = document.getElementById('formPostulacion');
    if (formPostulacion) {
        formPostulacion.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const allFieldsets = this.querySelectorAll('fieldset.form-group');
            let valid = true;
            
            allFieldsets.forEach(fieldset => {
                if (fieldset.style.display !== 'none') {
                    const stepValid = window.validarPaso(this, fieldset);
                    if (!stepValid) valid = false;
                }
            });

            if (!valid) {
                Swal.fire({
                    icon: 'error',
                    title: 'Campos incompletos',
                    text: 'Por favor complete todos los campos obligatorios.',
                    confirmButtonColor: '#2A5A46'
                });
                return;
            }

            const idMascota = document.getElementById('id-mascota-form-adopcion').value.trim();
            const nombreMascota = document.getElementById('nombre-mascota-form-adopcion').value.trim();
            const especieMascota = document.getElementById('tipo-mascota-form-adopcion').value;
            const sexoMascota = document.querySelector('input[name="sexo_form_adopcion"]:checked');
            const edadMascota = document.getElementById('edad-form-adopcion').value.trim();
            const pesoMascota = document.getElementById('peso-form-adopcion').value.trim();
            
            if (!sexoMascota) {
                Swal.fire({
                    icon: 'error',
                    title: 'Sexo no seleccionado',
                    text: 'Por favor seleccione el sexo de la mascota.',
                    confirmButtonColor: '#2A5A46'
                });
                return;
            }
            
            const sexoValue = sexoMascota.value;
            
            Swal.fire({
                title: 'Verificando datos...',
                allowOutsideClick: false,
                didOpen: () => {
                    Swal.showLoading();
                }
            });

            window.validarMascota(idMascota, nombreMascota, especieMascota, sexoValue, edadMascota, pesoMascota)
                .then(resultado => {
                    Swal.close();
                    if (!resultado.valido) {
                        Swal.fire({
                            icon: resultado.icon || 'error',
                            title: resultado.title || 'Error de coincidencia',
                            html: resultado.mensaje.replace(/\n/g, '<br>'),
                            confirmButtonColor: '#2A5A46',
                            width: resultado.icon === 'success' ? '600px' : undefined
                        });
                        if (resultado.icon === 'success' || resultado.icon === 'info') {
                            window.limpiarFormulario(formPostulacion);
                            if (window.resetStepper) window.resetStepper('formPostulacion');
                        }
                        return;
                    }

                    if (resultado.error) {
                        Swal.fire({
                            icon: 'warning',
                            title: 'Advertencia',
                            text: 'No se pudo verificar la mascota. ¿Deseas continuar?',
                            confirmButtonColor: '#6c757d',
                            confirmButtonText: 'Ok',
                            showCancelButton: false
                        }).then((result) => {
                            if (result.isConfirmed) {
                                enviarSolicitudAdopcion(formPostulacion);
                            }
                        });
                        return;
                    }

                    enviarSolicitudAdopcion(formPostulacion);
                })
                .catch(error => {
                    console.error('Error en validación:', error);
                    Swal.close();
                    Swal.fire({
                        icon: 'warning',
                        title: '<i class="fa-solid fa-triangle-exclamation"></i> Advertencia',
                        text: 'No se pudo verificar la mascota. ¿Deseas continuar?',
                        confirmButtonColor: '#6c757d',
                        confirmButtonText: 'Ok',
                        showCancelButton: false
                    }).then((result) => {
                        if (result.isConfirmed) {
                            enviarSolicitudAdopcion(formPostulacion);
                        }
                    });
                });
        });
    }
});

// Se elimina la mascota
function manejarAceptar(id) {
    Swal.fire({
        title: '¿Confirmar acción?',
        text: 'La solicitud será aprobada y la mascota ya no estará disponible en el catálogo.',
        icon: 'question',
        showCancelButton: true,
        confirmButtonColor: '#2A5A46',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Sí, aceptar',
        cancelButtonText: 'Cancelar'
    }).then((result) => {
        if (result.isConfirmed) {
            let historial = getHistorialAdopciones();
            const index = historial.findIndex(s => s.idUnico === id);
            
            if (index !== -1) {
                const solicitud = historial[index];
                
                if (solicitud.tipo === 'publicacion' && solicitud.datos) {
                    // Publicación del refugio se publica en catálogo
                    const datos = solicitud.datos;
                    let foto = datos.foto || 'img/default.jpg';
                    
                    const nuevaMascota = {
                        id: datos.id,
                        nombre: datos.nombre,
                        especie: datos.especie,
                        sexo: datos.sexo,
                        edad: datos.edad,
                        peso: datos.peso,
                        raza: datos.raza,
                        tamanio: datos.tamanio,
                        provincia: datos.provincia,
                        descripcion: datos.descripcion || 'Mascota en busca de un hogar lleno de amor.',
                        imagen: foto,
                    };
                    
                    agregarMascotaCatalogo(nuevaMascota);
                    
                    historial[index].estado = 'aceptado';
                    guardarHistorialAdopciones(historial);
                    renderizarHistorial();
                    
                    Swal.fire({
                        icon: 'success',
                        title: '¡Publicación aprobada!',
                        text: `${datos.nombre} ya está disponible en el catálogo.`,
                        confirmButtonColor: '#2A5A46'
                    });
                } else {
                    // Adopción
                    // Eliminar de mascotasPostuladas
                    eliminarMascotaPostulada(solicitud.id);
                    
                    // Eliminar del catálogo
                    eliminarMascotaDelCatalogo(solicitud.id);
                    
                    // Actualizar estado en historial
                    historial[index].estado = 'aceptado';
                    guardarHistorialAdopciones(historial);
                    renderizarHistorial();
                    
                    Swal.fire({
                        icon: 'success',
                        title: '¡Adopción confirmada!',
                        text: `La adopción de ${solicitud.nombre} ha sido aprobada. La mascota ya no está disponible en el catálogo.`,
                        confirmButtonColor: '#2A5A46'
                    });
                }
            }
        }
    });
}
function renderizarHistorial() {
    const lista = document.getElementById('listaHistorial');
    const resumen = document.getElementById('resumenHistorial');
    
    if (!lista) return;
    
    const historial = getHistorialAdopciones();
    
    if (resumen) {
        const postulados = historial.filter(s => s.estado === 'postulado').length;
        const publicados = historial.filter(s => s.estado === 'publicado').length;
        resumen.textContent = `Total: ${historial.length} | ${postulados} postulados | ${publicados} publicados`;
    }
    
    if (historial.length === 0) {
        lista.innerHTML = `<p class="historial-vacio">No hay solicitudes en el historial.</p>`;
        return;
    }
    
    lista.innerHTML = historial.map(solicitud => {
        const esPublicacion = solicitud.tipo === 'publicacion';
        const data = esPublicacion ? (solicitud.datos || {}) : solicitud;
        
        // Determinar icono y clase de estado
        const estadoIcono = solicitud.estado === 'aceptado' ? 'fa-circle-check' : 
                            solicitud.estado === 'cancelado' ? 'fa-circle-xmark' : 'fa-clock';
        
        return `
            <div class="historial-card" data-id="${solicitud.idUnico}">
                <div class="historial-card-header">
                    <h3>${esPublicacion ? '<i class="fa-solid fa-bullhorn"></i>' : '<i class="fa-solid fa-paw"></i>'} ${solicitud.nombre}</h3>
                    <span class="estado-chip chip-${solicitud.estado}"><i class="fa-solid ${estadoIcono}"></i> ${solicitud.estado}</span>
                </div>
                
                <div class="historial-card-body">
                    <div class="historial-foto-placeholder ${!esPublicacion ? 'tipo-adopcion' : ''}">
                        <i class="fa-solid ${esPublicacion ? 'fa-paw' : 'fa-user'}"></i>
                    </div>
                    
                    <div class="info-grid">
                        <p><strong>ID:</strong> ${solicitud.id}</p>
                        <p><strong>${esPublicacion ? 'Publicador' : 'Solicitante'}:</strong> ${solicitud.adoptante || data.publicador || 'N/A'}</p>
                        <p><strong>Fecha:</strong> ${solicitud.fecha.split(',')[0]}</p>
                        <p><strong>Especie:</strong> ${data.especie || 'N/A'}</p>
                        <p><strong>Sexo:</strong> ${data.sexo || 'N/A'}</p>
                        <p><strong>Provincia:</strong> ${data.provincia || 'N/A'}</p>
                    </div>

                    <details>
                        <summary><i class="fa-solid fa-chevron-down chevron"></i> Ver información detallada</summary>
                        <div class="det-inner">
                            <div class="detalles-grid">
                                <div>
                                    <h6>Contacto</h6>
                                    <p><i class="fa-solid fa-envelope"></i> ${data.email || 'N/A'}</p>
                                    <p><i class="fa-solid fa-phone"></i> ${data.telefono || 'N/A'}</p>
                                </div>
                                <div>
                                    <h6>Hogar / Mascota</h6>
                                    <p><strong>Patio:</strong> ${data.tiene_patio === 'si' ? 'Sí' : 'No'}</p>
                                    <p><strong>Otras mascotas:</strong> ${data.otras_mascotas === 'si' ? 'Sí' : 'No'}</p>
                                </div>
                            </div>
                            ${data.motivo || data.descripcion ? `
                                <div class="nota-adicional">
                                    <strong>Nota:</strong> <p class="motivo-texto">${data.motivo || data.descripcion}</p>
                                </div>` : ''}
                        </div>
                    </details>
                </div>

                <div class="historial-card-actions">
                    ${(solicitud.estado === 'postulado' || solicitud.estado === 'publicado') ? `
                        <button class="btn-historial btn-aceptar" data-id="${solicitud.idUnico}"><i class="fa-solid fa-check"></i> Aceptar</button>
                        <button class="btn-historial btn-cancelar" data-id="${solicitud.idUnico}"><i class="fa-solid fa-xmark"></i> Cancelar</button>
                    ` : `
                        <div class="estado-finalizado ${solicitud.estado === 'aceptado' ? 'ok' : 'cancelado'}">
                            <i class="fa-solid ${solicitud.estado === 'aceptado' ? 'fa-circle-check' : 'fa-circle-xmark'}"></i>
                            Proceso ${solicitud.estado}
                        </div>
                    `}
                </div>
            </div>
        `;
    }).join('');

    // Reasignar eventos
    document.querySelectorAll('.btn-aceptar').forEach(b => b.onclick = (e) => manejarAceptar(parseInt(e.currentTarget.dataset.id)));
    document.querySelectorAll('.btn-cancelar').forEach(b => b.onclick = (e) => manejarCancelar(parseInt(e.currentTarget.dataset.id)));
}



function manejarCancelar(id) {
    Swal.fire({
        title: '¿Cancelar solicitud?',
        text: 'Esta acción eliminará la solicitud.',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#d33',
        cancelButtonColor: '#6c757d',
        confirmButtonText: 'Sí, cancelar',
        cancelButtonText: 'No, mantener'
    }).then((result) => {
        if (result.isConfirmed) {
            let historial = getHistorialAdopciones();
            const index = historial.findIndex(s => s.idUnico === id);
            
            if (index !== -1) {
                const solicitud = historial[index];
                
                if (solicitud.tipo === 'adopcion' && solicitud.id) {
                    // Solo eliminar de postuladas, la mascota sigue en catálogo
                    eliminarMascotaPostulada(solicitud.id);
                }
                
                historial.splice(index, 1);
                guardarHistorialAdopciones(historial);
                renderizarHistorial();
                
                Swal.fire({
                    icon: 'info',
                    title: 'Solicitud cancelada',
                    text: 'La solicitud ha sido eliminada. La mascota sigue disponible en el catálogo.',
                    confirmButtonColor: '#2A5A46'
                });
            }
        }
    });
}

// Responsivos
(function() {
    const css = `
        /* ── Historial cards ── */
        .historial-card {
            width: 100%;
            box-sizing: border-box;
        }

        /* ── Grid 1 columna en cel── */
        @media (max-width: 600px) {
            .detalle-grid {
                grid-template-columns: 1fr !important;
                gap: 4px 0 !important;
            }

            .historial-card-header {
                flex-direction: column;
                align-items: flex-start;
                gap: 6px;
            }

            .historial-card-header h3 {
                font-size: 1rem;
            }

            .historial-card-body p {
                font-size: 0.82rem;
            }

            .historial-card-actions {
                display: flex;
                flex-direction: column;
                gap: 8px;
            }

            .historial-card-actions button,
            .btn-aceptar,
            .btn-cancelar {
                width: 100%;
                justify-content: center;
            }

            /* Stepper más pequeño*/
            .step-navigation {
                display: flex;
                flex-wrap: wrap;
                gap: 8px;
                justify-content: space-between;
            }

            .btn-step {
                flex: 1 1 auto;
                min-width: 120px;
                font-size: 0.85rem;
                padding: 8px 12px;
            }

            /* Banner de mascota */
            #mascotaBanner {
                padding: 10px 12px;
                font-size: 0.85rem;
            }

            #mascotaBanner .banner-info {
                flex-direction: column;
                gap: 4px;
            }

            /* Campos del formulario */
            .form-group input,
            .form-group select,
            .form-group textarea {
                font-size: 16px; 
                width: 100%;
                box-sizing: border-box;
            }

            .btn-submit {
                width: 100%;
                justify-content: center;
            }

            /* Título de sección */
            fieldset.form-group legend {
                font-size: 0.95rem;
            }

            #resumenHistorial {
                font-size: 0.8rem;
            }

            #btnVaciarHistorial {
                width: 100%;
                justify-content: center;
            }

            .historial-card-body img {
                max-height: 120px;
            }
        }
    `;

    const style = document.createElement('style');
    style.id = 'formulario-responsive-styles';
    style.textContent = css;

    if (!document.getElementById('formulario-responsive-styles')) {
        document.head.appendChild(style);
    }
})();