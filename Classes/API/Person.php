<?php

namespace Profile_API\API;

class Person {

    /**
     * @var int
     */
    private $limit = 3; // max requests allowed per IP

    public function __construct() {
        add_action( 'rest_api_init', [$this, 'register_routes'] );
    }

    public function register_routes() {

        register_rest_route( 'profile-api/v1', '/person/email', [
            'methods'             => 'POST',
            'callback'            => [$this, 'enrich_person_email'],
            'permission_callback' => '__return_true',
        ] );

        register_rest_route( 'profile-api/v1', '/person/linkedin', [
            'methods'             => 'POST',
            'callback'            => [$this, 'enrich_person_linkedin'],
            'permission_callback' => '__return_true',
        ] );

        register_rest_route( 'profile-api/v1', '/person/id', [
            'methods'             => 'POST',
            'callback'            => [$this, 'enrich_person_id'],
            'permission_callback' => '__return_true',
        ] );

        register_rest_route( 'profile-api/v1', '/person/phone', [
            'methods'             => 'POST',
            'callback'            => [$this, 'enrich_person_phone'],
            'permission_callback' => '__return_true',
        ] );

        register_rest_route( 'profile-api/v1', '/person/getEmail', [
            'methods'             => 'POST',
            'callback'            => [$this, 'enrich_person_getEmail'],
            'permission_callback' => '__return_true',
        ] );
    }

    /**
     * Check request limit by IP (only check, no increment)
     */
    private function check_request_limit() {
        $ip  = $_SERVER['REMOTE_ADDR'] ?? 'unknown';
        $key = "profileapi_ip_" . $ip;

        $count = (int)get_transient( $key );

        if ( $count >= $this->limit ) {
            return new \WP_Error(
                'too_many_requests',
                "❌ You have reached the maximum of $this->limit searches allowed.",

                [
                    'status'  => 429,
                    'message' => "❌ You have reached the maximum of $this->limit searches allowed. Please try again after 1 year.",
                    'url'     => home_url() . "/free-trial/",
                ]
            );
        }

        return true; // শুধু চেক করবে, কাউন্ট বাড়াবে না
    }

    /**
     * Increment request count only after success
     */
    private function increment_request_count() {
        $ip  = $_SERVER['REMOTE_ADDR'] ?? 'unknown';
        $key = "profileapi_ip_" . $ip;

        $count = (int)get_transient( $key );
        set_transient( $key, $count + 1, YEAR_IN_SECONDS );
    }

    /**
     * Reset request limit for current IP
     */
    public function reset_request_limit( $ip = null ) {
        $ip  = $ip ?? ( $_SERVER['REMOTE_ADDR'] ?? 'unknown' );
        $key = "profileapi_ip_" . $ip;
        delete_transient( $key );
        return true;
    }

    /**
     * The function `enrich_person_email` enriches a person's email by making a reverse lookup API call
     * and returns the fetched data along with success or error messages.
     *
     * @param request The `enrich_person_email` function you provided seems to be enriching a person's
     * email by making a request to an external API for reverse email lookup. Let's break down the
     * function and its parameters:
     *
     * @return The function `enrich_person_email` returns a response based on the email provided in the
     * request. Here are the possible return scenarios:
     */

