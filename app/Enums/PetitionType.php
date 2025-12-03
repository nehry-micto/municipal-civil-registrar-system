<?php

namespace App\Enums;

enum PetitionType: int
{
    case CORRECTION = 0;
    case CHANGE_OF_FIRST_NAME = 1;

    public function label(): string
    {
        return match ($this) {
            self::CORRECTION => 'Correction of clerical error',
            self::CHANGE_OF_FIRST_NAME => 'Change of first name',
        };
    }

    public function description(): string
    {
        return match ($this) {
            self::CORRECTION => 'Petition for correction of clerical error in civil registry documents',
            self::CHANGE_OF_FIRST_NAME => 'Petition for change of first name in civil registry documents',
        };
    }

    public function name(): string
    {
        return match ($this) {
            self::CORRECTION => 'Correction',
            self::CHANGE_OF_FIRST_NAME => 'Change of First Name',
        };
    }
}
