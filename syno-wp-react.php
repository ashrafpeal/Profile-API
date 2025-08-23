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

final class Syno_WP_React {

    /**
     * Constructor.
     */
    public function __construct() {
        add_action('init', [$this, 'load_textdomain']);
        add_action('wp_enqueue_scripts', [$this, 'frontend_scripts']);
        add_action('admin_enqueue_scripts', [$this, 'admin_scripts']);
        $this->define_constants();
        $this->autoload_classes();
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
            SYNO_WP_REACT_PLUGIN_URL . 'build/index.bundle.js',
            ['wp-element'],
            time(),
            true
        );

        wp_localize_script('syno-wp-react-frontend-script', 'syno_wp_react_frontend', [
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

        wp_localize_script('syno-wp-react-admin-script', 'syno_wp_react_admin', [

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
        // Activation code here
    }

    /**
     * Deactivate the plugin.
     */
    public function deactivate() {
        // Deactivation code here
    }

    /**
     * Autoload Classes
     */
    public function autoload_classes() {
        spl_autoload_register(function ($class) {
            $prefix = 'Syno_WP_React\\';
            $base_dir = SYNO_WP_REACT_DIR . '/Classes/';
            $len = strlen($prefix);
            if (strncmp($prefix, $class, $len) !== 0) {
                return;
            }
            $relative_class = substr($class, $len);
            $file = $base_dir . str_replace('\\', '/', $relative_class) . '.php';

            if (file_exists($file)) {
                require $file;
            }
        });

        // Admin Menu
        if (is_admin()) {
            new \Syno_WP_React\Admin_Menu();
        }

        // For frontend
        new \Syno_WP_React\Shortcode();
    }
}

new Syno_WP_React();
