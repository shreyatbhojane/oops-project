import { GreetingCard } from './models/GreetingCard.js';
import { TextElement } from './models/TextElement.js';
import { ShapeElement } from './models/ShapeElement.js';
import { SvgElement } from './models/SvgElement.js';
import { CardRenderer } from './services/CardRenderer.js';
import { TemplateService } from './services/TemplateService.js';
import { ProjectService } from './services/ProjectService.js';
import { HistoryManager } from './services/HistoryManager.js';
import { AnimationController } from './services/AnimationController.js';
import { ExportService } from './services/ExportService.js';

/**
 * CardoraApp — Main Application Orchestrator
 * Coordinates UI views, canvas rendering, and user interactions.
 */
class CardoraApp {
  constructor() {
    this._templateService = new TemplateService();
    this._projectService = new ProjectService();
    this._exportService = new ExportService();
    this._history = new HistoryManager();

    this._canvas = document.getElementById('card-canvas');
    this._renderer = new CardRenderer(this._canvas);

    this._animCanvas = document.getElementById('anim-canvas');
    this._animController = null;

    this._activeCard = null;
    this._selectedElement = null;

    // Interaction drag state
    this._isDragging = false;
    this._dragOffsetX = 0;
    this._dragOffsetY = 0;
    this._zoom = 1.0;
    this._currentView = 'studio';

    this._init();
  }

  async _init() {
    // 1. Load active project from draft or initial template
    const draft = this._projectService.getDraft();
    if (draft) {
      this._activeCard = draft;
    } else {
      const firstTmpl = this._templateService.getAllTemplates()[0];
      this._activeCard = this._createCardFromTemplate(firstTmpl);
    }

    // Connect global SvgElement image loaded callback to trigger immediate re-render
    SvgElement.onAnyImageLoaded = () => {
      this._renderAll();
    };

    // When Google Fonts finish loading, re-render
    if (document.fonts) {
      document.fonts.ready.then(() => {
        this._renderAll();
      });
    }

    // Auto-select the "Birthday" script element by default on load
    const bdayEl = this._activeCard.elements.find(el => el.type === 'text' && el.text.includes('Birthday'));
    if (bdayEl) {
      this._selectedElement = bdayEl;
      this._renderer.selectedElementId = bdayEl.id;
    }

    // 2. Initialize Animation Controller
    this._animController = new AnimationController(this._animCanvas, this._activeCard);

    // 3. Setup Components & Workflows
    this._setupViewNavigation();
    this._setupModals();
    this._setupCanvasInteractions();
    this._setupEditorToolbar();
    this._setupElementPalette();
    this._setupPropertyInspector();
    this._setupTemplateGallery();
    this._setupTemplateShowcase();
    this._setupAnimationControls();
    this._setupExportWorkflow();
    this._applySettings();

    // 4. Initial Layout & Render Pass
    this._updateCanvasSize();
    this._renderAll();
    this._syncInspector();

    // Window resize observer to keep canvas perfectly fitted
    window.addEventListener('resize', () => {
      if (this._currentView === 'studio') {
        this._updateCanvasSize();
      }
    });

    this._showToast('Cardora Studio ready.');
  }

  /* =========================================================================
     THEME TOGGLE
     ========================================================================= */

  toggleTheme() {
    const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
    const nextTheme = isDark ? 'light' : 'dark';
    if (nextTheme === 'dark') {
      document.documentElement.setAttribute('data-theme', 'dark');
    } else {
      document.documentElement.removeAttribute('data-theme');
    }
    const settings = this._projectService.getSettings();
    settings.theme = nextTheme;
    this._projectService.saveSettings(settings);

    const settingSelect = document.getElementById('setting-theme-select');
    if (settingSelect) settingSelect.value = nextTheme;
    this._showToast(`Switched to ${nextTheme === 'dark' ? 'Midnight Luxury' : 'Warm Ivory'} theme.`);
  }

  /* =========================================================================
     VIEW SWITCHER
     ========================================================================= */

