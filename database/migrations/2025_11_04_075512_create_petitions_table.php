<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {

        // petitioner
        Schema::create('clients', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->string('client_code');
            $table->string('first_name');
            $table->string('last_name');
            $table->string('middle_name')->nullable();
            $table->string('suffix')->nullable();
            $table->string('contact_number')->nullable();
            $table->softDeletes();
            $table->timestamps();
            // index client_code, last name first name
            $table->index(['client_code', 'last_name', 'first_name']);
        });

        // document owner
        Schema::create('petitions', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->string('petition_number')->unique();
            $table->string('registry_number');
            $table->date('date_of_filing');
            // document type 1 = birth, 2 = death
            $table->unsignedTinyInteger('document_type');
            #type of petition
            $table->unsignedTinyInteger('petition_type');
            # petition nature type
            $table->text('petition_nature');
            # Name on the document (might differ from petitioner)
            $table->string('document_owner');
            $table->json('errors_to_correct');
            # current step 0 = encoding, 1 = notice, 2 cert posting, 3 = record sheet, 4 = finalities
            $table->unsignedTinyInteger('current_step')->default(0);
            # status 0 = draft, 1 = in progress, 2 = completed, 3 = cancelled, 4= on hold, 5 = rejected
            $table->unsignedTinyInteger('status')->default(0);
            # priority 0 = normal, 1  = urgent
            $table->unsignedTinyInteger('priority')->default(0);

            $table->foreignUuid('client_id')->constrained('clients')->cascadeOnDelete();

            $table->dateTime('completed_at')->nullable();
            $table->softDeletes();
            $table->timestamps();

            $table->index([
                'petition_number',
                'document_owner',
                'document_type',
                'date_of_filing',
                'status'
            ]);
        });

        Schema::create('petition_notices', function (Blueprint $table) {
            $table->id();
            $table->foreignUuid('petition_id')
                ->constrained('petitions')
                ->cascadeOnDelete();
            $table->date('notice_posting_date');
            $table->timestamps();
        });

        Schema::create('petition_certificates', function (Blueprint $table) {
            $table->id();
            $table->foreignUuid('petition_id')
                ->constrained('petitions')
                ->cascadeOnDelete();
            $table->date('start_date');
            $table->date('end_date');
            $table->date('posting_date');
            $table->timestamps();
        });

        Schema::create('petition_record_sheets', function (Blueprint $table) {
            $table->id();
            $table->foreignUuid('petition_id')
                ->constrained('petitions')
                ->cascadeOnDelete();
            $table->date('first_published_at')->nullable();
            $table->date('second_published_at')->nullable();
            $table->date('rendered_date');
            $table->text('remarks')->nullable();
            $table->unsignedInteger('decision')->default(1);
            $table->timestamps();
        });

        Schema::create('petition_finalities', function (Blueprint $table) {
            $table->id();
            $table->foreignUuid('petition_id')
                ->constrained('petitions')
                ->cascadeOnDelete();
            $table->string('certificate_number')->unique();
            $table->date('released_at')->nullable();
            $table->text('notes')->nullable();
            $table->timestamps();

            $table->index(['certificate_number', 'released_at']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('clients');
        Schema::dropIfExists('petitions');
        Schema::dropIfExists('petition_finalities');
        Schema::dropIfExists('petition_record_sheets');
        Schema::dropIfExists('petition_certificates');
        Schema::dropIfExists('petition_notices');
        Schema::dropIfExists('clients');
    }
};
