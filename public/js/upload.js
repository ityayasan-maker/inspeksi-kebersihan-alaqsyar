/**
 * upload.js — foto upload, preview, gallery
 */

// Helper: ambil Base URL yang aman
function getBaseUrl() {
  if (typeof window.BASE_URL === 'string' && window.BASE_URL.length > 0) {
    return window.BASE_URL.replace(/\/+$/, '');
  }
  return window.location.origin;
}

// Global state untuk galeri foto
let currentGalleryPhotos = [];
let currentGalleryInspeksiId = null;

function handleFotoChange(input) {
  const uid = input.dataset.uid;
  const file = input.files[0];
  if (!file) return;
  const allowed = ['image/jpeg','image/png','image/webp'];
  if (!allowed.includes(file.type)) {
    Swal.fire({icon:'error',title:'Format tidak didukung',text:'Gunakan JPG, PNG, atau WebP.'});
    input.value=''; return;
  }
  if (file.size/1024 > 2048) {
    Swal.fire({icon:'error',title:'File terlalu besar',text:'Maksimal 2 MB.'});
    input.value=''; return;
  }
  const reader = new FileReader();
  reader.onload = e => {
    Swal.fire({
      title:'Upload foto ini?',
      html:`<img src="${e.target.result}" class="img-fluid rounded mb-2" style="max-height:200px">
            <div class="small text-muted">${escH(file.name)}</div>`,
      showCancelButton:true, confirmButtonText:'Upload', cancelButtonText:'Batal',
      confirmButtonColor:'#2d8653',
    }).then(r => { if(r.isConfirmed) doUpload(uid); else input.value=''; });
  };
  reader.readAsDataURL(file);
}

function doUpload(uid) {
  const input      = document.getElementById(uid+'_file');
  const inspeksiId = input.dataset.inspeksiId;
  const standarId  = input.dataset.standarId;
  const file       = input.files[0];
  if (!file) return;

  document.getElementById(uid+'_progress')?.classList.remove('d-none');
  document.getElementById(uid+'_input')?.classList.add('d-none');

  const fd = new FormData();
  fd.append('foto', file);
  fd.append('inspeksi_id', inspeksiId);
  fd.append('standar_id',  standarId);

  fetch(getBaseUrl() + '/upload/inspeksi-foto', {
    method:'POST', headers:{'X-Requested-With':'XMLHttpRequest'}, body:fd
  })
  .then(r=>r.json())
  .then(data => {
    document.getElementById(uid+'_progress')?.classList.add('d-none');
    document.getElementById(uid+'_input')?.classList.remove('d-none');
    if (data.success) {
      renderPreview(uid, data.data.url, data.data.filename, inspeksiId, standarId);
      showToast('success','Foto berhasil diupload');
    } else {
      Swal.fire({icon:'error',title:'Upload gagal',text:data.message||'Coba lagi.'});
    }
  })
  .catch(()=>{
    document.getElementById(uid+'_progress')?.classList.add('d-none');
    document.getElementById(uid+'_input')?.classList.remove('d-none');
    Swal.fire({icon:'error',title:'Koneksi gagal',text:'Periksa koneksi internet.'});
  });
}

function renderPreview(uid, url, filename, inspeksiId, standarId) {
  document.getElementById(uid+'_preview')?.remove();
  const wrap = document.getElementById(uid);
  if (!wrap) return;
  const el = document.createElement('div');
  el.id = uid+'_preview';
  el.className = 'd-flex align-items-center gap-2 mb-2';
  el.innerHTML = `
    <img src="${url}" class="rounded border" style="width:60px;height:60px;object-fit:cover;cursor:pointer"
         onclick="openGallery('${url}','${escH(filename)}')">
    <div>
      <div class="small text-muted" style="font-size:11px">${escH(filename)}</div>
      <button type="button" class="btn btn-sm btn-outline-danger mt-1" style="font-size:11px;padding:2px 8px"
        onclick="deleteFoto('${uid}',${inspeksiId},${standarId},'${filename}')">
        <i class="bi bi-trash"></i> Hapus
      </button>
    </div>`;
  wrap.insertBefore(el, document.getElementById(uid+'_input'));
  const lbl = document.getElementById(uid+'_label');
  if(lbl) lbl.textContent='Ganti Foto';
}

