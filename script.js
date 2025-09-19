const form = document.getElementById('shippingForm');
const historyTableBody = document.querySelector('#historyTable tbody');
const printBtn = document.getElementById('printBtn');

function loadHistory() {
  const history = JSON.parse(localStorage.getItem('shippingHistory')) || [];
  historyTableBody.innerHTML = '';
  history.forEach((item, index) => {
    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td>${index + 1}</td>
      <td>${item.senderName}</td>
      <td>${item.senderPhone}</td>
      <td>${item.senderAddress}</td>
      <td>${item.receiverName}</td>
      <td>${item.receiverPhone}</td>
      <td>${item.receiverAddress}</td>
      <td>${item.refNumber}</td>
      <td>${item.awbNumber}</td>
      <td>${item.totalKoli || 1}</td>
    `;
    historyTableBody.appendChild(tr);
  });
}

form.addEventListener('submit', (e) => {
  e.preventDefault();

  const formData = {
    senderName: form.senderName.value.trim(),
    senderPhone: form.senderPhone.value.trim(),
    senderAddress: form.senderAddress.value.trim(),
    receiverName: form.receiverName.value.trim(),
    receiverPhone: form.receiverPhone.value.trim(),
    receiverAddress: form.receiverAddress.value.trim(),
    refNumber: form.refNumber.value.trim(),
    awbNumber: form.awbNumber.value.trim(),
    totalKoli: parseInt(form.totalKoli.value) || 1
  };

  // Simpan ke localStorage
  const history = JSON.parse(localStorage.getItem('shippingHistory')) || [];
  history.push(formData);
  localStorage.setItem('shippingHistory', JSON.stringify(history));

  alert('Data pengiriman berhasil disimpan!');

  form.reset();
  loadHistory();
});

printBtn.addEventListener('click', () => {
  const formData = {
    senderName: form.senderName.value.trim(),
    senderPhone: form.senderPhone.value.trim(),
    senderAddress: form.senderAddress.value.trim(),
    receiverName: form.receiverName.value.trim(),
    receiverPhone: form.receiverPhone.value.trim(),
    receiverAddress: form.receiverAddress.value.trim(),
    refNumber: form.refNumber.value.trim(),
    awbNumber: form.awbNumber.value.trim(),
    totalKoli: parseInt(form.totalKoli.value) || 1
  };

  let allPages = "";

  for (let i = 1; i <= formData.totalKoli; i++) {
    allPages += `
      <div class="print-page">
        <h1>Data Pengiriman Barang</h1>

        <div class="section">
          <h2>Data Pengirim</h2>
          <div class="field"><label>Nama Pengirim:</label> ${formData.senderName}</div>
          <div class="field"><label>No HP Pengirim:</label> ${formData.senderPhone}</div>
          <div class="field"><label>Alamat Pengirim:</label> ${formData.senderAddress.replace(/\n/g, '<br>')}</div>
        </div>

        <div class="section">
          <h2>Data Penerima</h2>
          <div class="field"><label>Nama Penerima:</label> ${formData.receiverName}</div>
          <div class="field"><label>No HP Penerima:</label> ${formData.receiverPhone}</div>
          <div class="field"><label>Alamat Penerima:</label> ${formData.receiverAddress.replace(/\n/g, '<br>')}</div>
        </div>

        <div class="section">
          <h2>Informasi Pengiriman</h2>
          <div class="field"><label>No Reff:</label> ${formData.refNumber}</div>
          <div class="field"><label>No AWB:</label> ${formData.awbNumber}</div>
          <div class="field koli">Koli: ${i}/${formData.totalKoli}</div>
        </div>
      </div>
    `;
  }

  const printContent = `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8" />
      <title>Print Pengiriman Barang</title>
      <style>
        body { font-family: Arial, sans-serif; padding: 20px; }
        h1 { text-align: center; color: #1a73e8; }
        .section { margin-bottom: 20px; border: 1px solid #1a73e8; padding: 10px; border-radius: 6px; background: #f3f9ff; }
        .field { margin-bottom: 8px; }
        .field label { font-weight: bold; display: inline-block; width: 150px; }
        .koli { font-size: 18px; font-weight: bold; text-align: right; color: #d35400; margin-top: 15px; }
        .print-page { page-break-after: always; }
        .print-page:last-child { page-break-after: auto; }
      </style>
    </head>
    <body>
      ${allPages}
    </body>
    </html>
  `;

  const printWindow = window.open('', '_blank', 'width=700,height=800');
  printWindow.document.open();
  printWindow.document.write(printContent);
  printWindow.document.close();

  printWindow.onload = () => {
    printWindow.focus();
    printWindow.print();
  };
});

// Load history saat pertama kali buka halaman
window.onload = loadHistory;
