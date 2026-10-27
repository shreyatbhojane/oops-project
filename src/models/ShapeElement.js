import { CardElement } from './CardElement.js';

/**
 * ShapeElement represents geometric decorations, frames, divider lines, and ornaments.
 * Demonstrates OOP: Inheritance and Polymorphism.
 */
export class ShapeElement extends CardElement {
  constructor({
    shapeType = 'rectangle', // 'rectangle', 'circle', 'line', 'diamond', 'heart', 'star'
    fill = 'transparent',
    stroke = '#C6A15B',
    strokeWidth = 2,
    dashArray = '',
    cornerRadius = 0,
    ...baseProps
  } = {}) {
    super({ ...baseProps, type: 'shape' });
    this._shapeType = shapeType;
    this._fill = fill;
    this._stroke = stroke;
    this._strokeWidth = Number(strokeWidth);
    this._dashArray = dashArray;
    this._cornerRadius = Number(cornerRadius);
  }

  get shapeType() { return this._shapeType; }
  set shapeType(val) { this._shapeType = val; }
  get fill() { return this._fill; }
  set fill(val) { this._fill = val; }
  get stroke() { return this._stroke; }
  set stroke(val) { this._stroke = val; }
  get strokeWidth() { return this._strokeWidth; }
  set strokeWidth(val) { this._strokeWidth = Math.max(0, Number(val)); }
  get dashArray() { return this._dashArray; }
  set dashArray(val) { this._dashArray = val; }
  get cornerRadius() { return this._cornerRadius; }
  set cornerRadius(val) { this._cornerRadius = Number(val); }

  render(ctx, options = {}) {
    ctx.save();
    ctx.globalAlpha = this._opacity;

    const cx = this._x + this._width / 2;
    const cy = this._y + this._height / 2;
    if (this._rotation !== 0) {
      ctx.translate(cx, cy);
      ctx.rotate((this._rotation * Math.PI) / 180);
      ctx.translate(-cx, -cy);
    }

    ctx.fillStyle = this._fill;
    ctx.strokeStyle = this._stroke;
    ctx.lineWidth = this._strokeWidth;

    if (this._dashArray) {
      ctx.setLineDash(this._dashArray.split(',').map(n => Number(n.trim())));
    } else {
      ctx.setLineDash([]);
    }

    ctx.beginPath();
    switch (this._shapeType) {
      case 'rectangle':
        if (this._cornerRadius > 0 && ctx.roundRect) {
          ctx.roundRect(this._x, this._y, this._width, this._height, this._cornerRadius);
        } else {
          ctx.rect(this._x, this._y, this._width, this._height);
        }
        break;

      case 'circle':
        ctx.ellipse(cx, cy, this._width / 2, this._height / 2, 0, 0, Math.PI * 2);
        break;

      case 'line':
        ctx.moveTo(this._x, cy);
        ctx.lineTo(this._x + this._width, cy);
        break;

      case 'diamond':
        ctx.moveTo(cx, this._y);
        ctx.lineTo(this._x + this._width, cy);
        ctx.lineTo(cx, this._y + this._height);
        ctx.lineTo(this._x, cy);
        ctx.closePath();
        break;

      case 'heart': {
        const topCurveHeight = this._height * 0.3;
        ctx.moveTo(cx, this._y + topCurveHeight);
        // top left curve
        ctx.bezierCurveTo(
          cx, this._y,
          this._x, this._y,
          this._x, this._y + topCurveHeight
        );
        // bottom left curve
        ctx.bezierCurveTo(
          this._x, this._y + (this._height + topCurveHeight) / 2,
          cx, this._y + (this._height + topCurveHeight) / 2,
          cx, this._y + this._height
        );
        // bottom right curve
        ctx.bezierCurveTo(
          cx, this._y + (this._height + topCurveHeight) / 2,
          this._x + this._width, this._y + (this._height + topCurveHeight) / 2,
          this._x + this._width, this._y + topCurveHeight
        );
        // top right curve
        ctx.bezierCurveTo(
          this._x + this._width, this._y,
          cx, this._y,
          cx, this._y + topCurveHeight
        );
        ctx.closePath();
        break;
      }

      case 'star': {
        const spikes = 5;
        const outerRadius = Math.min(this._width, this._height) / 2;
        const innerRadius = outerRadius / 2.5;
        let rot = (Math.PI / 2) * 3;
        let x = cx;
        let y = cy;
        const step = Math.PI / spikes;

        ctx.moveTo(cx, cy - outerRadius);
        for (let i = 0; i < spikes; i++) {
          x = cx + Math.cos(rot) * outerRadius;
          y = cy + Math.sin(rot) * outerRadius;
          ctx.lineTo(x, y);
          rot += step;

          x = cx + Math.cos(rot) * innerRadius;
          y = cy + Math.sin(rot) * innerRadius;
          ctx.lineTo(x, y);
          rot += step;
        }
        ctx.lineTo(cx, cy - outerRadius);
        ctx.closePath();
        break;
      }

      default:
        ctx.rect(this._x, this._y, this._width, this._height);
        break;
    }

    if (this._fill && this._fill !== 'transparent') ctx.fill();
    if (this._stroke && this._strokeWidth > 0) ctx.stroke();

    ctx.restore();
  }

  clone() {
    return new ShapeElement({
      ...this.toJSON(),
      id: null,
      x: this._x + 20,
      y: this._y + 20
    });
  }

  toJSON() {
    return {
      ...super.toJSON(),
      shapeType: this._shapeType,
      fill: this._fill,
      stroke: this._stroke,
      strokeWidth: this._strokeWidth,
      dashArray: this._dashArray,
      cornerRadius: this._cornerRadius
    };
  }

  static fromJSON(data) {
    return new ShapeElement(data);
  }
}
