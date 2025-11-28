import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { PetitionForm } from '@/types';

interface FinalityStepProps {
    data: PetitionForm;
    setData: (key: keyof PetitionForm, value: any) => void;
}

const FinalityStep = ({ data, setData }: FinalityStepProps) => {
    if (!data.finality) return null;

    return (
        <Card>
            <CardHeader>
                <CardTitle className="text-base">Certificate of Finality</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
                <div className="space-y-2">
                    <Label>Certificate Number</Label>
                    <Input
                        value={data.finality.certificate_number || ''}
                        onChange={(e) =>
                            setData('finality', {
                                ...data.finality,
                                certificate_number: e.target.value,
                            })
                        }
                    />
                </div>
                <div className="space-y-2">
                    <Label>Released At</Label>
                    <Input
                        type="date"
                        value={
                            data.finality.released_at
                                ? new Date(data.finality.released_at)
                                      .toISOString()
                                      .split('T')[0]
                                : ''
                        }
                        onChange={(e) =>
                            setData('finality', {
                                ...data.finality,
                                released_at: e.target.value,
                            })
                        }
                    />
                </div>
                <div className="space-y-2">
                    <Label>Notes</Label>
                    <Textarea
                        value={data.finality.notes || ''}
                        onChange={(e) =>
                            setData('finality', {
                                ...data.finality,
                                notes: e.target.value,
                            })
                        }
                    />
                </div>
            </CardContent>
        </Card>
    );
};

export default FinalityStep;
