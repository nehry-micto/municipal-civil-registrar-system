<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class PetitionFinality extends Model
{
    use HasFactory;

    protected $fillable = [
        'petition_id',
        'certificate_number',
        'released_at',
        'notes',
    ];

    public function petition()
    {
        return $this->belongsTo(Petition::class);
    }

}
