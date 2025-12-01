<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Configuration extends Model
{
    protected $fillable = [
        'version',
        'data',
    ];

    protected function casts(): array
    {
        return [
            'data' => 'array',
        ];
    }

    /**
     * Get the latest configuration version
     */
    public static function getLatest(): ?Configuration
    {
        return static::orderBy('version', 'desc')->first();
    }

    /**
     * Get the next version number
     */
    public static function getNextVersion(): int
    {
        $latest = static::getLatest();
        return $latest ? $latest->version + 1 : 1;
    }
}
