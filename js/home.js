document.addEventListener('DOMContentLoaded', function() {
    fetch('data/home.json')
        .then(response => response.json())
        .then(data => {
            // Renderizar cifras del hero (10k+, 85%)
            const cifrasPet = document.querySelector('.inicio-content .cifras-container');
            if (cifrasPet) {
                cifrasPet.innerHTML = '';
                data.cifras.forEach(item => {
                    const card = document.createElement('div');
                    card.className = 'card';

                    const cardIcons = document.createElement('div');
                    cardIcons.className = 'card-icons';

                    item.iconos.forEach(iconClass => {
                        const icon = document.createElement('i');
                        icon.className = iconClass;
                        if (iconClass.includes('dog')) icon.classList.add('dog-icon');
                        else if (iconClass.includes('location')) icon.classList.add('location-icon');
                        else if (iconClass.includes('paw')) icon.classList.add('paw-icon');
                        else if (iconClass.includes('heart')) icon.classList.add('heart-icon');
                        cardIcons.appendChild(icon);
                    });

                    const numberSpan = document.createElement('span');
                    numberSpan.className = 'number';
                    numberSpan.textContent = item.estado;
                    cardIcons.appendChild(numberSpan);

                    const paragraph = document.createElement('p');
                    paragraph.textContent = item.descripcion;

                    card.appendChild(cardIcons);
                    card.appendChild(paragraph);
                    cifrasPet.appendChild(card);
                });
            }

            // Renderizar características (adopción responsable)
            const caracteristicasContainer = document.getElementById('cifras-adopcion');
            if (caracteristicasContainer) {
                caracteristicasContainer.innerHTML = '';
                data.caracteristicas.forEach(item => {
                    const card = document.createElement('div');
                    card.className = 'caracteristicas-info card';

                    const cardIcons = document.createElement('div');
                    cardIcons.className = 'card-icons';

                    item.iconos.forEach(iconClass => {
                        const icon = document.createElement('i');
                        icon.className = iconClass;
                        if (iconClass.includes('calendar')) icon.classList.add('calendar-icon');
                        else if (iconClass.includes('clock')) icon.classList.add('clock-icon');
                        else if (iconClass.includes('briefcase')) icon.classList.add('briefcase-medical-icon');
                        else if (iconClass.includes('stethoscope')) icon.classList.add('stethoscope-icon');
                        else if (iconClass.includes('baseball')) icon.classList.add('baseball-icon');
                        cardIcons.appendChild(icon);
                    });

                    const paragraph = document.createElement('p');
                    paragraph.innerHTML = `<strong>${item.titulo}: </strong>${item.descripcion}`;

                    card.appendChild(cardIcons);
                    card.appendChild(paragraph);
                    caracteristicasContainer.appendChild(card);
                });
            }

            // Renderizar Misión y Visión 
            const misionVisionContainer = document.getElementById('mision-vision-container');
            if (misionVisionContainer) {
                misionVisionContainer.innerHTML = '';
                data.mision_vision.forEach(item => {
                    const card = document.createElement('div');
                    card.className = 'card';

                    const cardIcons = document.createElement('div');
                    cardIcons.className = 'card-icons';

                    item.iconos.forEach(iconClass => {
                        const icon = document.createElement('i');
                        icon.className = iconClass;

                        cardIcons.appendChild(icon);
                    });

                    const title = document.createElement('h3');
                    title.textContent = item.titulo;
                    title.style.color = '#93CFA7'; 

                    const paragraph = document.createElement('p');
                    paragraph.textContent = item.descripcion;

                    card.appendChild(cardIcons);
                    card.appendChild(title);
                    card.appendChild(paragraph);
                    misionVisionContainer.appendChild(card);
                });
            }
        })
        .catch(error => console.error('Error cargando datos:', error));
});