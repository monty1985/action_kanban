import sqlite3 from 'sqlite3';
import { ActionItem } from '../models/ActionItem';

const sqlite = sqlite3.verbose();

export class Database {
  private db: sqlite3.Database;

  constructor() {
    const dbPath = process.env.NODE_ENV === 'production' 
      ? '/app/data/action_items.db'
      : './action_items.db';
    this.db = new sqlite.Database(dbPath);
    this.init();
  }

  private init() {
    const createTableQuery = `
      CREATE TABLE IF NOT EXISTS action_items (
        id TEXT PRIMARY KEY,
        title TEXT NOT NULL,
        description TEXT,
        status TEXT CHECK(status IN ('todo', 'in_progress', 'review', 'done')) DEFAULT 'todo',
        priority TEXT CHECK(priority IN ('low', 'medium', 'high')) DEFAULT 'medium',
        due_date TEXT,
        created_at TEXT NOT NULL,
        updated_at TEXT NOT NULL,
        assignee TEXT,
        tags TEXT
      )
    `;

    this.db.run(createTableQuery, (err) => {
      if (err) {
        console.error('Error creating table:', err);
      } else {
        console.log('Database initialized successfully');
      }
    });
  }

  async getAll(): Promise<ActionItem[]> {
    return new Promise((resolve, reject) => {
      this.db.all('SELECT * FROM action_items ORDER BY created_at DESC', (err, rows) => {
        if (err) reject(err);
        else {
          const items = (rows as any[]).map(row => ({
            ...row,
            tags: row.tags ? JSON.parse(row.tags) : []
          }));
          resolve(items);
        }
      });
    });
  }

  async getById(id: string): Promise<ActionItem | null> {
    return new Promise((resolve, reject) => {
      this.db.get('SELECT * FROM action_items WHERE id = ?', [id], (err, row) => {
        if (err) reject(err);
        else if (!row) resolve(null);
        else {
          const item = row as any;
          resolve({
            ...item,
            tags: item.tags ? JSON.parse(item.tags) : []
          });
        }
      });
    });
  }

  async create(item: ActionItem): Promise<void> {
    return new Promise((resolve, reject) => {
      const query = `
        INSERT INTO action_items (id, title, description, status, priority, due_date, created_at, updated_at, assignee, tags)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `;
      const tags = item.tags ? JSON.stringify(item.tags) : null;
      
      this.db.run(query, [
        item.id,
        item.title,
        item.description,
        item.status,
        item.priority,
        item.due_date,
        item.created_at,
        item.updated_at,
        item.assignee,
        tags
      ], (err) => {
        if (err) reject(err);
        else resolve();
      });
    });
  }

  async update(id: string, updates: Partial<ActionItem>): Promise<void> {
    return new Promise((resolve, reject) => {
      const fields = [];
      const values = [];
      
      for (const [key, value] of Object.entries(updates)) {
        if (key !== 'id') {
          fields.push(`${key} = ?`);
          values.push(key === 'tags' && value ? JSON.stringify(value) : value);
        }
      }
      
      values.push(id);
      const query = `UPDATE action_items SET ${fields.join(', ')} WHERE id = ?`;
      
      this.db.run(query, values, (err) => {
        if (err) reject(err);
        else resolve();
      });
    });
  }

  async delete(id: string): Promise<void> {
    return new Promise((resolve, reject) => {
      this.db.run('DELETE FROM action_items WHERE id = ?', [id], (err) => {
        if (err) reject(err);
        else resolve();
      });
    });
  }

  async search(query: string): Promise<ActionItem[]> {
    return new Promise((resolve, reject) => {
      const searchQuery = `
        SELECT * FROM action_items 
        WHERE title LIKE ? OR description LIKE ? OR assignee LIKE ?
        ORDER BY created_at DESC
      `;
      const searchParam = `%${query}%`;
      
      this.db.all(searchQuery, [searchParam, searchParam, searchParam], (err, rows) => {
        if (err) reject(err);
        else {
          const items = (rows as any[]).map(row => ({
            ...row,
            tags: row.tags ? JSON.parse(row.tags) : []
          }));
          resolve(items);
        }
      });
    });
  }

  close() {
    this.db.close();
  }
}

export const db = new Database();