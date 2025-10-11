interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline';
  size?: 'sm' | 'md' | 'lg';
  isLoading?: boolean;
  children: React.ReactNode;
}

export default function Button({
  variant = 'primary',
  size = 'md',
  isLoading = false,
  children,
  className = '',
  disabled,
  ...props
}: ButtonProps) {
  const baseClasses =
    "relative px-4 py-2.5 bg-[#cf784b]/70 backdrop-blur-md bg-clip-padding border border-white/30 text-white rounded-xl flex items-center justify-center gap-2 hover:bg-[#cf784b]/90 transition-all duration-300 font-medium group/readmore shadow-lg hover:shadow-2xl transform hover:-translate-y-0.5 text-sm overflow-hidden";

  return (
    <button
      className={`${baseClasses} ${className}`}
      disabled={disabled || isLoading}
      {...props}
    >
      <span aria-hidden className="absolute inset-0 rounded-xl bg-white/10 backdrop-blur-[2px] pointer-events-none" />
      <span className="relative z-10 flex items-center gap-2">
        {isLoading && (
          <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
        )}
        {children}
      </span>
    </button>
  );
}
