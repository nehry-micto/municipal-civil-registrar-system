<?php

namespace App\Http\Controllers;

use App\Enums\PetitionStatus;
use App\Models\Petition;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;

class DashboardController extends Controller
{
    public function __invoke()
    {
        // 1. Summary Cards
        $totalPetitions = Petition::count();
        $pendingPetitions = Petition::where('status', PetitionStatus::IN_PROGRESS)->count(); // Assuming you have a status enum
        $completedPetitions = Petition::where('status', PetitionStatus::COMPLETED)->count(); // Or whatever your completed status is

        // 2. Monthly Trends (Current Year Jan-Dec)
        $monthlyTrends = collect(range(1, 12))->map(function ($month) {
            $date = now()->month($month)->startOfMonth();
            $count = Petition::whereYear('created_at', now()->year)
                ->whereMonth('created_at', $month)
                ->count();

            return [
                'name' => $date->format('M'), // Short month name (Jan, Feb, etc.)
                'total' => $count,
            ];
        });

        // 3. Petitions by Type
        $petitionsByType = Petition::select('petition_type', DB::raw('count(*) as count'))
            ->groupBy('petition_type')
            ->get()
            ->map(function ($item) {
                return [
                    'name' => $item->petition_type->label(), // Assuming your Enum has a label() method
                    'value' => $item->count,
                ];
            });

        return Inertia::render('dashboard', [
            'stats' => [
                'total' => $totalPetitions,
                'pending' => $pendingPetitions,
                'completed' => $completedPetitions,
                'monthlyTrends' => $monthlyTrends,
                'byType' => $petitionsByType,
            ],
        ]);
    }
}
