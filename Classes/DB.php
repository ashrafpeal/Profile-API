<?php

namespace Syno_WP_React;

use Illuminate\Pagination\LengthAwarePaginator;
use Illuminate\Pagination\Paginator;   
use Illuminate\Database\Capsule\Manager as Capsule;

class DB {

    public function __construct() {
        add_action('init', [$this, 'connect_db']);
    }

    public function connect_db(): void {
        global $wpdb;

        if (!defined('DB_NAME') || !defined('DB_USER') || !defined('DB_PASSWORD') || !defined('DB_HOST')) {
            return;
        }

        if (!class_exists(Capsule::class)) {
            return;
        }

        $db = new Capsule;

        $db->addConnection([
            'driver'    => 'mysql',
            'host'      => DB_HOST,
            'database'  => DB_NAME,
            'username'  => DB_USER,
            'password'  => DB_PASSWORD,
            'charset'   => 'utf8',
            'collation' => 'utf8_unicode_ci',
            'prefix'    => $wpdb->prefix,
        ]);

        $db->setAsGlobal();
        $db->bootEloquent();

        // Set the current path resolver for pagination
        Paginator::currentPathResolver(function () {
            return strtok($_SERVER['REQUEST_URI'], '?');
        });

        // Set the current page resolver for pagination
        Paginator::currentPageResolver(function ($pageName = 'page') {
            return (int) ($_GET[$pageName] ?? 1);
        });

        // Set the current page resolver for pagination
        LengthAwarePaginator::currentPathResolver(function () {
            return strtok($_SERVER['REQUEST_URI'], '?');
        });
        LengthAwarePaginator::currentPageResolver(function ($pageName = 'page') {
            return (int) ($_GET[$pageName] ?? 1);
        });

    }
}
