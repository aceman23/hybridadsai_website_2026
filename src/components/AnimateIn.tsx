import { useInView } from '../hooks/useInView';

interface AnimateInProps {
  children: React.ReactNode;
  delay?: number;
  className?: string;
}

export default function AnimateIn({ children, delay = 0, className = '' }: AnimateInProps) {
  const { ref, isVisible } = useInView();

  return (
    <div
      ref={ref}
      className={`animate-on-scroll ${isVisible ? 'is-visible' : ''} ${className}`}
      style={{ transitionDelay: `${delay}ms` }}
    >
      {children}
    </div>
  );
}
