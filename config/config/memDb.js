const fs = require('fs');
const path = require('path');
const bcrypt = require('bcryptjs');

// In-Memory fallback store populated from database_exports/
class MemoryStore {
  constructor() {
    this.users = [];
    this.destinations = [];
    this.reviews = [];
    this.bookings = [];
    this.isLoaded = false;
  }

  loadInitialData() {
    try {
      const exportsDir = path.join(__dirname, '..', 'database_exports');
      
      if (fs.existsSync(path.join(exportsDir, 'users.json'))) {
        this.users = JSON.parse(fs.readFileSync(path.join(exportsDir, 'users.json'), 'utf8'));
      }
      if (fs.existsSync(path.join(exportsDir, 'destinations.json'))) {
        this.destinations = JSON.parse(fs.readFileSync(path.join(exportsDir, 'destinations.json'), 'utf8'));
      }
      if (fs.existsSync(path.join(exportsDir, 'reviews.json'))) {
        this.reviews = JSON.parse(fs.readFileSync(path.join(exportsDir, 'reviews.json'), 'utf8'));
      }
      if (fs.existsSync(path.join(exportsDir, 'bookings.json'))) {
        this.bookings = JSON.parse(fs.readFileSync(path.join(exportsDir, 'bookings.json'), 'utf8'));
      }

      // Add default hashed passwords for demo accounts in memory
      this.users.forEach((u) => {
        if (!u.password) {
          u.password = '$2a$10$w3a6zI3hVdDkK6VfB2WcXe3pE0nI6t.GgLg9tI7gV6nO4zR8hKz3W'; // 'password123'
        }
      });

      this.isLoaded = true;
      console.log(`📦 Fallback memory store initialized with ${this.destinations.length} destinations, ${this.users.length} users.`);
    } catch (err) {
      console.warn('Fallback store load notice:', err.message);
    }
  }

  generateId() {
    return '66d' + Math.random().toString(16).substring(2, 10) + '000000000000'.substring(0, 13);
  }
}

const memStore = new MemoryStore();
memStore.loadInitialData();

module.exports = memStore;
