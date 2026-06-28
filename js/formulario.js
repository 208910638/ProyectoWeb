document.addEventListener('DOMContentLoaded', function() {
    // Pestañas
    const tabs = document.querySelectorAll('.tab-btn');
    const panelPostulacion = document.getElementById('panelPostulacion');
    const panelRefugio = document.getElementById('panelRefugio');

    function switchTab(tabId) {
        for (let i = 0; i < tabs.length; i++) 
            tabs[i].classList.remove('active');

        if (panelPostulacion) 
            panelPostulacion.hidden = true;

        if (panelRefugio) 
            panelRefugio.hidden = true;

        const activeTab = document.querySelector('[data-tab="' + tabId + '"]');
        if (activeTab) 
            activeTab.classList.add('active');

        if (tabId === 'postulacion' && panelPostulacion) 
            panelPostulacion.hidden = false;
        else if (tabId === 'refugio' && panelRefugio) 
            panelRefugio.hidden = false;

        // Disparar evento personalizado para notificar cambio de pestaña
        document.dispatchEvent(new CustomEvent('tabChanged', { 
            detail: { tabId: tabId } 
        }));
    }

    for (let i = 0; i < tabs.length; i++) {
        tabs[i].addEventListener('click', function() {
            const tabId = this.getAttribute('data-tab');
            switchTab(tabId);
        });
    }

    switchTab('postulacion');
    
    // Inicializar los steppers
    setupStepper('formRefugio');
    setupStepper('formPostulacion');

    window.limpiarFormulario = function(form) {
        // Limpiar inputs de texto y textareas
        const inputs = form.querySelectorAll('input:not([type="radio"]):not([type="file"]), select, textarea');
        inputs.forEach(input => {
            if (input.tagName === 'SELECT') {
                input.selectedIndex = 0;
            } else {
                input.value = '';
            }
            input.classList.remove('input-error', 'input-warning', 'input-success');
        });

        // Limpiar radio buttons
        const radios = form.querySelectorAll('input[type="radio"]');
        radios.forEach(radio => {
            radio.checked = false;
        });

        // Limpiar errores
        const errores = form.querySelectorAll('.form-error');
        errores.forEach(error => {
            error.textContent = '';
        });

        // Limpiar mensajes
        const msg = form.querySelector('.form-message');
        if (msg) {
            msg.textContent = '';
            msg.hidden = true;
        }
    };

    // Botón limpiar
    document.querySelectorAll('.btn-limpiar').forEach(btn => {
        btn.addEventListener('click', function() {
            const form = this.closest('form');
            if (form) {
                Swal.fire({
                    title: '¿Limpiar formulario?',
                    text: 'Todos los campos se vaciarán.',
                    icon: 'warning',
                    showCancelButton: true,
                    confirmButtonColor: '#2A5A46',
                    cancelButtonColor: '#d33',
                    confirmButtonText: 'Sí, limpiar',
                    cancelButtonText: 'Cancelar'
                }).then((result) => {
                    if (result.isConfirmed) {
                        window.limpiarFormulario(form);
                        Swal.fire({
                            icon: 'info',
                            title: 'Formulario limpiado',
                            text: 'Todos los campos han sido vaciados.',
                            confirmButtonColor: '#2A5A46',
                            timer: 1500
                        });
                    }
                });
            }
        });
    });
});

