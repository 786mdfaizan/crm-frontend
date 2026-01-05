import { forwardRef } from 'react';

function cn(...inputs) {
  return inputs.filter(Boolean).join(' ');
}

const Button = forwardRef(({ className, variant = 'default', size = 'default', ...props }, ref) => {
  let baseClass = 'inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none';
  if (variant === 'default') baseClass += ' bg-blue-600 text-white hover:bg-blue-700';
  if (variant === 'outline') baseClass += ' border border-gray-300 hover:bg-gray-100';
  if (variant === 'ghost') baseClass += ' hover:bg-gray-100';
  if (size === 'default') baseClass += ' h-10 py-2 px-4';
  if (size === 'sm') baseClass += ' h-9 px-3';

  return (
    <button
      className={cn(baseClass, className)}
      ref={ref}
      {...props}
    />
  );
});

Button.displayName = 'Button';

export { Button };