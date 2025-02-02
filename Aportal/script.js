let currentIndex = 0;
const items = document.querySelectorAll('.carousel-item');
const totalItems = items.length;

document.getElementById('next').addEventListener('click', () => {
    currentIndex = (currentIndex + 1) % totalItems;
    updateCarousel();
});

document.getElementById('prev').addEventListener('click', () => {
    currentIndex = (currentIndex - 1 + totalItems) % totalItems;
    updateCarousel();
});

function updateCarousel() {
    items.forEach((item, index) => {
        item.style.transform = `translateX(-${currentIndex * 100}%)`;
    });
    updateDots();
}

function updateDots() {
    const dots = document.querySelectorAll('.dots button');
    dots.forEach(dot => dot.classList.remove('active'));
    dots[currentIndex].classList.add('active');
}

// Generate dots dynamically based on the number of items
const dotsContainer = document.querySelector('.dots');
for (let i = 0; i < totalItems; i++) {
    const dot = document.createElement('button');
    dot.addEventListener('click', () => {
        currentIndex = i;
        updateCarousel();
    });
    dotsContainer.appendChild(dot);
}

// Initialize the carousel
updateCarousel();
