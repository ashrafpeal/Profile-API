<?php

namespace Profile_API\API;

class Phone {
    public function __construct() {
        add_action( 'rest_api_init', [$this, 'register_routes'] );
    }

    public function register_routes() {

        register_rest_route( 'profile-api/v1', '/phone/linkedin', [
            'methods' => 'POST',
            'callback' => [$this, 'get_phone_number_by_linkedin'],
            'permission_callback' => '__return_true',
        ]);

        register_rest_route( 'profile-api/v1', '/phone/id', [
            'methods'             => 'POST',
            'callback'            => [$this, 'get_phone_number_by_id'],
            'permission_callback' => '__return_true',
        ] );
    }

    public function get_phone_number_by_linkedin($request) {
        $linkedinUrl = $request->get_param('linkedInUrl');
        $api_key = $_ENV['API_KEY'] ?? '';
        if ( empty( $linkedinUrl ) || empty( $api_key ) ) {
            return new \WP_Error( 'missing_data', 'ID or API key missing', ['status' => 400] );
        }

        $url = 'https://api.profileapi.com/2024-03-01/phone-contacts/lookup';

        $body = [
            'linkedInUrl' => $linkedinUrl,
        ];

        $response = wp_remote_post( $url, [
            'headers' => [
                'Authorization' => 'ApiKey ' . $api_key,
                'Content-Type'  => 'application/json',
                'Accept'        => 'application/json',
            ],
            'body'    => wp_json_encode( $body ),
            'timeout' => 5,
        ] );

        if ( is_wp_error( $response ) ) {
            return new \WP_Error( 'request_failed', $response->get_error_message(), ['status' => 500] );
        }

        return rest_ensure_response( json_decode( wp_remote_retrieve_body( $response ), true ) );
    }


    /**
     * @param $request
     */
    public function get_phone_number_by_id( $request ) {
        $id      = $request->get_param( 'id' );
        $api_key = $_ENV['API_KEY'] ?? '';
        if ( empty( $id ) || empty( $api_key ) ) {
            return new \WP_Error( 'missing_data', "ID $id or API key missing", ['status' => 400] );
        }

        $url = 'https://api.profileapi.com/2024-03-01/phone-contacts/lookup';

        $body = [
            'id' => $id,
        ];

        $response = wp_remote_post( $url, [
            'headers' => [
                'Authorization' => 'ApiKey ' . $api_key,
                'Content-Type'  => 'application/json',
                'Accept'        => 'application/json',
            ],
            'body'    => wp_json_encode( $body ),
            'timeout' => 5,
        ] );

        if ( is_wp_error( $response ) ) {
            return new \WP_Error( 'request_failed', $response->get_error_message(), ['status' => 500] );
        }

        return rest_ensure_response( json_decode( wp_remote_retrieve_body( $response ), true ) );
    }
    
}
