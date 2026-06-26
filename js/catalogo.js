document.addEventListener('DOMContentLoaded', function() {
    const grid = document.getElementById('pet-grid-container');
    const searchInput = document.getElementById('search-input');
    const especieSelect = document.getElementById('filter-especie');
    const provinciaSelect = document.getElementById('filter-provincia');
    const tamanioSelect = document.getElementById('filter-tamanio');

    let mascotas = []; 

    function normalizar(texto) {
        return texto.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase().replace(/\s/g, '');
    }

    // Obtener IDs de mascotas postuladas
    function getMascotasPostuladas() {
        return JSON.parse(localStorage.getItem('mascotasPostuladas')) || [];
    }

    function cargarMascotas() {
        fetch('data/mascotas.json')
            .then(response => response.json())
            .then(data => {
                const mascotasLocal = JSON.parse(localStorage.getItem('mascotasCatalogo')) || [];
                const idsExistentes = new Set(data.map(p => p.id));
                const nuevasMascotas = mascotasLocal.filter(p => !idsExistentes.has(p.id));
                
                // Combinar todas las mascotas
                let todasMascotas = [...data, ...nuevasMascotas];
                
                // Filtrar mascotas que NO estén postuladas
                const postuladas = getMascotasPostuladas();
                mascotas = todasMascotas.filter(p => !postuladas.includes(p.id));
                
                renderMascotas(mascotas);
            })
            .catch(error => console.error('Error cargando mascotas:', error));
    }

    cargarMascotas();

    function renderMascotas(lista) {
        if (!grid) return;
        grid.innerHTML = ''; 

        if (lista.length === 0) {
            grid.innerHTML = `<p class="no-results">No se encontraron mascotas con esos filtros.</p>`;
            return;
        }

        lista.forEach(pet => {
            const sexoIcon = pet.sexo === 'hembra' 
                ? '<i class="fa-solid fa-venus text-pink"></i>' 
                : '<i class="fa-solid fa-mars text-blue"></i>';

            const card = document.createElement('article');
            card.className = 'pet-card';
            card.dataset.especie = pet.especie;
            card.dataset.edad = pet.edad; 
            card.dataset.provincia = normalizar(pet.provincia);
            card.dataset.nombre = pet.nombre.toLowerCase();
            card.dataset.tamanio = pet.tamanio;

            const imagenSrc = pet.imagen && pet.imagen.startsWith('data:image') 
                ? pet.imagen 
                : pet.imagen || pet.imagen_fallback || 'img/default.jpg';

            card.innerHTML = `
                <div class="pet-badge">ID: ${pet.id}</div>
                <img src="${imagenSrc}" alt="Foto de ${pet.nombre}" class="pet-image" onerror="this.src='${pet.imagen_fallback || 'img/default.jpg'}'">
                <div class="pet-info">
                    <h2 class="pet-name">${pet.nombre} ${sexoIcon}</h2>
                    <p class="pet-breed"><i class="fa-solid fa-paw"></i> ${pet.raza || 'Raza no especificada'}</p>
                    <ul class="pet-details-list">
                        <li><i class="fa-solid fa-cake-candles"></i> ${pet.edad || 'Edad no especificada'}</li>
                        <li><i class="fa-solid fa-weight-scale"></i> ${pet.peso || 'Peso no especificado'}</li>
                        <li><i class="fa-solid fa-location-dot"></i> ${pet.provincia || 'Ubicación no especificada'}</li>
                    </ul>
                    <p class="pet-description">${pet.descripcion || 'Mascota en busca de un hogar lleno de amor.'}</p>
                    <a href="formulario.html?id=${pet.id}&nombre=${pet.nombre}&especie=${pet.especie}&sexo=${pet.sexo}&edad=${pet.edad}&peso=${pet.peso}" class="btn-adoptar">Adoptar a ${pet.nombre}</a>
                </div>
            `;
            grid.appendChild(card);
        });
    }

    function filtrar() {
        const busqueda = searchInput ? searchInput.value.toLowerCase() : '';
        const especie = especieSelect ? especieSelect.value : 'todos';
        const provincia = provinciaSelect ? provinciaSelect.value : 'todas';
        const provinciaNormalizada = normalizar(provincia);
        const tamanio = tamanioSelect ? tamanioSelect.value : 'todos';

        const filtradas = mascotas.filter(pet => {
            const nombre = pet.nombre.toLowerCase();
            const esp = pet.especie;
            const prov = normalizar(pet.provincia || '');   
            const tam = pet.tamanio;

            const matchNombre = nombre.includes(busqueda);
            const matchEspecie = (especie === 'todos' || esp === especie);
            const matchProvincia = (provincia === 'todas' || prov === provinciaNormalizada);
            const matchTamanio = (tamanio === 'todos' || tam === tamanio);

            return matchNombre && matchEspecie && matchProvincia && matchTamanio;
        });

        renderMascotas(filtradas);
    }

    if (searchInput) searchInput.addEventListener('input', filtrar);
    if (especieSelect) especieSelect.addEventListener('change', filtrar);
    if (provinciaSelect) provinciaSelect.addEventListener('change', filtrar);
    if (tamanioSelect) tamanioSelect.addEventListener('change', filtrar);

    // Escuchar cambios en localStorage
    window.addEventListener('storage', function(e) {
        if (e.key === 'mascotasCatalogo' || e.key === 'mascotasPostuladas') {
            cargarMascotas();
        }
    });
});