function deleteFoto(uid, inspeksiId, standarId, filename) {
  Swal.fire({
    title:'Hapus foto ini?',icon:'warning',showCancelButton:true,
    confirmButtonColor:'#dc3545',confirmButtonText:'Ya, Hapus',cancelButtonText:'Batal',
  }).then(r => {
    if (!r.isConfirmed) return;
    const fd = new FormData();
    fd.append('_csrf', window.CSRF_TOKEN||'');
    fd.append('inspeksi_id', inspeksiId);
    fd.append('standar_id',  standarId);
    fd.append('filename',    filename);
    fetch(getBaseUrl() + '/upload/delete',{method:'POST',headers:{'X-Requested-With':'XMLHttpRequest'},body:fd})
    .then(r=>r.json()).then(data=>{
      if(data.success){
        document.getElementById(uid+'_preview')?.remove();
        const lbl=document.getElementById(uid+'_label');
        if(lbl) lbl.textContent='Tambah Foto';
        showToast('success','Foto dihapus');
      } else { Swal.fire({icon:'error',title:'Gagal',text:data.message}); }
    });
  });
}

function loadGallery(inspeksiId) {
  if (!inspeksiId) return;
  currentGalleryInspeksiId = inspeksiId;
  currentGalleryPhotos = [];

  const modalEl = document.getElementById('galleryModal');
  if (!modalEl) {
    console.warn('galleryModal element not found');
    return;
  }
  const modal = bootstrap.Modal.getOrCreateInstance(modalEl);

  const grid = document.getElementById('galleryGrid');
  const main = document.getElementById('galleryMain');
  const loading = document.getElementById('galleryLoading');
  const empty = document.getElementById('galleryEmpty');
  const btnBack = document.getElementById('btnBackToGrid');
  const title = document.getElementById('galleryTitle');
  const sub = document.getElementById('gallerySub');

  if (main) main.classList.add('d-none');
  if (btnBack) btnBack.classList.add('d-none');
  if (grid) {
    grid.innerHTML = '';
    grid.classList.remove('d-none');
  }
  if (loading) loading.classList.remove('d-none');
  if (empty) empty.classList.add('d-none');
  if (title) title.textContent = 'Galeri Foto #' + inspeksiId;
  if (sub) sub.textContent = 'Memuat foto...';

  modal.show();

  const url = getBaseUrl() + '/upload/gallery/' + encodeURIComponent(inspeksiId);

  fetch(url, {
    headers: { 'X-Requested-With': 'XMLHttpRequest' }
  })
  .then(res => {
    if (!res.ok) throw new Error('HTTP ' + res.status);
    return res.json();
  })
  .then(data => {
    if (loading) loading.classList.add('d-none');

    const photos = data.photos || [];
    currentGalleryPhotos = photos;

    if (sub) {
      const room = data.ruangan_nama ? data.ruangan_nama + ' — ' : '';
      sub.textContent = room + (data.tanggal || '') + ' (' + photos.length + ' Foto)';
    }

    if (!photos || photos.length === 0) {
      if (empty) empty.classList.remove('d-none');
      return;
    }

    renderGalleryGrid(photos);
  })
  .catch(err => {
    console.error('loadGallery error:', err);
    if (loading) loading.classList.add('d-none');
    if (empty) {
      empty.classList.remove('d-none');
      empty.innerHTML = `
        <i class="bi bi-exclamation-triangle text-warning mb-2" style="font-size:2.5rem; display:block"></i>
        <h6 class="text-white mb-1">Gagal Memuat Galeri</h6>
        <p class="small text-white-50 mb-0">Tidak dapat terhubung ke server atau foto belum tersedia.</p>
      `;
    }
  });
}

function renderGalleryGrid(photos) {
  const grid = document.getElementById('galleryGrid');
  if (!grid) return;
  grid.innerHTML = '';

  const kc = k => k === 'bersih' ? 'success' : k === 'kurang_bersih' ? 'warning' : 'danger';
  const kl = k => (k || 'bersih').replace('_', ' ').toUpperCase();

  photos.forEach((p, idx) => {
    const col = document.createElement('div');
    col.className = 'col-6 col-md-4 col-lg-3';
    col.innerHTML = `
      <div class="card bg-black border border-secondary border-opacity-50 overflow-hidden shadow-sm h-100"
           style="cursor:pointer; transition:transform .2s ease, border-color .2s ease;"
           onmouseover="this.style.transform='scale(1.02)'; this.style.borderColor='#0dcaf0';"
           onmouseout="this.style.transform='scale(1)'; this.style.borderColor='rgba(108,117,125,0.5)';"
           onclick="openPhotoInGallery(${idx})">
        <div style="aspect-ratio:4/3; position:relative; background:#181818;">
          <img src="${p.url}" class="w-100 h-100" style="object-fit:cover;"
               onerror="this.src='data:image/svg+xml;charset=UTF-8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%22200%22%20height%3D%22150%22%20viewBox%3D%220%200%20200%20150%22%3E%3Crect%20fill%3D%22%23333%22%20width%3D%22200%22%20height%3D%22150%22%2F%3E%3Ctext%20fill%3D%22%23888%22%20x%3D%2250%25%22%20y%3D%2250%25%22%20text-anchor%3D%22middle%22%20dy%3D%22.3em%22%3EFoto%20Kosong%3C%2Ftext%3E%3C%2Fsvg%3E'">
          ${p.is_utama ? '<span class="position-absolute top-0 start-0 m-1 badge bg-primary" style="font-size:10px;"><i class="bi bi-camera me-1"></i>Ruangan</span>' : ''}
          <span class="position-absolute bottom-0 end-0 m-1 badge bg-${kc(p.kondisi)}" style="font-size:9.5px;">
            ${kl(p.kondisi)}
          </span>
        </div>
        <div class="card-body p-2">
          <div class="text-white small fw-semibold text-truncate" title="${escH(p.aspek)}">${escH(p.aspek)}</div>
          ${p.catatan ? `<div class="text-white-50" style="font-size:11px; overflow:hidden; text-overflow:ellipsis; white-space:nowrap;">${escH(p.catatan)}</div>` : ''}
        </div>
      </div>
    `;
    grid.appendChild(col);
  });
}

