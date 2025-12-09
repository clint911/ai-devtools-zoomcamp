Build a collaborative coding interview platform frontend with the following requirements:

Core Features:
Session Creation: Generate shareable links for coding sessions
Real-time Collaborative Code Editor: Multiple users can edit simultaneously with live updates
Syntax Highlighting: Support for JavaScript and Python
Code Execution: Execute code safely in the browser (client-side only, using WASM for Python)
Multi-user Presence: Show who's currently in the session
Design Requirements:
Style: Hacker-centric brutalist/neobrutalist aesthetic targeting younger developers
Design System: Create a cohesive design system with:
Bold, raw typography (use monospace fonts like JetBrains Mono or Fira Code)
High contrast color scheme with vibrant accent colors
Minimal rounded corners, stark borders
Terminal/console-inspired UI elements
Dark mode by default with neon/cyberpunk accents
Responsive: Fully functional on mobile and desktop
Micro-interactions: Smooth animations for code execution, user joins, etc.
Technical Stack:
Framework: React + Vite
Code Editor: Monaco Editor or CodeMirror for syntax highlighting
Real-time: WebSocket connection for live collaboration
Code Execution: Pyodide for Python WASM, native eval for JavaScript
Styling: Vanilla CSS with a brutalist design system
Key Pages/Components:
Landing Page: Create/join session with brutalist hero section
Code Editor View: Split panels with:
Code editor (main focus)
Language selector
Execute button
Output console
Connected users list
Session Link Sharing: Copy-to-clipboard functionality
Generate OpenAPI Specification for Backend:
After implementing the frontend, create OpenAPI 3.0 specs for:

POST /api/sessions - Create new coding session
GET /api/sessions/:id - Get session details
WebSocket /ws/sessions/:id - Real-time code updates
PUT /api/sessions/:id/code - Update code
GET /api/sessions/:id/code - Get current code
Deliverables:
Complete React + Vite frontend application
Brutalist/neobrutalist CSS design system
OpenAPI specification file (openapi.yaml)
README with setup instructions
Make it look raw, powerful, and terminal-inspired - think hacker aesthetic with modern polish!


Create or adjust the readme at the root of this entire project to reflect how to work with our application on a professional level, how can it be accessed, the url, how can it be ran, what are the available modes and why and how to utilize them. How can this setup be replicated on another machine, how about a normal user who say wants to learn to code using our application, there was this meme on twitter on a user who just wanted an exe, to run on their machine, how can something similar be achieved, not necessarily a binary or executable but within the constraints of the nature of our application, how best can it be served to our users. 
Evaluate & propose necessary improvements/adjustments/enhancements to be made regarding the same. 
I want to clean up  and consolidate the documentation and all that stuff to ensure a more consistent & professional outlook of the project so it best serves the intrests of the users and the project as a whole.
