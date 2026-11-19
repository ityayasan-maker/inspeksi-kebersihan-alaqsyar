<?php
/**
 * Konfigurasi Aplikasi
 */
return [
    'name'     => 'Inspeksi Kebersihan Al Aqsyar',
    'url'      => 'https://inspeksi.alaqsyar.sch.id', // Ganti sesuai domain
    'debug'    => true, // true saat development, false di production
    'timezone' => 'Asia/Jakarta',

    // Scoring (sinkron dengan tabel settings)
    'score' => [
        'bersih'        => 100,
        'kurang_bersih' => 70,
        'kotor'         => 30,
        'threshold_alert' => 50,
    ],

    // Upload
    'upload' => [
        'max_size'   => 2048, // KB
        'allowed'    => ['jpg', 'jpeg', 'png', 'webp'],
        'path'       => PUBLIC_PATH . '/uploads',
    ],

    // Session
    'session_lifetime' => 7200, // detik

    // Pagination
    'per_page' => 15,
];
