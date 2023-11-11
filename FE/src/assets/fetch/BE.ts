import { BACKEND_URL } from '../env';

type FetchOptions = Omit<RequestInit, "body"> & { body?: Record<string, unknown> };


export const BackendFetch = async (url: string, options?: FetchOptions) =>
    fetch(`${BACKEND_URL}${url}`, {
        ...options,
        headers: {
            'Content-Type': 'application/json',
            ...options?.headers,
        },
        body: JSON.stringify(options?.body),
    });

