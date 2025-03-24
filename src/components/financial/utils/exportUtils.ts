
/**
 * Exports data to a CSV file
 */
export const exportToCSV = (items: any[], filename: string) => {
  // Create CSV string
  const headers = Object.keys(items[0]).filter(key => key !== 'id');
  const csvRows = [
    headers.join(','),
    ...items.map(item => headers.map(header => item[header]).join(','))
  ];
  const csvString = csvRows.join('\n');
  
  // Create download link
  const blob = new Blob([csvString], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', `${filename}.csv`);
  link.style.visibility = 'hidden';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};
