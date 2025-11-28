<?php

use App\Http\Controllers\ClientController;
use App\Http\Controllers\CertificateGeneratorController;
use App\Http\Controllers\PetitionController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use Laravel\Fortify\Features;

Route::get('/', function () {
    return Inertia::render('welcome', [
        'canRegister' => Features::enabled(Features::registration()),
    ]);
})->name('home');

Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('dashboard', function () {
        return Inertia::render('dashboard');
    })->name('dashboard');

    Route::group([
        'controller' => PetitionController::class,
        'as' => 'petitions.',
        'prefix' => 'petitions',
    ], function () {
        Route::get('/', 'index')->name('index');
        Route::get('/create', 'create')->name('create');
        Route::post('/store', 'store')->name('store');
        Route::get('/{petition}', 'show')->name('show');
        Route::delete('/{petition}', 'destroy')->name('destroy');
        Route::post('/{petition}', 'changeStep')->name('changeStep');
    });

    Route::group(
        [
            'controller' => ClientController::class,
            'as' => 'clients.',
            'prefix' => 'clients',
        ],
        function () {
            Route::get('/', 'index')->name('index');
            Route::get('/create', 'create')->name('create');
            Route::post('/store', 'store')->name('store');
        }
    );

    Route::get('petitions/{petition}/generate-notice', [CertificateGeneratorController::class, 'generateNoticeOfPosting'])->name('certificate-generator.notice');
    Route::get('petitions/{petition}/generate-certificate-of-posting', [CertificateGeneratorController::class, 'generateCertificateOfPosting'])->name('certificate-generator.certificate-of-posting');
    Route::get('petitions/{petition}/generate-record-sheet', [CertificateGeneratorController::class, 'generateRecordSheet'])->name('certificate-generator.record-sheet');
    Route::get('petitions/{petition}/generate-certificate-of-finality', [CertificateGeneratorController::class, 'generateCertificateOfFinality'])->name('certificate-generator.certificate-of-finality');
});

require __DIR__ . '/settings.php';
