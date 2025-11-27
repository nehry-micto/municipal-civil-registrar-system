<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class PetitionNotice extends Model
{
    use HasFactory;

    protected $fillable = [
        'petition_id',
        'notice_posting_date',
    ];
}
