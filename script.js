document.addEventListener('DOMContentLoaded', function () {
    const heroSection = document.querySelector('.hero');
    const cardsContainer = document.querySelector('.cards');
    const loader = document.querySelector('.cards .loader');
    const reservationForm = document.getElementById('reservation-form');
    const reservationButton = document.getElementById('reservation-button');
    const filterPills = document.querySelectorAll('.filters .pill');

    const bowl1 = document.getElementById('bowl-wrap-1');
    const bowl2 = document.getElementById('bowl-wrap-2');
    const bowlImg1 = document.getElementById('bowl-img-1');
    const bowlImg2 = document.getElementById('bowl-img-2');

    const initializePage = async (category = 'all') => {
        if (!cardsContainer || !loader) return;
        
        loader.style.display = 'block';
        cardsContainer.innerHTML = ''; 
        cardsContainer.appendChild(loader);

        try {
            const menuItems = await fetchMenuItems(category);

            // --- 1. Populate Hero Bowl Slider ---
            if (bowlImg1 && bowlImg2 && menuItems.length > 0) {
                bowlImg1.src = menuItems[0].image;
                bowlImg2.src = menuItems.length > 1 ? menuItems[1].image : menuItems[0].image;

                if (menuItems.length > 1) {
                    // Add click listeners to both bowls to trigger the swap
                    bowl1.addEventListener('click', () => heroSection.classList.toggle('is-swapped'));
                    bowl2.addEventListener('click', () => heroSection.classList.toggle('is-swapped'));
                }
            }
            
            // --- 2. Populate Menu Cards ---
            if (menuItems.length === 0) {
                cardsContainer.innerHTML = '<p>No menu items found for this category.</p>';
                return;
            }
            
            menuItems.forEach((item, index) => {
                const card = document.createElement('article');
                card.className = 'card-item anim-slide-up';
                card.style.animationDelay = `${index * 0.1}s`;
                card.innerHTML = `
                    <img src="${item.image}" alt="${item.name}">
                    <div class="card-header"><h3>${item.name}</h3></div>
                    <p class="muted">${item.description}</p>
                    <div class="card-foot">
                        <div class="price-small">$${item.price}</div>
                        <button class="btn-small">Add to cart</button>
                    </div>
                `;
                cardsContainer.appendChild(card);
            });

        } catch (error) {
            console.error('Error populating page:', error);
            cardsContainer.innerHTML = '<p>Sorry, we couldn\'t load the menu.</p>';
        } finally {
            loader.style.display = 'none';
        }
    };
    
    // --- Filter Logic ---
    filterPills.forEach(pill => {
        pill.addEventListener('click', () => {
            document.querySelector('.pill.selected').classList.remove('selected');
            pill.classList.add('selected');
            const category = pill.getAttribute('data-category');
            populateMenuCards(category); 
        });
    });

    const populateMenuCards = async (category) => {
        loader.style.display = 'block';
        cardsContainer.innerHTML = '';
        cardsContainer.appendChild(loader);
        try {
            const menuItems = await fetchMenuItems(category);
            if (menuItems.length === 0) {
                cardsContainer.innerHTML = '<p>No menu items found for this category.</p>';
                return;
            }
            menuItems.forEach((item, index) => {
                 const card = document.createElement('article');
                card.className = 'card-item anim-slide-up';
                card.style.animationDelay = `${index * 0.1}s`;
                card.innerHTML = `
                    <img src="${item.image}" alt="${item.name}">
                    <div class="card-header"><h3>${item.name}</h3></div>
                    <p class="muted">${item.description}</p>
                    <div class="card-foot">
                        <div class="price-small">$${item.price}</div>
                        <button class="btn-small">Add to cart</button>
                    </div>
                `;
                cardsContainer.appendChild(card);
            });
        } catch(error) {
             cardsContainer.innerHTML = '<p>Sorry, we couldn\'t load the menu.</p>';
        } finally {
             loader.style.display = 'none';
        }
    }

    // --- Reservation Form Logic ---
    if (reservationForm) {
        reservationForm.addEventListener('submit', async (event) => {
            event.preventDefault();
            reservationButton.disabled = true;
            reservationButton.textContent = 'Booking...';
            try {
                const result = await createReservation(
                    document.getElementById('name').value,
                    document.getElementById('date').value,
                    document.getElementById('time').value,
                    document.getElementById('guests').value
                );
                if (result) {
                    alert('Reservation successful!');
                    reservationForm.reset();
                } else { throw new Error('Server error.'); }
            } catch (error) {
                alert('There was an error with your reservation.');
            } finally {
                reservationButton.disabled = false;
                reservationButton.textContent = 'Book Now';
            }
        });
    }

    // Initial page load
    initializePage('all');
});