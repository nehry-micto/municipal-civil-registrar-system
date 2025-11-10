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
}

export interface ErrorsToCorrect {
    item_number: string;
    description: string;
    current_value: string;
    corrected_value: string;
}

export interface PetitionForm {
    client_id: string;
    registry_number: string;
    date_of_filing: string;
    document_type: string;
    document_owner: string;
    petition_type: string;
    petition_nature: string;
    errors_to_correct: ErrorsToCorrect[];
    priority: string;
}
interface Option {
    value: string;
    label: string;
}

export type DocumentType = Option;

export type Priority = Option;
