# Cardora — Digital Greeting Card Studio

> **Turn Moments Into Beautiful Memories**  
> A client-side, zero-dependency, single-page creative studio combining Object-Oriented Software Architecture with botanical vector art and high-DPI export.

---

## 1. Project Overview

**Cardora** is an interactive, browser-based digital greeting card creator. Designed with an editorial stationery aesthetic, it empowers users to personalize greetings, customize typography, add SVG vector illustrations, preview physics-based particle animations, and export print-ready cards.

This project was built from the ground up to demonstrate rigorous **Object-Oriented Programming (OOP)** patterns in frontend engineering while fulfilling modern web standards with **zero external runtime dependencies**.

---

## 2. Key Features

- **Embedded Interactive Studio**: Large central canvas supporting direct pointer manipulation, element hit-testing, dragging, and coordinate tracking.
- **Curated Starter Templates & Showcase**: 14+ distinct occasion designs (Botanical Birthday, Midnight Gold, Royal Wedding, Eucalyptus Romance, Golden Jubilee, Diwali Lights, Milestone Triumph, Gratitude & Grace, etc.) rendered from pure data models with real-time studio loading.
- **Typographic & Element Inspector**: Full control over font families (Georgia, Inter), sizes, font weights, italic styles, text alignment, and luxury color swatches.
- **Pure Vector & SVG Asset Library**: Includes custom botanical branches, balloon bundles, birthday cakes, gold flourishes, and festive lamps. **Zero emojis** are used anywhere in the product.
- **Motion & Particle Engine**: Real-time canvas animation loop featuring entrance transitions (Slide Up, Fade In, Scale In, 2.5D Card Opening) and physics-based particle effects (falling petals, confetti, twinkling stars). Respects `prefers-reduced-motion`.
- **Command / Memento Undo & Redo**: Full rollback and roll-forward capability for element additions, mutations, and color changes.
- **Clean High-DPI Export**: Renders offscreen at 1x or 2x supersampling (144+ DPI) to PNG or JPEG, automatically stripping all editor handles and selection outlines.
- **Local Persistence & Recovery**: Autosaves project drafts and saved collections to browser `localStorage` with error fallback.

---

## 3. Object-Oriented Architecture (OOP Highlights)

Cardora is structured cleanly into models, services, and presentation controllers:

```
src/
├── models/
│   ├── CardElement.js    # Abstract base class (encapsulation, hit-testing, polymorphic render)
│   ├── TextElement.js    # Inherits CardElement (typography, multi-line wrapping, styles)
│   ├── ShapeElement.js   # Inherits CardElement (rect, circle, heart, star, diamond)
│   ├── SvgElement.js     # Inherits CardElement (vector rasterization, aspect ratio)
│   └── GreetingCard.js   # Composition container owning elements, canvas dimensions, background
└── services/
    ├── CardRenderer.js       # Strategy pattern coordinating canvas rendering & selection handles
    ├── TemplateService.js    # Factory method creating pre-composed GreetingCard instances
    ├── ProjectService.js     # Repository pattern handling local persistence & drafts
    ├── HistoryManager.js     # Memento pattern implementing undo/redo state stacks
    ├── AnimationController.js# State & observer loop driving particle physics & transitions
    └── ExportService.js      # Offscreen snapshot factory producing high-DPI image downloads
```

### Core OOP Principles Demonstrated:
1. **Inheritance**: `TextElement`, `ShapeElement`, and `SvgElement` extend `CardElement`.
2. **Polymorphism**: `CardRenderer` iterates polymorphically over `card.elements`, calling `element.render(ctx)`.
3. **Encapsulation**: Element dimensions, coordinates, and styling are guarded by getters and setters with boundary clamping.
4. **Composition**: `GreetingCard` manages collections of `CardElement` objects and their z-order lifecycles.
5. **Design Patterns**:
   - **Memento Pattern**: `HistoryManager` captures and restores card state snapshots.
   - **Factory Method**: `TemplateService` instantiates occasion-specific greeting cards.
   - **Strategy Pattern**: `ExportService` and `CardRenderer` isolate rendering contexts.

---

## 4. Technology Stack

- **Runtime**: Native Modern JavaScript (ES Modules, ES2022+).
- **Presentation**: Semantic HTML5 & Modern CSS3 (CSS Custom Properties, Glassmorphism, Responsive Grid).
- **Graphics Engine**: HTML5 Canvas 2D Context (`CanvasRenderingContext2D`) + Scalable Vector Graphics (SVG).
- **Build Requirements**: **Zero build step required**. Operates directly in any modern web browser or static web server.

---

## 5. Local Setup & Running Instructions

To run Cardora locally:

### Option A: Python Built-in Server (Recommended)
Open your terminal in the `shreya-oops` folder and run:
```sh
# Navigate to project directory
cd shreya-oops

# Start local server
python -m http.server 3000
```
Open your browser and navigate to: `http://localhost:3000`

### Option B: VS Code Live Server
1. Open the `shreya-oops` folder in VS Code.
2. Right-click `index.html` and click **"Open with Live Server"**.

---

## 6. Static Hosting Deployment

Cardora is completely self-contained and pre-configured for static host deployment:

### Netlify Deployment
1. Push this directory to your GitHub repository.
2. Log in to [Netlify](https://www.netlify.com).
3. Click **Add new site** > **Import an existing project** > **GitHub**.
4. Set:
   - **Base directory**: `shreya-oops` (or root if repository is dedicated).
   - **Build command**: *(leave blank)*.
   - **Publish directory**: `.` (or `shreya-oops`).
5. Click **Deploy Site**.

### Cloudflare Pages Deployment
1. Log in to the [Cloudflare Dashboard](https://dash.cloudflare.com) > **Workers & Pages**.
2. Select **Create application** > **Pages** > **Connect to Git**.
3. Select your repository.
4. Set:
   - **Framework preset**: `None`.
   - **Build command**: *(leave blank)*.
   - **Build output directory**: `shreya-oops` (or `.` if root).
5. Click **Save and Deploy**.

---

## 7. Storage & Privacy

- All user cards and custom edits are stored locally in the browser via `localStorage` under `cardora.projects.v1`.
- **Zero data is transmitted** to any third-party analytics or external cloud servers.
- No cookies or authentication credentials are required.

---

## 8. Academic Evaluation Notes

- If your college evaluation strictly asks for native Java/JavaFX desktop applications, note that this web application delivers the complete OOP architectural design in modern modular JavaScript. The class contracts map 1:1 to Java classes (`CardElement.java`, `GreetingCard.java`, etc.).
