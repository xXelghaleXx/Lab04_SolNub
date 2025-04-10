document.addEventListener('DOMContentLoaded', function() {
  // Elementos del DOM
  const userForm = document.getElementById('userForm');
  const usersTable = document.getElementById('usersTable').getElementsByTagName('tbody')[0];
  const saveBtn = document.getElementById('saveBtn');
  const cancelBtn = document.getElementById('cancelBtn');
  const addUserBtn = document.getElementById('addUserBtn');
  
  // Estado de la aplicación
  let editMode = false;
  
  // Cargar usuarios al inicio
  loadUsers();
  
  // Event Listeners
  userForm.addEventListener('submit', saveUser);
  cancelBtn.addEventListener('click', resetForm);
  addUserBtn.addEventListener('click', () => {
    resetForm();
    document.querySelector('.user-form').scrollIntoView({ behavior: 'smooth' });
  });
  
  // Funciones
  async function loadUsers() {
    try {
      const response = await fetch('/api/users');
      const data = await response.json();
      
      if (data.success) {
        renderUsers(data.data);
      } else {
        showMessage('Error al cargar usuarios', 'error');
      }
    } catch (error) {
      console.error('Error:', error);
      showMessage('Error de conexión al servidor', 'error');
    }
  }
  
  function renderUsers(users) {
    // Limpiar tabla
    usersTable.innerHTML = '';
    
    if (users.length === 0) {
      const row = document.createElement('tr');
      row.innerHTML = '<td colspan="5" style="text-align: center;">No hay usuarios registrados</td>';
      usersTable.appendChild(row);
      return;
    }
    
    // Renderizar cada usuario
    users.forEach(user => {
      const row = document.createElement('tr');
      
      row.innerHTML = `
        <td>${user.id}</td>
        <td>${user.name}</td>
        <td>${user.email}</td>
        <td>${user.active ? 'Activo' : 'Inactivo'}</td>
        <td>
          <button class="edit-btn" data-id="${user.id}">Editar</button>
          <button class="delete-btn" data-id="${user.id}">Eliminar</button>
        </td>
      `;
      
      // Agregar event listeners a los botones
      row.querySelector('.edit-btn').addEventListener('click', () => editUser(user.id));
      row.querySelector('.delete-btn').addEventListener('click', () => deleteUser(user.id));
      
      usersTable.appendChild(row);
    });
  }
  
  async function saveUser(e) {
    e.preventDefault();
    
    const userId = document.getElementById('userId').value;
    const userData = {
      name: document.getElementById('name').value,
      email: document.getElementById('email').value,
      active: document.getElementById('active').checked
    };
    
    try {
      let response;
      
      if (editMode) {
        // Actualizar usuario existente
        response = await fetch(`/api/users/${userId}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(userData)
        });
      } else {
        // Crear nuevo usuario
        response = await fetch('/api/users', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(userData)
        });
      }
      
      const data = await response.json();
      
      if (data.success) {
        showMessage(editMode ? 'Usuario actualizado correctamente' : 'Usuario creado correctamente', 'success');
        resetForm();
        loadUsers();
      } else {
        showMessage(`Error: ${data.error}`, 'error');
      }
    } catch (error) {
      console.error('Error:', error);
      showMessage('Error al guardar el usuario', 'error');
    }
  }
  
  async function editUser(id) {
    try {
      const response = await fetch(`/api/users/${id}`);
      const data = await response.json();
      
      if (data.success) {
        const user = data.data;
        
        // Rellenar formulario
        document.getElementById('userId').value = user.id;
        document.getElementById('name').value = user.name;
        document.getElementById('email').value = user.email;
        document.getElementById('active').checked = user.active;
        
        // Cambiar a modo edición
        editMode = true;
        saveBtn.textContent = 'Actualizar';
        
        // Scroll al formulario
        document.querySelector('.user-form').scrollIntoView({ behavior: 'smooth' });
      } else {
        showMessage(`Error: ${data.message}`, 'error');
      }
    } catch (error) {
      console.error('Error:', error);
      showMessage('Error al cargar el usuario', 'error');
    }
  }
  
  async function deleteUser(id) {
    if (!confirm('¿Estás seguro de eliminar este usuario?')) {
      return;
    }
    
    try {
      const response = await fetch(`/api/users/${id}`, {
        method: 'DELETE'
      });
      
      const data = await response.json();
      
      if (data.success) {
        showMessage('Usuario eliminado correctamente', 'success');
        loadUsers();
      } else {
        showMessage(`Error: ${data.message}`, 'error');
      }
    } catch (error) {
      console.error('Error:', error);
      showMessage('Error al eliminar el usuario', 'error');
    }
  }
  
  function resetForm() {
    userForm.reset();
    document.getElementById('userId').value = '';
    editMode = false;
    saveBtn.textContent = 'Guardar';
  }
  
  function showMessage(message, type = 'info') {
    // Aquí podrías implementar un sistema de notificaciones
    alert(message);
  }
});
