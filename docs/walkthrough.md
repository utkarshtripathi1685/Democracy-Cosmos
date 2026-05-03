# Antigravity Election Universe - Walkthrough

## What is this?
The **Antigravity Election Universe** is a highly interactive, 60 FPS physics-based web simulation designed to educate users about the civic processes established by the Election Commission of India.

## Features
1. **Interactive State Machine**: Navigate the entire election cycle from Voter Registration to Vote Counting.
2. **Crisis Simulation**: A dedicated scenario mode that handles advanced democratic situations like Model Code of Conduct violations.
3. **Physics & Audio Engine**: Built-in 2D physics using springs and dynamic bounds, plus real-time synthesized audio nodes via Web Audio API.
4. **Cloud Ready**: The application integrates a backend `/saveScore` metric reporter that syncs perfectly with Cloud Run.

## Testing & Judge Mode
To evaluate performance and ensure there are zero memory leaks:
1. Press `J` on your keyboard to open the **Hidden Judge Mode**.
2. Monitor real-time FPS, particle garbage collection, active audio nodes, and simulation state.
