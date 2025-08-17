# AGENTS.md

# Contributor & Agent Guide

Welcome! This file provides common context for **AI agents and contributors** working in this repository.  
Agents should read and respect these guidelines when proposing changes.

---

## 📂 Repository Overview

This is a **personal portfolio site** built with:

- **React** + **Vite**
- **Tailwind CSS**
- **i18next** (translations)

### Important folders

- `src/` → All React components, pages, and utilities live here.
- `public/` → Static assets (favicons, manifest, robots.txt, etc.).
- `.github/` → CI/CD workflows and repo configs.
- `.devcontainer/` → Development container setup for Codespaces/Dev Containers.

### Deployment

- Hosted on **GitHub Pages** from the `master` branch build.
- GitHub Actions handle build + deploy automatically.

---

## 🛠️ Dev Environment

- Node.js v20 (see `.nvmrc`).
- Install deps with:
  ```bash
  npm install
  ```
- Start local dev:
  ```bash
  npm run dev
  ```
- Build for production:
  ```bash
  npm run build
  npm run preview
  ```

If using Docker:

```bash
docker build -t demential98-site .
docker run -p 8080:80 demential98-site
```

---

## ✅ Validation & Testing

Before committing:

1. **Build must succeed** → `npm run build`
2. **Lint must pass** → `npm run lint`
3. (Optional) **Preview locally** → `npm run preview`

---

## 🎨 Style Guidelines

- **Code style**: Enforced with ESLint + Prettier. Run `npm run lint --fix`.
- **Formatting**:
  - 2 spaces indentation
  - Single quotes in JS/TS
  - Trailing commas allowed
- **React**: Prefer functional components and hooks.
- **CSS**: Use Tailwind classes; avoid inline styles.

---

## 🚦 Migration Notes

- Some UI components are being refactored for **internationalization (i18next)**.
- Theme support (`ThemeContext`) is being rolled out gradually.
- Pages may transition to **animated transitions with Framer Motion**.

Agents should:

- Favor new components using **i18next** for text.
- Use **Tailwind** instead of plain CSS.
- Wrap new pages in existing layout conventions.

---

## 🔄 PR Instructions

- **Branch naming**:
  - `feat/<something>` for features
  - `fix/<something>` for bug fixes
- **PR Title format**:

  ```
  [site] Short summary of change
  ```

- **PR Body**:

  - What changed
  - Why
  - Validation steps (how to test)

- **AI-generated PRs** should include:
  - A short summary of the request/task.
  - Clear commit messages.
  - Respect existing structure.

---

## 🤖 Agent Behavior Rules

- Do not refactor the entire codebase unless explicitly requested.
- Focus changes on **scoped areas** (one feature, one bugfix, or one config).
- Always update docs if behavior changes (README, comments, or public assets).
- Prefer smaller, reviewable PRs over giant changes.

---

## 📬 Contact

Repo owner: **Davide Battipaglia (@Demential98)**  
Preferred PR review style: clean, scoped, documented.

---
