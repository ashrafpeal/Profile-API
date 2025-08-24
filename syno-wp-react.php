<?php

/**
 * Plugin Name:       Syno WP React
 * Plugin URI:        https://wordpressdevservice.com/
 * Description:       Handle the Syno WP React plugin.
 * Version:           1.0
 * Requires at least: 6.0
 * Requires PHP:      8.0
 * Author:            Ashraf Uddin
 * Author URI:        https://wordpressdevservice.com/
 * License:           GPL v2 or later
 * License URI:       https://www.gnu.org/licenses/gpl-2.0.html
 * Text Domain:       syno-wp-react
 * Domain Path:       /languages
 */

namespace Syno_WP_React;

// If this file is called directly, abort.
if (! defined('ABSPATH')) {
    die();
}

if (file_exists(__DIR__ . '/vendor/autoload.php')) {
    require_once __DIR__ . '/vendor/autoload.php';
}

use Illuminate\Database\Capsule\Manager as Capsule;

final class Syno_WP_React {

    /**
     * Constructor.
     */
    public function __construct() {
        add_action('init', [$this, 'load_textdomain']);
        add_action('wp_enqueue_scripts', [$this, 'frontend_scripts']);
        add_action('admin_enqueue_scripts', [$this, 'admin_scripts']);
        add_action('plugins_loaded', [$this, 'autoload_classes']);
        register_activation_hook(__FILE__, [$this, 'activate']);
        register_deactivation_hook(__FILE__, [$this, 'deactivate']);
        $this->define_constants();
    }

    /**
     * Load plugin textdomain for translations.
     */
    public function load_textdomain() {
        load_plugin_textdomain('syno-wp-react', false, dirname(plugin_basename(__FILE__)) . '/languages');
    }

    /**
     * Enqueue scripts and styles for the admin area.
     */
    public function frontend_scripts() {
        // Enqueue the main React script
        wp_enqueue_script(
            'syno-wp-react-frontend-script',
            SYNO_WP_REACT_PLUGIN_URL . 'build/frontend.bundle.js',
            ['wp-element'],
            time(),
            true
        );

        wp_localize_script('syno-wp-react-frontend-script','swr_frontend', [
            'ajax_url' => admin_url('admin-ajax.php'),
            'api_url' => home_url('/wp-json'),
            'nonce'    => wp_create_nonce('syno_wp_react_nonce'),
        ]);
    }

    /**
     * Enqueue scripts and styles for the admin area.
     */
    public function admin_scripts() {
        // Enqueue the main React script
        wp_enqueue_script(
            'syno-wp-react-admin-script',
            SYNO_WP_REACT_PLUGIN_URL . 'build/admin.bundle.js',
            ['wp-element'],
            time(),
            true
        );

        wp_localize_script('syno-wp-react-admin-script', 'swr_admin', [

            'ajax_url' => admin_url('admin-ajax.php'),
            'api_url' => home_url('/wp-json'),
            'nonce'    => wp_create_nonce('syno_wp_react_nonce'),
        ]);
    }

    /**
     * Define Constants
     */
    public function define_constants() {
        define('SYNO_WP_REACT_VERSION', '1.0');
        define('SYNO_WP_REACT_DIR', __DIR__);
        define('SYNO_WP_REACT_PLUGIN_DIR', plugin_dir_path(__FILE__));
        define('SYNO_WP_REACT_PLUGIN_URL', plugin_dir_url(__FILE__));
        define('SYNO_WP_REACT_ASSETS', SYNO_WP_REACT_PLUGIN_URL . 'assets/');
        define('SYNO_WP_REACT_BUILD', SYNO_WP_REACT_PLUGIN_URL . 'build/');
    }


    /**
     * Activate the plugin.
     */
    public function activate() {
        if (! current_user_can('activate_plugins')) {
            return;
        }
        // Initialize DB connection manually for activation
        $db = new \Syno_WP_React\DB();
        $db->connect_db(); // ensures Capsule is ready
        $table = 'syno_wp_react';
        if (!Capsule::schema()->hasTable($table)) {
            Capsule::schema()->create($table, function ($table) {
                $table->id();
                $table->string('name');
                $table->string('email');
                $table->string('phone');
                $table->string('address');
                $table->timestamps();
            });
        }
    }

    /**
     * Deactivate the plugin.
     */
    public function deactivate() {
        if (! current_user_can('activate_plugins')) {
            return;
        }
        // Initialize DB connection manually for activation
        $db = new \Syno_WP_React\DB();
        $db->connect_db(); // ensures Capsule is ready
        $table = 'syno_wp_react';
        if (Capsule::schema()->hasTable($table)) {
            Capsule::schema()->dropIfExists($table);
        }
    }

    /**
     * Autoload Classes
     */
    public function autoload_classes() {
        // Admin Menu
        if (is_admin()) {
            new \Syno_WP_React\Admin_Menu();
        }
        // For frontend
        new \Syno_WP_React\Shortcode();
        // DB Connection
        new \Syno_WP_React\DB();

        // Model
        new \Syno_WP_React\Model\Syno_Wp_React();

        // REST API Routes
        new \Syno_WP_React\API\Syno_Wp_React_Rest_Route();
    }
}

new Syno_WP_React();
