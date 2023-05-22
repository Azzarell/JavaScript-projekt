class UserForm {
  constructor(formId, tableId) {
    this.form = document.getElementById(formId);
    this.tableBody = document.getElementById(tableId).getElementsByTagName('tbody')[0];
    this.users = JSON.parse(localStorage.getItem('users')) || [];
    this.editIndex = null;
    this.userFormTitle = document.getElementById('userFormTitle');
    this.submitBtn = this.form.querySelector('#submitBtn');
    this.cancelBtn = this.form.querySelector('#cancelBtn');
    this.sortColumn = null;
    this.sortDescending = false;
   
    this.init();

   
  }

  init() {
    const headers = Array.from(document.querySelectorAll('#userData th'));
    headers.forEach((header, index) => {
      if (index < 4) {
        header.innerHTML += '<i class="fas fa-sort ml-2"></i>';
        header.style.cursor = 'pointer';
        header.addEventListener('click', () => this.sortUsers(index));
      }
    });
    this.cancelBtn.addEventListener('click', (e) => this.cancelEdit(e));
    this.displayUsers();
    this.form.addEventListener('submit', (e) => this.handleSubmit(e));
  }

  displayUsers() {
    this.tableBody.innerHTML = '';
    this.users.forEach((user, index) => {
      const newRow = this.tableBody.insertRow();
      newRow.insertCell().textContent = user.name;
      newRow.insertCell().textContent = user.surname;
      newRow.insertCell().textContent = user.age;
      newRow.insertCell().textContent = user.phone;

      const actionCell = newRow.insertCell();
      actionCell.style.whiteSpace = 'nowrap';

      const editButton = document.createElement('button');
      editButton.classList.add('btn', 'btn-warning', 'mr-2', 'btn-sm');
      editButton.innerHTML = '<i class="fas fa-edit"></i>';
      editButton.title = 'Upravit';
      editButton.addEventListener('click', () => this.editUser(index));
      actionCell.appendChild(editButton);

      const removeButton = document.createElement('button');
      removeButton.classList.add('btn', 'btn-danger', 'btn-sm');
      removeButton.innerHTML = '<i class="fas fa-trash"></i>';
      removeButton.title = 'Odstranit';
      removeButton.addEventListener('click', (event) => {
        event.preventDefault();
        if (confirm('Opravdu chcete odstranit tohoto pojištěnce?')) {
          this.removeUser(index);
        }
      });
      removeButton.disabled = this.editIndex !== null;
      actionCell.appendChild(removeButton);

      if (this.editIndex === index) {
        newRow.classList.add('table-warning');
      }
    });
  }

  handleSubmit(e) {
    e.preventDefault();
    const nameInput = this.form.elements.name.value;
    const surnameInput = this.form.elements.surname.value;
    const ageInput = this.form.elements.age.value;
    const phoneInput = this.form.elements.phone.value;

    if (this.editIndex !== null) {
      this.users[this.editIndex] = {
        name: nameInput, surname: surnameInput, age: ageInput, phone: phoneInput
      };
      this.editIndex = null;
      this.userFormTitle.innerHTML = 'Vytvořit pojištence';
      this.submitBtn.textContent = 'Vytvořit';
      this.submitBtn.classList.replace('btn-success', 'btn-primary');
      this.cancelBtn.classList.add('d-none');
    } else {
      this.users.push({
        name: nameInput, surname: surnameInput, age: ageInput, phone: phoneInput
      });
    }

    try {
      localStorage.setItem('users', JSON.stringify(this.users));
      this.displayUsers();
      this.form.reset();
    } catch (error) {
      console.error("Error saving user:", error);
    }
  }

  editUser(index) {
    this.editIndex = index;
    this.form.elements.name.value = this.users[index].name;
    this.form.elements.surname.value = this.users[index].surname;
    this.form.elements.age.value = this.users[index].age;
    this.form.elements.phone.value = this.users[index].phone;
    this.userFormTitle.innerHTML = 'Upravit pojištence';
    this.submitBtn.textContent = 'Upravit';
    this.submitBtn.classList.replace('btn-primary', 'btn-success');
    this.cancelBtn.classList.remove('d-none');
    this.displayUsers();
  }

  cancelEdit(e) {
    e.preventDefault();
    this.editIndex = null;
    this.form.reset();
    this.userFormTitle.innerHTML = 'Vytvořit pojištence';
    this.submitBtn.textContent = 'Vytvořit';
    this.submitBtn.classList.replace('btn-success', 'btn-primary');
    this.cancelBtn.classList.add('d-none');
    this.displayUsers();
  }

  removeUser(index) {
    this.users.splice(index, 1);

    try {
      localStorage.setItem('users', JSON.stringify(this.users));
      this.displayUsers();
    } catch (error) {
      console.error("Error removing user:", error);
    }

  }
}

document.addEventListener('DOMContentLoaded', () => {
  try {
    new UserForm('userForm', 'userData');
  } catch (error) {
    console.error("Error initializing UserForm:", error);
  }
});
