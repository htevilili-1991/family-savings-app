<?php

namespace App\Http\Controllers;

use App\Models\Contribution;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;
use Carbon\Carbon;
use Inertia\Inertia;

class ContributionController extends Controller
{
    /**
     * Display a listing of the contributions.
     */
    public function index(Request $request)
    {
        $this->authorize('viewAny', Contribution::class);

        $query = Contribution::with(['user', 'creator']);

        if ($request->user()->hasRole('member')) {
            $query->where('user_id', $request->user()->id);
        }

        $contributions = $query->latest('contributed_at')->paginate(10);

        return Inertia::render('Contributions', [
            'contributions' => $contributions,
            'canManageContributions' => $request->user()->hasAnyRole(['admin', 'treasurer']),
            'users' => User::orderBy('name')->get(['id', 'name']),
        ]);
    }

    /**
     * Store a newly created contribution in storage.
     */
    public function store(Request $request)
    {
        $this->authorize('create', Contribution::class);

        $validated = $request->validate([
            'user_id' => ['required', 'exists:users,id'],
            'contributed_at' => ['required', 'date'],
            'notes' => ['nullable', 'string', 'max:255'],
        ]);

        $contributedAt = Carbon::parse($validated['contributed_at']);

        // Check for duplicate contribution for the given user and month/year
        $duplicate = Contribution::where('user_id', $validated['user_id'])
            ->where('contribution_year', $contributedAt->year)
            ->where('contribution_month', $contributedAt->month)
            ->exists();

        if ($duplicate) {
            return back()->withErrors([
                'contributed_at' => 'This user already has a contribution for the selected month.',
            ]);
        }

        $contribution = Contribution::create([
            'user_id' => $validated['user_id'],
            'amount' => 4000.00, // Fixed amount
            'contributed_at' => $validated['contributed_at'],
            'created_by' => $request->user()->id,
            'notes' => $validated['notes'],
        ]);

        return back()->with('success', 'Contribution added successfully.');
    }

    /**
     * Update the specified contribution in storage.
     */
    public function update(Request $request, Contribution $contribution)
    {
        $this->authorize('update', $contribution);

        $validated = $request->validate([
            'user_id' => ['required', 'exists:users,id'],
            'contributed_at' => ['required', 'date'],
            'notes' => ['nullable', 'string', 'max:255'],
        ]);

        $contributedAt = Carbon::parse($validated['contributed_at']);

        // Check for duplicate contribution for the given user and month/year, excluding the current contribution
        $duplicate = Contribution::where('user_id', $validated['user_id'])
            ->where('contribution_year', $contributedAt->year)
            ->where('contribution_month', $contributedAt->month)
            ->where('id', '!=', $contribution->id)
            ->exists();

        if ($duplicate) {
            return back()->withErrors([
                'contributed_at' => 'This user already has a contribution for the selected month.',
            ]);
        }

        $contribution->update([
            'user_id' => $validated['user_id'],
            'contributed_at' => $validated['contributed_at'],
            'notes' => $validated['notes'],
        ]);

        return back()->with('success', 'Contribution updated successfully.');
    }

    /**
     * Remove the specified contribution from storage.
     */
    public function destroy(Contribution $contribution)
    {
        $this->authorize('delete', $contribution);

        $contribution->delete();

        return back()->with('success', 'Contribution deleted successfully.');
    }
}
