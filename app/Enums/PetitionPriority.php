<?php

namespace App\Enums;

enum PetitionPriority: int
{
    case NORMAL = 0;
    case URGENT = 1;

    public function label(): string
    {
        return match ($this) {
            self::NORMAL => 'Normal',
            self::URGENT => 'Urgent',
        };
    }
}
