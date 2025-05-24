function exportToCSV(data) {
  const csvRows = [];
  const headers = ['Name', 'Email', 'Phone', 'Plan', 'Join Date'];
  csvRows.push(headers.join(','));

  data.forEach(member => {
    const row = [
      member.name || '',
      member.email || '',
      member.phone || '',
      member.plan || '',
      member.joinDate || ''
    ];
    csvRows.push(row.join(','));
  });

  const blob = new Blob([csvRows.join('\n')], { type: 'text/csv' });
  const url = window.URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.setAttribute('hidden', '');
  a.setAttribute('href', url);
  a.setAttribute('download', 'members.csv');
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
}
