/**
 * CardRenderer coordinates drawing the card and its polymorphic elements.
 * Demonstrates OOP: Strategy Pattern, Abstraction.
 */
export class CardRenderer {
  constructor(canvas) {
    this._canvas = canvas;
    this._ctx = canvas.getContext('2d');
    this._selectedElementId = null;
    this._hoveredElementId = null;
    this._showGuides = true;
    this._scale = 1.0;
  }

  get canvas() { return this._canvas; }
  get ctx() { return this._ctx; }
  get scale() { return this._scale; }
  set scale(val) { this._scale = Number(val); }
  get selectedElementId() { return this._selectedElementId; }
  set selectedElementId(id) { this._selectedElementId = id; }
  get hoveredElementId() { return this._hoveredElementId; }
  set hoveredElementId(id) { this._hoveredElementId = id; }

  /**
   * Main render pass.
   * @param {GreetingCard} card - The card to render
   * @param {Object} options - Render options (isExport, animationProgress, etc.)
   */
  render(card, options = {}) {
    if (!card) return;
    const ctx = this._ctx;
    const isExport = Boolean(options.isExport);

    // Clear background
    ctx.clearRect(0, 0, this._canvas.width, this._canvas.height);

    ctx.save();
    if (!isExport && this._scale !== 1.0) {
      ctx.scale(this._scale, this._scale);
    }

    // 1. Draw Card Background
    card.renderBackground(ctx);

    // 2. Draw Elements (Polymorphic iteration)
    const elements = card.elements;
    elements.forEach(element => {
      element.render(ctx, options);

      // Render selection outline and handles if in editor mode and selected
      if (!isExport && element.id === this._selectedElementId) {
        this._renderSelectionUI(ctx, element);
      }
    });

    ctx.restore();
  }

  _renderSelectionUI(ctx, el) {
    ctx.save();
    ctx.strokeStyle = '#A61E2D';
    ctx.lineWidth = 1.75;
    ctx.setLineDash([4, 4]);

    const pad = 4;
    const x = el.x - pad;
    const y = el.y - pad;
    const w = el.width + pad * 2;
    const h = el.height + pad * 2;

    ctx.strokeRect(x, y, w, h);

    // Draw resize anchor handles at corners
    ctx.setLineDash([]);
    ctx.fillStyle = '#FFFFFF';
    ctx.strokeStyle = '#A61E2D';
    ctx.lineWidth = 1.5;

    const handles = [
      { x, y }, // top-left
      { x: x + w, y }, // top-right
      { x, y: y + h }, // bottom-left
      { x: x + w, y: y + h }, // bottom-right
      { x: x + w / 2, y }, // top-center
      { x: x + w / 2, y: y + h } // bottom-center
    ];

    const handleSize = 7;
    handles.forEach(hPos => {
      ctx.fillRect(hPos.x - handleSize / 2, hPos.y - handleSize / 2, handleSize, handleSize);
      ctx.strokeRect(hPos.x - handleSize / 2, hPos.y - handleSize / 2, handleSize, handleSize);
    });

    ctx.restore();
  }
}
