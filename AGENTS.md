# Frame: Project Blueprint & Agent Guide

## 1. Project Overview
'Frame' is a React-based gallery application designed to fetch and view
remote image galleries organized across multiple folders
- **Frontend:** React 18+, TypeScript, React Router v6+, Styled Components.
- **Data Source:** 'Galleries API' (REST API).

## 2. Architectural Patterns (Decoupled & Scalable)
- **Folder Structure:** Group by role inside the application (e.g.,
  `components/viewer`, `components/grid`, `context/viewer`, `context/grid`).
- **API Decoupling:** Never fetch directly in components. Use a custom hook
  layer (e.g., `useGalleries()`) that interacts with an `api/` service layer.
- **State Management:** Use React Context for global UI state; use
  `React Query` (if available) or custom hooks for server-state caching.

## 3. Tech Stack Specifics & Best Practices

### Styled Components
- Define a `theme.ts` for colors and spacing.
- Use the `styled.div` syntax.
- **Naming:** Prefix styled components with `S.` (e.g., `<S.GalleryWrapper>`)
  to distinguish them from functional components in JSX.

### React Router
- Use **Data APIs** (createBrowserRouter).
- Implement **Lazy Loading** for main route components using `React.lazy()` to
  optimize the initial bundle size.

### TypeScript & API Contracts
- All API responses must have a defined `interface` in `src/types/api.ts`.
- **Galleries API Contract:**
  - `Folder`: `{ id: string, name: string, imageCount: number }`
  - `Image`: `{ id: string, url: string, metadata: { width: number, height: number } }`

## 4. UI/UX Standards
- **Performance:** Images must use `loading="lazy"`.
- **Error Handling:** Use React Error Boundaries for the gallery grid to
  prevent app crashes on bad API responses.
- **Loading States:** Every async component must have a corresponding
  Skeleton loader.

## 5. Development Workflow
- **Standard Command:** `npm run dev` to start.
- **Testing:** `npm run test` (Vitest/Testing Library).
- **Commit Messages:** Follow Conventional Commits
  (e.g., `feat(gallery): add grid view`).