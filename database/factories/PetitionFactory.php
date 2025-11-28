<?php

namespace Database\Factories;

use App\Enums\DocumentType;
use App\Enums\PetitionPriority;
use App\Enums\PetitionStatus;
use App\Enums\PetitionStep;
use App\Enums\PetitionType;
use App\Models\Client;
use App\Models\Petition;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Petition>
 */
class PetitionFactory extends Factory
{
    protected $model = Petition::class;

    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $documentType = fake()->randomElement(DocumentType::cases());
        $petitionType = fake()->randomElement(PetitionType::cases());

        return [
            'client_id' => Client::factory(),
            'petition_number' => 'PET-' . fake()->unique()->numerify('####-####'),
            'registry_number' => 'REG-' . fake()->unique()->numerify('####-####'),
            'date_of_filing' => fake()->dateTimeBetween('-6 months', 'now'),
            'document_type' => $documentType,
            'petition_type' => $petitionType,
            'petition_nature' => $this->getPetitionNature($petitionType),
            'document_owner' => fake()->name(),
            'errors_to_correct' => [
                [
                    'item_number' => 1,
                    'description' => 'First Name',
                    'current_value' => fake()->firstNameMale(),
                    'correct_value' => fake()->firstNameFemale(),
                ]
            ],
            'current_step' => PetitionStep::ENCODING,
            'status' => PetitionStatus::IN_PROGRESS,
            'priority' => fake()->randomElement(PetitionPriority::cases()),
            'completed_at' => null,
        ];
    }

    /**
     * Get petition nature based on petition type
     */
    private function getPetitionNature(PetitionType $type): string
    {
        return match ($type) {
            PetitionType::CORRECTION => fake()->randomElement([
                'Correction of Name',
                'Correction of Date of Birth',
                'Correction of Place of Birth',
                'Correction of Gender',
                'Correction of Civil Status',
            ]),
            // PetitionType::CORRECTION => fake()->randomElement([
            //     'Cancellation of Birth Record',
            //     'Cancellation of Death Record',
            //     'Cancellation of Marriage Record',
            // ]),
            // PetitionType::CORRECTION => fake()->randomElement([
            //     'Recognition of Illegitimate Child',
            //     'Recognition of Paternity',
            // ]),
            default => 'General Petition',
        };
    }

    /**
     * Indicate that the petition is at Notice of Posting step
     */
    public function atNoticeStep(): static
    {
        return $this->state(fn(array $attributes) => [
            'current_step' => PetitionStep::NOTICE,
        ]);
    }

    /**
     * Indicate that the petition is at Certificate of Posting step
     */
    public function atCertificateStep(): static
    {
        return $this->state(fn(array $attributes) => [
            'current_step' => PetitionStep::CERT_POSTING,
        ]);
    }

    /**
     * Indicate that the petition is at Record Sheet step
     */
    public function atRecordSheetStep(): static
    {
        return $this->state(fn(array $attributes) => [
            'current_step' => PetitionStep::RECORD_SHEET,
        ]);
    }

    /**
     * Indicate that the petition is at Finality step
     */
    public function atFinalityStep(): static
    {
        return $this->state(fn(array $attributes) => [
            'current_step' => PetitionStep::FINALITY,
        ]);
    }

    /**
     * Indicate that the petition is completed
     */
    public function completed(): static
    {
        return $this->state(fn(array $attributes) => [
            'current_step' => PetitionStep::FINALITY,
            'status' => PetitionStatus::COMPLETED,
            'completed_at' => fake()->dateTimeBetween('-1 month', 'now'),
        ]);
    }

    /**
     * Indicate that the petition is urgent priority
     */
    public function urgent(): static
    {
        return $this->state(fn(array $attributes) => [
            'priority' => PetitionPriority::URGENT,
        ]);
    }
}
