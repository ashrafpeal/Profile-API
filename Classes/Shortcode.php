<?php

namespace Syno_WP_React;


class Shortcode {
    public function __construct() {
        add_shortcode('syno_wp_react', [$this, 'render_shortcode']);
    }

    public function render_shortcode($atts, $content = null) {
        extract(shortcode_atts([
            'title' => 'Default Title',
            'description' => 'Default Description',
        ], $atts));
        
        ob_start(); ?>
        <h1><?php echo esc_html($title); ?></h1>
        <div id="syno-wp-react-frontend"></div>

        <?php return ob_get_clean();
    }
}