    public function enrich_person_email( $request ) {
        $limit_check = $this->check_request_limit();
        if ( is_wp_error( $limit_check ) ) {
            return rest_ensure_response( [
                'success' => false,
                'message' => $limit_check->get_error_message(),
                'status'  => 429,
            ] );
        }

        $email = $request->get_param( 'email' ) ?? '';
        $email = sanitize_email( $email );

        if ( !is_email( $email ) ) {
            return rest_ensure_response( [
                'success' => false,
                'message' => 'Invalid email address',
                'status'  => 400,
            ] );
        }

        $api_key = $_ENV['API_KEY'] ?? '';

        if ( empty( $email ) || empty( $api_key ) ) {
            return rest_ensure_response( [
                'success' => false,
                'message' => 'Email or API key missing',
                'status'  => 400,
            ] );
        }

        $url = 'https://api.profileapi.com/2024-03-01/email-contacts/reverse-lookup';

        $body = [
            'email' => $email,
        ];

        $response = wp_remote_post( $url, [
            'headers' => [
                'Authorization' => 'ApiKey ' . $api_key,
                'Content-Type'  => 'application/json',
                'Accept'        => 'application/json',
            ],
            'body'    => wp_json_encode( $body ),
            'timeout' => 30,
        ] );

        if ( is_wp_error( $response ) ) {
            return rest_ensure_response( [
                'success' => false,
                'message' => $response->get_error_message(),
                'status'  => 500,
            ] );
        }

        $data = json_decode( wp_remote_retrieve_body( $response ), true );

        $statusCode = $data['meta']['statusCode'] ?? null;

        // Only fail if meta.statusCode == 404
        if ( (int)$statusCode === 404 ) {
            return rest_ensure_response( [
                'success' => false,
                'status'  => $statusCode,
                'message' => 'Email not found',
                'data'    => $data,
            ] );
        }

        $this->increment_request_count();

        return rest_ensure_response( [
            'success' => true,
            'message' => '✅ Data fetched successfully',
            'data'    => $data,
            'status'  => $statusCode,
        ] );
    }

    /**
     * The function `enrich_person_linkedin` enriches person data using LinkedIn URLs and returns the
     * results with appropriate status and messages.
     *
     * @param request The `enrich_person_linkedin` function takes a `` parameter which is
     * expected to be an object containing the data needed to enrich a person's LinkedIn profile. This
     * data includes the LinkedIn URLs of the person to be enriched.
     *
     * @return The function `enrich_person_linkedin` returns a response based on the processing of a
     * request to enrich person data from LinkedIn.
     */
    public function enrich_person_linkedin( $request ) {
        $limit_check = $this->check_request_limit();
        if ( is_wp_error( $limit_check ) ) {
            return rest_ensure_response( [
                'success' => false,
                'message' => $limit_check->get_error_message(),
                'status'  => 429,
            ] );
        }

        $linkedInUrls = (array)( $request->get_json_params()['linkedInUrls'] ?? [] );
        $api_key      = $_ENV['API_KEY'] ?? '';
        if ( empty( $linkedInUrls ) || empty( $api_key ) ) {
            return rest_ensure_response( [
                'success' => false,
                'message' => 'ID or API key missing',
                'status'  => 400,
            ] );
        }

        $url  = 'https://api.profileapi.com/2024-03-01/persons/enrich';
        $body = [
            'linkedInUrls'   => $linkedInUrls,
            'fieldsToReturn' => 'basic',
            'latestOnly'     => false,
        ];

        $response = wp_remote_post( $url, [
            'headers' => [
                'Authorization' => 'ApiKey ' . $api_key,
                'Content-Type'  => 'application/json',
                'Accept'        => 'application/json',
            ],
            'body'    => wp_json_encode( $body ),
            'timeout' => 30,
        ] );

        if ( is_wp_error( $response ) ) {
            return rest_ensure_response( [
                'success' => false,
                'message' => $response->get_error_message(),
                'status'  => 500,
            ] );
        }

        // Decode as associative array
        $data = json_decode( wp_remote_retrieve_body( $response ), true );

        // Actual API status
        $statusCode = (int)( $data['meta']['statusCode'] ?? 0 );

        // Handle not found
        if ( $statusCode === 404 ) {
            return rest_ensure_response( [
                'success' => false,
                'status'  => $statusCode,
                'message' => $data['meta']['message'] ?? 'Person not found',
                'data'    => $data,
            ] );
        }

        // Success — increment request count
        $this->increment_request_count();

        return rest_ensure_response( [
            'success' => true,
            'status'  => $statusCode,
            'message' => '✅ Person Found successfully',
            'results' => $data,
        ] );
    }

