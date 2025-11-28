<?php

namespace Database\Seeders;

use App\Models\Client;
use App\Models\Petition;
use App\Models\PetitionCertificate;
use App\Models\PetitionFinality;
use App\Models\PetitionNotice;
use App\Models\PetitionRecordSheet;
use Illuminate\Database\Seeder;
use Illuminate\Support\Carbon;

class PetitionSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Create clients first
        $clients = Client::factory()->count(20)->create();

        // Create petitions at various stages

        // 10 petitions at Encoding step (just created)
        Petition::factory()
            ->count(10)
            ->recycle($clients)
            ->create();

        // 5 petitions at Notice of Posting step
        Petition::factory()
            ->count(5)
            ->recycle($clients)
            ->atNoticeStep()
            ->create()
            ->each(function ($petition) {
                // Create notice record
                PetitionNotice::factory()->create([
                    'petition_id' => $petition->id,
                    'notice_posting_date' => now()->subDays(1),
                ]);
            });

        // 5 petitions at Certificate of Posting step
        Petition::factory()
            ->count(5)
            ->recycle($clients)
            ->atCertificateStep()
            ->create()
            ->each(function ($petition) {
                // Create notice and certificate records
                $start = fake()->dateTimeBetween('1 year ago', 'now');
                $end =  Carbon::parse($start)->addDays(14);

                PetitionNotice::factory()->create([
                    'petition_id' => $petition->id,
                    'start_date' => $start,
                    'end_date' => $end,

                ]);
                PetitionCertificate::factory()->create([
                    'petition_id' => $petition->id,
                ]);
            });

        // 3 petitions at Record Sheet step
        Petition::factory()
            ->count(3)
            ->recycle($clients)
            ->atRecordSheetStep()
            ->create()
            ->each(function ($petition) {
                // Create notice, certificate, and record sheet
                PetitionNotice::factory()->create([
                    'petition_id' => $petition->id,
                ]);
                PetitionCertificate::factory()->create([
                    'petition_id' => $petition->id,
                ]);
                PetitionRecordSheet::factory()->create([
                    'petition_id' => $petition->id,
                ]);
            });

        // 3 petitions at Finality step
        Petition::factory()
            ->count(3)
            ->recycle($clients)
            ->atFinalityStep()
            ->create()
            ->each(function ($petition) {
                // Create all related records
                PetitionNotice::factory()->create([
                    'petition_id' => $petition->id,
                ]);
                PetitionCertificate::factory()->create([
                    'petition_id' => $petition->id,
                ]);
                PetitionRecordSheet::factory()->create([
                    'petition_id' => $petition->id,
                ]);
                PetitionFinality::factory()->create([
                    'petition_id' => $petition->id,
                ]);
            });

        // 4 completed petitions
        Petition::factory()
            ->count(4)
            ->recycle($clients)
            ->completed()
            ->create()
            ->each(function ($petition) {
                // Create all related records
                PetitionNotice::factory()->create([
                    'petition_id' => $petition->id,
                ]);
                PetitionCertificate::factory()->create([
                    'petition_id' => $petition->id,
                ]);
                PetitionRecordSheet::factory()->create([
                    'petition_id' => $petition->id,
                ]);
                PetitionFinality::factory()->create([
                    'petition_id' => $petition->id,
                ]);
            });

        // 2 urgent priority petitions
        Petition::factory()
            ->count(2)
            ->recycle($clients)
            ->urgent()
            ->create();
    }
}
