<?php

/**
 * Plugin Name:       Profile API
 * Plugin URI:        https://wordpressdevservice.com/
 * Description:       Handle the Profile API plugin.
 * Version:           1.0
 * Requires at least: 6.0
 * Requires PHP:      8.0
 * Author:            Ashraf Uddin
 * Author URI:        https://wordpressdevservice.com/
 * License:           GPL v2 or later
 * License URI:       https://www.gnu.org/licenses/gpl-2.0.html
 * Text Domain:       profile-api
 * Domain Path:       /languages
 */

namespace Profile_API;

// If this file is called directly, abort.
if ( !defined( 'ABSPATH' ) ) {
    die();
}

if ( file_exists( __DIR__ . '/vendor/autoload.php' ) ) {
    require_once __DIR__ . '/vendor/autoload.php';
}

use Dotenv\Dotenv;

if ( file_exists( __DIR__ . '/.env' ) ) {
    $dotenv = Dotenv::createImmutable( __DIR__ );
    $dotenv->load();
}

final class Profile_API {

    /**
     * Constructor.
     */
    public function __construct() {
        add_action( 'init', [$this, 'load_textdomain'] );
        add_action( 'wp_enqueue_scripts', [$this, 'frontend_scripts'] );
        add_action( 'plugins_loaded', [$this, 'autoload_classes'] );
        register_activation_hook( __FILE__, [$this, 'activate'] );
        register_deactivation_hook( __FILE__, [$this, 'deactivate'] );
        $this->define_constants();
    }

    /**
     * Load plugin textdomain for translations.
     */
    public function load_textdomain() {
        load_plugin_textdomain( 'profile-api', false, dirname( plugin_basename( __FILE__ ) ) . '/languages' );
    }

    /**
     * Enqueue scripts and styles for the admin area.
     */
    public function frontend_scripts() {
        // Enqueue the main React script
        wp_enqueue_script(
            'profile-api-frontend-script',
            SYNO_WP_REACT_PLUGIN_URL . 'build/frontend.bundle.js',
            ['wp-element'],
            time(),
            true
        );

        wp_localize_script( 'profile-api-frontend-script', 'pa_frontend', [
            'ajax_url' => admin_url( 'admin-ajax.php' ),
            'api_url'  => home_url( '/wp-json' ),
            'nonce'    => wp_create_nonce( 'profile_api' ),
            'domain'   => home_url(),
        ] );
    }

    /**
     * Define Constants
     */
    public function define_constants() {
        define( 'SYNO_WP_REACT_VERSION', '1.0' );
        define( 'SYNO_WP_REACT_DIR', __DIR__ );
        define( 'SYNO_WP_REACT_PLUGIN_DIR', plugin_dir_path( __FILE__ ) );
        define( 'SYNO_WP_REACT_PLUGIN_URL', plugin_dir_url( __FILE__ ) );
        define( 'SYNO_WP_REACT_ASSETS', SYNO_WP_REACT_PLUGIN_URL . 'assets/' );
        define( 'SYNO_WP_REACT_BUILD', SYNO_WP_REACT_PLUGIN_URL . 'build/' );
    }

    /**
     * Activate the plugin.
     */
    public function activate() {
        if ( !current_user_can( 'activate_plugins' ) ) {
            return;
        }
    }

    /**
     * Deactivate the plugin.
     */
    public function deactivate() {
        if ( !current_user_can( 'activate_plugins' ) ) {
            return;
        }
    }

    /**
     * Autoload Classes
     */
    public function autoload_classes() {
        // For frontend
        new \Profile_API\Shortcode();
        $person = new \Profile_API\API\Person();
        $person->reset_request_limit();
    }
}

new Profile_API();
