/**
 * ExportService handles offscreen high-DPI rasterization and direct file download.
 * Demonstrates OOP: Strategy Pattern, Factory Method.
 */
export class ExportService {
  constructor() {}

  /**
   * Export the greeting card as a high-resolution image file.
   * @param {GreetingCard} card - The card to render
   * @param {Object} options - Export settings (format, scale, width, height)
   * @returns {Promise<Blob>} The generated image Blob
   */
  async exportCard(card, {
    format = 'image/png',
    scale = 1.0,
    width = null,
    height = null,
    filename = null
  } = {}) {
    if (!card) throw new Error('No card provided for export.');

    const targetWidth = (width || card.width) * scale;
    const targetHeight = (height || card.height) * scale;

    const offscreen = document.createElement('canvas');
    offscreen.width = targetWidth;
    offscreen.height = targetHeight;
    const ctx = offscreen.getContext('2d');

    // Enable high quality rendering hints
    ctx.imageSmoothingEnabled = true;
    ctx.imageSmoothingQuality = 'high';

    // Scale drawing operations to target dimension
    ctx.scale(scale * (targetWidth / (card.width * scale)), scale * (targetHeight / (card.height * scale)));

    // 1. Draw Background
    card.renderBackground(ctx);

    // 2. Wait for all SVG images on the card to be fully loaded
    const svgElements = card.elements.filter(el => el.type === 'svg');
    await Promise.all(svgElements.map(el => {
      if (el._cachedImage && el._cachedImage.complete) return Promise.resolve();
      return new Promise(resolve => {
        const timeout = setTimeout(resolve, 1500); // 1.5s max wait
        if (!el._src) return resolve();
        const img = new Image();
        img.crossOrigin = 'anonymous';
        img.onload = () => {
          el._cachedImage = img;
          clearTimeout(timeout);
          resolve();
        };
        img.onerror = () => {
          clearTimeout(timeout);
          resolve();
        };
        img.src = el._src;
      });
    }));

    // 3. Render Elements with isExport = true (no selection outlines or handles)
    card.elements.forEach(element => {
      element.render(ctx, { isExport: true });
    });

    // 4. Convert to Blob and trigger browser download
    return new Promise((resolve, reject) => {
      offscreen.toBlob(blob => {
        if (!blob) {
          reject(new Error('Canvas export conversion failed.'));
          return;
        }

        const ext = format === 'image/jpeg' ? 'jpg' : 'png';
        const cleanTitle = card.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '') || 'card';
        const finalFilename = filename || `cardora-${cleanTitle}.${ext}`;

        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = finalFilename;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        setTimeout(() => URL.revokeObjectURL(url), 2000);

        resolve(blob);
      }, format, 0.95);
    });
  }
}
