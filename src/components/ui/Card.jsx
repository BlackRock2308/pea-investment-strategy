export default function Card({ children, className = '', padding = 'p-6' }) {
  return (
    <div
      className={`rounded-lg ${padding} ${className}`}
      style={{
        backgroundColor: 'var(--color-paper)',
        boxShadow: 'var(--shadow-card)',
      }}
    >
      {children}
    </div>
  );
}
