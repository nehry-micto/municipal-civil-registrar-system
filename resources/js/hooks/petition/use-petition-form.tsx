import { Client, PetitionForm } from '@/types';
import { useForm } from '@inertiajs/react';
import { useState } from 'react';

const usePetitionForm = () => {
    const {
        data: formData,
        setData,
        errors,
        reset,
    } = useForm<PetitionForm>({
        client_id: '',
        registry_number: '',
        date_of_filing: '',
        document_type: '',
        document_owner: '',
        petition_nature: '',
        errors_to_correct: [],
        priority: '0',
    });

    const [selectedClient, setSelectedClient] = useState<Client | null>(null);

    const addErrorCorrection = () => {
        setData('errors_to_correct', [
            ...formData.errors_to_correct,
            {
                item_number: '',
                description: '',
                current_value: '',
                corrected_value: '',
            },
        ]);
    };

    const removeErrorCorrection = (index: number) => {
        setData('errors_to_correct', [
            ...formData.errors_to_correct.slice(0, index),
            ...formData.errors_to_correct.slice(index + 1),
        ]);
    };

    const updateErrorCorrection = (
        index: number,
        description: string,
        value: string,
    ) => {
        setData('errors_to_correct', [
            ...formData.errors_to_correct.slice(0, index),
            { ...formData.errors_to_correct[index], [description]: value },
            ...formData.errors_to_correct.slice(index + 1),
        ]);
    };

    return {
        formData,
        addErrorCorrection,
        removeErrorCorrection,
        updateErrorCorrection,
        reset,
        setData,
        errors,
        selectedClient,
        setSelectedClient,
    };
};

export default usePetitionForm;
