<!DOCTYPE html>
<html lang="id">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1, user-scalable=yes">
<title>Login — Inspeksi Kebersihan</title>

<!-- PWA Support -->
<link rel="manifest" href="<?= Helper::baseUrl('manifest.json') ?>">
<meta name="theme-color" content="#1a5c38">
<meta name="mobile-web-app-capable" content="yes">
<meta name="apple-mobile-web-app-capable" content="yes">
<meta name="apple-mobile-web-app-status-bar-style" content="black-translucent">
<meta name="apple-mobile-web-app-title" content="Inspeksi">
<link rel="apple-touch-icon" sizes="180x180" href="<?= Helper::baseUrl('icons/apple-touch-icon-180x180.png') ?>">
<link rel="apple-touch-icon" href="<?= Helper::baseUrl('icons/apple-touch-icon.png') ?>">
<link rel="icon" type="image/png" sizes="192x192" href="<?= Helper::baseUrl('icons/icon-192x192.png') ?>">

<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css">
<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.11.3/font/bootstrap-icons.min.css">
<style>
:root {
  --green-dark:  #1a5c38;
  --green-main:  #2d8653;
  --green-light: #e8f5ee;
  --gold:        #c9a84c;
  --gold-light:  #fdf6e3;
}
* { box-sizing: border-box; }
body {
  min-height: 100vh;
  margin: 0;
  font-family: 'Segoe UI', sans-serif;
  background: linear-gradient(135deg, #0f3322 0%, #1a5c38 50%, #2d8653 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px;
}

/* Ornament background */
body::before {
  content: '';
  position: fixed;
  inset: 0;
  background-image:
    radial-gradient(circle at 15% 20%, rgba(201,168,76,.12) 0%, transparent 40%),
    radial-gradient(circle at 85% 80%, rgba(45,134,83,.25) 0%, transparent 40%);
  pointer-events: none;
}

.login-wrap {
  width: 100%;
  max-width: 420px;
  position: relative;
  z-index: 1;
}

/* Card */
.login-card {
  background: #fff;
  border-radius: 20px;
  overflow: hidden;
  box-shadow: 0 24px 64px rgba(0,0,0,.35);
}

/* Header */
.login-header {
  background: linear-gradient(135deg, var(--green-dark) 0%, var(--green-main) 100%);
  padding: 36px 32px 28px;
  text-align: center;
  position: relative;
}
.login-header::after {
  content: '';
  position: absolute;
  bottom: -1px; left: 0; right: 0;
  height: 28px;
  background: #fff;
  border-radius: 20px 20px 0 0;
}
.logo-icon {
  width: 68px; height: 68px;
  background: rgba(255,255,255,.15);
  border: 2px solid rgba(255,255,255,.3);
  border-radius: 50%;
  display: flex; align-items: center; justify-content: center;
  margin: 0 auto 14px;
  font-size: 30px;
  color: #fff;
}
.login-header h1 {
  font-size: 18px;
  font-weight: 700;
  color: #fff;
  margin: 0 0 4px;
}
.login-header p {
  font-size: 13px;
  color: rgba(255,255,255,.75);
  margin: 0;
}

/* Body */
.login-body {
  padding: 28px 32px 32px;
}

.arabic-quote {
  text-align: center;
  font-size: 15px;
  color: var(--green-dark);
  font-style: italic;
  margin-bottom: 24px;
  padding: 12px 16px;
  background: var(--green-light);
  border-radius: 10px;
  border-left: 3px solid var(--gold);
}
.arabic-quote small {
  display: block;
  font-size: 11px;
  color: #666;
  font-style: normal;
  margin-top: 2px;
}

.form-label {
  font-size: 13px;
  font-weight: 600;
  color: #333;
  margin-bottom: 6px;
}
.form-control {
  border-radius: 10px;
  border: 1.5px solid #dde;
  padding: 10px 14px;
  font-size: 14px;
  transition: border-color .2s, box-shadow .2s;
}
.form-control:focus {
  border-color: var(--green-main);
  box-shadow: 0 0 0 3px rgba(45,134,83,.15);
  outline: none;
}
.input-group .form-control { border-radius: 10px 0 0 10px; }
.input-group .btn-outline-secondary {
  border-radius: 0 10px 10px 0;
  border: 1.5px solid #dde;
  border-left: none;
  color: #666;
}
.input-group .btn-outline-secondary:hover { background: var(--green-light); color: var(--green-dark); }

.btn-login {
  width: 100%;
  padding: 12px;
  border-radius: 10px;
  background: linear-gradient(135deg, var(--green-dark), var(--green-main));
  border: none;
  color: #fff;
  font-size: 15px;
  font-weight: 600;
  letter-spacing: .3px;
  transition: opacity .2s, transform .1s;
  margin-top: 8px;
}
.btn-login:hover  { opacity: .92; transform: translateY(-1px); }
.btn-login:active { transform: translateY(0); }
.btn-login:disabled { opacity: .7; }

.alert { border-radius: 10px; font-size: 13px; padding: 10px 14px; }

.footer-note {
  text-align: center;
  font-size: 12px;
  color: rgba(255,255,255,.6);
  margin-top: 18px;
}
</style>
</head>
<body>

<div class="login-wrap">
  <div class="login-card">

    <div class="login-header">
      <div class="logo-icon"><i class="bi bi-clipboard2-check"></i></div>
      <h1>Inspeksi Kebersihan</h1>
      <p>Yayasan Am Badar — Al Aqsyar Islamic School</p>
    </div>

    <div class="login-body">

      <?php if ($timeout ?? false): ?>
        <div class="alert alert-warning">
          <i class="bi bi-clock me-1"></i> Sesi Anda habis. Silakan login kembali.
        </div>
      <?php endif; ?>

      <?= Helper::flashAlert() ?>

      <div class="arabic-quote">
        اَلطَّهُوْرُ شَطْرُ الْإِيْمَانِ
        <small>Kebersihan adalah sebagian dari iman. (HR. Muslim)</small>
      </div>

      <form method="POST" action="<?= Helper::baseUrl('login') ?>" id="loginForm" novalidate>
        <?= Helper::csrfField() ?>

        <div class="mb-3">
          <label class="form-label" for="email">
            <i class="bi bi-envelope me-1"></i>Email
          </label>
          <input
            type="email"
            class="form-control"
            id="email"
            name="email"
            placeholder="contoh@alaqsyar.sch.id"
            value="<?= Helper::e($_POST['email'] ?? '') ?>"
            autocomplete="email"
            required
          >
        </div>

        <div class="mb-3">
          <label class="form-label" for="password">
            <i class="bi bi-lock me-1"></i>Password
          </label>
          <div class="input-group">
            <input
              type="password"
              class="form-control"
              id="password"
              name="password"
              placeholder="Masukkan password"
              autocomplete="current-password"
              required
            >
            <button type="button" class="btn btn-outline-secondary" id="togglePw" tabindex="-1">
              <i class="bi bi-eye" id="eyeIcon"></i>
            </button>
          </div>
        </div>

        <button type="submit" class="btn-login" id="btnLogin">
          <i class="bi bi-box-arrow-in-right me-1"></i>Masuk
        </button>
      </form>

    </div><!-- /login-body -->
  </div><!-- /login-card -->

  <p class="footer-note">
    &copy; <?= date('Y') ?> Yayasan Am Badar &mdash; v1.0
  </p>
</div>

<script>
// Toggle password visibility
document.getElementById('togglePw').addEventListener('click', function () {
  const pw   = document.getElementById('password');
  const icon = document.getElementById('eyeIcon');
  if (pw.type === 'password') {
    pw.type = 'text';
    icon.className = 'bi bi-eye-slash';
  } else {
    pw.type = 'password';
    icon.className = 'bi bi-eye';
  }
});

// Disable button saat submit
document.getElementById('loginForm').addEventListener('submit', function () {
  const btn = document.getElementById('btnLogin');
  btn.disabled = true;
  btn.innerHTML = '<span class="spinner-border spinner-border-sm me-1"></span>Memproses...';
});

if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('<?= Helper::baseUrl('sw.js') ?>')
      .catch(err => console.warn('[PWA] SW reg failed:', err));
  });
}
</script>
</body>
</html>
