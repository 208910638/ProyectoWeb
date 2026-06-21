document.addEventListener('DOMContentLoaded', function() {
    // Menú hamburguesa
    const menuToggle = document.querySelector('.menu-toggle');
    const mainNav = document.querySelector('.main-nav');
    const header = document.querySelector('.site-header');
    const body = document.body;

    if (menuToggle && mainNav) {
        menuToggle.addEventListener('click', function() {
            mainNav.classList.toggle('open');
            menuToggle.textContent = mainNav.classList.contains('open') ? '✕' : '☰';
            ajustarPaddingHeader();
        });
    }

    // Función que ajusta el padding-top del body según la altura real del header
    function ajustarPaddingHeader() {
        if (!header) return;
        // Calcula la altura total del header (incluyendo el menú desplegado)
        const headerHeight = header.offsetHeight;
        // Asigna ese valor como padding-top al body
        body.style.paddingTop = headerHeight + 'px';
    }

    // Ejecutar al cargar, al redimensionar y al abrir/cerrar el menú
    window.addEventListener('resize', ajustarPaddingHeader);
    // También al cargar la página
    ajustarPaddingHeader();

    // Página activa en automático
    const currentPage = window.location.pathname.split('/').pop() || 'index.html';
    const navLinks = document.querySelectorAll('.main-nav a');

    navLinks.forEach(link => {
        const linkPage = link.getAttribute('href');
        if (linkPage === currentPage) {
            link.classList.add('active');
        }
    });
});