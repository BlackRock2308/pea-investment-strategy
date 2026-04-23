export default function Card({ children, className = '', padding = 'p-6' }) {
  return (
    <div
      className={`bg-white border border-border ${padding} ${className}`}
      style={{ boxShadow: '0 1px 0 rgba(15,20,25,0.04)' }}
    >
      {children}
    </div>
  );
}
