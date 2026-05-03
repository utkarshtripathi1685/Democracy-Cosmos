# Antigravity Election Universe

Democracy Cosmos: Observation Deck - Sector 4

## Overview

Antigravity Election Universe is an interactive, immersive web-based simulation and learning engine designed to educate users about the electoral process in India. Built with a focus on high-performance physics, engaging visual aesthetics, and educational content, this project transforms learning about democracy into an engaging cosmic experience.

## Features

*   **Interactive Physics Engine:** Experience a zero-gravity simulation with draggable candidate cards, orbital mechanics, and realistic collision physics.
*   **Immersive Visuals:** A stunning "Democracy Cosmos" setting complete with dynamic nebula backgrounds, floating glowing orbs, and interactive particle effects (confetti, starbursts, shockwaves).
*   **Learning Engine:** A built-in educational module that guides users through the 5 phases of the Indian electoral process:
    1.  Registration
    2.  Nomination
    3.  Campaigning
    4.  Voting
    5.  Counting
*   **Simulation Modes:**
    *   **Standard Mode:** Explore the cosmos and interact with election orbs at your own pace.
    *   **Election Day Simulation:** A guided, sequential walkthrough of all election phases with knowledge checks.
    *   **Crisis Simulation:** Test your decision-making skills in high-pressure election scenarios like fake news outbreaks and Model Code of Conduct violations.
*   **Audio Engine:** Dynamic background hums that change with gravity, interactive chimes, and bass drops for a multi-sensory experience.
*   **Judge Mode (Debug):** Press `J` to toggle a performance overlay displaying FPS, particle count, audio nodes, and engine state.
*   **Cloud Run Integration:** Reports learning scores to a configurable Google Cloud Run endpoint for analytics and progress tracking.
*   **Security Hardening:** Adds a strict Content Security Policy, bounded score validation, and safe JSON submission helpers.
*   **Keyboard + Accessibility:** Supports keyboard shortcuts (`J`, `V`, `S`, `C`), skip link navigation, and improved labeling for controls.
*   **Automated Tests:** Includes a Node test suite for scoring/progress/reporting utilities.

## Technology Stack

*   **HTML5 Canvas:** For high-performance rendering of the particle system, orbital rings, and physics simulation.
*   **Vanilla JavaScript (ES6+):** Powers the state machine, physics engine, audio context, and DOM manipulation without relying on heavy frameworks.
*   **CSS3:** Utilizes CSS variables, animations, 3D transforms, and backdrop filters for the "glassmorphism" UI and responsive design.
*   **Web Audio API:** For synthesizing dynamic sound effects directly in the browser.

## Getting Started

### Prerequisites

*   A modern web browser (Chrome, Firefox, Safari, Edge) with JavaScript enabled.
*   To test the Cloud Run integration, you will need a running backend service and to update the URL in `index.html`.

### Running Locally

1.  Clone the repository or download the source files.
2.  Open `index.html` in your web browser. No build steps or local servers are strictly necessary for the frontend simulation to run.

    *Alternatively, you can use a simple local server if you prefer:*
    ```bash
    npx serve
    ```

### Configure score reporting (Google Cloud Run)

Add this snippet right before the main script tag in `index.html` and set your Cloud Run endpoint:

```html
<script>
  window.__PROMPTWAR_CONFIG__ = {
    scoreEndpoint: "https://YOUR-CLOUD-RUN-URL/saveScore"
  };
</script>
```

If the endpoint is not set, score reporting is safely skipped without breaking the simulation.

### Run tests

```bash
npm test
```

### Controls

*   **Mouse Move:** Navigate the cosmos. Observe parallax effects and generate confetti trails.
*   **Mouse Click:** Interact with floating UI elements, candidate cards, and election orbs.
*   **Drag & Drop:** Click and hold candidate cards to throw them around the cosmos with physics.
*   **Gravity Slider:** Adjust the gravitational pull. Moving it to maximum triggers the Election Day Simulation.
*   **'J' Key:** Toggle the developer/judge performance overlay.
*   **'V' Key:** Trigger Cast a Vote.
*   **'S' Key:** Trigger Election Day Simulation mode.
*   **'C' Key:** Trigger Crisis Simulation mode.

## Project Structure

*   `index.html`: The monolithic file containing the HTML structure, CSS styles, and the entire JavaScript logic for the simulation, physics, audio, and learning engine.
*   `Dockerfile`: Configuration for containerizing the application (likely for the associated backend or serving the static file).

## Recent Upgrades

*   **Comet Trails:** Orbiting election orbs now feature dynamic comet trails.
*   **Repulsion Physics:** The mouse cursor acts as a gravitational repulsor, pushing orbs away naturally.
*   **Solar Flare Effects:** A dramatic visual sequence with shockwaves, sun pulses, and particle bursts when initiating simulations.
*   **Accessibility (ARIA):** Enhanced screen reader support for the learning engine overlay and control toolbar semantics.
*   **Code Assertions:** Added robust checks to ensure state machine integrity.
*   **Security + Reliability:** Introduced endpoint validation, score clamping, and safe network posting utility wrappers.
*   **Test Coverage:** Added automated tests for utility logic in score, progress, and network report helpers.

## License

This project is part of the Promptwar workspace.