  _setupViewNavigation() {
    const navButtons = document.querySelectorAll('.nav-link[data-view], .drawer-link[data-view]');
    navButtons.forEach(btn => {
      btn.addEventListener('click', () => {
        const view = btn.dataset.view;
        if (view) this.switchView(view);
      });
    });

    // Theme toggles in header and status bar
    document.getElementById('theme-toggle-header')?.addEventListener('click', () => this.toggleTheme());
    document.getElementById('theme-toggle-bottom')?.addEventListener('click', () => this.toggleTheme());

    // Quick Action button links inside views
    document.getElementById('tool-to-anim')?.addEventListener('click', () => this.switchView('animation'));
    document.getElementById('tool-to-export')?.addEventListener('click', () => this.switchView('export'));
    document.getElementById('btn-return-studio')?.addEventListener('click', () => this.switchView('studio'));

    // Hero Section CTAs
    document.getElementById('hero-create-btn')?.addEventListener('click', () => {
      this.switchView('studio');
      document.querySelector('.editor-workspace')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
    document.getElementById('hero-templates-btn')?.addEventListener('click', () => {
      this.switchView('templates');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
    document.querySelector('.brand')?.addEventListener('click', (e) => {
      e.preventDefault();
      this.switchView('studio');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });

    // Mobile Drawer Toggle
    document.getElementById('mobile-toggle')?.addEventListener('click', () => {
      document.getElementById('mobile-drawer')?.classList.add('is-open');
    });
    document.getElementById('close-drawer')?.addEventListener('click', () => {
      document.getElementById('mobile-drawer')?.classList.remove('is-open');
    });

    // Header My Cards & Settings buttons
    document.getElementById('nav-my-cards')?.addEventListener('click', () => {
      this._openModal('modal-projects');
      this._renderProjectsModal();
    });
    document.getElementById('nav-settings')?.addEventListener('click', () => {
      this._openModal('modal-settings');
    });

    // Footer Navigation Links
    document.querySelectorAll('.footer-nav-link[data-footer-view]').forEach(link => {
      link.addEventListener('click', e => {
        e.preventDefault();
        const view = link.dataset.footerView;
        if (view) {
          this.switchView(view);
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }
      });
    });

    // Footer Occasion Category Filter Links
    document.querySelectorAll('.footer-nav-link[data-footer-cat]').forEach(link => {
      link.addEventListener('click', e => {
        e.preventDefault();
        const cat = link.dataset.footerCat;
        this.switchView('templates');
        window.scrollTo({ top: 0, behavior: 'smooth' });
        const chip = document.querySelector(`#category-chips .chip-btn[data-cat="${cat}"]`);
        if (chip) {
          document.querySelectorAll('#category-chips .chip-btn').forEach(c => c.classList.remove('active'));
          chip.classList.add('active');
          this._renderTemplatesGrid(cat);
        }
      });
    });

    document.getElementById('footer-projects-trigger')?.addEventListener('click', e => {
      e.preventDefault();
      this._openModal('modal-projects');
      this._renderProjectsModal();
    });

    // Back to Top button
    document.getElementById('btn-back-to-top')?.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  switchView(viewName) {
    this._currentView = viewName;

    // Toggle active class on all nav links
    document.querySelectorAll('.nav-link[data-view], .drawer-link[data-view]').forEach(link => {
      link.classList.toggle('active', link.dataset.view === viewName);
    });

    // Toggle view containers
    document.querySelectorAll('.app-view').forEach(viewEl => {
      viewEl.classList.remove('is-visible');
    });

    const targetEl = document.getElementById(`view-${viewName}`);
    if (targetEl) {
      targetEl.classList.add('is-visible');
    }

    // Toggle hero visibility (displayed on studio view)
    const heroSection = document.getElementById('hero');
    const isStudio = (viewName === 'studio');
    if (heroSection) heroSection.style.display = isStudio ? 'block' : 'none';

    // Close mobile drawer if open
    document.getElementById('mobile-drawer')?.classList.remove('is-open');

    // Context-sensitive updates
    if (viewName === 'studio') {
      setTimeout(() => {
        this._updateCanvasSize();
        this._renderAll();
      }, 50);
    } else if (viewName === 'animation') {
      if (this._animController) {
        this._animController.card = this._activeCard;
        this._animController.renderFrame();
      }
    } else if (viewName === 'export') {
      this._renderExportThumbnail();
    }
  }

  /* =========================================================================
     CARD MODEL & RENDERING
     ========================================================================= */

  _createCardFromTemplate(template) {
    return new GreetingCard({
      title: template.title,
      occasion: template.occasion,
      width: template.width,
      height: template.height,
      backgroundColor: template.backgroundColor,
      backgroundPattern: template.backgroundPattern,
      elements: template.elements
    });
  }

  _recordState() {
    this._history.pushState(this._activeCard.toJSON());
    this._updateUndoRedoButtons();
    this._projectService.saveDraft(this._activeCard);
  }

  _renderAll() {
    this._renderer.render(this._activeCard);
    if (this._animController) {
      this._animController.card = this._activeCard;
    }
    this._syncInspector();
  }

  /**
   * Perfectly fit canvas to stage without CSS transform overflow bugs.
   */
  _updateCanvasSize() {
    const w = this._activeCard.width;
    const h = this._activeCard.height;
    this._canvas.width = w; // Internal buffer resolution (e.g. 1080)
    this._canvas.height = h;

    const stage = document.getElementById('canvas-stage');
    if (stage && stage.clientWidth > 0 && stage.clientHeight > 0) {
      const pad = 40;
      const availW = Math.max(220, stage.clientWidth - pad);
      const availH = Math.max(300, stage.clientHeight - pad);

      const cardAspect = w / h;
      const stageAspect = availW / availH;

      let dispW, dispH;
      if (stageAspect > cardAspect) {
        dispH = availH;
        dispW = dispH * cardAspect;
      } else {
        dispW = availW;
        dispH = dispW / cardAspect;
      }

      dispW *= this._zoom;
      dispH *= this._zoom;

      this._canvas.style.width = `${Math.round(dispW)}px`;
      this._canvas.style.height = `${Math.round(dispH)}px`;
    }
  }

  _applyZoom() {
    this._updateCanvasSize();
    const indicator = document.getElementById('zoom-value');
    if (indicator) {
      indicator.textContent = `${Math.round(this._zoom * 100)}%`;
    }
  }

  /* =========================================================================
     CANVAS INTERACTION (SELECT & DRAG)
     ========================================================================= */

  _setupCanvasInteractions() {
    const canvas = this._canvas;

    const getCanvasCoords = e => {
      const rect = canvas.getBoundingClientRect();
      const clientX = e.touches ? e.touches[0].clientX : e.clientX;
      const clientY = e.touches ? e.touches[0].clientY : e.clientY;
      const x = (clientX - rect.left) * (canvas.width / rect.width);
      const y = (clientY - rect.top) * (canvas.height / rect.height);
      return { x, y };
    };

    const handleStart = e => {
      const { x, y } = getCanvasCoords(e);
      const elements = [...this._activeCard.elements].reverse();
      const hit = elements.find(el => el.containsPoint(x, y));

      if (hit) {
        this._recordState();
        this._selectedElement = hit;
        this._renderer.selectedElementId = hit.id;
        this._isDragging = true;
        this._dragOffsetX = x - hit.x;
        this._dragOffsetY = y - hit.y;
      } else {
        this._selectedElement = null;
        this._renderer.selectedElementId = null;
      }
      this._renderAll();
    };

    const handleMove = e => {
      if (!this._isDragging || !this._selectedElement) return;
      const { x, y } = getCanvasCoords(e);
      this._selectedElement.x = Math.round(x - this._dragOffsetX);
      this._selectedElement.y = Math.round(y - this._dragOffsetY);
      this._renderAll();
    };

    const handleEnd = () => {
      if (this._isDragging) {
        this._isDragging = false;
        this._projectService.saveDraft(this._activeCard);
      }
    };

    canvas.addEventListener('mousedown', handleStart);
    window.addEventListener('mousemove', handleMove);
    window.addEventListener('mouseup', handleEnd);

    canvas.addEventListener('touchstart', handleStart, { passive: true });
    window.addEventListener('touchmove', handleMove, { passive: true });
    window.addEventListener('touchend', handleEnd);
  }

  /* =========================================================================
     TOOLBAR
     ========================================================================= */

  _setupEditorToolbar() {
    // New Card
    document.getElementById('tool-new')?.addEventListener('click', () => {
      this._recordState();
      this._activeCard = new GreetingCard({
        title: 'New Greeting Card',
        occasion: 'Birthday',
        width: 1080,
        height: 1350,
        backgroundColor: '#FAF7F0',
        elements: [
          new TextElement({
            text: 'Your Greeting Here',
            fontSize: 48,
            fontFamily: 'Georgia',
            x: 140,
            y: 500,
            width: 800,
            height: 100,
            color: '#A61E2D'
          })
        ]
      });
      this._selectedElement = null;
      this._renderer.selectedElementId = null;
      this._updateCanvasSize();
      this._renderAll();
      this._showToast('New card ready.');
    });

    // Save Card
    document.getElementById('tool-save')?.addEventListener('click', () => {
      const ok = this._projectService.saveProject(this._activeCard);
      if (ok) this._showToast('Card saved.');
      else this._showToast('Failed to save.', 'error');
    });

    // Undo / Redo
    const undoBtn = document.getElementById('tool-undo');
    const redoBtn = document.getElementById('tool-redo');

    undoBtn?.addEventListener('click', () => {
      const prev = this._history.undo(this._activeCard.toJSON());
      if (prev) {
        this._activeCard = GreetingCard.fromJSON(prev);
        this._selectedElement = null;
        this._renderer.selectedElementId = null;
        this._updateCanvasSize();
        this._renderAll();
        this._updateUndoRedoButtons();
      }
    });

    redoBtn?.addEventListener('click', () => {
      const next = this._history.redo(this._activeCard.toJSON());
      if (next) {
        this._activeCard = GreetingCard.fromJSON(next);
        this._selectedElement = null;
        this._renderer.selectedElementId = null;
        this._updateCanvasSize();
        this._renderAll();
        this._updateUndoRedoButtons();
      }
    });

    // Zoom Controls
    document.getElementById('tool-zoom-in')?.addEventListener('click', () => {
      this._zoom = Math.min(2.0, this._zoom + 0.15);
      this._applyZoom();
    });

    document.getElementById('tool-zoom-out')?.addEventListener('click', () => {
      this._zoom = Math.max(0.4, this._zoom - 0.15);
      this._applyZoom();
    });

    document.getElementById('tool-fit')?.addEventListener('click', () => {
      this._zoom = 1.0;
      this._applyZoom();
    });

    // Quick Action Buttons
    document.getElementById('tool-align-center-quick')?.addEventListener('click', () => {
      if (!this._selectedElement) return;
      this._recordState();
      this._selectedElement.x = Math.round((this._activeCard.width - this._selectedElement.width) / 2);
      this._renderAll();
    });

    document.getElementById('tool-dup-quick')?.addEventListener('click', () => {
      if (!this._selectedElement) return;
      this._recordState();
      const dup = this._activeCard.duplicateElement(this._selectedElement.id);
      this._selectedElement = dup;
      this._renderer.selectedElementId = dup.id;
      this._renderAll();
    });

    document.getElementById('tool-del-quick')?.addEventListener('click', () => {
      if (!this._selectedElement) return;
      this._recordState();
      this._activeCard.removeElement(this._selectedElement.id);
      this._selectedElement = null;
      this._renderer.selectedElementId = null;
      this._renderAll();
    });
  }

  _updateUndoRedoButtons() {
    const undoBtn = document.getElementById('tool-undo');
    const redoBtn = document.getElementById('tool-redo');
    if (undoBtn) undoBtn.disabled = !this._history.canUndo;
    if (redoBtn) redoBtn.disabled = !this._history.canRedo;
  }

  /* =========================================================================
     ADD ELEMENTS PALETTE (LEFT)
     ========================================================================= */

  _setupElementPalette() {
    // Category Tabs Switching
    document.querySelectorAll('.cat-nav-btn[data-cat-tab]').forEach(btn => {
      btn.addEventListener('click', () => {
        document.querySelectorAll('.cat-nav-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        const tabName = btn.dataset.catTab;
        document.querySelectorAll('.cat-pane').forEach(p => p.style.display = 'none');
        const targetPane = document.getElementById(`pane-${tabName}`);
        if (targetPane) targetPane.style.display = 'block';
      });
    });

    // Text Elements
    document.getElementById('add-heading-btn')?.addEventListener('click', () => {
      this._recordState();
      const el = new TextElement({
        text: 'Special Occasion',
        fontSize: 54,
        fontFamily: 'Playfair Display',
        color: '#A61E2D',
        x: 140,
        y: 350,
        width: 800,
        height: 80
      });
      this._activeCard.addElement(el);
      this._selectedElement = el;
      this._renderer.selectedElementId = el.id;
      this._renderAll();
    });

    document.getElementById('add-script-btn')?.addEventListener('click', () => {
      this._recordState();
      const el = new TextElement({
        text: 'Birthday',
        fontSize: 120,
        fontFamily: 'Alex Brush',
        color: '#A61E2D',
        x: 140,
        y: 430,
        width: 800,
        height: 150
      });
      this._activeCard.addElement(el);
      this._selectedElement = el;
      this._renderer.selectedElementId = el.id;
      this._renderAll();
    });

    document.getElementById('add-subheading-btn')?.addEventListener('click', () => {
      this._recordState();
      const el = new TextElement({
        text: 'wishing you a year filled with light and joy',
        fontSize: 26,
        fontFamily: 'Cormorant Garamond',
        fontStyle: 'italic',
        color: '#667085',
        x: 140,
        y: 600,
        width: 800,
        height: 60
      });
      this._activeCard.addElement(el);
      this._selectedElement = el;
      this._renderer.selectedElementId = el.id;
      this._renderAll();
    });

    document.getElementById('add-text-btn')?.addEventListener('click', () => {
      this._recordState();
      const el = new TextElement({
        text: 'May every moment of this celebration bring warm memories\nand laughter to your heart.',
        fontSize: 22,
        fontFamily: 'Inter',
        color: '#172033',
        x: 140,
        y: 670,
        width: 800,
        height: 70
      });
      this._activeCard.addElement(el);
      this._selectedElement = el;
      this._renderer.selectedElementId = el.id;
      this._renderAll();
    });

    // Shapes Elements
    document.getElementById('add-rect-btn')?.addEventListener('click', () => {
      this._recordState();
      const el = new ShapeElement({
        shapeType: 'rectangle',
        x: 60,
        y: 60,
        width: this._activeCard.width - 120,
        height: this._activeCard.height - 120,
        stroke: '#C6A15B',
        strokeWidth: 2,
        fill: 'transparent'
      });
      this._activeCard.addElement(el);
      this._selectedElement = el;
      this._renderer.selectedElementId = el.id;
      this._renderAll();
    });

    document.getElementById('add-circle-btn')?.addEventListener('click', () => {
      this._recordState();
      const el = new ShapeElement({
        shapeType: 'circle',
        x: 440,
        y: 400,
        width: 200,
        height: 200,
        stroke: '#C6A15B',
        fill: 'rgba(198, 161, 91, 0.08)'
      });
      this._activeCard.addElement(el);
      this._selectedElement = el;
      this._renderer.selectedElementId = el.id;
      this._renderAll();
    });

    document.getElementById('add-heart-btn')?.addEventListener('click', () => {
      this._recordState();
      const el = new ShapeElement({
        shapeType: 'heart',
        x: 465,
        y: 400,
        width: 150,
        height: 140,
        stroke: '#A61E2D',
        strokeWidth: 2,
        fill: 'rgba(166, 30, 45, 0.1)'
      });
      this._activeCard.addElement(el);
      this._selectedElement = el;
      this._renderer.selectedElementId = el.id;
      this._renderAll();
    });

    document.getElementById('add-star-btn')?.addEventListener('click', () => {
      this._recordState();
      const el = new ShapeElement({
        shapeType: 'star',
        x: 500,
        y: 400,
        width: 80,
        height: 80,
        stroke: '#C6A15B',
        fill: '#C6A15B',
        strokeWidth: 1
      });
      this._activeCard.addElement(el);
      this._selectedElement = el;
      this._renderer.selectedElementId = el.id;
      this._renderAll();
    });

    document.getElementById('add-diamond-btn')?.addEventListener('click', () => {
      this._recordState();
      const el = new ShapeElement({
        shapeType: 'diamond',
        x: 490,
        y: 400,
        width: 100,
        height: 100,
        stroke: '#C6A15B',
        fill: 'rgba(198, 161, 91, 0.1)',
        strokeWidth: 2
      });
      this._activeCard.addElement(el);
      this._selectedElement = el;
      this._renderer.selectedElementId = el.id;
      this._renderAll();
    });

    // Helper for adding SVG element
    const addSvg = (key, src, w = 240, h = 240, x = 420, y = 300) => {
      this._recordState();
      const el = new SvgElement({
        svgKey: key,
        src: src,
        x: x,
        y: y,
        width: w,
        height: h
      });
      this._activeCard.addElement(el);
      this._selectedElement = el;
      this._renderer.selectedElementId = el.id;
      this._renderAll();
    };

    document.getElementById('add-svg-watercolor-corner')?.addEventListener('click', () => addSvg('watercolor-floral-corner', 'assets/illustrations/watercolor-floral-corner.svg', 360, 360, 20, 20));
    document.getElementById('add-svg-botanical')?.addEventListener('click', () => addSvg('botanical-sidebar', 'assets/illustrations/botanical-sidebar.svg', 200, 300, 440, 250));
    document.getElementById('add-svg-balloons')?.addEventListener('click', () => addSvg('birthday-balloons', 'assets/illustrations/birthday-balloons.svg', 260, 320, 410, 200));
    document.getElementById('add-svg-cake')?.addEventListener('click', () => addSvg('birthday-cake', 'assets/illustrations/birthday-cake.svg', 200, 240, 440, 250));
    document.getElementById('add-svg-ornament')?.addEventListener('click', () => addSvg('gold-ornament', 'assets/illustrations/gold-ornament.svg', 180, 180, 450, 250));
    document.getElementById('add-svg-lamp')?.addEventListener('click', () => addSvg('festive-lamp', 'assets/illustrations/festive-lamp.svg', 160, 220, 460, 200));

    // Frames Elements
    document.getElementById('add-frame-gold-double')?.addEventListener('click', () => {
      addSvg('golden-double-frame', 'assets/illustrations/golden-double-frame.svg', this._activeCard.width - 60, this._activeCard.height - 60, 30, 30);
    });
    document.getElementById('add-frame-floral')?.addEventListener('click', () => {
      addSvg('floral-frame', 'assets/illustrations/floral-frame.svg', this._activeCard.width - 80, this._activeCard.height - 80, 40, 40);
    });
    document.getElementById('add-frame-geometric')?.addEventListener('click', () => {
      addSvg('geometric-frame', 'assets/illustrations/geometric-frame.svg', this._activeCard.width - 80, this._activeCard.height - 80, 40, 40);
    });
  }

  /* =========================================================================
     PROPERTIES INSPECTOR (RIGHT) & CARD SETTINGS
     ========================================================================= */

  _setupPropertyInspector() {
    const tabs = document.querySelectorAll('.inspector-tab');
    const elBody = document.getElementById('tab-element-body');
    const cardBody = document.getElementById('tab-card-body');

    tabs.forEach(tab => {
      tab.addEventListener('click', () => {
        tabs.forEach(t => t.classList.remove('active'));
        tab.classList.add('active');
        if (tab.dataset.tab === 'element') {
          elBody.style.display = 'flex';
          cardBody.style.display = 'none';
        } else {
          elBody.style.display = 'none';
          cardBody.style.display = 'flex';
        }
      });
    });

    const textInput = document.getElementById('text-content-input');
    textInput?.addEventListener('input', e => {
      if (this._selectedElement && this._selectedElement.type === 'text') {
        this._selectedElement.text = e.target.value;
        this._renderAll();
      }
    });

    document.getElementById('font-family-select')?.addEventListener('change', e => {
      if (this._selectedElement && this._selectedElement.type === 'text') {
        this._recordState();
        this._selectedElement.fontFamily = e.target.value;
        this._renderAll();
      }
    });

    document.getElementById('font-size-input')?.addEventListener('input', e => {
      if (this._selectedElement && this._selectedElement.type === 'text') {
        this._selectedElement.fontSize = Number(e.target.value);
        this._renderAll();
      }
    });

    document.getElementById('btn-font-inc')?.addEventListener('click', () => {
      if (this._selectedElement && this._selectedElement.type === 'text') {
        this._recordState();
        this._selectedElement.fontSize = Math.min(220, this._selectedElement.fontSize + 4);
        const input = document.getElementById('font-size-input');
        if (input) input.value = this._selectedElement.fontSize;
        this._renderAll();
      }
    });

    document.getElementById('btn-font-dec')?.addEventListener('click', () => {
      if (this._selectedElement && this._selectedElement.type === 'text') {
        this._recordState();
        this._selectedElement.fontSize = Math.max(12, this._selectedElement.fontSize - 4);
        const input = document.getElementById('font-size-input');
        if (input) input.value = this._selectedElement.fontSize;
        this._renderAll();
      }
    });

    document.getElementById('btn-bold')?.addEventListener('click', () => {
      if (this._selectedElement && this._selectedElement.type === 'text') {
        this._recordState();
        this._selectedElement.fontWeight = this._selectedElement.fontWeight === 'bold' ? 'normal' : 'bold';
        this._renderAll();
      }
    });

    document.getElementById('btn-italic')?.addEventListener('click', () => {
      if (this._selectedElement && this._selectedElement.type === 'text') {
        this._recordState();
        this._selectedElement.fontStyle = this._selectedElement.fontStyle === 'italic' ? 'normal' : 'italic';
        this._renderAll();
      }
    });

    document.getElementById('btn-align-left')?.addEventListener('click', () => {
      if (this._selectedElement && this._selectedElement.type === 'text') {
        this._selectedElement.textAlign = 'left';
        this._renderAll();
      }
    });

    document.getElementById('btn-align-center')?.addEventListener('click', () => {
      if (this._selectedElement && this._selectedElement.type === 'text') {
        this._selectedElement.textAlign = 'center';
        this._renderAll();
      }
    });

    document.getElementById('btn-align-right')?.addEventListener('click', () => {
      if (this._selectedElement && this._selectedElement.type === 'text') {
        this._selectedElement.textAlign = 'right';
        this._renderAll();
      }
    });

    document.getElementById('letter-spacing-slider')?.addEventListener('input', e => {
      if (this._selectedElement && this._selectedElement.type === 'text') {
        this._selectedElement.letterSpacing = Number(e.target.value);
        const lbl = document.getElementById('letter-spacing-val');
        if (lbl) lbl.textContent = e.target.value;
        this._renderAll();
      }
    });

    document.getElementById('line-height-slider')?.addEventListener('input', e => {
      if (this._selectedElement && this._selectedElement.type === 'text') {
        this._selectedElement.lineHeight = Number(e.target.value);
        const lbl = document.getElementById('line-height-val');
        if (lbl) lbl.textContent = e.target.value;
        this._renderAll();
      }
    });

    document.getElementById('opacity-slider')?.addEventListener('input', e => {
      if (this._selectedElement) {
        this._selectedElement.opacity = Number(e.target.value) / 100;
        const lbl = document.getElementById('opacity-val');
        if (lbl) lbl.textContent = e.target.value;
        this._renderAll();
      }
    });

    // Swatches Color Pickers
    document.querySelectorAll('.palette-swatches .swatch-btn[data-color]').forEach(btn => {
      btn.addEventListener('click', () => {
        if (!this._selectedElement) return;
        this._recordState();
        const color = btn.dataset.color;
        if (this._selectedElement.type === 'text') {
          this._selectedElement.color = color;
        } else if (this._selectedElement.type === 'shape') {
          this._selectedElement.stroke = color;
        }
        this._renderAll();
      });
    });

    // Custom Color Input
    document.getElementById('custom-color-input')?.addEventListener('input', e => {
      if (!this._selectedElement) return;
      const color = e.target.value;
      if (this._selectedElement.type === 'text') {
        this._selectedElement.color = color;
      } else if (this._selectedElement.type === 'shape') {
        this._selectedElement.stroke = color;
      }
      this._renderAll();
    });

    // Arrange buttons
    document.getElementById('btn-bring-front')?.addEventListener('click', () => {
      if (!this._selectedElement) return;
      this._recordState();
      this._activeCard.bringForward(this._selectedElement.id);
      this._renderAll();
    });

    document.getElementById('btn-send-back')?.addEventListener('click', () => {
      if (!this._selectedElement) return;
      this._recordState();
      this._activeCard.sendBackward(this._selectedElement.id);
      this._renderAll();
    });

    document.getElementById('btn-duplicate')?.addEventListener('click', () => {
      if (!this._selectedElement) return;
      this._recordState();
      const dup = this._activeCard.duplicateElement(this._selectedElement.id);
      this._selectedElement = dup;
      this._renderer.selectedElementId = dup.id;
      this._renderAll();
    });

    document.getElementById('btn-delete')?.addEventListener('click', () => {
      if (!this._selectedElement) return;
      this._recordState();
      this._activeCard.removeElement(this._selectedElement.id);
      this._selectedElement = null;
      this._renderer.selectedElementId = null;
      this._renderAll();
    });

    // Card Settings Handlers
    document.getElementById('card-title-input')?.addEventListener('input', e => {
      this._activeCard.title = e.target.value;
      this._projectService.saveDraft(this._activeCard);
    });

    document.querySelectorAll('.palette-swatches .swatch-btn[data-bg]').forEach(btn => {
      btn.addEventListener('click', () => {
        this._recordState();
        this._activeCard.backgroundColor = btn.dataset.bg;
        this._renderAll();
      });
    });

    document.getElementById('bg-pattern-select')?.addEventListener('change', e => {
      this._recordState();
      this._activeCard.backgroundPattern = e.target.value;
      this._renderAll();
    });

    document.getElementById('bg-pattern-select-card')?.addEventListener('change', e => {
      this._recordState();
      this._activeCard.backgroundPattern = e.target.value;
      this._renderAll();
    });

    // Aspect Ratio Pills in Card Settings & Status Bar
    document.querySelectorAll('.ratio-pill-btn, .quick-pill').forEach(btn => {
      btn.addEventListener('click', () => {
        this._setCardRatio(btn.dataset.ratio);
      });
    });

    document.getElementById('status-fit-btn')?.addEventListener('click', () => {
      this._zoom = 1.0;
      this._applyZoom();
    });
  }

  _setCardRatio(ratio) {
    this._recordState();
    let label = 'Square 1:1 (1080 × 1080)';
    if (ratio === 'portrait') {
      this._activeCard.width = 1080;
      this._activeCard.height = 1350;
      label = 'Portrait 4:5 (1080 × 1350)';
    } else if (ratio === 'story') {
      this._activeCard.width = 1080;
      this._activeCard.height = 1920;
      label = 'Story 9:16 (1080 × 1920)';
    } else if (ratio === 'folded') {
      this._activeCard.width = 1050;
      this._activeCard.height = 1470;
      label = 'Folded 5:7 (1050 × 1470)';
    } else {
      this._activeCard.width = 1080;
      this._activeCard.height = 1080;
      label = 'Square 1:1 (1080 × 1080)';
    }

    // Sync active state on pills
    document.querySelectorAll('.ratio-pill-btn, .quick-pill').forEach(btn => {
      btn.classList.toggle('active', btn.dataset.ratio === ratio);
    });

    const sizeEl = document.getElementById('status-card-size');
    if (sizeEl) sizeEl.textContent = `${this._activeCard.width} × ${this._activeCard.height} px (${ratio})`;

    this._updateCanvasSize();
    this._renderAll();
    this._showToast(`Ratio set to ${ratio}.`);
  }

  _syncInspector() {
    const noSel = document.getElementById('no-selection-msg');
    const selControls = document.getElementById('selection-controls');
    const textProps = document.getElementById('text-props-wrap');
    const statusSel = document.getElementById('status-selection');
    const statusSize = document.getElementById('status-card-size');

    if (statusSize) {
      statusSize.textContent = `${this._activeCard.width} × ${this._activeCard.height} px`;
    }

    if (!this._selectedElement) {
      if (noSel) noSel.style.display = 'block';
      if (selControls) selControls.style.display = 'none';
      if (statusSel) statusSel.textContent = 'None (Click item on card)';
      return;
    }

    if (noSel) noSel.style.display = 'none';
    if (selControls) selControls.style.display = 'flex';

    if (statusSel) {
      if (this._selectedElement.type === 'text') {
        const snippet = this._selectedElement.text.split('\n')[0].substring(0, 16);
        statusSel.textContent = `Selected: Text '${snippet}'`;
      } else if (this._selectedElement.type === 'svg') {
        statusSel.textContent = `Selected: ${this._selectedElement.svgKey || 'Artwork'}`;
      } else {
        statusSel.textContent = `Selected: ${this._selectedElement.shapeType || 'Shape'}`;
      }
    }

    if (this._selectedElement.type === 'text') {
      if (textProps) textProps.style.display = 'block';
      const textInput = document.getElementById('text-content-input');
      const fontSizeInput = document.getElementById('font-size-input');
      const fontFamSelect = document.getElementById('font-family-select');

      if (textInput && textInput !== document.activeElement) textInput.value = this._selectedElement.text;
      if (fontSizeInput) fontSizeInput.value = this._selectedElement.fontSize;
      if (fontFamSelect) fontFamSelect.value = this._selectedElement.fontFamily;

      const spacingSlider = document.getElementById('letter-spacing-slider');
      const spacingVal = document.getElementById('letter-spacing-val');
      if (spacingSlider) spacingSlider.value = this._selectedElement.letterSpacing || 0;
      if (spacingVal) spacingVal.textContent = this._selectedElement.letterSpacing || 0;

      const heightSlider = document.getElementById('line-height-slider');
      const heightVal = document.getElementById('line-height-val');
      if (heightSlider) heightSlider.value = this._selectedElement.lineHeight || 1.3;
      if (heightVal) heightVal.textContent = this._selectedElement.lineHeight || 1.3;
    } else {
      if (textProps) textProps.style.display = 'none';
    }

    const opSlider = document.getElementById('opacity-slider');
    const opVal = document.getElementById('opacity-val');
    const opPercent = Math.round((this._selectedElement.opacity ?? 1) * 100);
    if (opSlider) opSlider.value = opPercent;
    if (opVal) opVal.textContent = opPercent;

    const titleInput = document.getElementById('card-title-input');
    if (titleInput && titleInput !== document.activeElement) {
      titleInput.value = this._activeCard.title;
    }
  }

  /* =========================================================================
     TEMPLATES & OCCASIONS SHOWCASE
     ========================================================================= */

  _setupTemplateGallery() {
    this._renderTemplatesGrid('All');

    const chips = document.querySelectorAll('#category-chips .chip-btn');
    chips.forEach(chip => {
      chip.addEventListener('click', () => {
        chips.forEach(c => c.classList.remove('active'));
        chip.classList.add('active');
        this._renderTemplatesGrid(chip.dataset.cat);
      });
    });

    const searchInput = document.getElementById('template-search');
    searchInput?.addEventListener('input', e => {
      const q = e.target.value.toLowerCase();
      const all = this._templateService.getAllTemplates();
      const filtered = all.filter(t => t.title.toLowerCase().includes(q) || t.category.toLowerCase().includes(q));
      this._renderTemplateCards(filtered);
    });
  }

  _renderTemplatesGrid(category) {
    const templates = this._templateService.getTemplatesByCategory(category);
    this._renderTemplateCards(templates);
  }

  _renderTemplateCards(templates) {
    const grid = document.getElementById('templates-grid');
    if (!grid) return;
    grid.innerHTML = '';
    templates.forEach(t => {
      grid.appendChild(this._createTemplateCardElement(t));
    });
  }

  _setupTemplateShowcase() {
    this._renderShowcaseGrid('All');

    const showcaseChips = document.querySelectorAll('#showcase-category-chips .chip-btn');
    showcaseChips.forEach(chip => {
      chip.addEventListener('click', () => {
        showcaseChips.forEach(c => c.classList.remove('active'));
        chip.classList.add('active');
        this._renderShowcaseGrid(chip.dataset.showcaseCat);
      });
    });

    document.getElementById('btn-showcase-view-all')?.addEventListener('click', () => {
      this.switchView('templates');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  _renderShowcaseGrid(category) {
    const grid = document.getElementById('showcase-grid');
    if (!grid) return;
    grid.innerHTML = '';
    const templates = this._templateService.getTemplatesByCategory(category);
    // Showcase all templates matching category
    templates.forEach(t => {
      grid.appendChild(this._createTemplateCardElement(t));
    });
  }

  _createTemplateCardElement(t) {
    const card = document.createElement('article');
    card.className = 'template-card';
    const isFav = this._projectService.getFavorites().includes(t.id);

    // Extract calligraphy text or title for realistic aesthetic preview
    const scriptEl = t.elements.find(el => el.type === 'text' && (el.fontFamily.includes('Brush') || el.fontFamily.includes('Vibes')));
    const titleText = scriptEl ? scriptEl.text : t.title;
    const fontName = scriptEl ? scriptEl.fontFamily : 'Alex Brush';
    const isDark = (t.backgroundColor === '#0D1117' || t.backgroundColor === '#11141E' || t.backgroundColor === '#0B132B' || t.backgroundColor === '#0E1E38' || t.backgroundColor === '#2A0E14' || t.backgroundColor === '#172033');
    const fontColor = (t.previewStyle && t.previewStyle.textColor) || (isDark ? '#E8C988' : '#A61E2D');

    card.innerHTML = `
      <div class="template-preview-frame" style="background-color: ${t.backgroundColor}; border: 1px solid ${isDark ? 'rgba(232,201,136,0.2)' : 'rgba(198,161,91,0.25)'};">
        <span class="template-badge" style="background:${isDark ? 'rgba(232,201,136,0.18)' : 'rgba(166,30,45,0.08)'}; color:${isDark ? '#E8C988' : '#A61E2D'};">${t.category}</span>
        <button class="template-fav-btn ${isFav ? 'is-favorite' : ''}" data-fav-id="${t.id}" aria-label="Favorite">
          <svg class="icon" viewBox="0 0 24 24"><path d="M19 14c1.5-1.5 2-3 2-4.5 0-3-2.5-5.5-5.5-5.5-2 0-3.5 1-4.5 2.5C10 5 8.5 4 6.5 4 3.5 4 1 6.5 1 9.5c0 1.5.5 3 2 4.5L12 21l7-7Z"/></svg>
        </button>
        <div class="template-card-visual">
          <div class="mini-frame-inner" style="border: 1px solid ${isDark ? 'rgba(232,201,136,0.28)' : 'rgba(198,161,91,0.25)'};">
            <span class="mini-occasion-tag" style="color: ${isDark ? '#C6A15B' : '#81917A'};">${t.occasion.toUpperCase()}</span>
            <div class="mini-headline" style="font-family: '${fontName}', cursive; color: ${fontColor};">${titleText}</div>
            <div class="mini-subtext" style="color: ${isDark ? '#E8E2D8' : '#667085'};">Cardora Studio Design</div>
          </div>
        </div>
      </div>
      <div class="template-info">
        <div class="template-info-header">
          <h4>${t.title}</h4>
          <span class="template-ratio-tag">${t.width === t.height ? '1:1 Square' : '4:5 Portrait'}</span>
        </div>
        <p>${t.previewDesc || 'Customizable digital greeting card design.'}</p>
        <div class="template-actions">
          <button class="btn btn-primary btn-sm btn-use-template" data-template-id="${t.id}" style="width: 100%;">
            <svg class="icon" viewBox="0 0 24 24"><path d="m16 3 5 5-12 12-6 1 1-6Z"/><path d="m14 5 5 5"/></svg>
            <span>Customize in Studio</span>
          </button>
        </div>
      </div>
    `;

    card.querySelector('.template-fav-btn')?.addEventListener('click', e => {
      e.stopPropagation();
      this._projectService.toggleFavorite(t.id);
      this._refreshTemplateViews();
    });

    card.querySelector('.btn-use-template')?.addEventListener('click', () => {
      this._loadTemplateIntoStudio(t);
    });

    return card;
  }

  _loadTemplateIntoStudio(t) {
    this._recordState();
    this._activeCard = this._createCardFromTemplate(t);
    this._selectedElement = null;
    this._renderer.selectedElementId = null;
    if (this._currentView !== 'studio') {
      this.switchView('studio');
    }
    this._updateCanvasSize();
    this._renderAll();
    this._updateStatusCardInfo();
    this._updateUndoRedoButtons();
    // Smoothly scroll to the editor stage
    document.querySelector('.editor-workspace')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    this._showToast(`Loaded "${t.title}" into Studio.`);
  }

  _refreshTemplateViews() {
    const activeShowcaseCat = document.querySelector('#showcase-category-chips .chip-btn.active')?.dataset.showcaseCat || 'All';
    this._renderShowcaseGrid(activeShowcaseCat);
    const activeGalleryCat = document.querySelector('#category-chips .chip-btn.active')?.dataset.cat || 'All';
    this._renderTemplatesGrid(activeGalleryCat);
  }

  /* =========================================================================
     ANIMATION
     ========================================================================= */

  _setupAnimationControls() {
    const playBtn = document.getElementById('anim-play-btn');
    const restartBtn = document.getElementById('anim-restart-btn');
    const scrubber = document.getElementById('timeline-scrubber');
    const timeLabel = document.getElementById('anim-time-label');

    playBtn?.addEventListener('click', () => {
      if (this._animController.isPlaying) {
        this._animController.pause();
        playBtn.innerHTML = '<svg class="icon" viewBox="0 0 24 24"><polygon points="6 4 18 12 6 20 6 4" fill="currentColor"/></svg>';
      } else {
        this._animController.play();
        playBtn.innerHTML = '<svg class="icon" viewBox="0 0 24 24"><rect x="6" y="4" width="4" height="16"/><rect x="14" y="4" width="4" height="16"/></svg>';
      }
    });

    restartBtn?.addEventListener('click', () => {
      this._animController.restart();
      if (playBtn) playBtn.innerHTML = '<svg class="icon" viewBox="0 0 24 24"><rect x="6" y="4" width="4" height="16"/><rect x="14" y="4" width="4" height="16"/></svg>';
    });

    scrubber?.addEventListener('input', e => {
      const val = Number(e.target.value) / 100;
      this._animController.seek(val);
      if (timeLabel) timeLabel.textContent = `${this._animController.currentTime.toFixed(1)}s`;
    });

    document.getElementById('anim-entrance-select')?.addEventListener('change', e => {
      this._animController.entranceEffect = e.target.value;
      this._animController.restart();
    });

    document.getElementById('anim-effect-select')?.addEventListener('change', e => {
      this._animController.decorativeEffect = e.target.value;
      this._animController.restart();
    });

    document.getElementById('anim-particles-select')?.addEventListener('change', e => {
      this._animController.particleType = e.target.value;
      this._animController.restart();
    });

    document.getElementById('anim-duration-slider')?.addEventListener('input', e => {
      this._animController.duration = Number(e.target.value);
      const label = document.getElementById('duration-val-label');
      if (label) label.textContent = `${e.target.value}s`;
    });
  }

  /* =========================================================================
     EXPORT
     ========================================================================= */

  _setupExportWorkflow() {
    const downloadBtn = document.getElementById('download-final-btn');
    downloadBtn?.addEventListener('click', async () => {
      const format = document.getElementById('export-format-select')?.value || 'image/png';
      const scale = Number(document.getElementById('export-scale-select')?.value || '2.0');

      downloadBtn.disabled = true;
      downloadBtn.innerHTML = '<span>Rendering High-Res Card…</span>';

      try {
        await this._exportService.exportCard(this._activeCard, { format, scale });
        this._showToast('Card exported successfully!');
      } catch (err) {
        console.error(err);
        this._showToast('Export failed.', 'error');
      } finally {
        downloadBtn.disabled = false;
        downloadBtn.innerHTML = `
          <svg class="icon" viewBox="0 0 24 24"><path d="M12 3v12m-5-5 5 5 5-5M4 16v5h16v-5"/></svg>
          <span>Download Card Image</span>
        `;
      }
    });
  }

  _renderExportThumbnail() {
    const thumbCanvas = document.getElementById('export-thumbnail-canvas');
    if (!thumbCanvas || !this._activeCard) return;
    const ctx = thumbCanvas.getContext('2d');
    ctx.clearRect(0, 0, thumbCanvas.width, thumbCanvas.height);

    ctx.save();
    const scale = Math.min(thumbCanvas.width / this._activeCard.width, thumbCanvas.height / this._activeCard.height);
    ctx.scale(scale, scale);

    this._activeCard.renderBackground(ctx);
    this._activeCard.elements.forEach(el => el.render(ctx, { isExport: true }));
    ctx.restore();
  }

  /* =========================================================================
     PROJECTS & SETTINGS MODALS
     ========================================================================= */

  _setupModals() {
    document.getElementById('close-projects-btn')?.addEventListener('click', () => this._closeModal('modal-projects'));
    document.getElementById('close-settings-btn')?.addEventListener('click', () => this._closeModal('modal-settings'));

    document.querySelectorAll('.modal-backdrop').forEach(backdrop => {
      backdrop.addEventListener('click', e => {
        if (e.target === backdrop) backdrop.classList.remove('is-open');
      });
    });
  }

  _openModal(modalId) {
    document.getElementById(modalId)?.classList.add('is-open');
  }

  _closeModal(modalId) {
    document.getElementById(modalId)?.classList.remove('is-open');
  }

  _renderProjectsModal() {
    const container = document.getElementById('projects-list-body');
    if (!container) return;

    const list = this._projectService.getAllProjects();
    if (!list.length) {
      container.innerHTML = `
        <div style="text-align: center; padding: 28px 0; color: var(--color-text-muted);">
          <p>No saved projects yet. Click "Save" in the studio toolbar to save your creations.</p>
        </div>
      `;
      return;
    }

    container.innerHTML = `
      <div style="display: flex; flex-direction: column; gap: 10px;">
        ${list.map(p => `
          <div style="display: flex; align-items: center; justify-content: space-between; padding: 10px 14px; border: 1px solid var(--color-border); border-radius: var(--radius-md); background: var(--color-ivory);">
            <div>
              <strong style="font-size: 0.95rem; color: var(--color-text-dark);">${p.title}</strong>
              <div style="font-size: 0.75rem; color: var(--color-text-muted);">${new Date(p.updatedAt).toLocaleDateString()} · ${p.elements.length} elements</div>
            </div>
            <div style="display: flex; gap: 6px;">
              <button class="btn btn-secondary btn-sm btn-open-project" data-id="${p.id}">Open</button>
              <button class="btn btn-secondary btn-sm btn-del-project" data-id="${p.id}" style="color: var(--color-error);">Delete</button>
            </div>
          </div>
        `).join('')}
      </div>
    `;

    container.querySelectorAll('.btn-open-project').forEach(btn => {
      btn.addEventListener('click', () => {
        const proj = this._projectService.getProjectById(btn.dataset.id);
        if (proj) {
          this._recordState();
          this._activeCard = proj;
          this._selectedElement = null;
          this._renderer.selectedElementId = null;
          this._updateCanvasSize();
          this._renderAll();
          this._closeModal('modal-projects');
          this.switchView('studio');
          this._showToast(`Opened "${proj.title}".`);
        }
      });
    });

    container.querySelectorAll('.btn-del-project').forEach(btn => {
      btn.addEventListener('click', () => {
        this._projectService.deleteProject(btn.dataset.id);
        this._renderProjectsModal();
        this._showToast('Project deleted.');
      });
    });
  }

  _applySettings() {
    const settings = this._projectService.getSettings();
    if (settings.theme === 'dark') {
      document.documentElement.setAttribute('data-theme', 'dark');
      const select = document.getElementById('setting-theme-select');
      if (select) select.value = 'dark';
    }

    document.getElementById('setting-theme-select')?.addEventListener('change', e => {
      const theme = e.target.value;
      if (theme === 'dark') document.documentElement.setAttribute('data-theme', 'dark');
      else document.documentElement.removeAttribute('data-theme');
      settings.theme = theme;
      this._projectService.saveSettings(settings);
    });

    document.getElementById('setting-reduced-motion')?.addEventListener('change', e => {
      settings.reducedMotion = e.target.checked;
      this._projectService.saveSettings(settings);
    });

    document.getElementById('reset-workspace-btn')?.addEventListener('click', () => {
      if (confirm('Are you sure you want to reset demo cards?')) {
        localStorage.clear();
        location.reload();
      }
    });
  }

  _showToast(msg, type = 'success') {
    const container = document.getElementById('toast-container');
    if (!container) return;

    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    toast.textContent = msg;

    container.appendChild(toast);
    setTimeout(() => {
      toast.style.opacity = '0';
      toast.style.transform = 'translateY(8px)';
      toast.style.transition = 'all 160ms ease';
      setTimeout(() => toast.remove(), 160);
    }, 2800);
  }
}

// Bootstrap application on DOM load
window.addEventListener('DOMContentLoaded', () => {
  window.CardoraAppInstance = new CardoraApp();
});
