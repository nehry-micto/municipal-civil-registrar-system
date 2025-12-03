<?php

namespace App\Http\Controllers;

use App\Enums\PetitionStep;
use App\Http\Requests\PetitionRequest;
use App\Http\Resources\PetitionResource;
use App\Models\Client;
use App\Models\Petition;
use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Enums\PetitionStatus;

class PetitionController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $validated = $request->validate([
            'sortDir' => 'string|in:asc,desc',
            'sortBy' => 'string|in:petition_number,registry_number,date_of_filing,document_type,petition_type,petition_nature,priority,created_at,updated_at,document_owner',
            'search' => 'string|max:255',
            'perPage' => 'integer|between:1,100',
            'tab' => 'string|in:all,encoding,posting_notice,posting_certificate,record_sheet,finality_certificate',
            'trashedRecords' => 'in:1,2,3',
        ]);

        $sortDir = $validated['sortDir'] ?? 'desc';
        $sortBy = $validated['sortBy'] ?? 'date_of_filing';
        $search = $validated['search'] ?? '';
        $perPage = $validated['perPage'] ?? 10;
        $trashedRecords = $validated['trashedRecords'] ?? 0;

        $query = Petition::with('client')
            ->when($search, function ($query) use ($search) {
                return $query->whereAny(
                    [
                        'petition_number',
                        'registry_number',
                        'document_owner'
                    ],
                    'ILIKE',
                    "%" . $search . "%"
                );
            })->when($trashedRecords, function ($query) use ($trashedRecords) {

                if ($trashedRecords == 2) {
                    return $query->onlyTrashed();
                }

                if ($trashedRecords == 3) {
                    return $query->withTrashed();
                }
            });

        $tab = [
            'encoding' => PetitionStep::ENCODING,
            'posting_notice' => PetitionStep::NOTICE,
            'posting_certificate' => PetitionStep::CERT_POSTING,
            'record_sheet' => PetitionStep::RECORD_SHEET,
            'finality_certificate' => PetitionStep::FINALITY
        ][$request->tab] ?? ($request->tab === 'all' ? false : PetitionStep::ENCODING);


        if ($tab !== false) {
            $query->where('current_step', $tab);
        }

        $petitions =
            $query->orderBy($sortBy, $sortDir)
            ->paginate($perPage)
            ->withQueryString()
            ->toResourceCollection();


        return Inertia::render('petitions/index', [
            'petitions' => $petitions,
            'filters' => $validated
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create(Request $request)
    {

        $clients  =  Client::when($request->search, function ($query) use ($request) {
            return $query->whereAny(
                [
                    'first_name',
                    'last_name',
                    'client_code',
                ],
                'ILIKE',
                "%" . $request->search . "%"
            );
        })
            ->limit(5)
            ->latest()
            ->get();

        // dd($clients);

        return Inertia::render(
            'petitions/create/index',
            [
                'clients' => $clients
            ]

        );
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(PetitionRequest $request)
    {

        Petition::create($request->only([
            'client_id',
            'petition_number',
            'registry_number',
            'date_of_filing',
            'document_type',
            'document_owner',
            'petition_type',
            'petition_nature',
            'errors_to_correct',
            'priority',
        ]));

        return to_route('petitions.index');
    }

    /**
     * Display the specified resource.
     */
    public function show(Petition $petition)
    {

        return Inertia::render('petitions/show', [
            'petition' => (new PetitionResource($petition->load('client')))->resolve(),
        ]);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Petition $petition)
    {
        return Inertia::render('petitions/edit/index', [
            'petition' => $petition->load(['client', 'notice', 'certificate', 'recordSheet', 'finality']),
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(PetitionRequest $request, Petition $petition)
    {
        $petition->update($request->only([
            'petition_number',
            'registry_number',
            'date_of_filing',
            'document_type',
            'document_owner',
            'petition_type',
            'petition_nature',
            'errors_to_correct',
            'priority',
        ]));

        if ($request->has('notice') && $petition->notice) {
            $petition->notice->update($request->input('notice'));
        }

        if ($request->has('certificate') && $petition->certificate) {
            $petition->certificate->update($request->input('certificate'));
        }

        if ($request->has('record_sheet') && $petition->recordSheet) {
            $petition->recordSheet->update($request->input('record_sheet'));
        }

        if ($request->has('finality') && $petition->finality) {
            $petition->finality->update($request->input('finality'));
        }

        return to_route('petitions.show', $petition);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Petition $petition)
    {
        //
    }

    public function changeStep(Request $request, Petition $petition)
    {

        $nextStep = $petition->current_step->next();

        if ($nextStep === PetitionStep::NOTICE) {
            // validate the time
            $request->validate([
                'notice_date' => 'required|date',
                // already exists
            ]);

            $petition->update([
                'current_step' => $nextStep,
            ]);

            $petition->notice()->create([
                'notice_posting_date' => $request->notice_date,
            ]);

            // return to_route('petitions.index');
        }

        if ($nextStep === PetitionStep::CERT_POSTING) {
            $request->validate([
                'start_date' => 'required|date|after:notice_posting_date',
                'end_date' => 'required|date|after:start_date',
                'posting_date' => 'nullable|date',
            ]);

            // check if start date is greater than the notice posting date
            $noticePostingDate = $petition->notice->notice_posting_date;

            if ($request->date('start_date')->lessThanOrEqualTo($noticePostingDate)) {
                return back()->withErrors(['start_date' => 'Start date must be after the notice posting date.']);
            }

            $petition->update([
                'current_step' => $nextStep,
            ]);

            $petition->certificate()->create([
                'start_date' => $request->start_date,
                'end_date' => $request->end_date,
                'posting_date' => $request->posting_date,
            ]);
        }

        if ($nextStep === PetitionStep::RECORD_SHEET) {
            $request->validate([
                'first_published_at' => 'required|date',
                'second_published_at' => 'nullable|date',
                'rendered_date' => 'required|date',
                'remarks' => 'nullable|string',
                'decision' => 'required|in:1,0', // 1 = Approved, 0 = Denied (assuming)
            ]);

            $petition->update([
                'current_step' => $nextStep,
            ]);

            $petition->recordSheet()->create([
                'first_published_at' => $request->first_published_at,
                'second_published_at' => $request->second_published_at,
                'rendered_date' => $request->rendered_date,
                'remarks' => $request->remarks,
                'decision' => $request->decision,
            ]);
        }

        if ($nextStep === PetitionStep::FINALITY) {
            $request->validate([
                'certificate_number' => 'required|unique:petition_finalities,certificate_number',
                'released_at' => 'nullable|date',
                'notes' => 'nullable|string',
            ]);

            $petition->update([
                'current_step' => $nextStep,
                'status' => PetitionStatus::COMPLETED,
            ]);

            $petition->finality()->create([
                'certificate_number' => $request->certificate_number,
                'released_at' => $request->released_at,
                'notes' => $request->notes,
            ]);
        }
    }

    public function updateStep(Request $request, Petition $petition)
    {
        $step = $request->input('step');

        if ($step === 'notice') {
            $request->validate([
                'notice_posting_date' => 'required|date',
            ]);

            $petition->notice()->updateOrCreate(
                ['petition_id' => $petition->id],
                ['notice_posting_date' => $request->notice_posting_date]
            );
        } elseif ($step === 'certificate') {
            $request->validate([
                'start_date' => 'required|date',
                'end_date' => 'required|date|after:start_date',
                'posting_date' => 'nullable|date',
            ]);

            $petition->certificate()->updateOrCreate(
                ['petition_id' => $petition->id],
                [
                    'start_date' => $request->start_date,
                    'end_date' => $request->end_date,
                    'posting_date' => $request->posting_date,
                ]
            );
        } elseif ($step === 'record_sheet') {
            $request->validate([
                'first_published_at' => 'required|date',
                'second_published_at' => 'nullable|date',
                'rendered_date' => 'required|date',
                'remarks' => 'nullable|string',
                'decision' => 'required|in:1,0',
            ]);

            $petition->recordSheet()->updateOrCreate(
                ['petition_id' => $petition->id],
                [
                    'first_published_at' => $request->first_published_at,
                    'second_published_at' => $request->second_published_at,
                    'rendered_date' => $request->rendered_date,
                    'remarks' => $request->remarks,
                    'decision' => $request->decision,
                ]
            );
        } elseif ($step === 'finality') {
            $request->validate([
                'certificate_number' => 'required',
                'released_at' => 'nullable|date',
                'notes' => 'nullable|string',
            ]);

            $petition->finality()->updateOrCreate(
                ['petition_id' => $petition->id],
                [
                    'certificate_number' => $request->certificate_number,
                    'released_at' => $request->released_at,
                    'notes' => $request->notes,
                ]
            );
        }

        return back();
    }
}
