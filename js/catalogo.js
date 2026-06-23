document.addEventListener('DOMContentLoaded', function() {
    const grid = document.getElementById('pet-grid-container');
    const searchInput = document.getElementById('search-input');
    const especieSelect = document.getElementById('filter-especie');
    const provinciaSelect = document.getElementById('filter-provincia');
    const tamanioSelect = document.getElementById('filter-tamanio');

    let mascotas = []; // Almacenará los datos cargados

    // Función para quitar tildes, espacios y poner en minúscula
    function normalizar(texto) {
        return texto.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase().replace(/\s/g, '');
    }

    // Cargar datos del JSON
    fetch('data/mascotas.json')
        .then(response => response.json())
        .then(data => {
            mascotas = data;
            renderMascotas(mascotas);
        })
        .catch(error => console.error('Error cargando mascotas:', error));

    // Función para renderizar las tarjetas
    function renderMascotas(lista) {
        if (!grid) return;
        grid.innerHTML = ''; // Limpiar

        if (lista.length === 0) {
            grid.innerHTML = `<p class="no-results">No se encontraron mascotas con esos filtros.</p>`;
            return;
        }

        lista.forEach(pet => {
            // Determinar icono de sexo
            const sexoIcon = pet.sexo === 'hembra' 
                ? '<i class="fa-solid fa-venus text-pink"></i>' 
                : '<i class="fa-solid fa-mars text-blue"></i>';

            // Crear la tarjeta
            const card = document.createElement('article');
            card.className = 'pet-card';
            // Atributos para filtros (coinciden con los datos)
            card.dataset.especie = pet.especie;
            card.dataset.edad = pet.edad; // si quieres
            card.dataset.provincia = normalizar(pet.provincia);
            card.dataset.nombre = pet.nombre.toLowerCase();
            card.dataset.tamanio = pet.tamanio;

            card.innerHTML = `
                <div class="pet-badge">ID: ${pet.id}</div>
                <img src="${pet.imagen}" alt="Foto de ${pet.nombre}" class="pet-image" onerror="this.src='${pet.imagen_fallback}'">
                <div class="pet-info">
                    <h2 class="pet-name">${pet.nombre} ${sexoIcon}</h2>
                    <p class="pet-breed"><i class="fa-solid fa-paw"></i> ${pet.raza}</p>
                    <ul class="pet-details-list">
                        <li><i class="fa-solid fa-cake-candles"></i> ${pet.edad}</li>
                        <li><i class="fa-solid fa-weight-scale"></i> ${pet.peso}</li>
                        <li><i class="fa-solid fa-location-dot"></i> ${pet.provincia}</li>
                    </ul>
                    <p class="pet-description">${pet.descripcion}</p>
                    <a href="formulario.html?id=${pet.id}&nombre=${pet.nombre}" class="btn-adoptar">Adoptar a ${pet.nombre}</a>
                </div>
            `;
            grid.appendChild(card);
        });
    }

    // Función de filtrado
    function filtrar() {
        const busqueda = searchInput ? searchInput.value.toLowerCase() : '';
        const especie = especieSelect ? especieSelect.value : 'todos';
        const provincia = provinciaSelect ? provinciaSelect.value : 'todas';
        const provinciaNormalizada = normalizar(provincia);
        const tamanio = tamanioSelect ? tamanioSelect.value : 'todos';

        const filtradas = mascotas.filter(pet => {
            const nombre = pet.nombre.toLowerCase();
            const esp = pet.especie;
            const prov = normalizar(pet.provincia);   
            const tam = pet.tamanio;

            const matchNombre = nombre.includes(busqueda);
            const matchEspecie = (especie === 'todos' || esp === especie);
            const matchProvincia = (provincia === 'todas' || prov === provinciaNormalizada);
            const matchTamanio = (tamanio === 'todos' || tam === tamanio);

            return matchNombre && matchEspecie && matchProvincia && matchTamanio;
        });

        renderMascotas(filtradas);
    }

    // Eventos de filtros
    if (searchInput) searchInput.addEventListener('input', filtrar);
    if (especieSelect) especieSelect.addEventListener('change', filtrar);
    if (provinciaSelect) provinciaSelect.addEventListener('change', filtrar);
    if (tamanioSelect) tamanioSelect.addEventListener('change', filtrar);
});