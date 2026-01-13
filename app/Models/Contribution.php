<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Carbon\Carbon;

class Contribution extends Model
{
    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'user_id',
        'amount',
        'contributed_at',
        'created_by',
        'notes',
    ];

    /**
     * The attributes that should be cast.
     *
     * @var array<string, string>
     */
    protected $casts = [
        'contributed_at' => 'date',
        'amount' => 'decimal:2',
    ];

    /**
     * The "booted" method of the model.
     *
     * @return void
     */
    protected static function booted()
    {
        static::creating(function ($contribution) {
            if ($contribution->contributed_at) {
                $contribution->contribution_year = Carbon::parse($contribution->contributed_at)->year;
                $contribution->contribution_month = Carbon::parse($contribution->contributed_at)->month;
            }
        });

        static::updating(function ($contribution) {
            if ($contribution->isDirty('contributed_at')) {
                $contribution->contribution_year = Carbon::parse($contribution->contributed_at)->year;
                $contribution->contribution_month = Carbon::parse($contribution->contributed_at)->month;
            }
        });
    }

    /**
     * Get the user that owns the contribution.
     */
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    /**
     * Get the user who created the contribution.
     */
    public function creator(): BelongsTo
    {
        return $this->belongsTo(User::class, 'created_by');
    }
}
