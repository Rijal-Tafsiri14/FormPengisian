document.getElementById('shippingForm').addEventListener('submit', function (e) {
  e.preventDefault();
  alert('Barang berhasil dikirim!');
  this.reset();
});

// Simpan data pengirim ke localStorage
function saveSender() {
  const sender = {
    nama: document.getElementById('namaPengirim').value,
    hp: document.getElementById('hpPengirim').value,
    alamat: document.getElementById('alamatPengirim').value,
  };
  localStorage.setItem('dataPengirim', JSON.stringify(sender));
  alert('Data Pengirim disimpan!');
}

// Autofill data pengirim dari localStorage
function fillSender() {
  const sender = JSON.parse(localStorage.getItem('dataPengirim'));
  if (sender) {
    document.getElementById('namaPengirim').value = sender.nama;
    document.getElementById('hpPengirim').value = sender.hp;
    document.getElementById('alamatPengirim').value = sender.alamat;
    alert('Data Pengirim berhasil diisi!');
  } else {
    alert('Tidak ada data pengirim yang disimpan.');
  }
}

// Simpan data penerima ke localStorage
function saveReceiver() {
  const receiver = {
    nama: document.getElementById('namaPenerima').value,
    hp: document.getElementById('hpPenerima').value,
    alamat: document.getElementById('alamatPenerima').value,
  };
  localStorage.setItem('dataPenerima', JSON.stringify(receiver));
  alert('Data Penerima disimpan!');
}

// Autofill data penerima dari localStorage
function fillReceiver() {
  const receiver = JSON.parse(localStorage.getItem('dataPenerima'));
  if (receiver) {
    document.getElementById('namaPenerima').value = receiver.nama;
    document.getElementById('hpPenerima').value = receiver.hp;
    document.getElementById('alamatPenerima').value = receiver.alamat;
    alert('Data Penerima berhasil diisi!');
  } else {
    alert('Tidak ada data penerima yang disimpan.');
  }
}
function printForm() {
  const data = {
    namaPengirim: document.getElementById('namaPengirim').value,
    hpPengirim: document.getElementById('hpPengirim').value,
    alamatPengirim: document.getElementById('alamatPengirim').value,
    namaPenerima: document.getElementById('namaPenerima').value,
    hpPenerima: document.getElementById('hpPenerima').value,
    alamatPenerima: document.getElementById('alamatPenerima').value,
    noReff: document.getElementById('noReff').value,
    noAwb: document.getElementById('noAwb').value,
  };

  const printWindow = window.open('', '', 'width=600,height=700');
  printWindow.document.write(`
    <html>
      <head>
        <title>Print Form Pengiriman Barang</title>
      <style>
        body { font-family: arial, sans-serif; padding: 20px; }
        h2 { text-align: center; }
        table { width: 100%; border-collapse: collapse; margin-top: 20px; }
        td, th { border: 1px solid #333; padding: 8px; }
        th { background: #f0f0f0; }
        .logo {
          display: block;
          margin: 0 auto 20px auto;
          max-width: 150px;
          height: auto;
        }
      </style>
    </head>

      <body>
       <img src="https://brandlogos.net/wp-content/uploads/2023/10/blibli-logo_brandlogos.net_gq3tj-300x104.png" alt="Logo Perusahaan" class="logo" />
        <h2>Form Pengiriman Barang</h2>
        <table>
          <tr><th colspan="2">Data Pengirim</th></tr>
          <tr><td>Nama Pengirim</td><td>${data.namaPengirim}</td></tr>
          <tr><td>No HP Pengirim</td><td>${data.hpPengirim}</td></tr>
          <tr><td>Alamat Pengirim</td><td>${data.alamatPengirim.replace(/\n/g, '<br>')}</td></tr>
          
          <tr><th colspan="2">Data Penerima</th></tr>
          <tr><td>Nama Penerima</td><td>${data.namaPenerima}</td></tr>
          <tr><td>No HP Penerima</td><td>${data.hpPenerima}</td></tr>
          <tr><td>Alamat Penerima</td><td>${data.alamatPenerima.replace(/\n/g, '<br>')}</td></tr>
          
          <tr><th colspan="2">Info Pengiriman</th></tr>
          <tr><td>No Referensi</td><td>${data.noReff}</td></tr>
          <tr><td>No AWB</td><td>${data.noAwb}</td></tr>
        </table>
        <script>
          window.onload = function() {
            window.print();
            window.onafterprint = function() {
              window.close();
            }
          };
        </script>
      </body>
    </html>
  `);
  printWindow.document.close();
}
// Saat halaman load, muat data ke dropdown
window.onload = function() {
  loadSenderList();
  loadReceiverList();
};

