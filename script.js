const form = document.getElementById('shippingForm');
const historyTableBody = document.querySelector('#historyTable tbody');
const printBtn = document.getElementById('printBtn');
const toggleHistoryBtn = document.getElementById('toggleHistoryBtn');
const historySection = document.getElementById('historySection');

function loadHistory() {
  const history = JSON.parse(localStorage.getItem('shippingHistory')) || [];
  historyTableBody.innerHTML = '';
  history.forEach((item, index) => {
    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td>${index + 1}</td>
      <td>${item.senderName}</td>
      <td>${item.receiverName}</td>
      <td>${item.refNumber}</td>
      <td>${item.awbNumber}</td>
      <td>${item.totalKoli}</td>
      <td><button onclick="deleteRow(${index})">Hapus</button></td>
    `;
    historyTableBody.appendChild(tr);
  });
}

function deleteRow(index) {
  let history = JSON.parse(localStorage.getItem('shippingHistory')) || [];
  history.splice(index, 1);
  localStorage.setItem('shippingHistory', JSON.stringify(history));
  loadHistory();
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

  const history = JSON.parse(localStorage.getItem('shippingHistory')) || [];
  history.push(formData);
  localStorage.setItem('shippingHistory', JSON.stringify(history));

  form.reset();
  loadHistory();
});

printBtn.addEventListener('click', () => {
  const data = {
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
  for (let i = 1; i <= data.totalKoli; i++) {
    allPages += `
      <div class="print-page" style="font-family:Segoe UI,Tahoma,sans-serif;padding:20px;">
        <div style="text-align:center;margin-bottom:20px;">
          <img src="https://i.imgur.com/8nbxERj.jpeg" style="max-width:120px;" />
          <h2 style="color:#2e7d32;margin-top:10px;">Data Pengiriman Barang</h2>
        </div>
        <div style="border:1px solid #ccc;padding:10px;margin-bottom:10px;border-radius:6px;">
          <h3 style="margin:0 0 8px 0;">Data Pengirim</h3>
          <p>Nama: ${data.senderName}</p>
          <p>HP: ${data.senderPhone}</p>
          <p>Alamat: ${data.senderAddress.replace(/\n/g,'<br>')}</p>
        </div>
        <div style="border:1px solid #ccc;padding:10px;margin-bottom:10px;border-radius:6px;">
          <h3 style="margin:0 0 8px 0;">Data Penerima</h3>
          <p>Nama: ${data.receiverName}</p>
          <p>HP: ${data.receiverPhone}</p>
          <p>Alamat: ${data.receiverAddress.replace(/\n/g,'<br>')}</p>
        </div>
        <div style="border:1px solid #ccc;padding:10px;border-radius:6px;display:flex;justify-content:space-between;">
          <div>
            <p>No Reff: ${data.refNumber}</p>
            <p>No AWB: ${data.awbNumber}</p>
          </div>
          <div style="font-weight:bold;color:#d35400;">Koli: ${i}/${data.totalKoli}</div>
        </div>
      </div>
    `;
  }

  const w = window.open('', '_blank');
  w.document.write(`<html><head><title>Print</title></head><body>${allPages}</body></html>`);
  w.document.close();
  w.print();
});

toggleHistoryBtn.addEventListener('click', () => {
  historySection.classList.toggle('hidden');
  toggleHistoryBtn.textContent = historySection.classList.contains('hidden') 
    ? "Tampilkan Riwayat" 
    : "Sembunyikan Riwayat";
});

window.onload = loadHistory;
