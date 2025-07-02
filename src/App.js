import React, { useEffect, useState } from 'react';
import './App.css';

function App() {
  const [todo, setTodo] = useState('');
  const [todos, setTodos] = useState([]);
  const [editId, setEditId] = useState(null);

  // Load todos from backend
  useEffect(() => {
    fetch('/api/todos')
      .then(res => res.json())
      .then(data => setTodos(data));
  }, []);

  // Add or update todo
  const handleAddOrUpdate = async () => {
    if (!todo.trim()) return;

    if (editId) {
      const res = await fetch(`/api/todos/${editId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: todo }),
      });
      const updated = await res.json();
      setTodos(todos.map((t) => (t._id === updated._id ? updated : t)));
      setEditId(null);
    } else {
      const res = await fetch('/api/todos', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: todo }),
      });
      const newTodo = await res.json();
      setTodos([...todos, newTodo]);
    }
    setTodo('');
  };

  const handleDelete = async (id) => {
    await fetch(`/api/todos/${id}`, { method: 'DELETE' });
    setTodos(todos.filter((t) => t._id !== id));
  };

  const handleEdit = (item) => {
    setTodo(item.text);
    setEditId(item._id);
  };

  return (
    <div className="App">
      <h1>My Purple To-Do App 💜</h1>
      <input
        type="text"
        value={todo}
        onChange={(e) => setTodo(e.target.value)}
        placeholder="Enter a task..."
      />
      <button onClick={handleAddOrUpdate}>
        {editId ? 'Update' : 'Add'}
      </button>

      <ul>
        {todos.map((item) => (
          <li key={item._id}>
            📝 {item.text}
            <button onClick={() => handleEdit(item)}>✏️ Edit</button>
            <button onClick={() => handleDelete(item._id)}>🗑️ Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;
