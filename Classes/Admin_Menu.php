<?php

namespace Syno_WP_React;

class Admin_Menu {

    public function __construct() {
        add_action('admin_menu', [$this, 'add_admin_menu']);
    }

    public function add_admin_menu() {
        add_menu_page(
            'Syno WP React',
            'Syno WP React',
            'manage_options',
            'syno_wp_react',
            [$this, 'admin_page_content'],
            'dashicons-admin-generic',
            5
        );
    }

    public function admin_page_content() {
        echo '<div class="wrap">';
        echo '<h1>Syno WP React</h1>';
        echo do_shortcode("[syno_wp_react]");
        echo '</div>';
    }
}
// new \Syno_WP_React\Admin_Menu();    
