import { z } from "zod";

export const urlSchema = z.object({
    url: z.url("Please enter a valid URL")
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