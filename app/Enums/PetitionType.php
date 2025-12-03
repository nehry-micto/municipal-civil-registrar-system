<?php

namespace App\Enums;

enum PetitionType: int
{
    case CORRECTION = 0;

    public function label(): string
    {
        return match ($this) {
            self::CORRECTION => 'Correction of clerical error',
        };
    }

    public function description(): string
    {
        return match ($this) {
            self::CORRECTION => 'Petition for correction of clerical error in civil registry documents',
        };
    }

    public function name(): string
    {
        return match ($this) {
            self::CORRECTION => 'Correction',
        };
    }
}
