<?php

namespace App\Http\Controllers;

use App\Models\Petition;
use Illuminate\Http\Request;
use PhpOffice\PhpWord\TemplateProcessor;
use Symfony\Component\HttpFoundation\StreamedResponse;

class CertificateGeneratorController extends Controller
{
    public function generateNoticeOfPosting(Petition $petition)
    {
        $templateProcessor = new TemplateProcessor(
            storage_path('app/templates/POSTING_NOTICE.docx')
        );

        $documentType = match ($petition->document_type) {
            1 => 'Birth Certificate',
            2 => 'Death Certificate',
            default => 'Document',
        };

        $templateProcessor->setValue('petitioner', $petition->client->full_name);
        $templateProcessor->setValue('nature_of_petition', $petition->petition_nature);
        $templateProcessor->setValue('document_type', $documentType);
        $templateProcessor->setValue('document_owner', $petition->document_owner);

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
}
