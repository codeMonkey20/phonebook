<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class PhoneDirectory extends Model
{
    use HasFactory;

    protected static $rules = [
        'name' => 'required|string',
        'phone_number' => 'required|string|unique',
    ];

    protected $fillable = [
        'name',
        'phone_number',
    ];

}
