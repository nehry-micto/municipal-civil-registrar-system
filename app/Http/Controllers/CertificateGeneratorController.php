<?php

namespace App\Http\Controllers;

use App\Models\Configuration;
use App\Models\Petition;
use Illuminate\Http\Request;
use PhpOffice\PhpWord\TemplateProcessor;
use Symfony\Component\HttpFoundation\StreamedResponse;

class CertificateGeneratorController extends Controller
{
    public function generateNoticeOfPosting(Petition $petition)
    {

        if (!$petition->notice) {
            return response('Notice of Posting data is required before generating Notice of Posting.', 400);
        }

        $templateProcessor = new TemplateProcessor(
            storage_path('app/templates/POSTING_NOTICE.docx')
        );

        $documentType = match ($petition->document_type) {
            1 => 'Birth Certificate',
            2 => 'Death Certificate',
            default => 'Document',
        };
        
        

        // get latest configuration
        $configuration = Configuration::getLatest();

        $templateProcessor->setValue('petitioner', $petition->client->full_name);
        $templateProcessor->setValue('nature_of_petition', $petition->petition_nature);
        $templateProcessor->setValue('document_type', $documentType);
        $templateProcessor->setValue('document_owner', $petition->document_owner);
        $templateProcessor->setValue('date', $petition->notice->notice_posting_date->format('d F Y'));

        // from config
        $templateProcessor->setValue('civil_registry_head', $configuration->data['civil_registry_head']['name']);
        $templateProcessor->setValue('position', $configuration->data['civil_registry_head']['position']);

        $templateProcessor->setValue('municipality',strtoupper($configuration->data['municipality']));
        $templateProcessor->setValue('province',strtoupper($configuration->data['province']));

        $tempFile = tempnam(sys_get_temp_dir(), 'phpWord');

        $templateProcessor->saveAs($tempFile);

        return new StreamedResponse(function () use ($tempFile) {
            $stream = fopen($tempFile, 'rb');
            fpassthru($stream);
            fclose($stream);
            unlink($tempFile); // remove temp file
        }, 200, [
            "Content-Type" => "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
            "Content-Disposition" => "attachment; filename=\"Notice_of_Posting_{$petition->petition_number}.docx\"",
            "Content-Length" => filesize($tempFile),
        ]);
    }

    public function generateCertificateOfPosting(Petition $petition)
    {

        if (!$petition->certificate) {
            return response('Certificate of Posting data is required before generating Certificate of Posting.', 400);
        }

        $templateProcessor = new TemplateProcessor(
            storage_path('app/templates/CERT_POSTING.docx')
        );

        $documentType = match ($petition->document_type) {
            1 => 'Birth Certificate',
            2 => 'Death Certificate',
            default => 'Document',
        };

        $templateProcessor->setValue('petition_no', $petition->petition_number);
        $templateProcessor->setValue('petitioner', $petition->client->full_name);
        $templateProcessor->setValue('nature_of_petition', $petition->petition_nature);
        $templateProcessor->setValue('document_type', $documentType);
        $templateProcessor->setValue('document_owner', $petition->document_owner); 
        $templateProcessor->setValue('registry_no', $petition->registry_number);
        $templateProcessor->setValue('start_date', $petition->certificate->start_date->format('d F Y'));
        $templateProcessor->setValue('end_date', $petition->certificate->end_date->format('d F Y'));

        // from config
        $configuration = Configuration::getLatest();
        
        $templateProcessor->setValue('civil_registry_head', $configuration->data['civil_registry_head']['name']);
        $templateProcessor->setValue('position', $configuration->data['civil_registry_head']['position']);

        $templateProcessor->setValue('municipality',strtoupper($configuration->data['municipality']));
        $templateProcessor->setValue('province',strtoupper($configuration->data['province']));

        $postingDate = $petition->certificate->posting_date;
        $day = $postingDate?->format('jS') ?? '';
        $month = $postingDate?->format('F Y') ?? '';

        $templateProcessor->setValue('day', $day);
        $templateProcessor->setValue('month', $month);

        $tempFile = tempnam(sys_get_temp_dir(), 'phpWord');

        $templateProcessor->saveAs($tempFile);

        return new StreamedResponse(function () use ($tempFile) {
            $stream = fopen($tempFile, 'rb');
            fpassthru($stream);
            fclose($stream);
            unlink($tempFile); // remove temp file
        }, 200, [
            "Content-Type" => "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
            "Content-Disposition" => "attachment; filename=\"Certificate_of_Posting_{$petition->petition_number}.docx\"",
            "Content-Length" => filesize($tempFile),
        ]);
    }

