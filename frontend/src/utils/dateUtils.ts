/**
 * Parse a date string (YYYY-MM-DD) as a local date, not UTC
 * This prevents timezone issues where dates appear as the previous day
 */
export function parseLocalDate(dateString: string): Date {
  if (!dateString) return new Date();
  
  // Split the date string and create a date using local timezone
  const [year, month, day] = dateString.split('-').map(Number);
  return new Date(year, month - 1, day); // month is 0-indexed in JS
}

/**
 * Format a date for display, handling timezone issues
 */
export function formatDate(dateString: string | null | undefined, format: string): string {
  if (!dateString) return '-';
  
  const date = parseLocalDate(dateString);
  
  // Simple format implementation for common patterns
  if (format === 'MMM d') {
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    return `${months[date.getMonth()]} ${date.getDate()}`;
  }
  
  if (format === 'MMM d, yyyy') {
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    return `${months[date.getMonth()]} ${date.getDate()}, ${date.getFullYear()}`;
  }
  
  return dateString;
}

/**
 * Check if a date is in the past (for overdue highlighting)
 */
export function isOverdue(dateString: string | null | undefined): boolean {
  if (!dateString) return false;
  
  const date = parseLocalDate(dateString);
  const today = new Date();
  today.setHours(0, 0, 0, 0); // Reset time to start of day
  
  return date < today;
}