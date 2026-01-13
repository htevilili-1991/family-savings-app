<?php

namespace App\Http\Controllers;

use App\Models\Contribution;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;
use Carbon\Carbon;

class DashboardController extends Controller
{
    public function __invoke(Request $request)
    {
        $user = Auth::user();
        $currentYear = Carbon::now()->year;
        $currentMonth = Carbon::now()->month;

        // Card 1: Your Total Contributions This Year
        $yourTotalContributionsThisYear = Contribution::where('user_id', $user->id)
            ->whereYear('created_at', $currentYear)
            ->sum('amount');

        // Card 2: How Much You Can Withdraw (50% of total contributions this year)
        $withdrawableAmount = $yourTotalContributionsThisYear * 0.5;

        // Card 3: Your Retained Share (cumulative)
        // This is a simplified calculation. Assuming no withdrawals yet.
        // A more accurate approach would use a yearly_summaries table or track withdrawals.
        $yourRetainedShare = Contribution::where('user_id', $user->id)->sum('amount') * 0.5; // Placeholder logic

        // Card 4: Total Group Contributions This Year
        $totalGroupContributionsThisYear = Contribution::whereYear('created_at', $currentYear)
            ->sum('amount');

        // Chart 1: Group Contributions (This Month)
        $users = User::with(['contributions' => function ($query) use ($currentMonth, $currentYear) {
            $query->whereMonth('created_at', $currentMonth)->whereYear('created_at', $currentYear);
        }])->get();

        $monthlyContributions = $users->map(function ($user) {
            return [
                'name' => $user->name,
                'amount' => $user->contributions->sum('amount'),
            ];
        });

        // Chart 1: Group Contributions (This Year)
        $yearlyGroupContributions = Contribution::whereYear('created_at', $currentYear)
            ->selectRaw('EXTRACT(MONTH FROM created_at) as month, SUM(amount) as total')
            ->groupBy('month')
            ->orderBy('month')
            ->get();

        $yearlyGroupData = array_fill(0, 12, 0);
        foreach ($yearlyGroupContributions as $contribution) {
            $yearlyGroupData[$contribution->month - 1] = $contribution->total;
        }

        // Chart 2: Group Cumulative Contributions This Year
        $cumulativeGroupData = [];
        $runningTotal = 0;
        foreach ($yearlyGroupData as $total) {
            $runningTotal += $total;
            $cumulativeGroupData[] = $runningTotal;
        }

        return Inertia::render('Dashboard', [
            'stats' => [
                'yourTotalContributionsThisYear' => $yourTotalContributionsThisYear,
                'withdrawableAmount' => $withdrawableAmount,
                'yourRetainedShare' => $yourRetainedShare,
                'totalGroupContributionsThisYear' => $totalGroupContributionsThisYear,
            ],
            'charts' => [
                'monthlyContributions' => $monthlyContributions,
                'yearlyGroupContributions' => $yearlyGroupData,
                'cumulativeGroupContributions' => $cumulativeGroupData,
            ],
        ]);
    }
}
