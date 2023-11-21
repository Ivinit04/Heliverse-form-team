let users = [];
const selectedUsers = []; // Array to store selected users for creating a team
const teams = []; // Array to store teams, where each team is an array of selected users


// Fetch the data from the JSON file
fetch('mockData.json')
  .then(response => response.json())
  .then(data => {
    users = data; // Assign the fetched data to the 'users' variable

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
  card.setAttribute('data-user-id', user.id); // Add a data attribute to identify the user

  const avatar = document.createElement('img');
  avatar.src = user.avatar;
  avatar.alt = `${user.first_name} ${user.last_name}'s avatar`;
  avatar.classList.add('avatar');

  const fullName = document.createElement('p');
  fullName.textContent = `${user.first_name} ${user.last_name}`;

  const email = document.createElement('p');
  email.textContent = user.email;

  const gender = document.createElement('p');
  gender.textContent = `Gender: ${user.gender}`;

  const availability = document.createElement('p');
  availability.textContent = `Availability: ${user.available ? 'Available' : 'Not Available'}`;

  const domain = document.createElement('p');
  domain.textContent = `Domain: ${user.domain}`;

  card.appendChild(avatar);
  card.appendChild(fullName);
  card.appendChild(email);
  card.appendChild(gender);
  card.appendChild(availability);
  card.appendChild(domain);

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
    // Update the condition for the name filter
    if (currentFilters.name !== '' && `${user.first_name} ${user.last_name}`.toLowerCase().includes(currentFilters.name)) {
      return true;
    }

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
filterTeamDetails(); //  filter team details when the name is searched
}


function addToTeam(userId) {
  const user = users.find(u => u.id === userId);

  // Check if the user is available and not already in the selected users list
  if (user.available && !selectedUsers.some(selectedUser => selectedUser.id === userId)) {
      selectedUsers.push(user);

      // Add a visual indicator to the selected user card
      const selectedCard = document.querySelector(`.card[data-user-id="${userId}"]`);
      if (selectedCard) {
          selectedCard.classList.add('selected');
      }
  }
}

function createTeam() {
  // Check if there are selected users
  if (selectedUsers.length > 0) {
      // Add the selected users to the teamMembers array
      teams.push([...selectedUsers]);

      // Clear the selected users array after creating the team
      selectedUsers.length = 0;

      // Remove the visual indicator from all user cards
      const allCards = document.querySelectorAll('.card');
      allCards.forEach(card => card.classList.remove('selected'));

      // Display the updated team details
      displayTeamDetails();
      displayUsers(currentPage); 
  } else {
      alert("Select users before creating a team.");
  }
}

function isUniqueDomain(domain) {
// Check if the team already has a user from the same domain
return !teamMembers.some(member => member.domain === domain);
}


function displayTeamDetails() {
  const teamDetailsContainer = document.getElementById('team-details');
  teamDetailsContainer.innerHTML = '';

  teams.forEach((team, teamIndex) => {
      const teamListItem = document.createElement('li');
      teamListItem.textContent = `Team ${teamIndex + 1}:`;

      const teamMembersList = document.createElement('ul');
      team.forEach(user => {
          const memberListItem = document.createElement('li');
          memberListItem.textContent = `${user.first_name} ${user.last_name} (${user.domain})`;
          teamMembersList.appendChild(memberListItem);
      });

      teamListItem.appendChild(teamMembersList);
      teamDetailsContainer.appendChild(teamListItem);
  });
}