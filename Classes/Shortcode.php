<?php

namespace Profile_API;


class Shortcode {
    public function __construct() {
        add_shortcode('profile_api_shortcode', [$this, 'render_shortcode']);
    }

    public function render_shortcode($atts, $content = null) {
        extract(shortcode_atts([
            'title' => '',
            'description' => '',
        ], $atts));
        
        ob_start(); ?>
        <h1><?php echo esc_html($title); ?></h1>
        <p><?php echo esc_html($description); ?></p>
        <div id="profile-api-frontend"></div>
        <?php return ob_get_clean();
    }

}