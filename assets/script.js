const dataContacts = [
  { id: 1, fullName: "Mochamad Irvan", phone: "62881080070700", email: "mchmdirvan@example.com", location: "Jakarta" },
  { id: 2, fullName: "Adhitya Sofyan", phone: "62881080080800", email: "adhitya@example.com", location: "Bandung" }
];

function displayContacts() {
  const tbody = document.getElementById('contactsTableBody');
  tbody.innerHTML = ''; // Clear current list
  if (dataContacts.length === 0) {
    tbody.innerHTML = `<tr><td colspan="5" class="p-4 text-center text-gray-500 italic">No contacts available</td></tr>`;
  } else {
    dataContacts.forEach(contact => {
      const row = document.createElement('tr');
      row.innerHTML = `
        <td class="p-2"><input type="checkbox" class="selectContact" onclick="toggleButtons()"></td>
        <td class="p-2">${contact.fullName}</td>
        <td class="p-2">${contact.email}</td>
        <td class="p-2">${contact.phone}</td>
        <td class="p-2">${contact.location}</td>
      `;
      tbody.appendChild(row);
    });
  }
}

function getLastId() {
  if (dataContacts.length === 0) return 1;
  return dataContacts[dataContacts.length - 1].id + 1;
}

function addContact(fullName, phone, email, location) {
  dataContacts.push({
    id: getLastId(),
    fullName: fullName,
    phone: phone,
    email: email,
    location: location
  });
  displayContacts();
}

function searchContacts(keyword) {
  const filteredContacts = dataContacts.filter(contact =>
    contact.fullName.toLowerCase().includes(keyword.toLowerCase()) ||
    contact.phone.includes(keyword)
  );
  displayFilteredContacts(filteredContacts);
}

function displayFilteredContacts(filteredContacts) {
  const tbody = document.getElementById('contactsTableBody');
  tbody.innerHTML = '';
  if (filteredContacts.length === 0) {
    tbody.innerHTML = `<tr><td colspan="5" class="p-4 text-center text-gray-500 italic">No contacts found</td></tr>`;
  } else {
    filteredContacts.forEach(contact => {
      const row = document.createElement('tr');
      row.innerHTML = `
        <td class="p-2"><input type="checkbox" class="selectContact" onclick="toggleButtons()"></td>
        <td class="p-2">${contact.fullName}</td>
        <td class="p-2">${contact.email}</td>
        <td class="p-2">${contact.phone}</td>
        <td class="p-2">${contact.location}</td>
      `;
      tbody.appendChild(row);
    });
  }
}

function toggleButtons() {
  const selectedContacts = document.querySelectorAll('.selectContact:checked');
  const editBtn = document.getElementById('editBtn');
  const deleteBtn = document.getElementById('deleteBtn');
  editBtn.disabled = selectedContacts.length !== 1;
  deleteBtn.disabled = selectedContacts.length === 0;
}

function closeModal() {
  document.getElementById('modal').classList.add('hidden');
}

document.getElementById('addBtn').addEventListener('click', () => {
  document.getElementById('modal').classList.remove('hidden');
});

document.getElementById('addContactForm').addEventListener('submit', (e) => {
  e.preventDefault();
  const fullName = document.getElementById('name').value;
  const phone = document.getElementById('phone').value;
  const email = document.getElementById('email').value;
  const location = document.getElementById('location').value;
  
  addContact(fullName, phone, email, location);
  closeModal();
});

document.getElementById('searchInput').addEventListener('input', (e) => {
  searchContacts(e.target.value);
});

// Initialize
displayContacts();