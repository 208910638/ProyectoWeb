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
                    localStorage.removeItem('historialAdopciones');
                    localStorage.removeItem('mascotasPostuladas');
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
            const especieSelect = document.getElementById('tipo-mascota-form-adopcion');
            const edadInput = document.getElementById('edad-form-adopcion');
            const pesoInput = document.getElementById('peso-form-adopcion');
            
            if (idInput) idInput.value = params.id;
            if (nombreInput) nombreInput.value = params.nombre;
            if (especieSelect) especieSelect.value = params.especie || '';
            if (edadInput) edadInput.value = params.edad || '';
            if (pesoInput) pesoInput.value = params.peso || '';
            
            if (params.sexo) {
                const radios = document.querySelectorAll('input[name="sexo_form_adopcion"]');
                radios.forEach(radio => {
                    if (radio.value === params.sexo) {
                        radio.checked = true;
                    }
                });
            }
            
            mostrarBanner({
                id: params.id,
                nombre: params.nombre,
                especie: params.especie,
                sexo: params.sexo
            });
            
        }, 150);
    }

    function validarMascota(id, nombre, especie, sexo, edad, peso) {
        return fetch('data/mascotas.json')
            .then(response => response.json())
            .then(data => {
                const mascotasLocal = JSON.parse(localStorage.getItem('mascotasCatalogo')) || [];
                const todasMascotas = [...data, ...mascotasLocal];
                
                const mascota = todasMascotas.find(p => p.id === id);
                
                if (!mascota) {
                    return { 
                        valido: false, 
                        mensaje: `⚠️ No existe ninguna mascota con el ID: ${id}` 
                    };
                }
                
                const errores = [];
                
                if (mascota.nombre.toLowerCase() !== nombre.toLowerCase()) {
                    errores.push(`📝 Nombre: "${mascota.nombre}" ≠ "${nombre}"`);
                }
                
                if (mascota.especie.toLowerCase() !== especie.toLowerCase()) {
                    errores.push(`🐾 Especie: "${mascota.especie}" ≠ "${especie}"`);
                }
                
                if (mascota.sexo.toLowerCase() !== sexo.toLowerCase()) {
                    errores.push(`⚤ Sexo: "${mascota.sexo}" ≠ "${sexo}"`);
                }
                
                const edadNormalizada = mascota.edad.toLowerCase().replace(/\s/g, '');
                const edadInputNormalizada = edad.toLowerCase().replace(/\s/g, '');
                if (edadNormalizada !== edadInputNormalizada) {
                    errores.push(`📅 Edad: "${mascota.edad}" ≠ "${edad}"`);
                }
                
                const pesoNormalizado = mascota.peso.toLowerCase().replace(/\s/g, '');
                const pesoInputNormalizado = peso.toLowerCase().replace(/\s/g, '');
                if (pesoNormalizado !== pesoInputNormalizado) {
                    errores.push(`⚖️ Peso: "${mascota.peso}" ≠ "${peso}"`);
                }
                
                if (errores.length > 0) {
                    return {
                        valido: false,
                        mensaje: `❌ Los datos no coinciden con la mascota "${mascota.nombre}" (ID: ${mascota.id}):\n\n${errores.join('\n')}`,
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
        window.limpiarFormulario(form);
        
        if (banner) banner.hidden = true;
        
        if (window.history && window.history.pushState) {
            const url = window.location.pathname;
            window.history.pushState({}, document.title, url);
        }
        
        reiniciarStepper(form);
        
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

            validarMascota(idMascota, nombreMascota, especieMascota, sexoValue, edadMascota, pesoMascota)
                .then(resultado => {
                    if (!resultado.valido) {
                        const mensajeHtml = resultado.mensaje.replace(/\n/g, '<br>');
                        Swal.fire({
                            icon: 'error',
                            title: '❌ Datos incorrectos',
                            html: `
                                <div style="text-align: left; font-size: 0.95rem; line-height: 1.6;">
                                    ${mensajeHtml}
                                </div>
                                <div style="margin-top: 12px; padding: 10px; background: rgba(239, 68, 68, 0.1); border-radius: 8px; font-size: 0.85rem; color: #fca5a5;">
                                    💡 Asegúrate de que todos los datos coincidan exactamente con los del catálogo.
                                </div>
                            `,
                            confirmButtonColor: '#6c757d',
                            confirmButtonText: 'Ok'
                        });
                        return;
                    }

                    if (resultado.error) {
                        Swal.fire({
                            icon: 'warning',
                            title: '⚠️ Advertencia',
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
                    Swal.fire({
                        icon: 'warning',
                        title: '⚠️ Advertencia',
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

// Funciones de mascota como postulada
function marcarMascotaComoPostulada(idMascota) {
    let mascotasPostuladas = JSON.parse(localStorage.getItem('mascotasPostuladas')) || [];
    if (!mascotasPostuladas.includes(idMascota)) {
        mascotasPostuladas.push(idMascota);
        localStorage.setItem('mascotasPostuladas', JSON.stringify(mascotasPostuladas));
    }
}

function eliminarMascotaPostulada(idMascota) {
    let mascotasPostuladas = JSON.parse(localStorage.getItem('mascotasPostuladas')) || [];
    mascotasPostuladas = mascotasPostuladas.filter(id => id !== idMascota);
    localStorage.setItem('mascotasPostuladas', JSON.stringify(mascotasPostuladas));
}

// Historial
function agregarAlHistorial(solicitud) {
    let historial = JSON.parse(localStorage.getItem('historialAdopciones')) || [];
    solicitud.idUnico = Date.now();
    historial.push(solicitud);
    localStorage.setItem('historialAdopciones', JSON.stringify(historial));
    renderizarHistorial();
}

function renderizarHistorial() {
    const lista = document.getElementById('listaHistorial');
    const resumen = document.getElementById('resumenHistorial');
    
    if (!lista) return;
    
    const historial = JSON.parse(localStorage.getItem('historialAdopciones')) || [];
    
    if (resumen) {
        const postulados = historial.filter(s => s.estado === 'postulado').length;
        const publicados = historial.filter(s => s.estado === 'publicado').length;
        const total = historial.length;
        
        let texto = `Total: ${total}`;
        if (postulados > 0) texto += ` | ${postulados} postulados`;
        if (publicados > 0) texto += ` | ${publicados} publicados`;
        resumen.textContent = texto;
    }
    
    if (historial.length === 0) {
        lista.innerHTML = `<p class="historial-vacio">No hay solicitudes en el historial.</p>`;
        return;
    }
    
    lista.innerHTML = historial.map(solicitud => {
        const esPublicacion = solicitud.tipo === 'publicacion';
        const titulo = esPublicacion ? `📢 ${solicitud.nombre}` : solicitud.nombre;
        
        let estadoTexto = '';
        if (solicitud.tipo === 'publicacion') {
            estadoTexto = solicitud.estado === 'publicado' ? '📢 Publicado' :
                            solicitud.estado === 'aceptado' ? '✅ Aprobado' :
                            '❌ Cancelado';
        } else {
            estadoTexto = solicitud.estado === 'postulado' ? '📋 Postulado' :
                            solicitud.estado === 'aceptado' ? '✅ Adoptado' :
                            '❌ Cancelado';
        }
        
        let fotoHtml = '';
        if (solicitud.datos && solicitud.datos.foto) {
            fotoHtml = `
                <div style="margin-top: 8px;">
                    <img src="${solicitud.datos.foto}" alt="Foto de ${solicitud.nombre}" 
                        style="width: 100%; max-height: 150px; object-fit: cover; border-radius: 8px; border: 1px solid #2A5A46;">
                </div>
            `;
        }
        
        let descripcionHtml = '';
        if (!esPublicacion && solicitud.tipo === 'adopcion') {
            descripcionHtml = `
                <details>
                    <summary style="color: #93CFA7; cursor: pointer; font-size: 0.8rem; margin-top: 6px;">
                        <i class="fa-solid fa-chevron-down"></i> Ver detalles de la solicitud
                    </summary>
                    <div style="margin-top: 8px; font-size: 0.85rem; color: #94a3b8; background: rgba(15, 23, 42, 0.5); padding: 10px; border-radius: 8px;">
                        <p><strong>👤 Adoptante:</strong> ${solicitud.adoptante}</p>
                        ${solicitud.email ? `<p><strong>📧 Email:</strong> ${solicitud.email}</p>` : ''}
                        ${solicitud.telefono ? `<p><strong>📱 Teléfono:</strong> ${solicitud.telefono}</p>` : ''}
                        ${solicitud.provincia ? `<p><strong>📍 Provincia:</strong> ${solicitud.provincia}</p>` : ''}
                        ${solicitud.motivo ? `
                            <p style="margin-top: 8px;"><strong>📝 Motivo:</strong></p>
                            <p style="margin: 4px 0 0 0; padding: 8px; background: rgba(0,0,0,0.2); border-radius: 6px; font-style: italic;">
                                "${solicitud.motivo}"
                            </p>
                        ` : ''}
                        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 4px 12px; margin-top: 8px;">
                            ${solicitud.especie ? `<p><strong>🐾 Especie:</strong> ${solicitud.especie}</p>` : ''}
                            ${solicitud.sexo ? `<p><strong>⚤ Sexo:</strong> ${solicitud.sexo}</p>` : ''}
                            ${solicitud.tiene_patio ? `<p><strong>🏠 Patio:</strong> ${solicitud.tiene_patio === 'si' ? '✅ Sí' : '❌ No'}</p>` : ''}
                            ${solicitud.otras_mascotas ? `<p><strong>🐕 Otras mascotas:</strong> ${solicitud.otras_mascotas === 'si' ? '✅ Sí' : '❌ No'}</p>` : ''}
                        </div>
                    </div>
                </details>
            `;
        }
        
        let accionesHtml = '';
        if (solicitud.estado === 'postulado' || solicitud.estado === 'publicado') {
            accionesHtml = `
                <div class="historial-card-actions">
                    <button class="btn-aceptar" data-id="${solicitud.idUnico}">
                        <i class="fa-solid fa-check"></i> Aceptar
                    </button>
                    <button class="btn-cancelar" data-id="${solicitud.idUnico}">
                        <i class="fa-solid fa-xmark"></i> Cancelar
                    </button>
                </div>
            `;
        } else {
            accionesHtml = `
                <div class="historial-card-actions">
                    <span class="estado-finalizado">${solicitud.estado === 'aceptado' ? '✅ Proceso completado' : '❌ Cancelado'}</span>
                </div>
            `;
        }
        
        return `
            <div class="historial-card" data-id="${solicitud.idUnico}">
                <div class="historial-card-header">
                    <h3>${titulo}</h3>
                    <span class="estado ${solicitud.estado}">${estadoTexto}</span>
                </div>
                <div class="historial-card-body">
                    ${fotoHtml}
                    <p><strong>ID:</strong> ${solicitud.id}</p>
                    <p><strong>${esPublicacion ? 'Publicado por' : 'Adoptante'}:</strong> ${solicitud.adoptante}</p>
                    <p><strong>Fecha:</strong> ${solicitud.fecha}</p>
                    ${descripcionHtml}
                    ${esPublicacion && solicitud.datos ? `
                        <details>
                            <summary style="color: #93CFA7; cursor: pointer; font-size: 0.8rem; margin-top: 6px;">
                                <i class="fa-solid fa-chevron-down"></i> Ver detalles de publicación
                            </summary>
                            <div style="margin-top: 8px; font-size: 0.85rem; color: #94a3b8; background: rgba(15, 23, 42, 0.5); padding: 10px; border-radius: 8px;">
                                <p><strong>👤 Publicador:</strong> ${solicitud.datos.publicador}</p>
                                <p><strong>📧 Email:</strong> ${solicitud.datos.email}</p>
                                <p><strong>📱 Teléfono:</strong> ${solicitud.datos.telefono}</p>
                                <p><strong>📍 Provincia:</strong> ${solicitud.datos.provincia}</p>
                                <p><strong>🐾 Especie:</strong> ${solicitud.datos.especie}</p>
                                <p><strong>⚤ Sexo:</strong> ${solicitud.datos.sexo}</p>
                                <p><strong>📏 Tamaño:</strong> ${solicitud.datos.tamanio}</p>
                                <p><strong>🩺 Vacunado:</strong> ${solicitud.datos.esta_vacunado === 'si' ? '✅ Sí' : '❌ No'}</p>
                                <p><strong>🔬 Esterilizado:</strong> ${solicitud.datos.esta_esterilizado === 'si' ? '✅ Sí' : '❌ No'}</p>
                                ${solicitud.datos.descripcion ? `
                                    <p style="margin-top: 8px;"><strong>📝 Descripción:</strong></p>
                                    <p style="margin: 4px 0 0 0; padding: 8px; background: rgba(0,0,0,0.2); border-radius: 6px; font-style: italic;">
                                        "${solicitud.datos.descripcion}"
                                    </p>
                                ` : ''}
                            </div>
                        </details>
                    ` : ''}
                </div>
                ${accionesHtml}
            </div>
        `;
    }).join('');

    document.querySelectorAll('.btn-aceptar').forEach(btn => {
        btn.addEventListener('click', function() {
            const id = parseInt(this.dataset.id);
            manejarAceptar(id);
        });
    });

    document.querySelectorAll('.btn-cancelar').forEach(btn => {
        btn.addEventListener('click', function() {
            const id = parseInt(this.dataset.id);
            manejarCancelar(id);
        });
    });
}

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
            let historial = JSON.parse(localStorage.getItem('historialAdopciones')) || [];
            const index = historial.findIndex(s => s.idUnico === id);
            
            if (index !== -1) {
                const solicitud = historial[index];
                
                if (solicitud.tipo === 'publicacion' && solicitud.datos) {
                    // Publicación del refugio - se publica en catálogo
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
                    
                    const mascotasGuardadas = JSON.parse(localStorage.getItem('mascotasCatalogo')) || [];
                    mascotasGuardadas.push(nuevaMascota);
                    localStorage.setItem('mascotasCatalogo', JSON.stringify(mascotasGuardadas));
                    
                    historial[index].estado = 'aceptado';
                    localStorage.setItem('historialAdopciones', JSON.stringify(historial));
                    renderizarHistorial();
                    
                    Swal.fire({
                        icon: 'success',
                        title: '¡Publicación aprobada!',
                        text: `${datos.nombre} ya está disponible en el catálogo.`,
                        confirmButtonColor: '#2A5A46'
                    });
                } else {
                    // Adopción
                    // 1. Eliminar de mascotasPostuladas
                    eliminarMascotaPostulada(solicitud.id);
                    
                    // 2. Eliminar del catálogo
                    eliminarMascotaDelCatalogo(solicitud.id);
                    
                    // 3. Actualizar estado en historial
                    historial[index].estado = 'aceptado';
                    localStorage.setItem('historialAdopciones', JSON.stringify(historial));
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

function eliminarMascotaDelCatalogo(idMascota) {
    let mascotasLocal = JSON.parse(localStorage.getItem('mascotasCatalogo')) || [];
    mascotasLocal = mascotasLocal.filter(p => p.id !== idMascota);
    localStorage.setItem('mascotasCatalogo', JSON.stringify(mascotasLocal));
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
            let historial = JSON.parse(localStorage.getItem('historialAdopciones')) || [];
            const index = historial.findIndex(s => s.idUnico === id);
            
            if (index !== -1) {
                const solicitud = historial[index];
                
                if (solicitud.tipo === 'adopcion' && solicitud.id) {
                    // Solo eliminar de postuladas, la mascota sigue en catálogo
                    eliminarMascotaPostulada(solicitud.id);
                }
                
                historial.splice(index, 1);
                localStorage.setItem('historialAdopciones', JSON.stringify(historial));
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
