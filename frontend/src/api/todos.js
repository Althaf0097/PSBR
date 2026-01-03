/**
 * Todos API
 * 
 * This module provides functions for todo CRUD operations.
 * All functions require JWT authentication (handled automatically by axios interceptor).
 * 
 * All endpoints are scoped to the authenticated user - users can only
 * access and modify their own todos.
 */

import api from './axios';

export const todosAPI = {
  /**
   * Get all todos for the authenticated user
   * 
   * Retrieves todos with pagination, sorting, and optional filtering by completion status.
   * 
   * @param {number} page - Page number (0-indexed, default: 0)
   * @param {number} size - Number of items per page (default: 10)
   * @param {string} sortBy - Field to sort by: createdAt, dueDate, priority, title (default: createdAt)
   * @param {string} sortDir - Sort direction: asc or desc (default: desc)
   * @param {boolean|null} completed - Filter by completion: true (completed), false (pending), null (all)
   * @returns {Promise<Object>} Paginated response with todos array
   */
  getAll: async (page = 0, size = 10, sortBy = 'createdAt', sortDir = 'desc', completed = null) => {
    const params = { page, size, sortBy, sortDir };
    // Add completion filter only if specified
    if (completed !== null) {
      params.completed = completed;
    }
    const response = await api.get('/todos', { params });
    return response.data;
  },
  
  /**
   * Get a single todo by ID
   * 
   * @param {string} id - UUID of the todo
   * @returns {Promise<Object>} Todo object
   * @throws {Error} If todo not found or doesn't belong to user
   */
  getById: async (id) => {
    const response = await api.get(`/todos/${id}`);
    return response.data;
  },
  
  /**
   * Create a new todo
   * 
   * @param {Object} todo - Todo object with title, description, priority, dueDate
   * @returns {Promise<Object>} Created todo object with ID and timestamps
   */
  create: async (todo) => {
    const response = await api.post('/todos', todo);
    return response.data;
  },
  
  /**
   * Update an existing todo
   * 
   * @param {string} id - UUID of the todo to update
   * @param {Object} todo - Updated todo object
   * @returns {Promise<Object>} Updated todo object
   * @throws {Error} If todo not found or doesn't belong to user
   */
  update: async (id, todo) => {
    const response = await api.put(`/todos/${id}`, todo);
    return response.data;
  },
  
  /**
   * Delete a todo
   * 
   * @param {string} id - UUID of the todo to delete
   * @returns {Promise<void>}
   * @throws {Error} If todo not found or doesn't belong to user
   */
  delete: async (id) => {
    await api.delete(`/todos/${id}`);
  },
  
  /**
   * Toggle todo completion status
   * 
   * Switches a todo between completed and pending states.
   * 
   * @param {string} id - UUID of the todo to toggle
   * @returns {Promise<Object>} Updated todo object with new completion status
   * @throws {Error} If todo not found or doesn't belong to user
   */
  toggle: async (id) => {
    const response = await api.patch(`/todos/${id}/toggle`);
    return response.data;
  },
};