// Fungsi simpan data pengirim ke localStorage sebagai array
function saveSender() {
  const newSender = {
    nama: document.getElementById('namaPengirim').value,
    hp: document.getElementById('hpPengirim').value,
    alamat: document.getElementById('alamatPengirim').value,
  };
  
  let senderList = JSON.parse(localStorage.getItem('dataPengirimList')) || [];
  senderList.push(newSender);
  localStorage.setItem('dataPengirimList', JSON.stringify(senderList));
  
  alert('Data Pengirim disimpan!');
  loadSenderList(); // update dropdown
}

// Fungsi load data pengirim ke dropdown
function loadSenderList() {
  const senderList = JSON.parse(localStorage.getItem('dataPengirimList')) || [];
  const senderSelect = document.getElementById('senderSelect');
  
  // Reset option
  senderSelect.innerHTML = '<option value="">-- Pilih Pengirim --</option>';
  
  senderList.forEach((sender, idx) => {
    const option = document.createElement('option');
    option.value = idx;
    option.textContent = `${sender.nama} - ${sender.hp}`;
    senderSelect.appendChild(option);
  });
}

// Autofill dari pilihan dropdown pengirim
function fillSenderFromSelect() {
  const idx = document.getElementById('senderSelect').value;
  if (idx === '') return; // kosong berarti batal
  
  const senderList = JSON.parse(localStorage.getItem('dataPengirimList')) || [];
  if (senderList[idx]) {
    const sender = senderList[idx];
    document.getElementById('namaPengirim').value = sender.nama;
    document.getElementById('hpPengirim').value = sender.hp;
    document.getElementById('alamatPengirim').value = sender.alamat;
  }
}

// Sama buat penerima

function saveReceiver() {
  const newReceiver = {
    nama: document.getElementById('namaPenerima').value,
    hp: document.getElementById('hpPenerima').value,
    alamat: document.getElementById('alamatPenerima').value,
  };
  
  let receiverList = JSON.parse(localStorage.getItem('dataPenerimaList')) || [];
  receiverList.push(newReceiver);
  localStorage.setItem('dataPenerimaList', JSON.stringify(receiverList));
  
  alert('Data Penerima disimpan!');
  loadReceiverList();
}

function loadReceiverList() {
  const receiverList = JSON.parse(localStorage.getItem('dataPenerimaList')) || [];
  const receiverSelect = document.getElementById('receiverSelect');
  
  receiverSelect.innerHTML = '<option value="">-- Pilih Penerima --</option>';
  
  receiverList.forEach((receiver, idx) => {
    const option = document.createElement('option');
    option.value = idx;
    option.textContent = `${receiver.nama} - ${receiver.hp}`;
    receiverSelect.appendChild(option);
  });
}

function fillReceiverFromSelect() {
  const idx = document.getElementById('receiverSelect').value;
  if (idx === '') return;
  
  const receiverList = JSON.parse(localStorage.getItem('dataPenerimaList')) || [];
  if (receiverList[idx]) {
    const receiver = receiverList[idx];
    document.getElementById('namaPenerima').value = receiver.nama;
    document.getElementById('hpPenerima').value = receiver.hp;
    document.getElementById('alamatPenerima').value = receiver.alamat;
  }
}