let users = [];

// Fetch the data from the JSON file
fetch('mockData.json')
  .then(response => response.json())
  .then(data => {
    users = data; // Assign the fetched data to the 'users' variable

    // Rest of your existing code...

    // Initial display
    displayUsers(currentPage);
    displayPagination();
  })
  .catch(error => console.error('Error fetching data:', error));

const usersPerPage = 20;
let currentPage = 1;
let currentFilters = {};
const teamMembers = [];

function displayUsers(page) {
  const filteredUsers = applyFilters(users);
  const startIndex = (page - 1) * usersPerPage;
  const endIndex = startIndex + usersPerPage;
  const usersOnPage = filteredUsers.slice(startIndex, endIndex);

  const userCardsContainer = document.getElementById('user-cards');
  userCardsContainer.innerHTML = '';

  usersOnPage.forEach(user => {
    const card = document.createElement('div');
    card.classList.add('card');

    const avatar = document.createElement('img');
    avatar.src = user.avatar;
    avatar.alt = `${user.first_name} ${user.last_name}'s avatar`;
    avatar.classList.add('avatar');

    const fullName = document.createElement('p');
    fullName.textContent = `${user.first_name} ${user.last_name}`;

    const email = document.createElement('p');
    email.textContent = user.email;

    card.appendChild(avatar);
    card.appendChild(fullName);
    card.appendChild(email);

    card.addEventListener('click', () => addToTeam(user.id));

    userCardsContainer.appendChild(card);
  });

  displayPagination();
}

function displayPagination() {
  const totalPages = Math.ceil(applyFilters(users).length / usersPerPage);
  const paginationContainer = document.getElementById('pagination');
  paginationContainer.innerHTML = '';

  for (let i = 1; i <= totalPages; i++) {
    const li = document.createElement('li');
    li.textContent = i;
    li.addEventListener('click', () => {
      currentPage = i;
      displayUsers(currentPage);
      updatePaginationStyles();
    });

    paginationContainer.appendChild(li);
  }

  updatePaginationStyles();
}

function updatePaginationStyles() {
  const paginationItems = document.querySelectorAll('.pagination li');
  paginationItems.forEach((item, index) => {
    if (index + 1 === currentPage) {
      item.style.fontWeight = 'bold';
    } else {
      item.style.fontWeight = 'normal';
    }
  });
}

function applyFilters(users) {
  return users.filter(user => {
    for (const key in currentFilters) {
      if (currentFilters[key] !== '' && String(user[key]) !== currentFilters[key]) {
        return false;
      }
    }
    return true;
  });
}

function filterUsers() {
currentFilters = {
  name: document.getElementById('name').value.toLowerCase(),
  domain: document.getElementById('domain').value,
  gender: document.getElementById('gender').value,
  availability: document.getElementById('availability').value,
};

currentPage = 1;
displayUsers(currentPage);
filterTeamDetails(); // Add this line to filter team details when the name is searched
}


function addToTeam(userId) {
const user = users.find(u => u.id === userId);

// Check if the user is available and not already in the team
if (user.available && !teamMembers.some(member => member.id === userId)) {
  // Check if the user's domain is unique in the team
  if (isUniqueDomain(user.domain)) {
    teamMembers.push(user);
    displayTeamDetails();
  } else {
    alert(`A user from the domain "${user.domain}" is already in the team.`);
  }
}
}

function isUniqueDomain(domain) {
// Check if the team already has a user from the same domain
return !teamMembers.some(member => member.domain === domain);
}


function displayTeamDetails() {
  const teamDetailsContainer = document.getElementById('team-details');
  teamDetailsContainer.innerHTML = '';

  teamMembers.forEach(member => {
    const li = document.createElement('li');
    li.textContent = `${member.first_name} ${member.last_name} (${member.domain})`;
    teamDetailsContainer.appendChild(li);
  });
}