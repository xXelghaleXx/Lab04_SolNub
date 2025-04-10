const request = require('supertest');
const app = require('../src/app');
const { User } = require('../src/models');

// Datos de prueba
const testUser = {
  name: 'Usuario de Prueba',
  email: 'test@example.com',
  active: true
};

let createdUserId;

// Limpiar la base de datos antes de las pruebas
beforeAll(async () => {
  await User.destroy({ where: {}, force: true });
});

// Tests para la API
describe('API de Usuarios', () => {
  // Test para crear usuario
  test('POST /api/users - Debe crear un nuevo usuario', async () => {
    const response = await request(app)
      .post('/api/users')
      .send(testUser)
      .expect('Content-Type', /json/)
      .expect(201);
    
    expect(response.body.success).toBe(true);
    expect(response.body.data).toHaveProperty('id');
    expect(response.body.data.name).toBe(testUser.name);
    expect(response.body.data.email).toBe(testUser.email);
    
    createdUserId = response.body.data.id;
  });
  
  // Test para obtener todos los usuarios
  test('GET /api/users - Debe obtener todos los usuarios', async () => {
    const response = await request(app)
      .get('/api/users')
      .expect('Content-Type', /json/)
      .expect(200);
    
    expect(response.body.success).toBe(true);
    expect(response.body.data).toBeInstanceOf(Array);
    expect(response.body.data.length).toBeGreaterThan(0);
  });
  
  // Test para obtener un usuario por ID
  test('GET /api/users/:id - Debe obtener un usuario por ID', async () => {
    const response = await request(app)
      .get(`/api/users/${createdUserId}`)
      .expect('Content-Type', /json/)
      .expect(200);
    
    expect(response.body.success).toBe(true);
    expect(response.body.data.id).toBe(createdUserId);
    expect(response.body.data.name).toBe(testUser.name);
    expect(response.body.data.email).toBe(testUser.email);
  });
  
  // Test para actualizar un usuario
  test('PUT /api/users/:id - Debe actualizar un usuario existente', async () => {
    const updatedUser = {
      name: 'Usuario Actualizado',
      email: testUser.email,
      active: false
    };
    
    const response = await request(app)
      .put(`/api/users/${createdUserId}`)
      .send(updatedUser)
      .expect('Content-Type', /json/)
      .expect(200);
    
    expect(response.body.success).toBe(true);
    expect(response.body.data.id).toBe(createdUserId);
    expect(response.body.data.name).toBe(updatedUser.name);
    expect(response.body.data.active).toBe(updatedUser.active);
  });
  
  // Test para eliminar un usuario
  test('DELETE /api/users/:id - Debe eliminar un usuario existente', async () => {
    const response = await request(app)
      .delete(`/api/users/${createdUserId}`)
      .expect('Content-Type', /json/)
      .expect(200);
    
    expect(response.body.success).toBe(true);
    
    // Verificar que el usuario ha sido eliminado
    const checkResponse = await request(app)
      .get(`/api/users/${createdUserId}`)
      .expect('Content-Type', /json/)
      .expect(404);
    
    expect(checkResponse.body.success).toBe(false);
  });
  
  // Test para manejar ID no existente
  test('GET /api/users/:id - Debe manejar ID de usuario no existente', async () => {
    const nonExistentId = 9999;
    
    const response = await request(app)
      .get(`/api/users/${nonExistentId}`)
      .expect('Content-Type', /json/)
      .expect(404);
    
    expect(response.body.success).toBe(false);
    expect(response.body.message).toContain(`Usuario con ID ${nonExistentId} no encontrado`);
  });
  
  // Test para validación de email
  test('POST /api/users - Debe validar el email', async () => {
    const invalidUser = {
      name: 'Usuario Inválido',
      email: 'invalid-email',
      active: true
    };
    
    const response = await request(app)
      .post('/api/users')
      .send(invalidUser)
      .expect('Content-Type', /json/)
      .expect(400);
    
    expect(response.body.success).toBe(false);
    expect(response.body.error).toBe('Error de validación');
  });
  
  // Test para campos requeridos
  test('POST /api/users - Debe validar campos requeridos', async () => {
    const incompleteUser = {
      // Sin nombre
      email: 'incomplete@example.com',
      active: true
    };
    
    const response = await request(app)
      .post('/api/users')
      .send(incompleteUser)
      .expect('Content-Type', /json/)
      .expect(400);
    
    expect(response.body.success).toBe(false);
  });
});

// Limpiar después de las pruebas
afterAll(async () => {
  await User.destroy({ where: {}, force: true });
});
