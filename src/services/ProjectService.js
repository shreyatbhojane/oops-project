import { GreetingCard } from '../models/GreetingCard.js';

/**
 * ProjectService manages local persistence, project lists, and draft recovery.
 * Demonstrates OOP: Service Layer, Repository Pattern, Encapsulation.
 */
export class ProjectService {
  constructor() {
    this._STORAGE_KEY = 'cardora.projects.v1';
    this._DRAFT_KEY = 'cardora.draft.v1';
    this._FAVORITES_KEY = 'cardora.favorites.v1';
    this._SETTINGS_KEY = 'cardora.settings.v1';
  }

  getAllProjects() {
    try {
      const raw = localStorage.getItem(this._STORAGE_KEY);
      if (!raw) return [];
      const data = JSON.parse(raw);
      return Array.isArray(data) ? data : [];
    } catch (e) {
      console.warn('Failed to load projects from storage:', e);
      return [];
    }
  }

  getProjectById(id) {
    const list = this.getAllProjects();
    const item = list.find(p => p.id === id);
    return item ? GreetingCard.fromJSON(item) : null;
  }

  saveProject(greetingCard) {
    if (!greetingCard) return false;
    try {
      const list = this.getAllProjects();
      const json = greetingCard.toJSON();
      const existingIdx = list.findIndex(p => p.id === greetingCard.id);

      if (existingIdx !== -1) {
        list[existingIdx] = json;
      } else {
        list.unshift(json);
      }

      localStorage.setItem(this._STORAGE_KEY, JSON.stringify(list));
      return true;
    } catch (e) {
      console.error('Failed to save project:', e);
      return false;
    }
  }

  deleteProject(id) {
    try {
      const list = this.getAllProjects().filter(p => p.id !== id);
      localStorage.setItem(this._STORAGE_KEY, JSON.stringify(list));
      return true;
    } catch (e) {
      console.error('Failed to delete project:', e);
      return false;
    }
  }

  saveDraft(greetingCard) {
    try {
      if (!greetingCard) return;
      localStorage.setItem(this._DRAFT_KEY, JSON.stringify(greetingCard.toJSON()));
    } catch (e) {
      // Ignore quota errors on auto-save
    }
  }

  getDraft() {
    try {
      const raw = localStorage.getItem(this._DRAFT_KEY);
      if (!raw) return null;
      return GreetingCard.fromJSON(JSON.parse(raw));
    } catch (e) {
      return null;
    }
  }

  getFavorites() {
    try {
      const raw = localStorage.getItem(this._FAVORITES_KEY);
      return raw ? JSON.parse(raw) : [];
    } catch (e) {
      return [];
    }
  }

  toggleFavorite(templateId) {
    const favs = this.getFavorites();
    const idx = favs.indexOf(templateId);
    if (idx !== -1) {
      favs.splice(idx, 1);
    } else {
      favs.push(templateId);
    }
    try {
      localStorage.setItem(this._FAVORITES_KEY, JSON.stringify(favs));
    } catch (e) {
      console.error(e);
    }
    return favs;
  }

  getSettings() {
    const defaults = {
      theme: 'light',
      defaultFormat: 'portrait',
      reducedMotion: false,
      animationSpeed: 'normal'
    };
    try {
      const raw = localStorage.getItem(this._SETTINGS_KEY);
      return raw ? { ...defaults, ...JSON.parse(raw) } : defaults;
    } catch (e) {
      return defaults;
    }
  }

  saveSettings(settings) {
    try {
      localStorage.setItem(this._SETTINGS_KEY, JSON.stringify(settings));
    } catch (e) {
      console.error(e);
    }
  }
}
