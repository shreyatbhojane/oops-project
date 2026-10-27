import { CardElement } from './CardElement.js';

/**
 * TextElement represents editable typographic layers on the greeting card.
 * Demonstrates OOP: Inheritance and Polymorphism.
 */
export class TextElement extends CardElement {
  constructor({
    text = 'Your Greeting Here',
    fontFamily = 'Georgia',
    fontSize = 36,
    fontWeight = 'normal',
    fontStyle = 'normal',
    textAlign = 'center',
    color = '#172033',
    lineHeight = 1.3,
    letterSpacing = 0,
    textShadow = null,
    ...baseProps
  } = {}) {
    super({ ...baseProps, type: 'text' });
    this._text = String(text);
    this._fontFamily = fontFamily;
    this._fontSize = Number(fontSize);
    this._fontWeight = fontWeight;
    this._fontStyle = fontStyle;
    this._textAlign = textAlign;
    this._color = color;
    this._lineHeight = Number(lineHeight);
    this._letterSpacing = Number(letterSpacing);
    this._textShadow = textShadow;
  }

  get text() { return this._text; }
  set text(val) { this._text = String(val); }
  get fontFamily() { return this._fontFamily; }
  set fontFamily(val) { this._fontFamily = val; }
  get fontSize() { return this._fontSize; }
  set fontSize(val) { this._fontSize = Math.max(8, Number(val)); }
  get fontWeight() { return this._fontWeight; }
  set fontWeight(val) { this._fontWeight = val; }
  get fontStyle() { return this._fontStyle; }
  set fontStyle(val) { this._fontStyle = val; }
  get textAlign() { return this._textAlign; }
  set textAlign(val) { this._textAlign = val; }
  get color() { return this._color; }
  set color(val) { this._color = val; }
  get lineHeight() { return this._lineHeight; }
  set lineHeight(val) { this._lineHeight = Number(val); }
  get letterSpacing() { return this._letterSpacing; }
  set letterSpacing(val) { this._letterSpacing = Number(val); }
  get textShadow() { return this._textShadow; }
  set textShadow(val) { this._textShadow = val; }

  /**
   * Overridden polymorphic render method for canvas output.
   */
  render(ctx, options = {}) {
    ctx.save();
    ctx.globalAlpha = this._opacity;

    // Apply rotation around center
    const cx = this._x + this._width / 2;
    const cy = this._y + this._height / 2;
    if (this._rotation !== 0) {
      ctx.translate(cx, cy);
      ctx.rotate((this._rotation * Math.PI) / 180);
      ctx.translate(-cx, -cy);
    }

    ctx.font = `${this._fontStyle} ${this._fontWeight} ${this._fontSize}px "${this._fontFamily}", serif`;
    ctx.fillStyle = this._color;
    ctx.textAlign = this._textAlign;
    ctx.textBaseline = 'middle';

    if (this._textShadow) {
      ctx.shadowColor = this._textShadow.color || 'rgba(0,0,0,0.2)';
      ctx.shadowBlur = this._textShadow.blur || 4;
      ctx.shadowOffsetX = this._textShadow.offsetX || 0;
      ctx.shadowOffsetY = this._textShadow.offsetY || 2;
    }

    const lines = this._text.split('\n');
    const totalLineHeight = this._fontSize * this._lineHeight;
    const startY = cy - ((lines.length - 1) * totalLineHeight) / 2;

    let drawX = cx;
    if (this._textAlign === 'left') drawX = this._x + 10;
    else if (this._textAlign === 'right') drawX = this._x + this._width - 10;

    lines.forEach((line, index) => {
      ctx.fillText(line, drawX, startY + index * totalLineHeight);
    });

    ctx.restore();
  }

  clone() {
    return new TextElement({
      ...this.toJSON(),
      id: null,
      x: this._x + 20,
      y: this._y + 20
    });
  }

  toJSON() {
    return {
      ...super.toJSON(),
      text: this._text,
      fontFamily: this._fontFamily,
      fontSize: this._fontSize,
      fontWeight: this._fontWeight,
      fontStyle: this._fontStyle,
      textAlign: this._textAlign,
      color: this._color,
      lineHeight: this._lineHeight,
      letterSpacing: this._letterSpacing,
      textShadow: this._textShadow
    };
  }

  static fromJSON(data) {
    return new TextElement(data);
  }
}
