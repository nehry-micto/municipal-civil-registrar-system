<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Casts\Attribute;
use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Client extends Model
{
    use HasFactory;
    use HasUuids;
    use SoftDeletes;

    protected $fillable = [
        'client_code',
        'first_name',
        'last_name',
        'middle_name',
        'suffix',
        'contact_number',
    ];

    protected $appends = ['full_name'];

    protected static function boot()
    {
        parent::boot();

        static::creating(function ($client) {
            if (empty($client->client_code)) {
                $client->client_code = self::generateClientCode();
            }
        });
    }

    public function petitions()
    {
        return $this->hasMany(Petition::class);
    }


    protected function fullName(): Attribute
    {
        return Attribute::make(
            get: fn() => "{$this->first_name} {$this->middle_name} {$this->last_name} {$this->suffix}"
        );
    }

    public static function generateClientCode(): string
    {
        $year = now()->year;
        $latest = self::whereYear('created_at', $year)
            ->orderByDesc('created_at')
            ->first();

        $number = $latest ? (int) substr($latest->client_code, -4) + 1 : 1;

        return sprintf('MCR-%d-%04d', $year, $number);
    }
}