    public function generateRecordSheet(Petition $petition)
    {
        $templateProcessor = new TemplateProcessor(
            storage_path('app/templates/RECORD_SHEET.docx')
        );

        // Check if certificate relationship exists (posting period data)
        if (!$petition->certificate) {
            return response('Certificate of Posting data is required before generating Record Sheet.', 400);
        }

        // Map document type enum to readable string
        $documentType = match ($petition->document_type) {
            1 => 'Birth Certificate',
            2 => 'Death Certificate',
            default => 'Document',
        };

        // Map petition type enum to readable string
        $petitionType = match ($petition->petition_type) {
            1 => 'Correction',
            2 => 'Late Registration',
            default => 'Petition',
        };

        // Set basic petition data
        $templateProcessor->setValue('date', $petition->date_of_filing->format('d F Y'));
        $templateProcessor->setValue('petition_no', $petition->petition_number);

        $publicationPeriod = $this->formatPublicationDate($petition->recordSheet->first_published_at, $petition->recordSheet->second_published_at);
        $postingPeriod = $this->formatPublicationDate($petition->certificate->start_date, $petition->certificate->end_date);

        $templateProcessor->setValue('posting_period', $postingPeriod);
        $templateProcessor->setValue('publication_period', $publicationPeriod);
        $templateProcessor->setValue('petition_type', $petitionType);
        $templateProcessor->setValue('petitioner', $petition->client->full_name);
        $templateProcessor->setValue('owner', $petition->document_owner);
        $templateProcessor->setValue('document_type', $documentType);
        $templateProcessor->setValue('registry_no', $petition->registry_number);

                // from config
        $configuration = Configuration::getLatest();
        
        $templateProcessor->setValue('civil_registry_head', $configuration->data['civil_registry_head']['name']);
        $templateProcessor->setValue('position', $configuration->data['civil_registry_head']['position']);

        $templateProcessor->setValue('municipality',strtoupper($configuration->data['municipality']));
        $templateProcessor->setValue('province',strtoupper($configuration->data['province']));


        // Handle errors_to_correct table
        $errorsToCorrect = $petition->errors_to_correct ?? [];
        
        if (!empty($errorsToCorrect)) {
            // Clone the table row for each error entry
            $templateProcessor->cloneRow('item_no', count($errorsToCorrect));
            
            // Populate each row with error data
            foreach ($errorsToCorrect as $index => $error) {
                $rowNumber = $index + 1;
                $templateProcessor->setValue('item_no#' . $rowNumber, $error['item_number'] ?? '');
                $templateProcessor->setValue('description#' . $rowNumber, $error['description'] ?? '');
                $templateProcessor->setValue('from#' . $rowNumber, $error['current_value'] ?? '');
                $templateProcessor->setValue('to#' . $rowNumber, $error['corrected_value'] ?? '');
            }
        }

        $tempFile = tempnam(sys_get_temp_dir(), 'phpWord');

        $templateProcessor->saveAs($tempFile);

        return new StreamedResponse(function () use ($tempFile) {
            $stream = fopen($tempFile, 'rb');
            fpassthru($stream);
            fclose($stream);
            unlink($tempFile); // remove temp file
        }, 200, [
            "Content-Type" => "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
            "Content-Disposition" => "attachment; filename=\"Record_Sheet_{$petition->petition_number}.doc\"",
            "Content-Length" => filesize($tempFile),
        ]);
    }

    public function generateCertificateOfFinality(Petition $petition)
    {
        $templateProcessor = new TemplateProcessor(
            storage_path('app/templates/Finality.docx')
        );

        // Check if record sheet relationship exists (decision date data)
        if (!$petition->recordSheet) {
            return response('Record Sheet data is required before generating Certificate of Finality.', 400);
        }

        // Map document type enum to readable string
        $documentType = match ($petition->document_type) {
            1 => 'Birth Certificate',
            2 => 'Death Certificate',
            default => 'Document',
        };

        // Set petition data with proper date formatting (DD Month YYYY)
        $templateProcessor->setValue('petition_no', $petition->petition_number);
        $templateProcessor->setValue('filling_date', $petition->date_of_filing->format('d F Y'));
        $templateProcessor->setValue('petitioner', $petition->client->full_name);
        $templateProcessor->setValue('document_type', $documentType);
        $templateProcessor->setValue('document_owner', $petition->document_owner);
        $templateProcessor->setValue('petition_nature', $petition->petition_nature);
        $templateProcessor->setValue('decision_date', $petition->recordSheet->rendered_date ? 
            \Carbon\Carbon::parse($petition->recordSheet->rendered_date)->format('d F Y') : '');

                // from config
        $configuration = Configuration::getLatest();
        
        $templateProcessor->setValue('civil_registry_head', $configuration->data['civil_registry_head']['name']);
        $templateProcessor->setValue('position', $configuration->data['civil_registry_head']['position']);

        $templateProcessor->setValue('municipality',strtoupper($configuration->data['municipality']));
        $templateProcessor->setValue('province',strtoupper($configuration->data['province']));


        $dateReleased = $petition->finality->released_at;
        $day = $dateReleased->format('jS');
        $month = $dateReleased->format('F Y');

        $templateProcessor->setValue('day', $day);
        $templateProcessor->setValue('month', $month);

        $tempFile = tempnam(sys_get_temp_dir(), 'phpWord');

        $templateProcessor->saveAs($tempFile);

        return new StreamedResponse(function () use ($tempFile) {
            $stream = fopen($tempFile, 'rb');
            fpassthru($stream);
            fclose($stream);
            unlink($tempFile); // remove temp file
        }, 200, [
            "Content-Type" => "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
            "Content-Disposition" => "attachment; filename=\"Certificate_of_Finality_{$petition->petition_number}.docx\"",
            "Content-Length" => filesize($tempFile),
        ]);
    }

    private function formatPublicationDate($startDate, $endDate) {
        // no end date
        if (!$endDate) {
            return $startDate->format('F d, Y');
        }

        // same month and year
        if ($startDate->format('F Y') == $endDate->format('F Y')) {
           // format Month d - d, Y
           return $startDate->format('F d') . ' - ' . $endDate->format('d, Y');
        }
        // different month but same year
        if ($startDate->format('Y') == $endDate->format('Y')) {
            // format Month d - Month d, Y
            return $startDate->format('F d') . ' - ' . $endDate->format('F d, Y');
        }
        // different month and year
        return $startDate->format('F d, Y') . ' - ' . $endDate->format('F d, Y');
    }
}
