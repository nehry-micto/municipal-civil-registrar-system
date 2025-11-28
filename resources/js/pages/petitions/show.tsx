import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { BreadcrumbItem, Petition } from '@/types';
import { Head, Link, usePage } from '@inertiajs/react';
import { ArrowLeft, ArrowRight, CheckCircle2Icon, DownloadIcon, Lock, FileText, User, Calendar } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { useState } from 'react';
import PostingNotice from './create/posting-notice';
import PostingCertificate from './create/posting-certificate';
import RecordSheet from './create/record-sheet';
import CertificateOfFinality from './create/finality-certificate';
import petitions from '@/routes/petitions';
import AppLayout from '@/layouts/app-layout';
import { generateCertificateOfFinality, generateCertificateOfPosting, generateNoticeOfPosting, generateRecordSheet } from '@/actions/App/Http/Controllers/CertificateGeneratorController';

const Show = ({ petition }: { petition: Petition }) => {

    console.log(petition);

    const { petitionSteps, certificateGenerator } = usePage<{
        petitionSteps: {
            value: number;
            label: string;
            description: string;
        }[];
        certificateGenerator: any;
    }>().props;

    const [selectedRecord, setSelectedRecord] = useState<Petition | null>(null);

    // Determine current step index
    const currentStepLabel = petition.next_step;
    const currentStepIndex = currentStepLabel 
        ? petitionSteps.findIndex(s => s.label === currentStepLabel)
        : petitionSteps.length;

    const getStepStatus = (stepIndex: number) => {
        if (stepIndex < currentStepIndex) return 'completed';
        if (stepIndex === currentStepIndex) return 'current';
        return 'future';
    };

    const handleDownload = (stepValue: number) => {

       const url = {
        1: generateNoticeOfPosting(petition.id).url,
        2: generateCertificateOfPosting(petition.id).url,
        3: generateRecordSheet(petition.id).url,
        4: generateCertificateOfFinality(petition.id).url,
       }[stepValue];

        window.open(url ?? '#', '_blank');
    };

    return (
        <div className="container mx-auto px-10 py-10 space-y-8">
            <Head title={`Petition ${petition.petition_number}`} />

            {/* Header */}
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <Badge variant={currentStepIndex === petitionSteps.length ? 'default' : 'secondary'} className="text-sm px-3 py-1">
                        {currentStepIndex === petitionSteps.length ? 'Completed' : 'In Progress'}
                    </Badge>
                </div>
                <Button asChild variant="outline" size="sm">
                    <Link href={petitions.edit(petition.id).url}>
                        Edit Petition
                    </Link>
                </Button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Left Column: Details */}
                <div className="lg:col-span-2 space-y-6">
                    {/* Client Information */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2 text-base">
                                <User className="size-4" /> Client Information
                            </CardTitle>
                            <CardDescription className="text-xs">Details of the petitioner filing this request</CardDescription>
                        </CardHeader>
                        <CardContent className="grid gap-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <p className="text-xs font-medium text-muted-foreground">Full Name</p>
                                    <p className="text-sm font-medium">{petition.client?.full_name}</p>
                                </div>
                                <div>
                                    <p className="text-xs font-medium text-muted-foreground">Contact Number</p>
                                    <p className="text-sm">{petition.client?.contact_number || 'N/A'}</p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Petition Information */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2 text-base">
                                <FileText className="size-4" /> Petition Information
                            </CardTitle>
                            <CardDescription className="text-xs">Core details and classification of the petition</CardDescription>
                        </CardHeader>
                        <CardContent className="grid gap-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <p className="text-xs font-medium text-muted-foreground">Petition Number</p>
                                    <p className="text-sm font-medium">{petition.petition_number}</p>
                                </div>
                                <div>
                                    <p className="text-xs font-medium text-muted-foreground">Registry Number</p>
                                    <p className="text-sm">{petition.registry_number}</p>
                                </div>
                                <div>
                                    <p className="text-xs font-medium text-muted-foreground">Type</p>
                                    <p className="text-sm">{petition.petition_type}</p>
                                </div>
                                <div>
                                    <p className="text-xs font-medium text-muted-foreground">Nature</p>
                                    <p className="text-sm">{petition.petition_nature}</p>
                                </div>
                                <div>
                                    <p className="text-xs font-medium text-muted-foreground">Document Type</p>
                                    <p className="text-sm">{petition.document_type}</p>
                                </div>
                                <div>
                                    <p className="text-xs font-medium text-muted-foreground">Document Owner</p>
                                    <p className="text-sm">{petition.document_owner}</p>
                                </div>
                                <div>
                                    <p className="text-xs font-medium text-muted-foreground">Date of Filing</p>
                                    <div className="flex items-center gap-2">
                                        <Calendar className="size-3 text-muted-foreground" />
                                        <p className="text-sm">{petition.date_of_filing}</p>
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Errors to Correct */}
                    {petition.errors_to_correct && petition.errors_to_correct.length > 0 && (
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2 text-base">
                                    <FileText className="size-4" /> Errors to Correct
                                </CardTitle>
                                <CardDescription className="text-xs">List of corrections requested in this petition</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className="rounded-md border">
                                    <table className="w-full text-xs">
                                        <thead>
                                            <tr className="border-b bg-muted/50">
                                                <th className="p-2 text-left font-medium text-muted-foreground w-16">Item No.</th>
                                                <th className="p-2 text-left font-medium text-muted-foreground">Field/Description</th>
                                                <th className="p-2 text-left font-medium text-muted-foreground">Current Value</th>
                                                <th className="p-2 text-left font-medium text-muted-foreground">Corrected Value</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {  petition.errors_to_correct.map((error, index) => (
                                                <tr key={index} className="border-b last:border-0 hover:bg-muted/30">
                                                    <td className="p-2 font-medium">{error.item_number}</td>
                                                    <td className="p-2">{error.description}</td>
                                                    <td className="p-2 text-muted-foreground">{error.current_value}</td>
                                                    <td className="p-2 font-medium">{error.corrected_value}</td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </CardContent>
                        </Card>
                    )}
                </div>

                {/* Right Column: Workflow Timeline */}
                <div className="space-y-6">
                    <Card className="h-full">
                        <CardHeader>
                            <CardTitle>Workflow Timeline</CardTitle>
                            <CardDescription>Track the progress of the petition.</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="relative space-y-0">
                                {petitionSteps.map((step, index) => {
                                    const status = getStepStatus(step.value);
                                    const isLast = index === petitionSteps.length - 1;

                                    return (
                                        <div key={step.value} className="relative pb-8 last:pb-0">
                                            {!isLast && (
                                                <span 
                                                    className={cn(
                                                        "absolute top-4 left-4 -ml-px h-full w-0.5",
                                                        status === 'completed' ? "bg-primary" : "bg-muted"
                                                    )} 
                                                    aria-hidden="true" 
                                                />
                                            )}
                                            <div className="relative flex items-start space-x-3">
                                                <div className={cn(
                                                    "relative flex h-8 w-8 items-center justify-center rounded-full ring-8 ring-white",
                                                    status === 'completed' ? "bg-green-500" : 
                                                    status === 'current' ? "bg-primary" : "bg-muted"
                                                )}>
                                                    {status === 'completed' ? (
                                                        <CheckCircle2Icon className="h-5 w-5 text-white" aria-hidden="true" />
                                                    ) : status === 'current' ? (
                                                        <span className="h-2.5 w-2.5 rounded-full bg-white" aria-hidden="true" />
                                                    ) : (
                                                        <Lock className="h-4 w-4 text-muted-foreground" aria-hidden="true" />
                                                    )}
                                                </div>
                                                <div className="min-w-0 flex-1 pt-1.5">
                                                    <div className="flex justify-between items-start">
                                                        <div>
                                                            <p className={cn("text-sm font-medium", status === 'future' && "text-muted-foreground")}>
                                                                {step.label}
                                                            </p>
                                                            <p className="text-xs text-muted-foreground mt-0.5">
                                                                {step.description}
                                                            </p>
                                                        </div>
                                                    </div>
                                                    
                                                    <div className="mt-2">
                                                        {status === 'completed' && step.label !== 'Encoding' && (
                                                            <Button 
                                                                variant="outline" 
                                                                size="sm" 
                                                                className="h-7 text-xs"
                                                                onClick={() => handleDownload(step.value)}
                                                            >
                                                                <DownloadIcon className="mr-1.5 size-3" />
                                                                Download
                                                            </Button>
                                                        )}
                                                        
                                                        {status === 'current' && (
                                                            <Button 
                                                                size="sm" 
                                                                className="h-7 text-xs"
                                                                onClick={() => setSelectedRecord(petition)}
                                                            >
                                                                Proceed <ArrowRight className="ml-1.5 size-3" />
                                                            </Button>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>

            {/* Modals */}
            <PostingNotice
                // open={selectedRecord?.next_step === 'Notice of Posting'}
                // onOpenChange={() => setSelectedRecord(null)}
                selectedRecord={selectedRecord}
                setSelectedRecord={setSelectedRecord}
            />
            <PostingCertificate
                // open={selectedRecord?.next_step === 'Certificate of Posting'}
                // onOpenChange={() => setSelectedRecord(null)}
                selectedRecord={selectedRecord}
                setSelectedRecord={setSelectedRecord}
            />
            <RecordSheet
                // open={selectedRecord?.next_step === 'Record Sheet'}
                // onOpenChange={() => setSelectedRecord(null)}
                selectedRecord={selectedRecord}
                setSelectedRecord={setSelectedRecord}
            />
            <CertificateOfFinality
                // open={selectedRecord?.next_step === 'Certificate of Finality'}
                // onOpenChange={() => setSelectedRecord(null)}
                selectedRecord={selectedRecord}
                setSelectedRecord={setSelectedRecord}
            />
        </div>
    );
}

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Petitions',
        href: petitions.index().url,
    },
    {
        title: 'View Petition',
        href: "#",
    },
];

Show.layout = (page: React.ReactNode) => (
    <AppLayout children={page} breadcrumbs={breadcrumbs} />
);

export default Show;
