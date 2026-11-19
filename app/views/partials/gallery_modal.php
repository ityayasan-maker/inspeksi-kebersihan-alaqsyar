<?php
/**
 * Partial: gallery_modal.php
 * Include sekali di layout atau di halaman yang butuh gallery.
 * Trigger: openGallery(url) atau loadGallery(inspeksiId)
 */
?>

<!-- Gallery Modal -->
<div class="modal fade" id="galleryModal" tabindex="-1" aria-labelledby="galleryTitle" aria-hidden="true">
  <div class="modal-dialog modal-xl modal-dialog-centered modal-dialog-scrollable">
    <div class="modal-content bg-dark text-white border-0 shadow-lg" style="border-radius:14px; overflow:hidden">
      <div class="modal-header border-bottom border-secondary border-opacity-25 py-3 px-4 d-flex align-items-center justify-content-between">
        <div class="d-flex align-items-center gap-2">
          <i class="bi bi-images text-info fs-5"></i>
          <div>
            <h6 class="modal-title mb-0 fw-bold" id="galleryTitle">Galeri Foto Inspeksi</h6>
            <small class="text-white-50" id="gallerySub" style="font-size:12px"></small>
          </div>
        </div>
        <div class="d-flex align-items-center gap-2">
          <button type="button" class="btn btn-sm btn-outline-light d-none" id="btnBackToGrid" onclick="backToGalleryGrid()">
            <i class="bi bi-grid-3x3-gap me-1"></i>Lihat Semua Foto
          </button>
          <button type="button" class="btn-close btn-close-white" data-bs-dismiss="modal" aria-label="Close"></button>
        </div>
      </div>
      <div class="modal-body p-3 p-md-4" style="min-height:350px">
        <!-- Single photo view -->
        <div id="galleryMain" class="text-center d-none">
          <div class="position-relative d-inline-block w-100">
            <img id="galleryMainImg" src="" class="img-fluid rounded shadow" style="max-height:65vh; max-width:100%; object-fit:contain; background:#111">
          </div>
          <div class="mt-3 p-3 bg-secondary bg-opacity-25 rounded-3 text-start mx-auto" style="max-width:700px">
            <div class="d-flex align-items-center justify-content-between gap-2 flex-wrap mb-1">
              <span class="fw-bold text-white fs-6" id="galleryMainAspek"></span>
              <span class="badge" id="galleryMainBadge"></span>
            </div>
            <div class="text-white-50 small mb-2" id="galleryMainCatatan"></div>
            <div class="d-flex justify-content-between align-items-center pt-2 border-top border-secondary border-opacity-25">
              <button type="button" class="btn btn-sm btn-outline-info" onclick="backToGalleryGrid()">
                <i class="bi bi-arrow-left me-1"></i>Kembali ke Galeri
              </button>
              <a id="galleryMainDownload" href="#" target="_blank" class="btn btn-sm btn-outline-light">
                <i class="bi bi-box-arrow-up-right me-1"></i>Buka Ukuran Penuh
              </a>
            </div>
          </div>
        </div>

        <!-- Grid view -->
        <div id="galleryGrid" class="row g-3"></div>

        <!-- Loading -->
        <div id="galleryLoading" class="text-center py-5 text-white d-none">
          <div class="spinner-border text-info mb-2" role="status"></div>
          <p class="mb-0 text-white-50">Memuat foto hasil inspeksi...</p>
        </div>

        <!-- Empty -->
        <div id="galleryEmpty" class="text-center py-5 text-white-50 d-none">
          <i class="bi bi-camera text-secondary mb-2" style="font-size:3rem; display:block"></i>
          <h6 class="text-white mb-1">Tidak Ada Foto</h6>
          <p class="small text-white-50 mb-0">Inspeksi ini belum memiliki foto dokumentasi.</p>
        </div>
      </div>
    </div>
  </div>
</div>
