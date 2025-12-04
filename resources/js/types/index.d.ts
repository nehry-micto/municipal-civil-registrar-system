import { InertiaLinkProps } from '@inertiajs/react';
import { LucideIcon } from 'lucide-react';

export interface Auth {
    user: User;
}

export interface BreadcrumbItem {
    title: string;
    href: string;
}

export interface NavGroup {
    title: string;
    items: NavItem[];
}

export interface NavItem {
    title: string;
    href: NonNullable<InertiaLinkProps['href']>;
    icon?: LucideIcon | null;
    isActive?: boolean;
}

export interface SharedData {
    name: string;
    quote: { message: string; author: string };
    auth: Auth;
    sidebarOpen: boolean;
    [key: string]: unknown;
}

export interface User {
    id: number;
    name: string;
    email: string;
    avatar?: string;
    email_verified_at: string | null;
    two_factor_enabled?: boolean;
    created_at: string;
    updated_at: string;
    [key: string]: unknown; // This allows for additional properties...
}

export interface Client {
    id: string;
    client_code: string | null;
    first_name: string;
    last_name: string;
    middle_name: string | null;
    suffix: string | null;
    contact_number: string | null;
    full_name: string;
    created_at: string;
    updated_at: string;
    deleted_at?: string | null;
}

export interface ErrorsToCorrect {
    item_number: number;
    description: string;
    current_value: string;
    corrected_value: string;
}

export interface NoticeData {
    notice_posting_date?: string;
}

export interface CertificateData {
    start_date?: string;
    end_date?: string;
    posting_date?: string;
}

export interface RecordSheetData {
    first_published_at?: string;
    second_published_at?: string;
    rendered_date?: string;
    decision?: number | string;
    remarks?: string;
}

export interface FinalityData {
    certificate_number?: string;
    released_at?: string;
    notes?: string;
}

export interface PetitionForm {
    client_id: string;
    petition_number: string;
    registry_number: string;
    date_of_filing: string;
    document_type: string;
    document_owner: string;
    petition_type: string;
    petition_nature: string;
    errors_to_correct: ErrorsToCorrect[];
    priority: string;
    notice?: NoticeData | null;
    certificate?: CertificateData | null;
    record_sheet?: RecordSheetData | null;
    finality?: FinalityData | null;
}

export interface Petition extends PetitionForm {
    id: string;
    next_step: string;
    next_step_id: string;
    current_step: number;
    created_at: string;
    updated_at: string;
    client: Client;
    deleted_at?: string | null;
}
interface Option {
    value: string;
    label: string;
}

export type DocumentType = Option;

export type Priority = Option;

export type PetitionType = Option;

export interface ConfigurationData {
    civil_registry_head: {
        name: string;
        position: string;
    };
    mayor: {
        name: string;
        position: string;
    };
    municipality: string;
    province: string;
}

export interface Configuration {
    id: number;
    version: number;
    data: ConfigurationData;
    created_at: string;
    updated_at: string;
}
