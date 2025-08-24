<?php

namespace Syno_Wp_React\API;

use Syno_Wp_React\Model\Syno_Wp_React;

class Syno_Wp_React_Rest_Route {
    /**
     * @return void
     */
    public function __construct() {
        add_action('rest_api_init', [$this, 'register_routes']);
    }
    /**
     * @return void
     */
    public function register_routes(): void {

        register_rest_route('swr/v1', '/data', [
            'methods' => 'GET',
            'callback' => [$this, 'get_data'],
            'permission_callback' => '__return_true',
        ]);
        register_rest_route('swr/v1', '/data', [
            'methods'  => 'POST',
            'callback' => [$this, 'add_data'],
            'permission_callback' => '__return_true', // বা custom capability
        ]);
        register_rest_route('swr/v1', '/data/(?P<id>\d+)', [
            'methods' => 'GET',
            'callback' => [$this, 'edit_data'],
            'permission_callback' => '__return_true',
        ]);
        register_rest_route('swr/v1', '/data/(?P<id>\d+)', [
            'methods' => 'PUT',
            'callback' => [$this, 'update_data'],
            'permission_callback' => '__return_true',
        ]);
        register_rest_route('swr/v1', '/data/(?P<id>\d+)', [
            'methods' => 'DELETE',
            'callback' => [$this, 'delete_data'],
            'permission_callback' => '__return_true',
        ]);
    }

    /**
     * @param \WP_REST_Request $request 
     * 
     * @return \WP_REST_Response
     */
    public function add_data(\WP_REST_Request $request): \WP_REST_Response {
        $data = $request->get_json_params() ?? [];

        if (empty($data['name']) || empty($data['email']) || empty($data['phone']) || empty($data['address'])) {
            return rest_ensure_response(['success' => false, 'message' => 'Name, email, phone, and address are required'], 400);
        }


        $submission = Syno_Wp_React::create([
            'name'    => sanitize_text_field($data['name'] ?? ''),
            'email'   => sanitize_email($data['email'] ?? ''),
            'phone'   => sanitize_text_field($data['phone'] ?? ''),
            'address' => sanitize_text_field($data['address'] ?? ''),
        ]);

        if ($submission) {
            return rest_ensure_response(['success' => true, 'data' => $submission], 201);
        } else {
            return rest_ensure_response(['success' => false, 'message' => 'Failed to save submission'], 500);
        }
    }

    /**
     * @param \WP_REST_Request $request
     * 
     * @return \WP_REST_Response
     */
    public function edit_data(\WP_REST_Request $request): \WP_REST_Response {
        $id = (int) $request['id'];
        $data = Syno_Wp_React::find($id);
        if (!$data) {
            return rest_ensure_response(['message' => 'Data not found'], 404);
        }
        return rest_ensure_response($data);
    }

    public function update_data(\WP_REST_Request $request): \WP_REST_Response {
        $id = (int) $request['id'];
        $data = Syno_Wp_React::find($id);
        if (!$data) {
            return rest_ensure_response(['message' => 'Data not found'], 404);
        }
        if (empty($request['name']) || empty($request['email']) || empty($request['phone']) || empty($request['address'])) {
            return rest_ensure_response(['message' => 'Name, email, phone, and address are required'], 400);
        }

        $updated = $data->update([
            'name'    => sanitize_text_field($request['name'] ?? ''),
            'email'   => sanitize_email($request['email'] ?? ''),
            'phone'   => sanitize_text_field($request['phone'] ?? ''),
            'address' => sanitize_text_field($request['address'] ?? ''),
        ]);

        if ($updated) {
            return rest_ensure_response(['message' => 'Data updated successfully'], 200);
        } else {
            return rest_ensure_response(['message' => 'Failed to update data'], 500);
        }
    }

    /**
     * @param \WP_REST_Request $request
     * 
     * @return \WP_REST_Response
     */
    public function delete_data(\WP_REST_Request $request): \WP_REST_Response {
        $id = (int) $request['id'];
        $data = Syno_Wp_React::find($id);
        if (!$data) {
            return rest_ensure_response(['message' => 'Data not found'], 404);
        }
        $data->delete();
        return rest_ensure_response(['message' => 'Data deleted'], 200);
    }

    /**
     * @param \WP_REST_Request $request
     * 
     * @return \WP_REST_Response
     */
    public function get_data(\WP_REST_Request $request): \WP_REST_Response {
        $page = max(1, (int) $request->get_param('page'));
        $perPage = 10; // items per page
        $searchTerm = sanitize_text_field($request->get_param('search'));
        
        // Base query
        $query = Syno_Wp_React::query();

        // Apply search using whereAny
        if (!empty($searchTerm)) {
            $query->whereAny(['name', 'email', 'phone', 'address'], 'like', '%' . $searchTerm . '%');
        }

        $total = $query->count();

        $data = $query->skip(($page - 1) * $perPage)
            ->take($perPage)
            ->get();

        return rest_ensure_response([
            'data' => $data,
            'current_page' => $page,
            'last_page' => ceil($total / $perPage),
            'total' => $total,
        ]);
    }

}
