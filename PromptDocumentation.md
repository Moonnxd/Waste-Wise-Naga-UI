# AI Prompt Documentation

**Project Name:** Waste-Wise Naga  
**Project Summary:** Image-Assisted Decision Support System for Special Waste Collection.

---

## Overview
This document records the AI prompts used during the development of **Waste-Wise Naga**, covering the initial multi-screen frontend UI generation from design screens and the lightweight Express backend + frontend wiring for the core resident special waste photo submission to `/admin` reception flow.

---

## Prompt Log

### Prompt #01 — Full Multi-Screen UI Implementation from PDF Design
* **Phase:** Frontend UI Generation
* **Model:** ChatGPT (Codex)
* **Context:** Convert a multi-page UI design PDF representing mobile views into a responsive React web application using plain JavaScript (ES6+), Tailwind CSS, shadcn/ui components, and Lucide icons, complete with screen navigation/state transitions and interactive elements.
* **Exact Prompt:**
  > "Act as an expert frontend developer specializing in JavaScript (ES6+), React, Tailwind CSS, and the shadcn/ui component library. Analyze the attached PDF document, which contains multiple pages of UI screens and user flows, and convert the entire design into a functional, responsive web application using plain JavaScript rather than TypeScript, replicating the exact layout, typography, colors, and text content shown across the screens. Because the designs in the PDF represent mobile views, build the application using a strict mobile-first approach so it matches the document on smaller viewports while scaling cleanly to tablet and desktop screens using Tailwind responsive breakpoints. Utilize standard shadcn/ui components (such as Buttons, Cards, Inputs, Badges, Tabs, and Sheets) wherever possible alongside Lucide icons, and organize the code into clean, reusable .jsx components with working navigation or state transitions to connect the different screens shown in the PDF, plus interactive elements like hover effects and functional form inputs. Finally, provide the complete, production-ready JavaScript code along with the specific CLI commands needed to install the required shadcn/ui components."
* **AI Output Summary:** Generated a complete multi-screen React (JavaScript) application structure, shadcn/ui CLI installation commands, mobile-first responsive layout, screen navigation/state transitions, and interactive form inputs directly from the design PDF in a single pass.
* **Changes & Verification:** Completed in a single prompt pass for the UI implementation.

---

### Prompt #02 — Express Backend & End-to-End Resident-to-Admin Image Flow
* **Phase:** Backend & Integration
* **Model:** ChatGPT (Codex)
* **Context:** Build a lightweight Node.js/Express demo backend with local image upload support (e.g., `multer` and static serving) and simple in-memory or JSON storage to connect a resident special waste collection request (with photo) to the `/admin` view, aligned with the existing frontend and system proposal PDF while allowing targeted frontend fixes for mock data or mismatched fields/endpoints.
* **Exact Prompt:**
  > "I am attaching my frontend folder (which contains both the resident/requester UI and the admin UI under /admin) along with our system proposal PDF (Waste Wise Naga: Image-Assisted Decision Support System for Special Waste Collection).
  > Your Task: Build a simple, working backend using JavaScript / Node.js with Express purely to demonstrate how data passes through the core flow: a resident submits a special collection request with a picture, and the admin views/receives that request on /admin.
  > Strict Scope & Rules:
  > 1. Scan the frontend & PDF first: Inspect my frontend folder (routes, components, forms, request payloads, field names, and /admin views) and reference the PDF's flow for special waste collection requests so the backend matches what the UI expects.
  > 2. Permission to fix frontend conflicts: If anything in the frontend conflicts with how the backend needs to work—such as hardcoded mock values, mock arrays, static responses, or mismatched field names/endpoints—you are free to update those parts of the frontend as long as the resident-to-admin image flow works end-to-end. Clearly note every frontend change you make.
  > 3. Focus ONLY on Resident Image Submission -> Admin Reception: Do not build full production auth/RBAC, complex ML/image-processing pipelines, real GPS/IoT hardware integrations, SMS/push notification services, or unrelated modules unless needed to keep the demo flow working. Placeholder/mocked values (e.g., mock waste estimate or status) are fine if the frontend displays them.
  > 4. Keep it simple and demo-ready: Use straightforward Express endpoints, image upload handling (e.g., multer saving uploaded images locally and serving them via a static route), and simple in-memory storage or a lightweight local store (like a JSON file) so it runs quickly with minimal setup.
  > 5. Wire/align with the frontend: Show clearly how the frontend connects to the backend (endpoints, request/response shapes, CORS setup, and any minimal API call adjustments needed in the frontend so resident submissions actually appear in the admin UI).
  > Output Format:
  > - Brief summary of the request -> backend -> admin data flow you found in my frontend and PDF.
  > - Folder/file structure for the new Express backend.
  > - Complete, runnable backend code (package.json, server entry file, routes/storage).
  > - List of any frontend updates made to resolve conflicts or hardcoded values.
  > - Exact steps to run both the backend and frontend locally to test a resident sending a photo and the admin receiving it."
* **AI Output Summary:** Provided a data-flow summary from the frontend and proposal PDF, backend folder/file structure, runnable Express backend code (`package.json`, server entry point, upload/request routes, and local/in-memory storage), frontend conflict/mock-data fixes, and local run/test instructions.

---

## Summary & Reflection
* **Most helpful use cases:** Generating a mobile-first React (JavaScript) UI from multi-page design screens in a single pass and scoping a lightweight Express prototype focused strictly on resident photo submission to `/admin`.
