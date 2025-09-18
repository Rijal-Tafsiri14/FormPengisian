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
  };

  // Ambil data lama dari localStorage
  const history = JSON.parse(localStorage.getItem('shippingHistory')) || [];
  history.push(formData);

  localStorage.setItem('shippingHistory', JSON.stringify(history));

  alert('Data pengiriman berhasil disimpan!');

  form.reset();
  loadHistory();
});

printBtn.addEventListener('click', () => {
  window.print();
});

// Load history saat halaman dibuka
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
  };
   const logoUrl = 'https://i.imgur.com/O7HfRj6.png';

  const printContent = `
  <!DOCTYPE html>
  <html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Print Pengiriman Barang</title>
    <style>
      body {
        font-family: Arial, sans-serif;
        padding: 20px;
        color: #222;
        background: white;
      }
      .logo-container {
        text-align: center;
        margin-bottom: 20px;
      }
      .logo-container img {
        width: 100px;
        height: auto;
      }
      h1 {
        text-align: center;
        margin-bottom: 30px;
        color: #1a73e8;
      }
      .section {
        margin-bottom: 25px;
        padding: 15px;
        border: 1px solid #1a73e8;
        border-radius: 8px;
        background: #f3f9ff;
        page-break-inside: avoid;
      }
      .section h2 {
        margin-top: 0;
        color: #0b47a1;
      }
      .field {
        margin-bottom: 10px;
        word-wrap: break-word;
      }
      .field label {
        font-weight: bold;
        display: inline-block;
        width: 150px;
      }
    </style>
  </head>
  <body>
    <div class="logo-container">
      <img src="https://brandlogos.net/wp-content/uploads/2023/10/blibli-logo_brandlogos.net_gq3tj-300x104.png" alt="Logo Astronot" />
    </div>
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
    </div>
  </body>
  </html>
`;

 

  const printWindow = window.open('', '_blank', 'width=700,height=800');
  printWindow.document.open();
  printWindow.document.write(printContent);
  printWindow.document.close();

  // Delay sedikit supaya style dan konten benar-benar load dulu
  printWindow.onload = () => {
    printWindow.focus();
    printWindow.print();
    // Jangan langsung tutup kalau kamu ingin lihat hasil print dulu,
    // printWindow.close();
  };
});
tr.innerHTML = `
  <td data-label="No">${index + 1}</td>
  <td data-label="Nama Pengirim">${item.senderName}</td>
  <td data-label="No HP Pengirim">${item.senderPhone}</td>
  <td data-label="Alamat Pengirim">${item.senderAddress}</td>
  <td data-label="Nama Penerima">${item.receiverName}</td>
  <td data-label="No HP Penerima">${item.receiverPhone}</td>
  <td data-label="Alamat Penerima">${item.receiverAddress}</td>
  <td data-label="No Reff">${item.refNumber}</td>
  <td data-label="No AWB">${item.awbNumber}</td>
`;
