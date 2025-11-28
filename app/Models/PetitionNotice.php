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

    public function casts() : array {
        return [
            'notice_posting_date' => 'date',
        ];
    }
    
    public function petition()
    {
        return $this->belongsTo(Petition::class);
    }


}
