import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Client, ErrorsToCorrect, PetitionForm } from '@/types';

const PetitionSummary = ({
    formData,
    selectedClient,
}: {
    formData: PetitionForm;
    selectedClient: Client | null;
}) => {
    if (!formData.client_id) return null;

    return (
        <Card className="mt-6 border-1">
            <CardHeader className="pb-3">
                <CardTitle className="text-lg">Petition Summary</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 text-sm">
                <div className="flex justify-between">
                    <span className="text-gray-600">Petitioner:</span>
                    <span className="font-semibold">
                        {selectedClient?.full_name}
                    </span>
                </div>
                {formData.registry_number && (
                    <div className="flex justify-between">
                        <span className="text-gray-600">Registry Number:</span>
                        <span className="font-semibold">
                            {formData.registry_number}
                        </span>
                    </div>
                )}
                {formData.document_owner && (
                    <div className="flex justify-between">
                        <span className="text-gray-600">Document Owner:</span>
                        <span className="font-semibold">
                            {formData.document_owner}
                        </span>
                    </div>
                )}
                {formData.errors_to_correct.filter(
                    (e: ErrorsToCorrect) => e.description,
                ).length > 0 && (
                    <div className="flex justify-between">
                        <span className="text-gray-600">
                            Errors to Correct:
                        </span>
                        <Badge variant="secondary">
                            {
                                formData.errors_to_correct.filter(
                                    (e) => e.description,
                                ).length
                            }{' '}
                            error(s)
                        </Badge>
                    </div>
                )}
            </CardContent>
        </Card>
    );
};

export default PetitionSummary;
