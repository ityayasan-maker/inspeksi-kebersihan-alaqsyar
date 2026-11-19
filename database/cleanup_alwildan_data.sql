-- ============================================================
-- SQL CLEANUP: Hapus data / user Al Wildan dari Database Al Aqsyar
-- Jalankan query ini di phpMyAdmin database Al Aqsyar jika pernah
-- membuat akun user atau unit Al Wildan sebelumnya.
-- ============================================================

-- 1. Hapus akun user uji coba Al Wildan jika ada
DELETE FROM `users` 
WHERE `email` LIKE '%alwildan%' 
   OR `email` LIKE 'AW8@%' 
   OR `name` LIKE '%Al Wildan%';

-- 2. Jika ada gedung yang sempat diset unit 'al_wildan', alihkan ke 'yayasan' atau 'smp'
UPDATE `gedung` 
SET `unit` = 'yayasan' 
WHERE `unit` = 'al_wildan';
