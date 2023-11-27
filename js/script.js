let users = [];

fetch('https://randomuser.me/api/?results=12&nat=us')
    .then(response => response.json())
    .then(data => {
        users = data.results;
        displayUsers(users);
    });

function displayUsers(users) {
    const container = document.querySelector('#gallery');
    container.innerHTML = ''; // Clear existing user cards
    users.forEach(user => {
        const html = `
                <div class="card" data-id="${user.login.uuid}">
                    <div class="card-img-container">
                        <img class="card-img" src="${user.picture.large}" alt="profile picture">
                    </div>
                    <div class="card-info-container">
                        <h3 id="name" class="card-name cap">${user.name.first} ${user.name.last}</h3>
                        <p class="card-text">${user.email}</p>
                        <p class="card-text cap">${user.location.city}, ${user.location.state}</p>
                    </div>
                </div>
            `;
        container.insertAdjacentHTML('beforeend', html);
    });
    // Add event listener to user cards
    document.querySelectorAll('.card').forEach(card => {
        card.addEventListener('click', (e) => {
            const id = e.currentTarget.dataset.id;
            const user = users.find(user => user.login.uuid === id);
            displayModal(user);
        });
    });
    // Function to display modal
    function displayModal(user) {
        const html = `
      <div class="modal-container">
        <div class="modal">
        <button id="modal-prev" class="modal-prev btn">Prev</button>
        <button id="modal-next" class="modal-next btn">Next</button>
            <button id="close-modal" class="modal-close-btn"><strong>X</strong></button>
            <div class="modal-info-container">
                <img src="${user.picture.large}" alt="${user.name.first} ${user.name.last}">
                <h3 id="name" class="modal-name cap">${user.name.first} ${user.name.last}</h3>
                <p class="modal-text">${user.email}</p>
                <p class="modal-text cap">${user.location.city}</p>         
                <p class="modal-text">${user.cell}</p>
                <p class="modal-text">${user.location.street.number} ${user.location.street.name}, ${user.location.state} ${user.location.postcode}</p>
                <p class="modal-text">Birthday: ${new Date(user.dob.date).toLocaleDateString()}</p>
        </div>
      </div>
    `;
        document.body.insertAdjacentHTML('beforeend', html);
        // Add event listeners to prev and next buttons
        document.querySelector('#modal-prev').addEventListener('click', () => {
            const index = users.indexOf(user);
            if (index > 0) {
                document.querySelector('.modal-container').remove();
                displayModal(users[index - 1], users);
            }
        });
        document.querySelector('#modal-next').addEventListener('click', () => {
            const index = users.indexOf(user);
            if (index < users.length - 1) {
                document.querySelector('.modal-container').remove();
                displayModal(users[index + 1], users);
            }
        });


        // Add event listener to user cards
        document.querySelectorAll('.card').forEach(card => {
            card.addEventListener('click', (e) => {
                const id = e.currentTarget.dataset.id;
                const user = users.find(user => user.login.uuid === id);
                displayModal(user, users);
            });
        });
    }
}

// Add search form to HTML
const searchContainer = document.querySelector('.search-container');
searchContainer.innerHTML = `
    <form action="#" method="get">
        <input type="search" id="search-input" class="search-input" placeholder="Search...">
        <input type="submit" value="&#x1F50D;" id="search-submit" class="search-submit">
    </form>
`;

// Add event listener to search form
document.querySelector('#search-input').addEventListener('input', (e) => {
    const searchTerm = e.target.value.toLowerCase();
    const filteredUsers = users.filter(user =>
        `${user.name.first} ${user.name.last}`.toLowerCase().includes(searchTerm)
    );
    displayUsers(filteredUsers);
});

// Event delegation for close button
document.body.addEventListener('click', (e) => {
    if (e.target.id === 'close-modal' || e.target.parentElement.id === 'close-modal') {
        const modal = document.querySelector('.modal-container');
        if (modal) {
            modal.remove();
        }
    }
});

