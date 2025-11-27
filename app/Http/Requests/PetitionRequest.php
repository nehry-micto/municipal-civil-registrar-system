<?php

namespace App\Http\Requests;

use App\Enums\DocumentType;
use App\Enums\PetitionPriority;
use App\Enums\PetitionType;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rules\Enum;

class PetitionRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'client_id' => 'required|exists:clients,id',
            'petition_number' => 'required|unique:petitions,petition_number',
            'registry_number' => 'required',
            'date_of_filing' => 'required|date',
            'document_type' => ['required', new Enum(DocumentType::class)],
            'petition_type' => ['required', new Enum(PetitionType::class)],
            'document_owner' => 'required|max:100',
            'petition_nature' => 'required|max:255',
            'errors_to_correct' => 'nullable|array',
            'errors_to_correct.*.item_number' => 'required|numeric',
            'errors_to_correct.*.description' => 'required|max:100',
            'errors_to_correct.*.current_value' => 'required|max:100',
            'errors_to_correct.*.corrected_value' => 'required|max:100',
            'priority' => ['required', new Enum(PetitionPriority::class)],
        ];
    }
}
