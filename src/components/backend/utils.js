// TODO(fzxu): revisit this implementation.
export const downloadData = (filename, data) => {
    let blob = null;
    if (filename.endsWith('.json')) {
        const jsonObj = JSON.stringify(data, null, 2);
        blob = new Blob([jsonObj], { type: 'application/json' });
    } else if (filename.endsWith('.md')) {
        blob = new Blob([data], { type: 'text/plain' })
    }
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.download = filename;
    a.href = url;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
}