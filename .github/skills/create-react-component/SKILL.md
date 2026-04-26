---
name: create-react-component
description: 'Create or update React components with TypeScript React.FC, antd-first UI, local S styled-components fallback, and hook-based data flow. Use for create component, update component, refactor component, and UI component implementation.'
argument-hint: 'Component name, target path under src/components, props, and UI/data requirements'
---

# Create React Component

## Goal
Create or update React components that follow Frame conventions with minimal ambiguity.

## Use When
- Creating a component in `src/components/`.
- Updating or refactoring an existing component.
- Standardizing a component to project patterns.

## Required Rules
- Place components in `src/components/` (feature subfolders allowed).
- Use TypeScript function components with `React.FC`.
- Use `<ComponentName>Props` interface only when props count is 3+.
- Prefer `antd` for UI first.
- If `antd` is insufficient, add local styled-components in the same file with `const S = { ... }`.
- Keep business logic out of components; use hooks from `src/hooks/`.
- Extract business logic only when explicitly requested.
- Use `export default` for component export.

## Import Order
1. React/core imports.
2. Third-party imports.
3. Internal value imports.
4. Type-only imports last.

## Workflow
1. Confirm component path, name, and props.
2. Build UI with `antd` primitives.
3. Add `S` styled-components only for missing layout/style capabilities.
4. Wire data via hooks only.
5. Validate export style and import order.

## Quick Decisions
- Needs server/data state: use or create hook in `src/hooks/`.
- No suitable `antd` primitive: use local `const S =` fallback.
- Props >= 3: create `<ComponentName>Props` interface.
- Business logic extraction needed: only if explicitly requested.

## Before And After Examples

### 1) Props Typing Threshold
Before
```tsx
const Card: React.FC<{ title: string; subtitle: string; image: string }> = (props) => {
  return <div />;
};
```

After
```tsx
interface CardProps {
  title: string;
  subtitle: string;
  image: string;
}

const Card: React.FC<CardProps> = ({ title, subtitle, image }) => {
  return <div>{title}</div>;
};

export default Card;
```

### 2) antd First, S Fallback
Before
```tsx
return <div className="error">Error loading</div>;
```

After
```tsx
const S = {
  Wrapper: styled.div`
    display: grid;
    gap: ${({ theme }) => theme.spacing.md};
  `,
};

return (
  <S.Wrapper>
    <Alert type="error" showIcon message="Error loading" />
  </S.Wrapper>
);
```

### 3) Business Logic Boundary
Before
```tsx
const Gallery: React.FC = () => {
  const [items, setItems] = React.useState([]);
  React.useEffect(() => {
    fetch('/api/items').then(...);
  }, []);
  return <div />;
};
```

After
```tsx
const Gallery: React.FC = () => {
  const { items, isLoading, error } = useGalleryItems();
  if (isLoading) return <Skeleton active />;
  if (error) return <Alert type="error" message={error.message} />;
  return <div>{items.length}</div>;
};

export default Gallery;
```

## Done Criteria
- File is under `src/components/`.
- `React.FC` is used.
- 3+ props use `<ComponentName>Props` interface.
- `antd` is primary UI layer.
- Custom styling is local `const S =` in same file.
- Data/business logic stays in hooks (unless extraction was not requested).
- Import order is correct.
- Uses `export default`.

## Reference
Pattern source: `src/components/gallery/Gallery.tsx`.
