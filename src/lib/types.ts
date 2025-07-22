import { z } from "zod";

export const urlSchema = z.object({
    url: z.string().url() //FIXME need to preprocess so that if example.com is entered gets coverted to https://example.com currently it gives invalid url
});

export type UrlFormData = z.infer<typeof urlSchema>;

export type ApiResponse<T> = {
    success: boolean;
    data?: T;
    error?: string;
}

export type Url = {
    id: number;
    originalUrl: string;
    shortCode: string;
    clicks: number;
    createdAt: string;
    updatedAt: string;
}