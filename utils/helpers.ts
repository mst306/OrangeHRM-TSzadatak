// Generate a unique ID with optional prefix - Example: EMP1678901234567
export function generateUniqueId(prefix: string = 'ID'): string 
{
  return `${prefix}${Date.now().toString().slice(-7)}`;
}

// Example: 1995-15-03
export function formatDate
(
  day: number, 
  month: string, 
  year: number | string
): string 
{
  const monthMap: Record<string, string> = 
  {
    January: '01', February: '02', March: '03', April: '04',
    May: '05', June: '06', July: '07', August: '08',
    September: '09', October: '10', November: '11', December: '12'
  };

  return `${year}-${day.toString().padStart(2, '0')}-${monthMap[month]}`;
}
