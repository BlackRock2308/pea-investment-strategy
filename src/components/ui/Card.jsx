export default function Card({ children, className = '', padding = 'p-6 sm:p-7', hover = false }) {
  return (
    <div
      className={`rounded-card border ${hover ? 'hover-lift' : ''} ${padding} ${className}`}
      style={{
        backgroundColor: 'var(--color-paper)',
        borderColor: 'var(--color-border)',
        boxShadow: 'var(--shadow-card)',
      }}
    >
      {children}
    </div>
  );
}
