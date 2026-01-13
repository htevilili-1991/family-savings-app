<?php

use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use Laravel\Fortify\Features;
use App\Http\Controllers\ContributionController;

Route::get('/', function () {
    return Inertia::render('welcome', [
        'canRegister' => Features::enabled(Features::registration()),
    ]);
})->name('home');

Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('dashboard', function () {
        return Inertia::render('dashboard');
    })->name('dashboard');

    Route::get('contributions', [ContributionController::class, 'index'])
        ->name('contributions.index');

    Route::middleware(['role:admin|treasurer'])->group(function () {
        Route::post('contributions', [ContributionController::class, 'store'])
            ->name('contributions.store');
        Route::put('contributions/{contribution}', [ContributionController::class, 'update'])
            ->name('contributions.update');
        Route::delete('contributions/{contribution}', [ContributionController::class, 'destroy'])
            ->name('contributions.destroy');
    });
});

require __DIR__.'/settings.php';
