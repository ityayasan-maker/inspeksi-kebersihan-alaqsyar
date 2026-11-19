<?php
class Database
{
    private static ?PDO $instance = null;

    private function __construct() {}
    private function __clone() {}

    public static function getInstance(): PDO
    {
        if (self::$instance === null) {
            $cfg = require ROOT_PATH . '/config/database.php';
            $dsn = "mysql:host={$cfg['host']};dbname={$cfg['dbname']};charset={$cfg['charset']}";
            self::$instance = new PDO($dsn, $cfg['user'], $cfg['pass'], $cfg['options']);
            self::$instance->exec("SET NAMES utf8mb4 COLLATE utf8mb4_unicode_ci");
            self::$instance->exec("SET collation_connection = utf8mb4_unicode_ci");
        }
        return self::$instance;
    }
}