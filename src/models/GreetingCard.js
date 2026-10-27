import { TextElement } from './TextElement.js';
import { ShapeElement } from './ShapeElement.js';
import { SvgElement } from './SvgElement.js';

/**
 * GreetingCard represents a complete digital greeting card project.
 * Demonstrates OOP: Composition, Encapsulation, State Management.
 */
export class GreetingCard {
  constructor({
    id = null,
    title = 'Untitled Greeting Card',
    occasion = 'Birthday',
    width = 1080,
    height = 1350, // 4:5 Portrait default
    backgroundColor = '#FAF7F0',
    backgroundGradient = null,
    backgroundPattern = 'none',
    elements = [],
    createdAt = null,
    updatedAt = null
  } = {}) {
    this._id = id || `card-${Date.now().toString(36)}-${Math.random().toString(36).substring(2, 6)}`;
    this._title = title;
    this._occasion = occasion;
    this._width = Number(width);
    this._height = Number(height);
    this._backgroundColor = backgroundColor;
    this._backgroundGradient = backgroundGradient;
    this._backgroundPattern = backgroundPattern;
    this._elements = [];
    this._createdAt = createdAt || new Date().toISOString();
    this._updatedAt = updatedAt || new Date().toISOString();

    if (Array.isArray(elements)) {
      elements.forEach(el => this.addElement(el));
    }
  }

  get id() { return this._id; }
  get title() { return this._title; }
  set title(val) { this._title = String(val || 'Untitled Card'); this._touch(); }
  get occasion() { return this._occasion; }
  set occasion(val) { this._occasion = val; this._touch(); }
  get width() { return this._width; }
  set width(val) { this._width = Math.max(300, Number(val)); this._touch(); }
  get height() { return this._height; }
  set height(val) { this._height = Math.max(300, Number(val)); this._touch(); }
  get backgroundColor() { return this._backgroundColor; }
  set backgroundColor(val) { this._backgroundColor = val; this._touch(); }
  get backgroundGradient() { return this._backgroundGradient; }
  set backgroundGradient(val) { this._backgroundGradient = val; this._touch(); }
  get backgroundPattern() { return this._backgroundPattern; }
  set backgroundPattern(val) { this._backgroundPattern = val; this._touch(); }
  get elements() { return [...this._elements]; }
  get createdAt() { return this._createdAt; }
  get updatedAt() { return this._updatedAt; }

  _touch() {
    this._updatedAt = new Date().toISOString();
  }

  /**
   * Add a CardElement instance or polymorphic plain object.
   */
  addElement(element) {
    if (!element) return null;
    let instance = element;
    if (!(element instanceof TextElement || element instanceof ShapeElement || element instanceof SvgElement)) {
      if (element.type === 'text') instance = TextElement.fromJSON(element);
      else if (element.type === 'shape') instance = ShapeElement.fromJSON(element);
      else if (element.type === 'svg') instance = SvgElement.fromJSON(element);
    }
    this._elements.push(instance);
    this._sortElementsByZ();
    this._touch();
    return instance;
  }

  removeElement(elementId) {
    const idx = this._elements.findIndex(el => el.id === elementId);
    if (idx !== -1) {
      const removed = this._elements.splice(idx, 1)[0];
      this._touch();
      return removed;
    }
    return null;
  }

  getElementById(elementId) {
    return this._elements.find(el => el.id === elementId) || null;
  }

  duplicateElement(elementId) {
    const target = this.getElementById(elementId);
    if (!target) return null;
    const cloned = target.clone();
    this.addElement(cloned);
    return cloned;
  }

  bringForward(elementId) {
    const el = this.getElementById(elementId);
    if (!el) return;
    el.zIndex += 1;
    this._sortElementsByZ();
    this._touch();
  }

  sendBackward(elementId) {
    const el = this.getElementById(elementId);
    if (!el) return;
    el.zIndex = Math.max(0, el.zIndex - 1);
    this._sortElementsByZ();
    this._touch();
  }

  _sortElementsByZ() {
    this._elements.sort((a, b) => a.zIndex - b.zIndex);
  }

  clearElements() {
    this._elements = [];
    this._touch();
  }

  /**
   * Draw the card's background onto canvas.
   */
  renderBackground(ctx) {
    ctx.save();
    if (this._backgroundGradient && this._backgroundGradient.stops) {
      const grad = ctx.createLinearGradient(0, 0, 0, this._height);
      this._backgroundGradient.stops.forEach(s => grad.addColorStop(s.offset, s.color));
      ctx.fillStyle = grad;
    } else {
      ctx.fillStyle = this._backgroundColor;
    }
    ctx.fillRect(0, 0, this._width, this._height);

    // Subtle background pattern
    if (this._backgroundPattern === 'dots') {
      ctx.fillStyle = 'rgba(198, 161, 91, 0.12)';
      const step = 32;
      for (let x = step / 2; x < this._width; x += step) {
        for (let y = step / 2; y < this._height; y += step) {
          ctx.beginPath();
          ctx.arc(x, y, 1.5, 0, Math.PI * 2);
          ctx.fill();
        }
      }
    } else if (this._backgroundPattern === 'lines') {
      ctx.strokeStyle = 'rgba(232, 226, 216, 0.5)';
      ctx.lineWidth = 1;
      const step = 40;
      for (let y = step; y < this._height; y += step) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(this._width, y);
        ctx.stroke();
      }
    }
    ctx.restore();
  }

  toJSON() {
    return {
      id: this._id,
      title: this._title,
      occasion: this._occasion,
      width: this._width,
      height: this._height,
      backgroundColor: this._backgroundColor,
      backgroundGradient: this._backgroundGradient,
      backgroundPattern: this._backgroundPattern,
      elements: this._elements.map(el => el.toJSON()),
      createdAt: this._createdAt,
      updatedAt: this._updatedAt
    };
  }

  static fromJSON(data) {
    return new GreetingCard(data);
  }
}
