document.addEventListener("DOMContentLoaded", function () {
  let dataContacts = [
    { id: 1, fullName: "Haechan", phone: "62881080070700", email: "haechan@example.com", location: "Bandung" },
    { id: 2, fullName: "Keonho", phone: "62881080080800", email: "keonho@example.com", location: "Jakarta" }
  ];

  let selectedIds = [];
  let editId = null;

  const tbody = document.getElementById("contactsTableBody");
  const addBtn = document.getElementById("addBtn");
  const editBtn = document.getElementById("editBtn");
  const deleteBtn = document.getElementById("deleteBtn");
  const searchInput = document.getElementById("searchInput");
  const selectAll = document.getElementById("selectAll");
  const modal = document.getElementById("modal");
  const form = document.getElementById("addContactForm");
  const cancelBtn = document.getElementById("cancelBtn");

  const nameInput = document.getElementById("name");
  const emailInput = document.getElementById("email");
  const phoneInput = document.getElementById("phone");
  const locationInput = document.getElementById("location");

  function saveToLocalStorage() {
    localStorage.setItem("contacts", JSON.stringify(dataContacts));
  }

  function loadFromLocalStorage() {
    const saved = localStorage.getItem("contacts");
    if (!saved) {
      saveToLocalStorage();
      return;
    }
    try {
      const parsed = JSON.parse(saved);
      if (Array.isArray(parsed)) dataContacts = parsed;
      else saveToLocalStorage();
    } catch {
      localStorage.removeItem("contacts");
      saveToLocalStorage();
    }
  }

  function createNewId() {
    if (dataContacts.length === 0) return 1;
    return Math.max(...dataContacts.map(c => c.id)) + 1;
  }

  function toggleButtons() {
    editBtn.disabled = selectedIds.length !== 1;
    deleteBtn.disabled = selectedIds.length === 0;
  }

  function syncSelectAll() {
    const all = document.querySelectorAll(".selectContact");
    const checked = document.querySelectorAll(".selectContact:checked");
    selectAll.checked = all.length > 0 && all.length === checked.length;
  }

  function bindCheckboxEvents() {
    document.querySelectorAll(".selectContact").forEach(cb => {
      cb.addEventListener("change", function () {
        const id = Number(this.value);
        if (this.checked) {
          if (!selectedIds.includes(id)) selectedIds.push(id);
        } else {
          selectedIds = selectedIds.filter(x => x !== id);
        }
        syncSelectAll();
        toggleButtons();
      });
    });
  }

  function displayContacts(list = dataContacts) {
    tbody.innerHTML = "";
    selectedIds = [];
    selectAll.checked = false;
    toggleButtons();

    if (list.length === 0) {
      tbody.innerHTML = `
        <tr>
          <td colspan="5" class="p-4 text-center text-gray-400 italic">No contacts available</td>
        </tr>`;
      return;
    }

    list.forEach(contact => {
      const row = document.createElement("tr");
      row.className = "hover:bg-rose-50 transition";
      row.innerHTML = `
        <td class="p-2"><input type="checkbox" class="selectContact" value="${contact.id}"></td>
        <td class="p-2">${contact.fullName}</td>
        <td class="p-2">${contact.email}</td>
        <td class="p-2">${contact.phone}</td>
        <td class="p-2">${contact.location}</td>
      `;
      tbody.appendChild(row);
    });

    bindCheckboxEvents();
  }

  function toggleSelectAll(source) {
    selectedIds = [];
    document.querySelectorAll(".selectContact").forEach(cb => {
      cb.checked = source.checked;
      if (source.checked) selectedIds.push(Number(cb.value));
    });
    toggleButtons();
  }

  function validateForm() {
    const fullName = nameInput.value.trim();
    const email = emailInput.value.trim();
    const phone = phoneInput.value.trim();

    if (!fullName || !email || !phone) return false;
    if (!email.includes("@")) return false;
    if (!/^[0-9]+$/.test(phone)) return false;

    return true;
  }

  function openModal(mode) {
    modal.classList.remove("hidden");
    if (mode === "add") {
      editId = null;
      form.reset();
      document.getElementById("modalTitle").textContent = "Add Contact";
    } else {
      document.getElementById("modalTitle").textContent = "Edit Contact";
    }
  }

  function closeModal() {
    modal.classList.add("hidden");
    form.reset();
  }

  function addContact() {
    if (!validateForm()) return;

    dataContacts.push({
      id: createNewId(),
      fullName: nameInput.value.trim(),
      email: emailInput.value.trim(),
      phone: phoneInput.value.trim(),
      location: locationInput.value.trim()
    });

    saveToLocalStorage();
    displayContacts();
  }

  function startEdit() {
    if (selectedIds.length !== 1) return;

    const id = selectedIds[0];
    const contact = dataContacts.find(c => c.id === id);
    if (!contact) return;

    editId = id;

    nameInput.value = contact.fullName;
    emailInput.value = contact.email;
    phoneInput.value = contact.phone;
    locationInput.value = contact.location;

    openModal("edit");
  }

  function updateContact() {
    if (editId === null) return;
    if (!validateForm()) return;

    dataContacts = dataContacts.map(c => {
      if (c.id === editId) {
        return {
          ...c,
          fullName: nameInput.value.trim(),
          email: emailInput.value.trim(),
          phone: phoneInput.value.trim(),
          location: locationInput.value.trim()
        };
      }
      return c;
    });

    saveToLocalStorage();
    displayContacts();
  }

  function deleteContact() {
    dataContacts = dataContacts.filter(c => !selectedIds.includes(c.id));
    selectedIds = [];
    selectAll.checked = false;
    saveToLocalStorage();
    displayContacts();
    toggleButtons();
  }

  function searchContacts(keyword) {
    const key = keyword.toLowerCase();
    const filtered = dataContacts.filter(c =>
      c.fullName.toLowerCase().includes(key) ||
      c.email.toLowerCase().includes(key) ||
      c.phone.includes(key) ||
      c.location.toLowerCase().includes(key)
    );
    displayContacts(filtered);
  }

  addBtn.addEventListener("click", function () {
    openModal("add");
  });

  editBtn.addEventListener("click", function () {
    startEdit();
  });

  deleteBtn.addEventListener("click", function () {
    deleteContact();
  });

  selectAll.addEventListener("change", function () {
    toggleSelectAll(this);
  });

  searchInput.addEventListener("input", function (e) {
    searchContacts(e.target.value);
  });

  form.addEventListener("submit", function (e) {
    e.preventDefault();
    if (editId === null) addContact();
    else updateContact();
    closeModal();
  });

  cancelBtn.addEventListener("click", function () {
    closeModal();
  });

  loadFromLocalStorage();
  displayContacts();
});