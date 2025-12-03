<?php

namespace App\Http\Controllers;

use App\Http\Resources\ClientResource;
use App\Models\Client;
use App\Http\Requests\StoreClientRequest;
use App\Http\Requests\UpdateClientRequest;
use Illuminate\Http\Request;
use Inertia\Inertia;

class ClientController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $validated = $request->validate([
            'sortDir' => 'string|in:asc,desc',
            'sortBy' => 'string|in:client_code,full_name,contact_number,created_at,petitions_count',
            'search' => 'string|max:255',
            'perPage' => 'integer|between:1,100',
            'trashedRecords' => 'in:1,2,3',
        ]);

        $sortDir = $validated['sortDir'] ?? 'desc';
        $sortBy = $validated['sortBy'] ?? 'created_at';
        $search = $validated['search'] ?? '';
        $perPage = $validated['perPage'] ?? 10;
        $trashedRecords = $validated['trashedRecords'] ?? 0;

        $query = Client::withCount('petitions')
            ->when($search, function ($query) use ($search) {
                return $query->whereAny(
                    [
                        'first_name',
                        'last_name',
                        'client_code',
                        'contact_number'
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

        if ($sortBy === 'full_name') {
            $query->orderBy('last_name', $sortDir)
                ->orderBy('first_name', $sortDir);
        } else {
            $query->orderBy($sortBy, $sortDir);
        }

        $clients = $query->paginate($perPage)
            ->withQueryString();

        return Inertia::render('clients/index', [
            'clients' => ClientResource::collection($clients),
            'filters' => $validated
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        return Inertia::render('clients/create');
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreClientRequest $request)
    {
        Client::create($request->only([
            'first_name',
            'last_name',
            'middle_name',
            'suffix',
            'contact_number',
        ]));

        return to_route('clients.index');
    }

    /**
     * Display the specified resource.
     */
    public function show(Client $client)
    {
        return Inertia::render('clients/show', [
            'client' => (new ClientResource($client->load('petitions')))->resolve(),
        ]);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Client $client)
    {
        return Inertia::render('clients/edit', [
            'client' => (new ClientResource($client))->resolve(),
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateClientRequest $request, Client $client)
    {
        $client->update($request->only([
            'first_name',
            'last_name',
            'middle_name',
            'suffix',
            'contact_number',
        ]));

        return to_route('clients.index');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Client $client)
    {
        $client->delete();

        return back();
    }
}
