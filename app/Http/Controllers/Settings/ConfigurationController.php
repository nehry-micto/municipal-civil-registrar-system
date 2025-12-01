<?php

namespace App\Http\Controllers\Settings;

use App\Http\Controllers\Controller;
use App\Http\Resources\ConfigurationResource;
use App\Models\Configuration;
use Illuminate\Http\Request;
use Inertia\Inertia;

class ConfigurationController extends Controller
{
    /**
     * Display the configuration settings page.
     */
    public function edit()
    {
        $configuration = Configuration::getLatest();

        return Inertia::render('settings/configuration', [
            'configuration' => $configuration 
                ? new ConfigurationResource($configuration) 
                : null,
        ]);
    }

    /**
     * Update the configuration and create a new version.
     */
    public function update(Request $request)
    {
        $validated = $request->validate([
            'civil_registry_head.name' => 'required|string|max:255',
            'civil_registry_head.position' => 'required|string|max:255',
            'mayor.name' => 'required|string|max:255',
            'mayor.position' => 'required|string|max:255',
            'municipality' => 'required|string|max:255',
            'province' => 'required|string|max:255',
        ]);

        // Create new configuration version
        $configuration = Configuration::create([
            'version' => Configuration::getNextVersion(),
            'data' => [
                'civil_registry_head' => [
                    'name' => $validated['civil_registry_head']['name'],
                    'position' => $validated['civil_registry_head']['position'],
                ],
                'mayor' => [
                    'name' => $validated['mayor']['name'],
                    'position' => $validated['mayor']['position'],
                ],
                'municipality' => $validated['municipality'],
                'province' => $validated['province'],
            ],
        ]);

        return redirect()
            ->route('configuration.edit')
            ->with('success', 'Configuration saved successfully! Version ' . $configuration->version . ' created.');
    }

    /**
     * List all configuration versions (for future use).
     */
    public function index()
    {
        $configurations = Configuration::orderBy('version', 'desc')
            ->paginate(10);

        return Inertia::render('settings/configuration-history', [
            'configurations' => ConfigurationResource::collection($configurations),
        ]);
    }
}
