import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { PetitionForm } from '@/types';

interface RecordSheetStepProps {
    data: PetitionForm;
    setData: (key: keyof PetitionForm, value: any) => void;
}

const RecordSheetStep = ({ data, setData }: RecordSheetStepProps) => {
    if (!data.record_sheet) return null;

    return (
        <Card>
            <CardHeader>
                <CardTitle className="text-base">Record Sheet</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                        <Label>First Published</Label>
                        <Input
                            type="date"
                            value={data.record_sheet.first_published_at || ''}
                            onChange={(e) =>
                                setData('record_sheet', {
                                    ...data.record_sheet,
                                    first_published_at: e.target.value,
                                })
                            }
                        />
                    </div>
                    <div className="space-y-2">
                        <Label>Second Published</Label>
                        <Input
                            type="date"
                            value={data.record_sheet.second_published_at || ''}
                            onChange={(e) =>
                                setData('record_sheet', {
                                    ...data.record_sheet,
                                    second_published_at: e.target.value,
                                })
                            }
                        />
                    </div>
                </div>
                <div className="space-y-2">
                    <Label>Rendered Date</Label>
                    <Input
                        type="date"
                        value={data.record_sheet.rendered_date || ''}
                        onChange={(e) =>
                            setData('record_sheet', {
                                ...data.record_sheet,
                                rendered_date: e.target.value,
                            })
                        }
                    />
                </div>
                <div className="space-y-2">
                    <Label>Decision</Label>
                    <Select
                        value={data.record_sheet.decision?.toString()}
                        onValueChange={(value) =>
                            setData('record_sheet', {
                                ...data.record_sheet,
                                decision: value,
                            })
                        }
                    >
                        <SelectTrigger>
                            <SelectValue placeholder="Select decision" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="1">Approved</SelectItem>
                            <SelectItem value="0">Denied</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
                <div className="space-y-2">
                    <Label>Remarks</Label>
                    <Textarea
                        value={data.record_sheet.remarks || ''}
                        onChange={(e) =>
                            setData('record_sheet', {
                                ...data.record_sheet,
                                remarks: e.target.value,
                            })
                        }
                    />
                </div>
            </CardContent>
        </Card>
    );
};

export default RecordSheetStep;
