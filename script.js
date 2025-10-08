/* script.js
   - semua fitur aktif: tanggal di riwayat & print, toast+suara, export/import CSV,
     hapus semua, search/filter, print per entry, preview print dari form.
*/

// elements
const form = document.getElementById('shippingForm');
const historyTableBody = document.querySelector('#historyTable tbody');
const printBtn = document.getElementById('printBtn');            // header print (quick)
const printFormBtn = document.getElementById('printFormBtn');    // preview cetak dari form
const toggleHistoryBtn = document.getElementById('toggleHistoryBtn');
const historySection = document.getElementById('historySection');
const searchInput = document.getElementById('searchInput');
const importFile = document.getElementById('importFile');
const exportBtn = document.getElementById('exportBtn');
const clearAllBtn = document.getElementById('clearAllBtn');
const toastRoot = document.getElementById('toast-root');

let historyData = [];

// ---------------- utilities ----------------
function nowISOShort() {
  const d = new Date();
  const pad = (n) => String(n).padStart(2, '0');
  return `${d.getFullYear()}-${pad(d.getMonth()+1)}-${pad(d.getDate())} ${pad(d.getHours())}:${pad(d.getMinutes())}`;
}
function niceDate(dStr) {
  try {
    const d = new Date(dStr);
    if (isNaN(d)) return dStr;
    return d.toLocaleDateString('id-ID', { day:'2-digit', month:'long', year:'numeric' }) + ' ' +
           d.toLocaleTimeString('id-ID', { hour:'2-digit', minute:'2-digit' });
  } catch { return dStr; }
}
function saveHistoryToStorage(){ localStorage.setItem('shippingHistory', JSON.stringify(historyData)); }
function loadHistoryFromStorage(){ historyData = JSON.parse(localStorage.getItem('shippingHistory')) || []; }

// toast + sound (AudioContext)
function showToast(message, duration = 2500) {
  const t = document.createElement('div');
  t.className = 'toast';
  t.textContent = message;
  toastRoot.appendChild(t);
  // show
  requestAnimationFrame(()=> t.classList.add('show'));
  playTing();
  setTimeout(()=> {
    t.classList.remove('show');
    setTimeout(()=> t.remove(), 300);
  }, duration);
}
function playTing() {
  try {
    const ctx = new (window.AudioContext || window.webkitAudioContext)();
    const o = ctx.createOscillator();
    const g = ctx.createGain();
    o.type = 'sine';
    o.frequency.value = 880;
    g.gain.value = 0.0015;
    o.connect(g); g.connect(ctx.destination);
    o.start();
    g.gain.exponentialRampToValueAtTime(0.12, ctx.currentTime + 0.01);
    g.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.12);
    o.stop(ctx.currentTime + 0.13);
  } catch(e) {}
}

