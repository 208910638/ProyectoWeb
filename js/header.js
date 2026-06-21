document.addEventListener('DOMContentLoaded', function() {
    // Menú hamburguesa
    const menuToggle = document.querySelector('.menu-toggle');
    const mainNav = document.querySelector('.main-nav');

    if (menuToggle && mainNav) {
        menuToggle.addEventListener('click', function() {
            mainNav.classList.toggle('open');
            menuToggle.textContent = mainNav.classList.contains('open') ? '✕' : '☰';
        });
    }

    // Página activa en automático

    // window.location.pathname -> La ruta actual 
    // .split('/')              -> Corta la ruta por cada "/" y hace una lista
    // .pop()                   -> Saca el último elemento de esa lista ("contacto.html")
    // || 'index.html'          -> Si está vacío, usa "index.html" por defecto
    const currentPage = window.location.pathname.split('/').pop() || 'index.html';
    const navLinks = document.querySelectorAll('.main-nav a');

    navLinks.forEach(link => {
        const linkPage = link.getAttribute('href');
        if (linkPage === currentPage) {
            link.classList.add('active');
        }
    });

    // Menú hamburguesa - empuja el contenido en vez de superponerse
    if (mainNav) {
        // Debe coincidir con el padding-top base definido en base.css (body)
        const BASE_PADDING = 90;

        function ajustarEspacio() {
            if (mainNav.classList.contains('open') && window.innerWidth < 768) {
                const navHeight = mainNav.scrollHeight;
                document.body.style.paddingTop = (BASE_PADDING + navHeight) + 'px';
            } else {
                // Vuelve al padding-top definido en la hoja de estilos
                document.body.style.paddingTop = '';
            }
        }

        // Por si en el futuro algo más cambia la clase "open" en .main-nav
        const observer = new MutationObserver(ajustarEspacio);
        observer.observe(mainNav, { attributes: true, attributeFilter: ['class'] });

        // Por si la ventana cambia de tamaño (ej. rotar el celular)
        // mientras el menú está abierto
        window.addEventListener('resize', ajustarEspacio);
    }
});