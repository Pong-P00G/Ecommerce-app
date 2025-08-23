import html2pdf from 'html2pdf.js';

function debounce(fn, delay = 300) {
    let timeout;
    return function (...args) {
        clearTimeout(timeout);
        timeout = setTimeout(() => {
        fn.apply(this, args);
        }, delay);
    };
}

function DowlodadReceipt() {
    const orderNumber = localStorage.getItem('lastOrderNumber)') || 'UNKNOWN';
    const orderDetails = JSON.parse(localStorage.getItem('lastOrderDetails')) || {};
    if (!orderDetails.items || orderDetails.items.length === 0) {
        alert('No order details found.');
        return;
    }
    const chunkSize = 50;
    const element = document.createElement('div');
    element.style.fontFamily = 'Arial, sans-serif';
    element.style.padding = '20px';
    element.style.maxWidth = '600px';
    element.innerHTML = `
    <h1 style="text-align: center; color: #10b981;">RECEIPT</h1>
    <hr>
    <p><strong>Order Number:</strong> ${orderNumber}</p>
    <p><strong>Date:</strong> ${orderDetails.date || 'N/A'}</p>
    <p><strong>Time:</strong> ${orderDetails.time || 'N/A'}</p>
    <hr>
    <h3>Items:</h3>
    <div id="progress" style="margin-bottom: 10px; color: #2563eb;">Generating PDF...</div>
    <table style="width: 100%; border-collapse: collapse;">
        <thead>
            <tr>
            <th align="left">Name</th>
            <th>Size</th>
            <th>Color</th>
            <th>Qty</th>
            <th align="right">Subtotal</th>
            </tr>
        </thead>
        <tbody id="receipt-body"></tbody>
        </table>
        <hr>
        <h2 style="text-align: right;">Total: $${parseFloat(orderDetails.total).toFixed(2)}</h2>
    `;
    document.body.appendChild(element);
    const tbody = element.querySelector('#receipt-body');
    const progress = element.querySelector('#progress');
    let index = 0;
    function addRowsChunk() {
        const end = Math.min(index + chunkSize, orderDetails.items.length);
        for (; index < end; index++) {
        const item = orderDetails.items[index];
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${item.name}</td>
            <td align="center">${item.size}</td>
            <td align="center">${item.color}</td>
            <td align="center">${item.quantity}</td>
            <td align="right">$${(item.price * item.quantity).toFixed(2)}</td>
        `;
        tbody.appendChild(row);
        }
        const percent = Math.min(100, Math.round((index / orderDetails.items.length) * 100));
        progress.textContent = `Generating PDF... (${percent}%)`;
        if (index < orderDetails.items.length) {
        if ('requestIdleCallback' in window) {
            requestIdleCallback(addRowsChunk);
        } else {
            setTimeout(addRowsChunk, 0);
        }
        } else {
        progress.textContent = 'Finalizing PDF...';
        html2pdf()
            .set({
                margin: 10,
                filename: `receipt-${orderNumber}.pdf`,
                image: { type: 'jpeg', quality: 0.98 },
                html2canvas: { scale: 2 },
                jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
            })
            .from(element)
            .save()
            .then(() => {
            document.body.removeChild(element);
            });
        }
    }
    addRowsChunk();
}
export const onClickDownloadReceipt = debounce(() => {
    DowlodadReceipt();
}, 300);