function setupStepper(formId) {
    const form = document.getElementById(formId);
    if (!form) {
        console.log('Formulario no encontrado:', formId);
        return;
    }

    const legends = form.querySelectorAll('legend');
    const totalSteps = legends.length;

    let currentStep = 0;

    const navContainer = document.createElement('div');
    navContainer.className = 'step-navigation';

    const counter = document.createElement('span');
    counter.className = 'step-counter';
    counter.textContent = 'Paso ' + (currentStep + 1) + ' de ' + totalSteps;

    const buttons = document.createElement('div');
    buttons.className = 'step-buttons';

    const btnPrev = document.createElement('button');
    btnPrev.type = 'button';
    btnPrev.className = 'btn-step';
    btnPrev.innerHTML = '<i class="fa-solid fa-arrow-left"></i> Anterior';
    btnPrev.disabled = true;

    const btnNext = document.createElement('button');
    btnNext.type = 'button';
    btnNext.className = 'btn-step btn-step-primary';
    btnNext.innerHTML = 'Siguiente <i class="fa-solid fa-arrow-right"></i>';

    buttons.appendChild(btnPrev);
    buttons.appendChild(btnNext);

    navContainer.appendChild(counter);
    navContainer.appendChild(buttons);

    const lastLegend = legends[totalSteps - 1];
    const lastFieldset = lastLegend.closest('fieldset');
    if (lastFieldset) 
        lastFieldset.parentNode.insertBefore(navContainer, lastFieldset.nextSibling);

    const btnSubmit = form.querySelector('.btn-submit');
    if (btnSubmit) {
        btnSubmit.style.display = 'none';
    }

    // Función global de validación
    window.validarPaso = function(form, stepElement) {
        let valid = true;
        
        const inputs = stepElement.querySelectorAll('input[required]:not([type="radio"]), select[required], textarea[required]');
        
        for (let i = 0; i < inputs.length; i++) {
            const input = inputs[i];
            const errorMsg = input.parentElement.querySelector('.form-error');
            
            if (!input.value.trim()) {
                valid = false;
                input.classList.add('input-error');
                if (errorMsg) {
                    errorMsg.textContent = 'Este campo es obligatorio';
                }
            } else {
                let formatoValido = true;
                const tipo = input.getAttribute('type');
                
                if (tipo === 'email') {
                    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                    if (!emailRegex.test(input.value.trim())) {
                        formatoValido = false;
                        valid = false;
                        input.classList.add('input-error');
                        if (errorMsg) {
                            errorMsg.textContent = 'Ingrese un correo electrónico válido (ej. nombre@dominio.com)';
                        }
                    }
                } else if (tipo === 'tel') {
                    const telefonoRegex = /^[0-9]{4}[- ]?[0-9]{4}$/;
                    if (!telefonoRegex.test(input.value.trim())) {
                        formatoValido = false;
                        valid = false;
                        input.classList.add('input-error');
                        if (errorMsg) {
                            errorMsg.textContent = 'Ingrese un número de teléfono válido (ej. 8888-8888)';
                        }
                    }
                }
                
                if (formatoValido && input.value.trim()) {
                    // Validación: edad y peso no pueden ser negativos
                    const fieldId = input.id || '';
                    if (fieldId.includes('edad') || fieldId.includes('peso')) {
                        const numVal = parseFloat(input.value.replace(/[^0-9.\-]/g, ''));
                        if (!isNaN(numVal) && numVal < 0) {
                            formatoValido = false;
                            valid = false;
                            input.classList.add('input-error');
                            if (errorMsg) {
                                errorMsg.textContent = fieldId.includes('edad')
                                    ? 'La edad no puede ser negativa'
                                    : 'El peso no puede ser negativo';
                            }
                        }
                    }
                }

                if (formatoValido && input.value.trim()) {
                    input.classList.remove('input-error');
                    if (errorMsg) {
                        errorMsg.textContent = '';
                    }
                }
            }
        }
        
        const allRadios = stepElement.querySelectorAll('input[type="radio"]'); 
        const radioGroups = {};

        for (let i = 0; i < allRadios.length; i++) {
            const radio = allRadios[i];
            const name = radio.getAttribute('name');
            if (name) {
                if (!radioGroups[name]) {
                    radioGroups[name] = {
                        checked: false,
                        required: false,
                        elements: []
                    };
                }
                radioGroups[name].elements.push(radio);
                if (radio.hasAttribute('required')) {
                    radioGroups[name].required = true;
                }
                if (radio.checked) {
                    radioGroups[name].checked = true;
                }
            }
        }

        for (const groupName in radioGroups) {
            const group = radioGroups[groupName];
            if (!group.required) continue;

            const firstRadio = group.elements[0];
            let container = firstRadio.closest('.radio-group');
            if (!container) container = firstRadio.closest('.subgroup');
            if (!container) container = firstRadio.closest('.input-box');

            let errorMsg = null;
            if (container) {
                errorMsg = container.querySelector('.form-error');
            }
            if (!errorMsg) {
                errorMsg = firstRadio.closest('.input-box')?.querySelector('.form-error') ||
                        firstRadio.closest('.subgroup')?.querySelector('.form-error') ||
                        firstRadio.closest('.radio-group')?.querySelector('.form-error');
            }

            if (!group.checked) {
                valid = false;
                if (container) {
                    container.classList.add('grupo-error');
                }
                if (errorMsg) {
                    errorMsg.textContent = 'Debe seleccionar una opción';
                }
            } else {
                if (container) {
                    container.classList.remove('grupo-error');
                }
                if (errorMsg) {
                    errorMsg.textContent = '';
                }
            }
        }

        return valid;
    };

    function showStep(index) {
        const allFields = form.querySelectorAll('fieldset.form-group');
        for (let i = 0; i < allFields.length; i++) 
            allFields[i].style.display = 'none';

        const currentFieldset = legends[index].closest('fieldset');
        if (currentFieldset) 
            currentFieldset.style.display = 'block';

        const radios = currentFieldset?.querySelectorAll('input[type="radio"]');
        if (radios) {
            for (let i = 0; i < radios.length; i++) 
                radios[i].style.display = 'inline-block';
        }

        counter.textContent = 'Paso ' + (index + 1) + ' de ' + totalSteps;

        btnPrev.disabled = (index === 0);

        if (btnSubmit) {
            if (index === totalSteps - 1) {
                btnSubmit.style.display = 'flex';
            } else {
                btnSubmit.style.display = 'none';
            }
        }
        
        if (index === totalSteps - 1) 
            btnNext.style.display = 'none';
        else {
            btnNext.style.display = 'inline-flex';
            btnNext.innerHTML = 'Siguiente <i class="fa-solid fa-arrow-right"></i>';
            btnNext.className = 'btn-step btn-step-primary';
        }

        currentStep = index;
    }

    btnPrev.addEventListener('click', function() {
        if (currentStep > 0) {
            showStep(currentStep - 1);
            form.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    });

    btnNext.addEventListener('click', function() {
        if (currentStep === totalSteps - 1) {
            return;
        }

        const currentFieldset = legends[currentStep].closest('fieldset');

        if (!window.validarPaso(form, currentFieldset)) {
            const msg = form.querySelector('.form-message');
            if (msg) {
                msg.textContent = 'Por favor complete todos los campos obligatorios';
                msg.className = 'form-message form-message--error';
                msg.hidden = false;
                setTimeout(function() {
                    msg.hidden = true;
                }, 3000);
            }
            return;
        }

        if (currentStep < totalSteps - 1) {
            showStep(currentStep + 1);
            form.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    });

    const allFields = form.querySelectorAll('fieldset.form-group');
    for (let i = 1; i < allFields.length; i++) {
        allFields[i].style.display = 'none';
    }

    showStep(0);

    // Exponer función para resetear desde otros archivos JS
    form._resetStepper = function() {
        showStep(0);
    };
}

// Función global para resetear el stepper de un formulario por ID
window.resetStepper = function(formId) {
    const form = document.getElementById(formId);
    if (form && typeof form._resetStepper === 'function') {
        form._resetStepper();
    }
};