<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class PetitionResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'petition_number' => $this->petition_number,
            'registry_number' => $this->registry_number,
            'date_of_filing' => $this->date_of_filing->format('M d, Y'),
            'document_type' => $this->document_type->label(),
            'document_owner' => $this->document_owner,
            'petition_type' => $this->petition_type->label(),
            'petition_nature' => $this->petition_nature,
            'errors_to_correct' => $this->errors_to_correct,
            'priority' => $this->priority,
            'next_step' => $this->current_step?->next()?->label(),
            'next_step_id' => $this->current_step?->next()?->value,
            'created_at' => $this->created_at->format('M d, Y h:i A'),
            'updated_at' => $this->updated_at->format('M d, Y h:i A'),
        ];
    }
}
