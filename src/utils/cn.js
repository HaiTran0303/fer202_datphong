export function cn(...inputs) {
  return inputs
    .flat()
    .filter(Boolean)
    .join(' ');
}

// Alternative implementation with conditional classes support
export function cnAdvanced(...inputs) {
  return inputs
    .flat()
    .filter((input) => {
      if (typeof input === 'string') return input.trim() !== '';
      if (typeof input === 'object' && input !== null) {
        return Object.keys(input).some(key => input[key]);
      }
      return false;
    })
    .map((input) => {
      if (typeof input === 'string') return input;
      if (typeof input === 'object' && input !== null) {
        return Object.keys(input).filter(key => input[key]).join(' ');
      }
      return '';
    })
    .join(' ');
} 