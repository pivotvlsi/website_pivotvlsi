# PIVOT VLSI - Schematic Editor Context

## Project Overview
This project is a web-based digital logic schematic editor. It allows users to place logic gates (currently AND gates), route wires between them, select/move components, copy/paste, and delete them. The application is built using standard web technologies (HTML5, CSS3, Vanilla JavaScript) and heavily utilizes the HTML `<canvas>` element for rendering.

### Unique Naming Convention
A critical characteristic of this codebase is that it uses **Sanskrit/Devanagari script** for almost all HTML IDs, CSS classes, JavaScript variables, and function names.

---

## File Summaries

### 1. `schematic.html` (Structure)
Provides the structural layout of the application.
- **Header (`#शीर्षपट्टिका`)**: Contains the company logo and navigation links.
- **Toolbar (`#उपकरणपट्टिका`)**: Contains buttons for various modes: Normal (Pointer), Save, Delete, Zoom Out, Zoom In, Zoom Percentage Input, Zoom Fit, and Copy.
- **Workspace (`#कार्यक्षेत्रम्`)**: Split into two main areas:
  - **Gate Palette (`#तर्कद्वारपट्टिका`)**: A sidebar containing draggable tools like the Wire tool (`तन्तुकुञ्जिका`) and the AND Gate tool (`संयोगद्वारकुञ्जिका`).
  - **Canvas Container (`#पटपात्रम्`)**: Houses two layered `<canvas>` elements:
    - `#बिन्दुपटः` (Grid/Dot Canvas): Renders the background grid.
    - `#तर्कद्वारपटः` (Logic Gate Canvas): Renders all gates, wires, nodes, and temporary UI feedback (selection boxes, floating gates).

### 2. `schematic.css` (Styling)
Manages the visual presentation and layout.
- Utilizes CSS Flexbox for the main layout to ensure the workspace fills the remaining screen height below the fixed header.
- Implements a glassmorphism effect on the top navigation bar.
- Styles a resizable vertical splitter (`#पट्टिकाविभाजकः`) between the gate palette and the canvas.
- Positions the two canvases absolutely on top of each other (`z-index: 1` for grid, `z-index: 2` for gates).

### 3. `schematic.js` (Core Logic)
This is the engine of the schematic editor. It handles state management, event listeners, and canvas rendering.

**Key Global State Variables:**
- `स्थापितानिद्वाराणि` (Placed Gates): Array of gate objects.
- `स्थापितास्तन्तवः` (Placed Wires): Array of wire segments.
- `स्थापिताःबिन्दवः` (Placed Dots/Nodes): Array of connection points.
- `चयनितद्वाराणि`, `चयनिततन्तवः` (Selected components for moving/copying).
- Mode flags: `सक्रियद्वारस्थापनम्` (Gate placement mode), `सक्रियतन्तुस्थापनम्` (Wire placement mode), `सक्रियशोधनम्` (Delete mode), `सक्रियप्रतिकृतिः` (Copy mode).

**Key Functionalities:**
- **Zooming & Panning:** Dynamic scaling of the canvas elements (25% to 250%) managed by `परिवर्तनविस्तारम्()`. The grid spacing and component rendering scale accordingly.
- **Component Rendering:** 
  - `जालरेखनम्()`: Draws the background dot grid.
  - `द्वाररेखनम्()`: Main render loop for the foreground. Draws wires, connection dots, gates, selection marquees, and floating components attached to the cursor.
- **Wire Routing:**
  - Calculates best paths using horizontal/vertical segments (`श्रेष्ठमार्गनिर्धारणम्`).
  - Validates wire paths to prevent them from illegally crossing through gate bodies (`मार्गःअवैधः`).
  - Features automatic snapping to gate pins (`शङ्कवः`) and unconnected wire ends.
- **Collision Detection:** `स्थानम्_अतिव्याप्तम्()` prevents gates from being placed on top of each other or over existing wires.
- **Event Handling:**
  - Drag-and-drop from the toolbar to the canvas.
  - Mouse down/move/up logic for marquee selection, component dragging, and wire drawing.
  - Keyboard shortcuts (`W` for wire, `C` for copy, `Delete` for delete, `[ / ]` for zoom).

---

## AI Assistant Tips for Working with this Code
- When suggesting code modifications, **maintain the Sanskrit naming convention** unless explicitly told otherwise.
- Pay attention to the scaling factor (`गुणकः`) when dealing with canvas coordinates. Mouse events must divide by the scale to get logical coordinates, and rendering must multiply by the scale to draw correctly.
- The UI separates fixed elements (wires, placed gates) from temporary visual states (floating wires, nearest pin highlights, selection boxes), all rendered in the `द्वाररेखनम्()` loop.