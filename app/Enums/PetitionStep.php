<?php

namespace App\Enums;

enum PetitionStep: int
{
    case ENCODING = 0;
    case NOTICE = 1;
    case CERT_POSTING = 2;
    case RECORD_SHEET = 3;
    case FINALITY = 4;

    public function label(): string
    {
        return match ($this) {
            self::ENCODING => 'Encoding',
            self::NOTICE => 'Notice of Posting',
            self::CERT_POSTING => 'Certificate of Posting',
            self::RECORD_SHEET => 'Record Sheet',
            self::FINALITY => 'Certificate of Finality',
        };
    }

    public function description(): string
    {
        return match ($this) {
            self::ENCODING => 'Enter petition details and document information',
            self::NOTICE => 'Record the notice posting date',
            self::CERT_POSTING => 'Set certificate posting period (10 days)',
            self::RECORD_SHEET => 'Record publication dates and decision',
            self::FINALITY => 'Issue certificate of finality',
        };
    }

    public function next(): ?self
    {
        return match ($this) {
            self::ENCODING => self::NOTICE,
            self::NOTICE => self::CERT_POSTING,
            self::CERT_POSTING => self::RECORD_SHEET,
            self::RECORD_SHEET => self::FINALITY,
            self::FINALITY => null,
        };
    }

    public function previous(): ?self
    {
        return match ($this) {
            self::ENCODING => null,
            self::NOTICE => self::ENCODING,
            self::CERT_POSTING => self::NOTICE,
            self::RECORD_SHEET => self::CERT_POSTING,
            self::FINALITY => self::RECORD_SHEET,
        };
    }

    public function canAdvanceTo(self $target): bool
    {
        return $target->value === $this->value + 1;
    }
}
