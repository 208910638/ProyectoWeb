// =========================
//  SISTEMA DE PESTAÑAS
// =========================

document.addEventListener('DOMContentLoaded', function() {

    const tabs = document.querySelectorAll('.tab-btn');
    const panelPostulacion = document.getElementById('panelPostulacion');
    const panelRefugio = document.getElementById('panelRefugio');

    function switchTab(tabId) {
        // Desactivar todas las pestañas
        for (let i = 0; i < tabs.length; i++) {
            tabs[i].classList.remove('active');
            tabs[i].setAttribute('aria-selected', 'false');
        }

        // Ocultar todos los paneles
        if (panelPostulacion) {
            panelPostulacion.hidden = true;
        }
        if (panelRefugio) {
            panelRefugio.hidden = true;
        }

        // Activar la pestaña seleccionada
        const activeTab = document.querySelector('[data-tab="' + tabId + '"]');
        if (activeTab) {
            activeTab.classList.add('active');
            activeTab.setAttribute('aria-selected', 'true');
        }

        // Mostrar el panel correspondiente
        if (tabId === 'postulacion' && panelPostulacion) {
            panelPostulacion.hidden = false;
        }
        if (tabId === 'refugio' && panelRefugio) {
            panelRefugio.hidden = false;
        }
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

});