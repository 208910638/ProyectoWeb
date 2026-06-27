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
                const mascotasLocal = getMascotasCatalogo();
                const todasMascotas = [...data, ...mascotasLocal];
                
                const mascota = todasMascotas.find(p => p.id === id);
                
                if (!mascota) {
                    return { 
                        valido: false, 
                        mensaje: `<i class=\"fa-solid fa-triangle-exclamation\"></i> No existe ninguna mascota con el ID: ${id}` 
                    };
                }
                
                const errores = [];
                
                if (mascota.nombre.toLowerCase() !== nombre.toLowerCase()) {
                    errores.push(`<i class=\"fa-solid fa-pen\"></i> Nombre: "${mascota.nombre}" ≠ "${nombre}"`);
                }
                
                if (mascota.especie.toLowerCase() !== especie.toLowerCase()) {
                    errores.push(`<i class=\"fa-solid fa-paw\"></i> Especie: "${mascota.especie}" ≠ "${especie}"`);
                }
                
                if (mascota.sexo.toLowerCase() !== sexo.toLowerCase()) {
                    errores.push(`<i class=\"fa-solid fa-venus-mars\"></i> Sexo: "${mascota.sexo}" ≠ "${sexo}"`);
                }
                
                const edadNormalizada = mascota.edad.toLowerCase().replace(/\s/g, '');
                const edadInputNormalizada = edad.toLowerCase().replace(/\s/g, '');
                if (edadNormalizada !== edadInputNormalizada) {
                    errores.push(`<i class=\"fa-solid fa-calendar\"></i> Edad: "${mascota.edad}" ≠ "${edad}"`);
                }
                
                const pesoNormalizado = mascota.peso.toLowerCase().replace(/\s/g, '');
                const pesoInputNormalizado = peso.toLowerCase().replace(/\s/g, '');
                if (pesoNormalizado !== pesoInputNormalizado) {
                    errores.push(`<i class=\"fa-solid fa-scale-balanced\"></i> Peso: "${mascota.peso}" ≠ "${peso}"`);
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
                            title: 'Datos incorrectos',
                            html: `
                                <div style="text-align: left; font-size: 0.95rem; line-height: 1.6;">
                                    ${mensajeHtml}
                                </div>
                                <div style="margin-top: 12px; padding: 10px; background: rgba(239, 68, 68, 0.1); border-radius: 8px; font-size: 0.85rem; color: #fca5a5;">
                                    Asegúrate de que todos los datos coincidan exactamente con los del catálogo.
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


function renderizarHistorial() {
    const lista = document.getElementById('listaHistorial');
    const resumen = document.getElementById('resumenHistorial');
    
    if (!lista) return;
    
    const historial = getHistorialAdopciones();
    
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
        const titulo = esPublicacion ? `<i class=\"fa-solid fa-bullhorn\"></i> ${solicitud.nombre}` : solicitud.nombre;
        
        let estadoTexto = '';
        if (solicitud.tipo === 'publicacion') {
            estadoTexto = solicitud.estado === 'publicado' ? '<i class="fa-solid fa-bullhorn"></i> Publicado' :
                            solicitud.estado === 'aceptado' ? '<i class="fa-solid fa-circle-check"></i> Aprobado' :
                            '<i class="fa-solid fa-circle-xmark"></i> Cancelado';
        } else {
            estadoTexto = solicitud.estado === 'postulado' ? '<i class="fa-solid fa-clipboard-list"></i> Postulado' :
                            solicitud.estado === 'aceptado' ? '<i class="fa-solid fa-house-heart"></i> Adoptado' :
                            '<i class="fa-solid fa-circle-xmark" style="color:#d33"></i> Cancelado';
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
                        <p><strong><i class="fa-solid fa-user"></i> Adoptante:</strong> ${solicitud.adoptante}</p>
                        ${solicitud.email ? `<p><strong><i class="fa-solid fa-envelope"></i> Email:</strong> ${solicitud.email}</p>` : ''}
                        ${solicitud.telefono ? `<p><strong><i class="fa-solid fa-phone"></i> Teléfono:</strong> ${solicitud.telefono}</p>` : ''}
                        ${solicitud.provincia ? `<p><strong><i class="fa-solid fa-location-dot"></i> Provincia:</strong> ${solicitud.provincia}</p>` : ''}
                        ${solicitud.motivo ? `
                            <p style="margin-top: 8px;"><strong><i class="fa-solid fa-pen"></i> Motivo:</strong></p>
                            <p style="margin: 4px 0 0 0; padding: 8px; background: rgba(0,0,0,0.2); border-radius: 6px; font-style: italic;">
                                "${solicitud.motivo}"
                            </p>
                        ` : ''}
                        <div class="detalle-grid" style="display: grid; grid-template-columns: 1fr 1fr; gap: 4px 12px; margin-top: 8px;">
                            ${solicitud.especie ? `<p><strong><i class="fa-solid fa-paw"></i> Especie:</strong> ${solicitud.especie}</p>` : ''}
                            ${solicitud.sexo ? `<p><strong><i class="fa-solid fa-venus-mars"></i> Sexo:</strong> ${solicitud.sexo}</p>` : ''}
                            ${solicitud.tiene_patio ? `<p><strong><i class="fa-solid fa-house"></i> Patio:</strong> ${solicitud.tiene_patio === 'si' ? '<i class="fa-solid fa-check" style="color:#2A5A46"></i> Sí' : '<i class="fa-solid fa-xmark" style="color:#d33"></i> No'}</p>` : ''}
                            ${solicitud.otras_mascotas ? `<p><strong><i class="fa-solid fa-dog"></i> Otras mascotas:</strong> ${solicitud.otras_mascotas === 'si' ? '<i class="fa-solid fa-check" style="color:#2A5A46"></i> Sí' : '<i class="fa-solid fa-xmark" style="color:#d33"></i> No'}</p>` : ''}
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
                    <span class="estado-finalizado">${solicitud.estado === 'aceptado' ? '<i class="fa-solid fa-circle-check" style="color:#2A5A46"></i> Proceso completado' : '<i class="fa-solid fa-circle-xmark" style="color:#d33"></i> Cancelado'}</span>
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
                                <p><strong><i class="fa-solid fa-user"></i> Publicador:</strong> ${solicitud.datos.publicador}</p>
                                <p><strong><i class="fa-solid fa-envelope"></i> Email:</strong> ${solicitud.datos.email}</p>
                                <p><strong><i class="fa-solid fa-phone"></i> Teléfono:</strong> ${solicitud.datos.telefono}</p>
                                <p><strong><i class="fa-solid fa-location-dot"></i> Provincia:</strong> ${solicitud.datos.provincia}</p>
                                <p><strong><i class="fa-solid fa-paw"></i> Especie:</strong> ${solicitud.datos.especie}</p>
                                <p><strong><i class="fa-solid fa-venus-mars"></i> Sexo:</strong> ${solicitud.datos.sexo}</p>
                                <p><strong><i class="fa-solid fa-ruler"></i> Tamaño:</strong> ${solicitud.datos.tamanio}</p>
                                <p><strong><i class="fa-solid fa-syringe"></i> Vacunado:</strong> ${solicitud.datos.esta_vacunado === 'si' ? '<i class="fa-solid fa-check" style="color:#2A5A46"></i> Sí' : '<i class="fa-solid fa-xmark" style="color:#d33"></i> No'}</p>
                                <p><strong><i class="fa-solid fa-scissors"></i> Esterilizado:</strong> ${solicitud.datos.esta_esterilizado === 'si' ? '<i class="fa-solid fa-check" style="color:#2A5A46"></i> Sí' : '<i class="fa-solid fa-xmark" style="color:#d33"></i> No'}</p>
                                ${solicitud.datos.descripcion ? `
                                    <p style="margin-top: 8px;"><strong><i class="fa-solid fa-pen"></i> Descripción:</strong></p>
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