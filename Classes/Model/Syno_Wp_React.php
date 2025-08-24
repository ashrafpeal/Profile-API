<?php

namespace Syno_Wp_React\Model;

use Illuminate\Database\Eloquent\Model;

class Syno_Wp_React extends Model {
    protected $table = 'syno_wp_react';
    protected $primaryKey = 'id';
    protected $fillable = [
        'name',
        'email',
        'phone',
        'address',
    ];
}
