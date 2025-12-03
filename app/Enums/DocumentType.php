<?php

namespace App\Enums;

enum DocumentType: int
{
    case BIRTH = 0;
    case DEATH = 1;
    case MARRIAGE = 2;

    public function label(): string
    {
        return match ($this) {
            self::BIRTH => 'Certificate of Live Birth',
            self::DEATH => 'Certificate of Death',
            self::MARRIAGE => 'Certificate of Marriage',
        };
    }

    public function value(): int
    {
        return match ($this) {
            self::BIRTH => 0,
            self::DEATH => 1,
            self::MARRIAGE => 2,
        };
    }

    public function name(): string
    {
        return match ($this) {
            self::BIRTH => 'Birth Certificate',
            self::DEATH => 'Death Certificate',
            self::MARRIAGE => 'Marriage Certificate',
        };
    }
}
