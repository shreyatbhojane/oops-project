/**
 * Base abstract class representing any element placed on a GreetingCard.
 * Demonstrates OOP: Abstraction, Encapsulation, and Polymorphism.
 */
export class CardElement {
  constructor({
    id = null,
    type = 'element',
    x = 50,
    y = 50,
    width = 100,
    height = 100,
    rotation = 0,
    opacity = 1.0,
    zIndex = 1,
    locked = false
  } = {}) {
    this._id = id || `el-${Date.now().toString(36)}-${Math.random().toString(36).substring(2, 7)}`;
    this._type = type;
    this._x = Number(x);
    this._y = Number(y);
    this._width = Math.max(10, Number(width));
    this._height = Math.max(10, Number(height));
    this._rotation = Number(rotation);
    this._opacity = Math.max(0, Math.min(1, Number(opacity)));
    this._zIndex = Number(zIndex);
    this._locked = Boolean(locked);
  }

  // Encapsulated Getters & Setters
  get id() { return this._id; }
  get type() { return this._type; }
  get x() { return this._x; }
  set x(val) { this._x = Number(val); }
  get y() { return this._y; }
  set y(val) { this._y = Number(val); }
  get width() { return this._width; }
  set width(val) { this._width = Math.max(10, Number(val)); }
  get height() { return this._height; }
  set height(val) { this._height = Math.max(10, Number(val)); }
  get rotation() { return this._rotation; }
  set rotation(val) { this._rotation = Number(val); }
  get opacity() { return this._opacity; }
  set opacity(val) { this._opacity = Math.max(0, Math.min(1, Number(val))); }
  get zIndex() { return this._zIndex; }
  set zIndex(val) { this._zIndex = Number(val); }
  get locked() { return this._locked; }
  set locked(val) { this._locked = Boolean(val); }

  /**
   * Hit test to determine if coordinates fall inside this element's bounds.
   */
  containsPoint(px, py) {
    return px >= this._x && px <= this._x + this._width &&
           py >= this._y && py <= this._y + this._height;
  }

  /**
   * Polymorphic render method to be overridden by subclasses.
   * @param {CanvasRenderingContext2D} ctx - Target 2D rendering context
   * @param {Object} options - Scale, animation progress, or selection indicators
   */
  render(ctx, options = {}) {
    throw new Error('render() must be implemented by subclass.');
  }

  /**
   * Clone this element.
   */
  clone() {
    throw new Error('clone() must be implemented by subclass.');
  }

  /**
   * Serialize element state to JSON object.
   */
  toJSON() {
    return {
      id: this._id,
      type: this._type,
      x: this._x,
      y: this._y,
      width: this._width,
      height: this._height,
      rotation: this._rotation,
      opacity: this._opacity,
      zIndex: this._zIndex,
      locked: this._locked
    };
  }
}