    /**
     * The function enriches a person's ID by making a request to an external API and returns the
     * enriched data.
     *
     * @param request The `enrich_person_id` function takes a request object as a parameter. This
     * request object is expected to have JSON parameters containing an array of IDs under the key
     * 'ids'.
     *
     * @return This function returns a response based on the outcome of the API request to enrich
     * person IDs. If the ID or API key is missing, it returns a response indicating the missing
     * parameter with a status code of 400. If there is an error during the API request, it returns a
     * response with the error message and a status code of 500. If the request is successful, it
     * returns a response with
     */
    public function enrich_person_id( $request ) {
        $id      = (array)( $request->get_json_params()['ids'] ?? [] );
        $api_key = $_ENV['API_KEY'] ?? '';
        if ( empty( $id ) || empty( $api_key ) ) {
            return rest_ensure_response( [
                'success' => false,
                'message' => 'ID or API key missing',
                'status'  => 400,
            ] );
        }

        $url = 'https://api.profileapi.com/2024-03-01/persons/enrich';

        $body = [
            'ids'            => $id,
            'fieldsToReturn' => 'basic',
            'latestOnly'     => false,
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
            return rest_ensure_response( [
                'success' => false,
                'message' => $response->get_error_message(),
                'status'  => 500,
            ] );
        }

        $this->increment_request_count();

        return rest_ensure_response( [
            'success' => true,
            'message' => '✅ Data fetched successfully',
            'data'    => json_decode( wp_remote_retrieve_body( $response ), true ),
        ] );
    }

    /**
     * The function `enrich_person_phone` enriches a person's phone contact information using a
     * LinkedIn URL and an API key by making a POST request to an external API.
     *
     * @param request The `enrich_person_phone` function takes a `` parameter which is expected
     * to be an instance of the `WP_REST_Request` class. This parameter is used to retrieve the
     * LinkedIn URL from the request parameters.
     *
     * @return The function `enrich_person_phone` returns either a WP_Error object with a message
     * indicating missing data (ID or API key missing) and a status code of 400 if either the LinkedIn
     * URL or API key is empty, or it returns the response from the API call to
     * 'https://api.profileapi.com/2024-03-01/phone-contacts/lookup' enriched with phone contacts
     */
    public function enrich_person_phone( $request ) {
        $id      = $request->get_param( 'id' );
        $api_key = $_ENV['API_KEY'] ?? '';
        if ( empty( $id ) || empty( $api_key ) ) {
            return new \WP_Error( 'missing_data', 'ID or API key missing', ['status' => 400] );
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
            'timeout' => 30,
        ] );

        if ( is_wp_error( $response ) ) {
            return new \WP_Error( 'request_failed', $response->get_error_message(), ['status' => 500] );
        }

        return rest_ensure_response( json_decode( wp_remote_retrieve_body( $response ), true ) );
    }

    /**
     * The function `enrich_person_getEmail` enriches a person's email address using a person ID and
     * an API key by making a POST request to an external API.
     *
     * @param request The `enrich_person_getEmail` function takes a `WP_REST_Request` object as a
     * parameter. This object is expected to have a parameter named 'id' which contains the person ID
     * for which the email needs to be enriched.
     *
     * @return The function `enrich_person_getEmail` returns either a WP_Error object with a message
     * indicating missing data (ID or API key missing) and a status code of 400 if either the person
     * ID or API key is empty, or it returns the response from the API call to
     * 'https://api.profileapi.com/2024-03-01/email-contacts/lookup' enriched with the person's email
     */
    public function enrich_person_getEmail( $request ) {
        $id      = $request->get_param( 'id' );
        $api_key = $_ENV['API_KEY'] ?? '';
        if ( empty( $id ) || empty( $api_key ) ) {
            return new \WP_Error( 'missing_data', 'ID or API key missing', ['status' => 400] );
        }

        $url = 'https://api.profileapi.com/2024-03-01/email-contacts/lookup';
        
        $body = [
            'id' => $id,
            'type' => 'professional'
        ];

        $response = wp_remote_post( $url, [
            'headers' => [
                'Authorization' => 'ApiKey ' . $api_key,
                'Content-Type'  => 'application/json',
                'Accept'        => 'application/json',
            ],
            'body'    => wp_json_encode( $body ),
            'timeout' => 30,
        ] );

        if ( is_wp_error( $response ) ) {
            return new \WP_Error( 'request_failed', $response->get_error_message(), ['status' => 500] );
        }

        return rest_ensure_response( json_decode( wp_remote_retrieve_body( $response ), true ) );
    }

}
