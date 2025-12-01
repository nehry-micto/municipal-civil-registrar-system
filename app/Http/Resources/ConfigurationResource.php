<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class ConfigurationResource extends JsonResource
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
            'version' => $this->version,
            'data' => [
                'civil_registry_head' => [
                    'name' => $this->data['civil_registry_head']['name'] ?? '',
                    'position' => $this->data['civil_registry_head']['position'] ?? 'Civil Registry Head',
                ],
                'mayor' => [
                    'name' => $this->data['mayor']['name'] ?? '',
                    'position' => $this->data['mayor']['position'] ?? 'Mayor',
                ],
                'municipality' => $this->data['municipality'] ?? '',
                'province' => $this->data['province'] ?? '',
            ],
            'created_at' => $this->created_at?->toISOString(),
            'updated_at' => $this->updated_at?->toISOString(),
        ];
    }
}
