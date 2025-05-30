  class Contact {
    constructor(name, email, phone) {
        this.name = name;
        this.email = email;
        this.phone = phone;
    }
}

   class ContactManager {
    constructor() {
        this.Contacts = this.loadContacts();
    }

      loadContacts() {
        const ContactsJSON = localStorage.getItem('Contacts');
        if (ContactsJSON) {
            const ContactsArray = JSON.parse(ContactsJSON);
            return ContactsArray.map(contact => new Contact(contact.name, contact.email, contact.phone));
        }
        return [];
    }

    saveContacts() {
        localStorage.setItem('Contacts', JSON.stringify(this.Contacts));
    }

    addContact(contact) {
        this.Contacts.push(contact);
        this.saveContacts();
    }

    updateContact(updateContact) {
        const index = this.Contacts.findIndex(contact => contact.email === updateContact.email);
        if (index !== -1) {
            this.Contacts[index] = updateContact;
            this.saveContacts();
        }
    }

    deleteContact(id) {
        this.Contacts = this.Contacts.filter(contact => contact.email !== id);
        this.saveContacts();
    }

      getContactById(id) {
        return this.Contacts.find(contact => contact.email === id);
    }
}

   const contactManager = new ContactManager();

const contactForm = document.getElementById('contact-form');
const nameInput = document.getElementById('name');
const emailInput = document.getElementById('email');
const phoneInput = document.getElementById('phone');
const submitButton = document.getElementById('submit-btn');
const contactIdInput = document.getElementById('contact-id');
const contactList = document.getElementById('contacts-list');

   function clearForm() {
    nameInput.value = '';
    emailInput.value = '';
    phoneInput.value = '';
    contactIdInput.value = '';
    submitButton.textContent = 'Add Contact';
}

function renderContacts() {
    contactList.innerHTML = '';
    if (contactManager.Contacts.length === 0) {
        contactList.innerHTML = '<p>No contacts available. Add one to get started Brother.</p>';
        return;
    }
    contactManager.Contacts.forEach(contact => {
        const contactDiv = document.createElement('div');
        contactDiv.className = 'contact-item';

  const contactInfo = document.createElement('div');
        contactInfo.className = 'contact-info';
        contactInfo.innerHTML = `
            <strong>${contact.name}</strong><br>
            Email: ${contact.email}<br>
            Phone: ${contact.phone}
        `;

       const actionDiv = document.createElement('div');
        actionDiv.className = 'contact-actions';

      const editButton = document.createElement('button');
        editButton.textContent = 'Edit';
        editButton.onclick = () => {
            nameInput.value = contact.name;
            emailInput.value = contact.email;
            phoneInput.value = contact.phone;
            contactIdInput.value = contact.email;
            submitButton.textContent = 'Update Contact';
        };

        const deleteButton = document.createElement('button');
        deleteButton.textContent = 'Delete';
        deleteButton.onclick = () => {
            if (confirm(`Are you sure you want to delete this contact: ${contact.name}?`)) {
                contactManager.deleteContact(contact.email);
                renderContacts();
                clearForm();
            }
        };

         actionDiv.appendChild(editButton);
        actionDiv.appendChild(deleteButton);
        contactDiv.appendChild(contactInfo);
        contactDiv.appendChild(actionDiv);

        contactList.appendChild(contactDiv);
    });
}

submitButton.addEventListener('click', (e) => {
    e.preventDefault();
    const name = nameInput.value.trim();
    const email = emailInput.value.trim();
    const phone = phoneInput.value.trim();

    if (!name || !email || !phone) {
        alert('Please fill in all fields and use your head, usinibebe ivo gathee.');
        return;
    }

    const id = contactIdInput.value;
     if (id) {
        const updateContact = new Contact(name, email, phone);
        contactManager.updateContact(updateContact);
        clearForm();
        renderContacts();
    } else {
        const newContact = new Contact(name, email, phone);
        contactManager.addContact(newContact);
        clearForm();
        renderContacts();
    }
});

renderContacts();
