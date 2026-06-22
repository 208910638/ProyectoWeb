document.addEventListener("DOMContentLoaded", () => {
    const searchInput = document.getElementById("search-input");
    const especieSelect = document.getElementById("filter-especie"); 
    const provinciaSelect = document.getElementById("filter-provincia"); 
    const tamanioSelect = document.getElementById("filter-tamanio"); 
    const cards = document.querySelectorAll(".pet-card");
    const noResults = document.getElementById("no-results");

    if (!searchInput) return;

    function filtrar() {
        const busqueda = searchInput.value.toLowerCase();
        
        // Obtenemos los valores
        const especie = especieSelect ? especieSelect.value : "todos";
        const provincia = provinciaSelect ? provinciaSelect.value : "todas";
        const tamanio = tamanioSelect ? tamanioSelect.value : "todos";
        
        let visibles = 0;

        cards.forEach(card => {
            const nombre = (card.dataset.nombre || "").toLowerCase();
            const esp = (card.dataset.especie || "").toLowerCase();
            const prov = (card.dataset.provincia || "").toLowerCase();
            const tam = (card.dataset.tamanio || "").toLowerCase(); 

            const matchNombre = nombre.includes(busqueda);
            const matchEspecie = (especie === "todos" || esp === especie);
            const matchProvincia = (provincia === "todas" || prov === provincia);
            const matchTamanio = (tamanio === "todos" || tam === tamanio);

    
            if (matchNombre && matchEspecie && matchProvincia) {
                card.style.display = "flex";
                visibles++;
            } else {
                card.style.display = "none";
            }
        });

        if (noResults) {
            noResults.style.display = visibles === 0 ? "block" : "none";
        }
    }

    if (searchInput) searchInput.addEventListener("input", filtrar);
    if (especieSelect) especieSelect.addEventListener("change", filtrar);
    if (provinciaSelect) provinciaSelect.addEventListener("change", filtrar);
    if (tamanioSelect) tamanioSelect.addEventListener("change", filtrar);
});