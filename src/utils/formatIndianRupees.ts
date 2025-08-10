
export const formatIndianRupees = (
  amount: number | string | undefined | null,
  decimals: number = 0
): string => {
  // Handle null/undefined/empty string cases
  if (amount === null || amount === undefined || amount === '') return '₹0';
  
  // Convert to number if it's a string
  const num = typeof amount === 'string' ? parseFloat(amount) : amount;
  
  // Handle NaN cases after conversion
  if (isNaN(num)) return '₹0';
  
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals
  }).format(num).replace('₹', '₹');
};