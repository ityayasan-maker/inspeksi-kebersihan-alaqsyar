-- Query Perbaikan Password Admin & User
-- Jalankan query ini di phpMyAdmin pada database website:

UPDATE `users` 
SET `password` = '$2y$12$/L2K2s3VEHvd527c19iIYuLGURVehTqdjMYrrcUp41j/lYj9nyMBe'
WHERE `email` = 'admin@alaqsyar.sch.id';

-- Atau jika ingin mereset password SEMUA user default menjadi Admin@123 :
-- UPDATE `users` SET `password` = '$2y$12$/L2K2s3VEHvd527c19iIYuLGURVehTqdjMYrrcUp41j/lYj9nyMBe';