function openPhotoInGallery(idx) {
  const p = currentGalleryPhotos[idx];
  if (!p) return;

  const grid = document.getElementById('galleryGrid');
  const main = document.getElementById('galleryMain');
  const btnBack = document.getElementById('btnBackToGrid');
  const img = document.getElementById('galleryMainImg');
  const aspek = document.getElementById('galleryMainAspek');
  const badge = document.getElementById('galleryMainBadge');
  const catatan = document.getElementById('galleryMainCatatan');
  const downloadLink = document.getElementById('galleryMainDownload');

  if (grid) grid.classList.add('d-none');
  if (main) main.classList.remove('d-none');
  if (btnBack) btnBack.classList.remove('d-none');

  if (img) img.src = p.url;
  if (aspek) aspek.textContent = p.aspek || 'Foto Dokumentasi';

  const kc = k => k === 'bersih' ? 'success' : k === 'kurang_bersih' ? 'warning' : 'danger';
  const kl = k => (k || 'bersih').replace('_', ' ').toUpperCase();

  if (badge) {
    badge.className = 'badge bg-' + kc(p.kondisi);
    badge.textContent = kl(p.kondisi);
  }

  if (catatan) {
    catatan.textContent = p.catatan ? 'Catatan: ' + p.catatan : (p.is_utama ? 'Foto kondisi umum ruangan saat inspeksi.' : 'Tidak ada catatan tambahan.');
  }

  if (downloadLink) {
    downloadLink.href = p.url;
  }
}

function backToGalleryGrid() {
  const grid = document.getElementById('galleryGrid');
  const main = document.getElementById('galleryMain');
  const btnBack = document.getElementById('btnBackToGrid');

  if (main) main.classList.add('d-none');
  if (btnBack) btnBack.classList.add('d-none');
  if (grid) grid.classList.remove('d-none');
}

function openGallery(url, caption) {
  const modalEl = document.getElementById('galleryModal');
  if (!modalEl) return;
  const modal = bootstrap.Modal.getOrCreateInstance(modalEl);

  const grid = document.getElementById('galleryGrid');
  const main = document.getElementById('galleryMain');
  const loading = document.getElementById('galleryLoading');
  const empty = document.getElementById('galleryEmpty');
  const btnBack = document.getElementById('btnBackToGrid');
  const title = document.getElementById('galleryTitle');
  const sub = document.getElementById('gallerySub');

  if (grid) grid.classList.add('d-none');
  if (loading) loading.classList.add('d-none');
  if (empty) empty.classList.add('d-none');
  if (btnBack) btnBack.classList.add('d-none');

  if (title) title.textContent = 'Preview Foto';
  if (sub) sub.textContent = caption || '';

  const img = document.getElementById('galleryMainImg');
  const aspek = document.getElementById('galleryMainAspek');
  const badge = document.getElementById('galleryMainBadge');
  const catatan = document.getElementById('galleryMainCatatan');
  const downloadLink = document.getElementById('galleryMainDownload');

  if (img) img.src = url;
  if (aspek) aspek.textContent = caption || 'Foto';
  if (badge) badge.className = 'd-none';
  if (catatan) catatan.textContent = '';
  if (downloadLink) downloadLink.href = url;

  if (main) main.classList.remove('d-none');
  modal.show();
}

function showToast(type, message) {
  Swal.fire({
    toast: true,
    position: 'top-end',
    icon: type,
    title: message,
    showConfirmButton: false,
    timer: 2500,
    timerProgressBar: true
  });
}

function escH(s) {
  return String(s || '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}
