document.addEventListener('DOMContentLoaded', function() {

    // Obtener elementos
    const tabs = document.querySelectorAll('.tab-btn');
    const panelPostulacion = document.getElementById('panelPostulacion');
    const panelRefugio = document.getElementById('panelRefugio');

    // Función para cambiar de pestaña
    function switchTab(tabId) {
        // Desactivar todas las pestañas
        for (let i = 0; i < tabs.length; i++) 
            tabs[i].classList.remove('active');

        // Ocultar todos los paneles
        if (panelPostulacion) 
            panelPostulacion.hidden = true;

        if (panelRefugio) 
            panelRefugio.hidden = true;

        // Activar la pestaña seleccionada
        const activeTab = document.querySelector('[data-tab="' + tabId + '"]');
        if (activeTab) 
            activeTab.classList.add('active');

        // Mostrar el panel correspondiente
        if (tabId === 'postulacion' && panelPostulacion) 
            panelPostulacion.hidden = false;
        else if (tabId === 'refugio' && panelRefugio) 
            panelRefugio.hidden = false;

    }

    // Agregar eventos a cada pestaña
    for (let i = 0; i < tabs.length; i++) {
        tabs[i].addEventListener('click', function() {
            const tabId = this.getAttribute('data-tab');
            switchTab(tabId);
        });
    }

    // Mostrar la primera pestaña por defecto
    switchTab('postulacion');

    // =========================
    //  INICIALIZAR STEPPER 
    // =========================
    setupStepper('formPostulacion');
    setupStepper('formRefugio');

});

// =========================
//  NAVEGACIÓN POR PASOS (STEPPER) 
// =========================

function setupStepper(formId) {
    const form = document.getElementById(formId);
    if (!form) {
        console.log('Formulario no encontrado:', formId);
        return;
    }

    // Buscar TODOS los legend dentro del formulario
    const legends = form.querySelectorAll('legend');
    const totalSteps = legends.length;

    console.log('Formulario:', formId, ' - Legends encontrados:', totalSteps);

    // Si no hay legends o solo hay uno, no hacer nada
    if (totalSteps <= 1) {
        console.log('No hay suficientes legends para el stepper');
        return;
    }

    let currentStep = 0;

    // Crear contenedor de navegación
    const navContainer = document.createElement('div');
    navContainer.className = 'step-navigation';

    // Contador 
    const counter = document.createElement('span');
    counter.className = 'step-counter';
    counter.textContent = 'Paso ' + (currentStep + 1) + ' de ' + totalSteps;

    // Botones
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

    // Agregar contador y botones al nav
    navContainer.appendChild(counter);
    navContainer.appendChild(buttons);

    // Insertar navegación después del último legend
    const lastLegend = legends[totalSteps - 1];
    const lastFieldset = lastLegend.closest('fieldset');
    if (lastFieldset) 
        lastFieldset.parentNode.insertBefore(navContainer, lastFieldset.nextSibling);

    // Mover el botón de enviar al final del último paso
    const btnSubmit = form.querySelector('.btn-submit');
    if (btnSubmit) {
        const lastStepContainer = legends[totalSteps - 1].closest('fieldset');
        if (lastStepContainer) 
            lastStepContainer.appendChild(btnSubmit);
    }

    // Función para ocultar/mostrar pasos
    function showStep(index) {
        // Ocultar todos los pasos (fieldset completos)
        const allFields = form.querySelectorAll('fieldset.form-group');
        for (let i = 0; i < allFields.length; i++) 
            allFields[i].style.display = 'none';

        // Mostrar solo el fieldset del paso actual
        const currentFieldset = legends[index].closest('fieldset');
        if (currentFieldset) 
            currentFieldset.style.display = 'block';

        // Forzar que los radio buttons sean visibles
        const radios = currentFieldset?.querySelectorAll('input[type="radio"]');
        if (radios) {
            for (let i = 0; i < radios.length; i++) 
                radios[i].style.display = 'inline-block';
        }

        // Actualizar contador
        counter.textContent = 'Paso ' + (index + 1) + ' de ' + totalSteps;

        // Actualizar botones
        btnPrev.disabled = (index === 0);
        
        // En el último paso, ocultar el botón "Siguiente"
        if (index === totalSteps - 1) 
            btnNext.style.display = 'none';
        else {
            btnNext.style.display = 'inline-flex';
            btnNext.innerHTML = 'Siguiente <i class="fa-solid fa-arrow-right"></i>';
            btnNext.className = 'btn-step btn-step-primary';
        }

        currentStep = index;
    }

    // Función para validar el paso actual
    function validarPaso(stepElement) {
        let valid = true;
        
        // 1. Validar inputs de texto, select y textarea (excluyendo radio buttons)
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
                input.classList.remove('input-error');
                if (errorMsg) {
                    errorMsg.textContent = '';
                }
            }
        }
        
        // 2. Validar todos los grupos de radio buttons
        const allRadios = stepElement.querySelectorAll('input[type="radio"]'); 
        const radioGroups = {};

        // Agrupar todos los radios por nombre
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

        // Validar cada grupo (solo si el grupo es obligatorio)
        for (const groupName in radioGroups) {
            const group = radioGroups[groupName];

            if (!group.required) {
                continue;
            }

            // Buscar el contenedor del grupo
            const firstRadio = group.elements[0];
            let container = firstRadio.closest('.radio-group');
            if (!container) {
                container = firstRadio.closest('.subgroup');
            }
            if (!container) {
                container = firstRadio.closest('.input-box');
            }

            // Buscar el mensaje de error asociado
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
    }

    // Evento para "Anterior"
    btnPrev.addEventListener('click', function() {
        if (currentStep > 0) {
            showStep(currentStep - 1);
            form.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    });

    // Evento para "Siguiente"
    btnNext.addEventListener('click', function() {
        // Si ya estamos en el último paso, no hacer nada
        if (currentStep === totalSteps - 1) {
            return;
        }

        const currentFieldset = legends[currentStep].closest('fieldset');

        if (!validarPaso(currentFieldset)) {
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

    // Ocultar todos los fieldset excepto el primero
    const allFields = form.querySelectorAll('fieldset.form-group');
    for (let i = 1; i < allFields.length; i++) {
        allFields[i].style.display = 'none';
    }

    // Iniciar en el paso 0
    showStep(0);
}