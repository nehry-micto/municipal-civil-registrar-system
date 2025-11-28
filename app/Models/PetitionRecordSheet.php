<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class PetitionRecordSheet extends Model
{
    use HasFactory;

    protected $fillable = [
        'petition_id',
        'first_published_at',
        'second_published_at',
        'rendered_date',
        'remarks',
        'decision',
    ];

    protected function casts(): array
    {
        return [
            'first_published_at' => 'date',
            'second_published_at' => 'date',
            'rendered_date' => 'date',
        ];
    }
}
