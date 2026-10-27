import { CardElement } from './CardElement.js';

/**
 * SvgElement represents vector illustrations and botanical artwork on the card.
 * Demonstrates OOP: Inheritance, Encapsulation, and Polymorphism.
 */
export class SvgElement extends CardElement {
  constructor({
    svgKey = 'botanical-sidebar',
    src = '',
    tint = null,
    preserveAspectRatio = true,
    ...baseProps
  } = {}) {
    super({ ...baseProps, type: 'svg' });
    this._svgKey = svgKey;
    this._src = src;
    this._tint = tint;
    this._preserveAspectRatio = preserveAspectRatio;
    this._cachedImage = null;
    this._loading = false;

    if (this._src) {
      this._loadImage();
    }
  }

  get svgKey() { return this._svgKey; }
  set svgKey(val) { this._svgKey = val; }
  get src() { return this._src; }
  set src(val) {
    this._src = val;
    this._cachedImage = null;
    this._loadImage();
  }
  get tint() { return this._tint; }
  set tint(val) { this._tint = val; }
  get preserveAspectRatio() { return this._preserveAspectRatio; }
  set preserveAspectRatio(val) { this._preserveAspectRatio = Boolean(val); }

  _loadImage() {
    if (this._cachedImage || this._loading || !this._src) return;
    this._loading = true;
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => {
      this._cachedImage = img;
      this._loading = false;
      if (typeof SvgElement.onAnyImageLoaded === 'function') {
        SvgElement.onAnyImageLoaded();
      }
    };
    img.onerror = () => {
      this._loading = false;
    };
    img.src = this._src;
  }

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

    if (this._cachedImage && this._cachedImage.complete && this._cachedImage.naturalWidth > 0) {
      ctx.drawImage(this._cachedImage, this._x, this._y, this._width, this._height);
    } else {
      // Fallback clean vector placeholder while loading
      ctx.strokeStyle = '#C6A15B';
      ctx.lineWidth = 1.5;
      ctx.setLineDash([4, 4]);
      ctx.strokeRect(this._x, this._y, this._width, this._height);
      ctx.fillStyle = '#667085';
      ctx.font = '12px Inter, sans-serif';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(this._svgKey, cx, cy);
    }

    ctx.restore();
  }

  clone() {
    return new SvgElement({
      ...this.toJSON(),
      id: null,
      x: this._x + 20,
      y: this._y + 20
    });
  }

  toJSON() {
    return {
      ...super.toJSON(),
      svgKey: this._svgKey,
      src: this._src,
      tint: this._tint,
      preserveAspectRatio: this._preserveAspectRatio
    };
  }

  static fromJSON(data) {
    return new SvgElement(data);
  }
}
