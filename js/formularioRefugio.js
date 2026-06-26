document.addEventListener('DOMContentLoaded', function() {
    const formRefugio = document.getElementById('formRefugio');
    if (formRefugio) {
        formRefugio.addEventListener('submit', function(e) {
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

            publicarMascotaRefugio(formRefugio);
        });
    }

    function publicarMascotaRefugio(form) {
        const nombreMascota = document.getElementById('nombre-mascota-refugio').value;
        const especieSeleccionada = document.querySelector('input[name="especie"]:checked');
        const especie = especieSeleccionada ? especieSeleccionada.value : '';
        const nombrePublicador = document.getElementById('nombre-form-refugio').value;
        const emailPublicador = document.getElementById('email-form-refugio').value;
        const telefonoPublicador = document.getElementById('telefono-form-refugio').value;
        
        const provinciaMap = {
            'sanjose': 'San José',
            'alajuela': 'Alajuela',
            'cartago': 'Cartago',
            'heredia': 'Heredia',
            'guanacaste': 'Guanacaste',
            'puntarenas': 'Puntarenas',
            'limon': 'Limón'
        };
        const provinciaSelect = document.getElementById('provincia-form-refugio');
        const provinciaValue = provinciaSelect ? provinciaSelect.value : '';
        const provincia = provinciaMap[provinciaValue] || provinciaValue;
        
        const fotoInput = document.getElementById('foto-mascota');
        
        function guardarSolicitud(foto = null) {
            const datosMascota = {
                id: 'PET' + String(Math.floor(Math.random() * 10000)).padStart(4, '0'),
                nombre: nombreMascota,
                especie: especie,
                sexo: document.querySelector('input[name="sexo_refugio"]:checked')?.value || '',
                edad: document.getElementById('edad-form-refugio').value,
                peso: document.getElementById('peso-form-refugio').value,
                raza: document.getElementById('raza').value,
                tamanio: document.getElementById('tamanio').value,
                esta_vacunado: document.querySelector('input[name="esta_vacunado"]:checked')?.value || '',
                esta_esterilizado: document.querySelector('input[name="esta_esterilizado"]:checked')?.value || '',
                descripcion: document.getElementById('descripcion-refugio').value,
                publicador: nombrePublicador,
                email: emailPublicador,
                telefono: telefonoPublicador,
                provincia: provincia,
                fecha_publicacion: new Date().toLocaleString(),
                foto: foto
            };

            agregarAlHistorial({
                id: datosMascota.id,
                nombre: datosMascota.nombre,
                adoptante: nombrePublicador,  
                fecha: datosMascota.fecha_publicacion,
                estado: 'publicado',
                tipo: 'publicacion',
                datos: datosMascota
            });

            window.limpiarFormulario(form);
            
            Swal.fire({
                icon: 'success',
                title: '¡Mascota publicada!',
                html: `
                    <p><strong>${nombreMascota}</strong> ha sido publicada en el catálogo.</p>
                    <p style="color: #94a3b8; font-size: 0.9rem; margin-top: 10px;">
                        ID asignado: <strong>${datosMascota.id}</strong>
                    </p>
                `,
                confirmButtonColor: '#2A5A46'
            });
        }
        
        if (fotoInput && fotoInput.files && fotoInput.files.length > 0) {
            const reader = new FileReader();
            reader.onload = function(e) {
                guardarSolicitud(e.target.result);
            };
            reader.readAsDataURL(fotoInput.files[0]);
        } else {
            guardarSolicitud(null);
        }
    }
});