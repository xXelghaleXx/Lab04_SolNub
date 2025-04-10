document.addEventListener('DOMContentLoaded', function() {
  // Elementos del DOM para usuarios
  const userForm = document.getElementById('userForm');
  const usersTable = document.getElementById('usersTable').getElementsByTagName('tbody')[0];
  const saveBtn = document.getElementById('saveBtn');
  const cancelBtn = document.getElementById('cancelBtn');
  const addUserBtn = document.getElementById('addUserBtn');
  
  // Elementos del DOM para productos
  const productForm = document.getElementById('productForm');
  const productsTable = document.getElementById('productsTable').getElementsByTagName('tbody')[0];
  const saveProductBtn = document.getElementById('saveProductBtn');
  const cancelProductBtn = document.getElementById('cancelProductBtn');
  const addProductBtn = document.getElementById('addProductBtn');
  
  // Estado de la aplicación
  let editMode = false;
  let editProductMode = false;
  
  // Cargar usuarios y productos al inicio
  loadUsers();
  loadProducts();
  
  // Event Listeners para usuarios
  userForm.addEventListener('submit', saveUser);
  cancelBtn.addEventListener('click', resetForm);
  addUserBtn.addEventListener('click', () => {
    resetForm();
    document.querySelector('.user-form').scrollIntoView({ behavior: 'smooth' });
  });
  
  // Event Listeners para productos
  productForm.addEventListener('submit', saveProduct);
  cancelProductBtn.addEventListener('click', resetProductForm);
  addProductBtn.addEventListener('click', () => {
    resetProductForm();
    document.querySelector('.product-form').scrollIntoView({ behavior: 'smooth' });
  });
  
  // Funciones para usuarios
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
          <button class="action-btn edit-btn" data-id="${user.id}"><i class="fas fa-edit edit"></i></button>
          <button class="action-btn delete-btn" data-id="${user.id}"><i class="fas fa-trash-alt delete"></i></button>
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
        saveBtn.innerHTML = '<i class="fas fa-save"></i> Actualizar';
        
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
    saveBtn.innerHTML = '<i class="fas fa-save"></i> Guardar';
  }
  
  // Funciones para productos
  async function loadProducts() {
    try {
      const response = await fetch('/api/products');
      const data = await response.json();
      
      if (data.success) {
        renderProducts(data.data);
      } else {
        showMessage('Error al cargar productos', 'error');
      }
    } catch (error) {
      console.error('Error:', error);
      showMessage('Error de conexión al servidor', 'error');
    }
  }
  
  function renderProducts(products) {
    // Limpiar tabla
    productsTable.innerHTML = '';
    
    if (products.length === 0) {
      const row = document.createElement('tr');
      row.innerHTML = '<td colspan="5" style="text-align: center;">No hay productos registrados</td>';
      productsTable.appendChild(row);
      return;
    }
    
    // Renderizar cada producto
    products.forEach(product => {
      const row = document.createElement('tr');
      
      row.innerHTML = `
        <td>${product.id}</td>
        <td>${product.name}</td>
        <td>${product.price.toFixed(2)} €</td>
        <td>${product.stock}</td>
        <td>
          <button class="action-btn edit-product-btn" data-id="${product.id}"><i class="fas fa-edit edit"></i></button>
          <button class="action-btn delete-product-btn" data-id="${product.id}"><i class="fas fa-trash-alt delete"></i></button>
        </td>
      `;
      
      // Agregar event listeners a los botones
      row.querySelector('.edit-product-btn').addEventListener('click', () => editProduct(product.id));
      row.querySelector('.delete-product-btn').addEventListener('click', () => deleteProduct(product.id));
      
      productsTable.appendChild(row);
    });
  }
  
  async function saveProduct(e) {
    e.preventDefault();
    
    const productId = document.getElementById('productId').value;
    const productData = {
      name: document.getElementById('productName').value,
      price: parseFloat(document.getElementById('price').value),
      stock: parseInt(document.getElementById('stock').value, 10)
    };
    
    try {
      let response;
      
      if (editProductMode) {
        // Actualizar producto existente
        response = await fetch(`/api/products/${productId}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(productData)
        });
      } else {
        // Crear nuevo producto
        response = await fetch('/api/products', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(productData)
        });
      }
      
      const data = await response.json();
      
      if (data.success) {
        showMessage(editProductMode ? 'Producto actualizado correctamente' : 'Producto creado correctamente', 'success');
        resetProductForm();
        loadProducts();
      } else {
        showMessage(`Error: ${data.error}`, 'error');
      }
    } catch (error) {
      console.error('Error:', error);
      showMessage('Error al guardar el producto', 'error');
    }
  }
  
  async function editProduct(id) {
    try {
      const response = await fetch(`/api/products/${id}`);
      const data = await response.json();
      
      if (data.success) {
        const product = data.data;
        
        // Rellenar formulario
        document.getElementById('productId').value = product.id;
        document.getElementById('productName').value = product.name;
        document.getElementById('price').value = product.price;
        document.getElementById('stock').value = product.stock;
        
        // Cambiar a modo edición
        editProductMode = true;
        saveProductBtn.innerHTML = '<i class="fas fa-save"></i> Actualizar';
        
        // Scroll al formulario
        document.querySelector('.product-form').scrollIntoView({ behavior: 'smooth' });
      } else {
        showMessage(`Error: ${data.message}`, 'error');
      }
    } catch (error) {