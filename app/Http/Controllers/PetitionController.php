<?php

namespace App\Http\Controllers;

use App\Http\Requests\PetitionRequest;
use App\Models\Client;
use App\Models\Petition;
use Illuminate\Http\Request;
use Inertia\Inertia;

class PetitionController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        return Inertia::render('petitions/index');
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
            'petitions/create',
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
            'registry_number',
            'date_of_filing',
            'document_type',
            'document_owner',
            'petition_nature',
            'errors_to_correct',
            'priority',
        ]));
    }

    /**
     * Display the specified resource.
     */
    public function show(Petition $petition)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Petition $petition)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Petition $petition)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Petition $petition)
    {
        //
    }
}
