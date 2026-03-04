import { useInView } from '../hooks/useInView';

interface AnimateInProps {
  children: React.ReactNode;
  delay?: number;
  className?: string;
  variant?: 'slide' | 'fade';
}

export default function AnimateIn({ children, delay = 0, className = '', variant = 'slide' }: AnimateInProps) {
  const { ref, isVisible } = useInView();
  const base = variant === 'fade' ? 'animate-fade-in' : 'animate-on-scroll';

  return (
    <div
      ref={ref}
      className={`${base} ${isVisible ? 'is-visible' : ''} ${className}`}
      style={{ transitionDelay: `${delay}ms` }}
    >
      {children}
    </div>
  );
}
