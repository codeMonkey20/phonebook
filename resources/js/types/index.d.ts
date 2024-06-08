export interface User {
    id: number;
    name: string;
    email: string;
    email_verified_at: string;
}

export type PageProps<
    T extends Record<string, unknown> = Record<string, unknown>
> = T & {
    auth: {
        user: User;
    };
};

export interface GraphQL {
    data?: any;
    errors?: any[];
}

export interface PhoneDirectory {
    id: number;
    name: string;
    phone_number: string;
    created_at: string;
    updated_at: string;
}

export interface PaginatorInfo {
    count: number;
    currentPage: number;
    hasMorePages: boolean;
    total: number;
    perPage: number;
    firstItem: number;
    lastItem: number;
    lastPage: number;
}
