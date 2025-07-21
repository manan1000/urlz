import { ApiResponse } from "@/lib/types";
import { ensureHttps } from "@/lib/utils";
import { z } from "zod";
import { customAlphabet } from 'nanoid';
import {prisma} from "@/lib/prisma";
import { revalidatePath } from "next/cache";


const shortenUrlSchema = z.object({
    url: z.url(),
});


const alphabet = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
const nanoid = customAlphabet(alphabet, 8);




export async function shortenUrl(formData: FormData): Promise<
    ApiResponse<{
        shortUrl: string
    }>
> {

    try {
        const url = formData.get('url') as string;

        const validatedFields = shortenUrlSchema.safeParse({ url });

        if(!validatedFields.success){
            return {
                success: false,
                error: validatedFields.error.flatten().fieldErrors.url?.[0] || "invalid URL"
            }
        }

        const originalUrl = ensureHttps(validatedFields.data.url);

        const existing = await prisma.url.findFirst({
            where: {originalUrl}
        });

        if(existing){
            return {
                success: true,
                data: {
                    shortUrl: `${process.env.PUBLIC_BASE_URL}/${existing.shortCode}`
                },
            };
        }

        const shortCode = nanoid(); // 8-character unique code
        const newUrl = await prisma.url.create({
            data: {
                originalUrl: originalUrl,
                shortCode: shortCode
            }
        });
        
        revalidatePath("/");

        return {
            success: true,
            data: {
                shortUrl: `${process.env.PUBLIC_BASE_URL}/${newUrl.shortCode}`
            },
        }

    } catch (error) {
        console.error("Error in shortenUrl: ", error);
        return {
            success: false,
            error: "Something went wrong.",
        };
    }
}

