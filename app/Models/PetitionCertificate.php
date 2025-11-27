<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class PetitionCertificate extends Model
{
    /** @use HasFactory<\Database\Factories\PetitionCertificateFactory> */
    use HasFactory;

    protected $fillable = [
        'petition_id',
        'start_date',
        'end_date',
    ];

    public function petition()
    {
        return $this->belongsTo(Petition::class);
    }

    public function scopePublished($query)
    {
        return $query->where('end_date', '>=', now());
    }

    public function scopeExpired($query)
    {
        return $query->where('end_date', '<', now());
    }
}
