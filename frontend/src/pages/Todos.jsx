import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { todosAPI } from '../api/todos';
import Button from '../components/common/Button';
import Input from '../components/common/Input';
import Modal from '../components/common/Modal';

const Todos = () => {
  const { user, logout } = useAuth();
  const [todos, setTodos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTodo, setEditingTodo] = useState(null);
  const [filter, setFilter] = useState('all'); // all, completed, pending
  const [sortBy, setSortBy] = useState('createdAt');
  const [sortDir, setSortDir] = useState('desc');
  
  // Form state
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [priority, setPriority] = useState('MEDIUM');
  const [dueDate, setDueDate] = useState('');

  useEffect(() => {
    loadTodos();
  }, [filter, sortBy, sortDir]);

  const loadTodos = async () => {
    try {
      setLoading(true);
      const completed = filter === 'all' ? null : filter === 'completed';
      const response = await todosAPI.getAll(0, 100, sortBy, sortDir, completed);
      setTodos(response.content || []);
      setError('');
    } catch (err) {
      setError('Failed to load todos. Please try again.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = () => {
    setEditingTodo(null);
    setTitle('');
    setDescription('');
    setPriority('MEDIUM');
    setDueDate('');
    setIsModalOpen(true);
  };

  const handleEdit = (todo) => {
    setEditingTodo(todo);
    setTitle(todo.title);
    setDescription(todo.description || '');
    setPriority(todo.priority);
    setDueDate(todo.dueDate || '');
    setIsModalOpen(true);
  };

  const handleSave = async () => {
    try {
      const todoData = {
        title,
        description,
        priority,
        dueDate: dueDate || null,
      };

      if (editingTodo) {
        await todosAPI.update(editingTodo.id, todoData);
      } else {
        await todosAPI.create(todoData);
      }

      setIsModalOpen(false);
      loadTodos();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to save todo');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this todo?')) return;

    try {
      await todosAPI.delete(id);
      loadTodos();
    } catch (err) {
      setError('Failed to delete todo');
    }
  };

  const handleToggle = async (id) => {
    try {
      await todosAPI.toggle(id);
      loadTodos();
    } catch (err) {
      setError('Failed to toggle todo');
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'HIGH':
        return 'bg-red-100 text-red-800';
      case 'MEDIUM':
        return 'bg-yellow-100 text-yellow-800';
      case 'LOW':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'No due date';
    return new Date(dateString).toLocaleDateString();
  };

  const isOverdue = (dueDate) => {
    if (!dueDate) return false;
    return new Date(dueDate) < new Date() && !new Date(dueDate).toDateString() === new Date().toDateString();
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-800">My Todos</h1>
          <div className="flex items-center gap-4">
            <span className="text-sm text-gray-600">Welcome, {user?.username}</span>
            <Button onClick={logout} variant="secondary">Logout</Button>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Filters and Sort */}
        <div className="bg-white rounded-lg shadow p-4 mb-6">
          <div className="flex flex-wrap gap-4 items-center">
            <div className="flex gap-2">
              <Button
                variant={filter === 'all' ? 'primary' : 'secondary'}
                onClick={() => setFilter('all')}
              >
                All
              </Button>
              <Button
                variant={filter === 'pending' ? 'primary' : 'secondary'}
                onClick={() => setFilter('pending')}
              >
                Pending
              </Button>
              <Button
                variant={filter === 'completed' ? 'primary' : 'secondary'}
                onClick={() => setFilter('completed')}
              >
                Completed
              </Button>
            </div>

            <div className="flex gap-2 items-center ml-auto">
              <label className="text-sm text-gray-600">Sort by:</label>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="px-3 py-1 border rounded-lg"
              >
                <option value="createdAt">Created Date</option>
                <option value="dueDate">Due Date</option>
                <option value="priority">Priority</option>
                <option value="title">Title</option>
              </select>
              <select
                value={sortDir}
                onChange={(e) => setSortDir(e.target.value)}
                className="px-3 py-1 border rounded-lg"
              >
                <option value="desc">Descending</option>
                <option value="asc">Ascending</option>
              </select>
            </div>

            <Button onClick={handleCreate} className="ml-auto">
              + New Todo
            </Button>
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
            {error}
          </div>
        )}

        {/* Todos List */}
        {loading ? (
          <div className="text-center py-12">
            <div className="text-gray-500">Loading todos...</div>
          </div>
        ) : todos.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-lg shadow">
            <p className="text-gray-500 text-lg">No todos found. Create your first todo!</p>
          </div>
        ) : (
          <div className="grid gap-4">
            {todos.map((todo) => (
              <div
                key={todo.id}
                className={`bg-white rounded-lg shadow p-4 ${
                  todo.completed ? 'opacity-75' : ''
                }`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <input
                        type="checkbox"
                        checked={todo.completed}
                        onChange={() => handleToggle(todo.id)}
                        className="w-5 h-5 cursor-pointer"
                      />
                      <h3
                        className={`text-lg font-semibold ${
                          todo.completed ? 'line-through text-gray-500' : 'text-gray-800'
                        }`}
                      >
                        {todo.title}
                      </h3>
                      <span
                        className={`px-2 py-1 rounded text-xs font-medium ${getPriorityColor(
                          todo.priority
                        )}`}
                      >
                        {todo.priority}
                      </span>
                    </div>
                    {todo.description && (
                      <p className="text-gray-600 mb-2 ml-8">{todo.description}</p>
                    )}
                    <div className="flex gap-4 text-sm text-gray-500 ml-8">
                      <span>Due: {formatDate(todo.dueDate)}</span>
                      {isOverdue(todo.dueDate) && !todo.completed && (
                        <span className="text-red-600 font-medium">⚠ Overdue</span>
                      )}
                      <span>Created: {new Date(todo.createdAt).toLocaleDateString()}</span>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      variant="secondary"
                      onClick={() => handleEdit(todo)}
                      disabled={todo.completed}
                    >
                      Edit
                    </Button>
                    <Button variant="danger" onClick={() => handleDelete(todo.id)}>
                      Delete
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Create/Edit Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingTodo ? 'Edit Todo' : 'Create Todo'}
      >
        <div className="space-y-4">
          <Input
            label="Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
            placeholder="Enter todo title"
          />

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Description
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Enter todo description (optional)"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              rows="3"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Priority
            </label>
            <select
              value={priority}
              onChange={(e) => setPriority(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="LOW">Low</option>
              <option value="MEDIUM">Medium</option>
              <option value="HIGH">High</option>
            </select>
          </div>

          <Input
            label="Due Date"
            type="date"
            value={dueDate}
            onChange={(e) => setDueDate(e.target.value)}
            placeholder="Select due date (optional)"
          />

          <div className="flex gap-2 justify-end mt-6">
            <Button variant="secondary" onClick={() => setIsModalOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSave} disabled={!title.trim()}>
              {editingTodo ? 'Update' : 'Create'}
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default Todos;


