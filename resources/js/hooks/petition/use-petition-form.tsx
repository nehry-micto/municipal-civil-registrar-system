import { Client, PetitionForm } from '@/types';
import { useForm } from '@inertiajs/react';
import { useState } from 'react';

const usePetitionForm = () => {
    const {
        data: formData,
        setData,
        errors,
        reset,
        post,
        processing,
    } = useForm<PetitionForm>({
        client_id: '',
        petition_number: '',
        registry_number: '',
        date_of_filing: new Date().toISOString().split('T')[0],
        document_type: '',
        petition_type: '0',
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
        processing,
        post,
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
