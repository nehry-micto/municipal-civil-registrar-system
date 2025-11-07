<?php

namespace App\Enums;

enum PetitionStatus: int
{
    case DRAFT = 0;
    case IN_PROGRESS = 1;
    case COMPLETED = 2;
    case CANCELLED = 3;
    case ON_HOLD = 4;
    case REJECTED = 5;

    public function label(): string
    {
        return match ($this) {
            self::DRAFT => 'Draft',
            self::IN_PROGRESS => 'In Progress',
            self::COMPLETED => 'Completed',
            self::CANCELLED => 'Cancelled',
            self::ON_HOLD => 'On Hold',
            self::REJECTED => 'Rejected',
        };
    }
}
