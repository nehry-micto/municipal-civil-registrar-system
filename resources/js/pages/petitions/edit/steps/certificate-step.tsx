import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { PetitionForm } from '@/types';

interface CertificateStepProps {
    data: PetitionForm;
    setData: (key: keyof PetitionForm, value: any) => void;
}

const CertificateStep = ({ data, setData }: CertificateStepProps) => {
    if (!data.certificate) return null;

    return (
        <Card>
            <CardHeader>
                <CardTitle className="text-base">Certificate of Posting</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                        <Label>Start Date</Label>
                        <Input
                            type="date"
                            value={data.certificate.start_date || ''}
                            onChange={(e) =>
                                setData('certificate', {
                                    ...data.certificate,
                                    start_date: e.target.value,
                                })
                            }
                        />
                    </div>
                    <div className="space-y-2">
                        <Label>End Date</Label>
                        <Input
                            type="date"
                            value={data.certificate.end_date || ''}
                            onChange={(e) =>
                                setData('certificate', {
                                    ...data.certificate,
                                    end_date: e.target.value,
                                })
                            }
                        />
                    </div>
                </div>
            </CardContent>
        </Card>
    );
};

export default CertificateStep;
