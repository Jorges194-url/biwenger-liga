import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';

// Simple in-memory storage (since localStorage works fine outside Claude.ai artifacts)
window.storage = {
  _data: JSON.parse(localStorage.getItem('bw_storage') || '{}'),
  _save() { localStorage.setItem('bw_storage', JSON.stringify(this._data)); },
  async get(key) {
    return this._data[key] ? { key, value: this._data[key] } : null;
  },
  async set(key, value) {
    this._data[key] = value;
    this._save();
    return { key, value };
  },
  async delete(key) {
    delete this._data[key];
    this._save();
    return { key, deleted: true };
  },
  async list(prefix = '') {
    const keys = Object.keys(this._data).filter(k => k.startsWith(prefix));
    return { keys };
  }
};

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<React.StrictMode><App /></React.StrictMode>);
