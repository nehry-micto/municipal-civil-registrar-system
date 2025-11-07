<?php

namespace App\Models;

use App\Enums\DocumentType;
use App\Enums\PetitionPriority;
use App\Enums\PetitionStatus;
use App\Enums\PetitionStep;
use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\SoftDeletes;

class Petition extends Model
{

    use HasFactory;
    use HasUuids;
    use SoftDeletes;

    protected $fillable = [
        'petition_number',
        'registry_number',
        'date_of_filing',
        'document_type',
        'petition_nature',
        'document_owner',
        'errors_to_correct',
        'current_step',
        'status',
        'priority',
        'client_id',
        'completed_at',
    ];

    protected function casts(): array
    {
        return [
            'errors_to_correct' => 'array',
            'date_of_filing' => 'datetime',
            'completed_at' => 'datetime',
            'created_at' => 'datetime',
            'updated_at' => 'datetime',
            'document_type' => DocumentType::class,
            'current_step' => PetitionStep::class,
            'status' => PetitionStatus::class,
            'priority' => PetitionPriority::class,
        ];
    }

    public function client(): BelongsTo
    {
        return $this->belongsTo(Client::class);
    }
}