// escape html
function escapeHtml(s=''){ return String(s).replace(/[&<>"']/g, m => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'})[m]); }

// ---------------- render ----------------
function renderHistoryTable(filter='') {
  historyTableBody.innerHTML = '';
  const q = filter.trim().toLowerCase();
  const rows = historyData
    .map((item, idx) => ({ item, idx }))
    .filter(({ item }) => {
      if (!q) return true;
      const hay = [
        item.senderName, item.receiverName, item.senderAddress, item.receiverAddress,
        item.refNumber, item.awbNumber, item.senderPhone, item.receiverPhone, item.date
      ].join(' ').toLowerCase();
      return hay.includes(q);
    });

  rows.forEach(({ item, idx }, i) => {
    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td>${i+1}</td>
      <td>${escapeHtml(niceDate(item.date))}</td>
      <td>${escapeHtml(item.senderName)}</td>
      <td>${escapeHtml(item.senderPhone)}</td>
      <td>${escapeHtml(item.senderAddress).replace(/\n/g,'<br>')}</td>
      <td>${escapeHtml(item.receiverName)}</td>
      <td>${escapeHtml(item.receiverPhone)}</td>
      <td>${escapeHtml(item.receiverAddress).replace(/\n/g,'<br>')}</td>
      <td>${escapeHtml(item.refNumber)}</td>
      <td>${escapeHtml(item.awbNumber)}</td>
      <td>${escapeHtml(item.totalKoli)}</td>
      <td>
        <button class="table-action btn-print-row" data-index="${idx}">🖨️</button>
        <button class="table-action btn-delete" data-index="${idx}">🗑️</button>
      </td>
    `;
    historyTableBody.appendChild(tr);
  });
}

// ---------------- CRUD ----------------
function addEntry(entry){
  if (!entry.date) entry.date = new Date().toISOString();
  if (!entry.totalKoli) entry.totalKoli = parseInt(entry.totalKoli) || 1;
  historyData.push(entry);
  saveHistoryToStorage();
  renderHistoryTable(searchInput.value || '');
}
function deleteEntryByRealIndex(realIndex){
  historyData.splice(realIndex, 1);
  saveHistoryToStorage();
  renderHistoryTable(searchInput.value || '');
}
function clearAllHistory(){
  historyData = [];
  saveHistoryToStorage();
  renderHistoryTable();
}

// ---------------- form submit ----------------
form.addEventListener('submit', (e)=>{
  e.preventDefault();
  const fd = new FormData(form);
  const entry = {
    senderName: (fd.get('senderName')||'').trim(),
    senderPhone: (fd.get('senderPhone')||'').trim(),
    senderAddress: (fd.get('senderAddress')||'').trim(),
    receiverName: (fd.get('receiverName')||'').trim(),
    receiverPhone: (fd.get('receiverPhone')||'').trim(),
    receiverAddress: (fd.get('receiverAddress')||'').trim(),
    refNumber: (fd.get('refNumber')||'').trim(),
    awbNumber: (fd.get('awbNumber')||'').trim(),
    totalKoli: parseInt(fd.get('totalKoli')) || 1,
    date: new Date().toISOString()
  };
  addEntry(entry);
  form.reset();
  showToast('✅ Data berhasil disimpan');
});

// --------------- printing ---------------
function printEntry(data){
  let allPages = '';
  for (let i=1;i<= (parseInt(data.totalKoli)||1); i++){
    allPages += `
      <div class="print-page" style="font-family:Segoe UI,Tahoma,sans-serif;padding:20px;">
        <div style="text-align:center;margin-bottom:12px;">
          <img src="https://i.imgur.com/8nbxERj.jpeg" style="max-width:120px;display:block;margin:0 auto 8px" />
          <h2 style="color:${'#2e7d32'};margin:0 0 8px">Data Pengiriman Barang</h2>
        </div>
        <div style="margin-bottom:10px;display:flex;justify-content:space-between;align-items:center;">
          <div><strong>Tanggal:</strong> ${escapeHtml(niceDate(data.date||new Date().toISOString()))}</div>
          <div style="font-weight:bold;color:#d35400;">Koli: ${i}/${data.totalKoli}</div>
        </div>
        <div style="border:1px solid #ccc;padding:10px;margin-bottom:10px;border-radius:6px;">
          <h3 style="margin:0 0 8px 0;">Data Pengirim</h3>
          <p style="margin:4px 0">Nama: ${escapeHtml(data.senderName)}</p>
          <p style="margin:4px 0">HP: ${escapeHtml(data.senderPhone)}</p>
          <p style="margin:4px 0">Alamat: ${escapeHtml(data.senderAddress).replace(/\n/g,'<br>')}</p>
        </div>
        <div style="border:1px solid #ccc;padding:10px;margin-bottom:10px;border-radius:6px;">
          <h3 style="margin:0 0 8px 0;">Data Penerima</h3>
          <p style="margin:4px 0">Nama: ${escapeHtml(data.receiverName)}</p>
          <p style="margin:4px 0">HP: ${escapeHtml(data.receiverPhone)}</p>
          <p style="margin:4px 0">Alamat: ${escapeHtml(data.receiverAddress).replace(/\n/g,'<br>')}</p>
        </div>
        <div style="border:1px solid #ccc;padding:10px;border-radius:6px;display:flex;justify-content:space-between;">
          <div>
            <p style="margin:2px 0">No Reff: ${escapeHtml(data.refNumber)}</p>
            <p style="margin:2px 0">No AWB: ${escapeHtml(data.awbNumber)}</p>
          </div>
          <div style="text-align:right;">
            <p style="margin:0;font-weight:600;">Dicetak: ${escapeHtml(nowISOShort())}</p>
          </div>
        </div>
      </div>
    `;
  }
  const w = window.open('','_blank');
  w.document.write(`<html><head><title>Print</title><style>@media print{ .print-page{page-break-after: always} }</style></head><body>${allPages}</body></html>`);
  w.document.close();
  w.focus();
  w.print();
}

// print from header: uses currently filled form (quick)
printBtn.addEventListener('click', ()=>{
  const data = {
    senderName: form.senderName.value.trim(),
    senderPhone: form.senderPhone.value.trim(),
    senderAddress: form.senderAddress.value.trim(),
    receiverName: form.receiverName.value.trim(),
    receiverPhone: form.receiverPhone.value.trim(),
    receiverAddress: form.receiverAddress.value.trim(),
    refNumber: form.refNumber.value.trim(),
    awbNumber: form.awbNumber.value.trim(),
    totalKoli: parseInt(form.totalKoli.value) || 1,
    date: new Date().toISOString()
  };
  printEntry(data);
});
// preview print from form
printFormBtn.addEventListener('click', ()=>{
  const data = {
    senderName: form.senderName.value.trim(),
    senderPhone: form.senderPhone.value.trim(),
    senderAddress: form.senderAddress.value.trim(),
    receiverName: form.receiverName.value.trim(),
    receiverPhone: form.receiverPhone.value.trim(),
    receiverAddress: form.receiverAddress.value.trim(),
    refNumber: form.refNumber.value.trim(),
    awbNumber: form.awbNumber.value.trim(),
    totalKoli: parseInt(form.totalKoli.value) || 1,
    date: new Date().toISOString()
  };
  printEntry(data);
});

// ---------------- history table actions (delegate) ----------------
historyTableBody.addEventListener('click', (e) => {
  const btn = e.target.closest('button');
  if (!btn) return;
  const idx = parseInt(btn.dataset.index);
  if (btn.classList.contains('btn-delete')){
    if (confirm('Yakin menghapus entri ini?')) {
      deleteEntryByRealIndex(idx);
      showToast('Entri dihapus');
    }
    return;
  }
  if (btn.classList.contains('btn-print-row')){
    const entry = historyData[idx];
    if (entry) printEntry(entry);
  }
});

// ---------------- toggle history ----------------
toggleHistoryBtn.addEventListener('click', ()=>{
  historySection.classList.toggle('hidden');
  toggleHistoryBtn.textContent = historySection.classList.contains('hidden') ? '📜 Riwayat' : '✖ Tutup';
});

// ---------------- search/filter ----------------
searchInput.addEventListener('input', (e)=>{
  renderHistoryTable(e.target.value || '');
});

// ---------------- export CSV ----------------
function csvEscape(val){
  if (val == null) return '';
  val = String(val);
  if (val.includes('"') || val.includes(',') || val.includes('\n')) {
    return `"${val.replace(/"/g,'""')}"`;
  }
  return val;
}
exportBtn.addEventListener('click', ()=>{
  if (!historyData.length) { showToast('Riwayat kosong — tidak ada yang diexport'); return; }
  const headers = ['senderName','senderPhone','senderAddress','receiverName','receiverPhone','receiverAddress','refNumber','awbNumber','totalKoli','date'];
  const rows = historyData.map(item => headers.map(h => csvEscape(item[h])).join(','));
  const csv = [headers.join(','), ...rows].join('\n');
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `shipping_history_${new Date().toISOString().slice(0,10)}.csv`;
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
  showToast('Export CSV berhasil');
});

// ---------------- import CSV ----------------
importFile.addEventListener('change', (e)=>{
  const file = e.target.files[0];
  if (!file) return;
  const reader = new FileReader();
  reader.onload = () => {
    try {
      const text = reader.result.replace(/\r/g,'');
      const lines = text.split('\n').filter(l => l.trim() !== '');
      if (!lines.length) throw new Error('File kosong');
      const header = parseCsvLine(lines[0]).map(h => h.trim());
      const required = ['senderName','senderPhone','senderAddress','receiverName','receiverPhone','receiverAddress','refNumber','awbNumber','totalKoli','date'];
      // parse rows
      const newEntries = [];
      for (let r=1;r<lines.length;r++){
        const raw = parseCsvLine(lines[r]);
        if (!raw || raw.length===0) continue;
        const obj = {};
        header.forEach((h,i)=> obj[h] = raw[i] || '');
        const entry = {
          senderName: obj.senderName || '',
          senderPhone: obj.senderPhone || '',
          senderAddress: obj.senderAddress || '',
          receiverName: obj.receiverName || '',
          receiverPhone: obj.receiverPhone || '',
          receiverAddress: obj.receiverAddress || '',
          refNumber: obj.refNumber || '',
          awbNumber: obj.awbNumber || '',
          totalKoli: parseInt(obj.totalKoli) || 1,
          date: obj.date || new Date().toISOString()
        };
        newEntries.push(entry);
      }
      if (!newEntries.length) throw new Error('Tidak ada baris data valid');
      historyData = historyData.concat(newEntries);
      saveHistoryToStorage();
      renderHistoryTable(searchInput.value || '');
      showToast(`Import berhasil (${newEntries.length} entri)`);
    } catch (err) {
      alert('Gagal import CSV: ' + (err && err.message ? err.message : err));
    } finally {
      importFile.value = '';
    }
  };
  reader.readAsText(file,'utf-8');
});

// CSV line parser (handles quoted fields)
function parseCsvLine(line){
  const res = [];
  let cur = '', inQuotes = false;
  for (let i=0;i<line.length;i++){
    const ch = line[i];
    if (ch === '"'){
      if (inQuotes && line[i+1] === '"'){ cur += '"'; i++; }
      else { inQuotes = !inQuotes; }
      continue;
    }
    if (ch === ',' && !inQuotes){
      res.push(cur);
      cur = '';
    } else cur += ch;
  }
  res.push(cur);
  return res;
}

// ---------------- clear all ----------------
clearAllBtn.addEventListener('click', ()=>{
  if (!historyData.length) { showToast('Riwayat kosong'); return; }
  if (confirm('Yakin ingin menghapus SEMUA riwayat? Tindakan ini tidak bisa dibatalkan.')) {
    clearAllHistory();
    showToast('Semua riwayat dihapus');
  }
});

// ---------------- init ----------------
function init(){
  loadHistoryFromStorage();
  renderHistoryTable();
}
window.addEventListener('load', init);
