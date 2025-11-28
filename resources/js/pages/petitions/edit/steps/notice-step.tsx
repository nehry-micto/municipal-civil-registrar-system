import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { PetitionForm } from '@/types';

interface NoticeStepProps {
    data: PetitionForm;
    setData: (key: keyof PetitionForm, value: any) => void;
}

const NoticeStep = ({ data, setData }: NoticeStepProps) => {
    if (!data.notice) return null;

    return (
        <Card>
            <CardHeader>
                <CardTitle className="text-base">Notice of Posting</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
                <div className="space-y-2">
                    <Label>Posting Date</Label>
                    <Input
                        type="date"
                        value={data.notice.notice_posting_date || ''}
                        onChange={(e) =>
                            setData('notice', {
                                ...data.notice,
                                notice_posting_date: e.target.value,
                            })
                        }
                    />
                </div>
            </CardContent>
        </Card>
    );
};

export default NoticeStep;
