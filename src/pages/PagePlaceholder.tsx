export function PagePlaceholder({ name }: { name: string }) {
  return (
    <div style={{ padding: 'var(--space-5)' }}>
      <h1>{name}</h1>
    </div>
  );
}
