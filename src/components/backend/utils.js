export const downloadData = (filename, data) => {
    const jsonObj = JSON.stringify(data, null, 2);
    const blob = new Blob([jsonObj], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.download = filename;
    a.href = url;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
}