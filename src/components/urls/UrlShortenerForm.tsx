"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { UrlFormData, urlSchema } from "@/lib/types";
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";
import { shortenUrl } from "@/server/actions/urls/shortenUrl";
import { Card, CardContent } from "@/components//ui/card";
import { Copy } from "lucide-react";
import { toast } from "sonner"


export function UrlShortenerForm() {

    const router = useRouter();
    const pathname = usePathname();

    const [shortUrl, setShortUrl] = useState<string | null>(null);
    const [shortCode, setShortCode] = useState<string | null>(null); // TODO combine const [result, setResult] = useState<{ shortUrl: string; shortCode: string } | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);

    const form = useForm<UrlFormData>({
        resolver: zodResolver(urlSchema),
        defaultValues: {
            url: "",
        },
    });

    const onSubmit = async (data: UrlFormData) => {

        setIsLoading(true);
        setError(null);
        setShortUrl(null);
        setShortCode(null);

        try {
            const formData = new FormData();
            formData.append("url", data.url);

            const response = await shortenUrl(formData);
            if (response.success && response.data) {
                setShortUrl(response.data.shortUrl);
                

                //extract shorCode from the url
                const shortCodeMatch = response.data.shortUrl.match(/\/([^/]+)$/);
                if (shortCodeMatch && shortCodeMatch[1]) {
                    setShortCode(shortCodeMatch[1]);
                } else {
                    setError(response.error ?? "Something went wrong");
                }
            }

        } catch (error) {
            setError("An error occured.Please try again later")
            console.error(error);
        } finally {
            setIsLoading(false);
        }
    };

    const copyToClipboard = async () => {
        if (!shortUrl) return;

        try {
            await navigator.clipboard.writeText(shortUrl);
            toast.success('URL copied to clipboard');
        } catch (error) {
            console.error(error);
            toast.error('Failed to copy!');
        }
    };

    return (
        <div className="w-full max-w-2xl mx-auto">
            <Form {...form} >
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                    <div className="flex flex-col sm:flex-row gap-2">
                        <FormField
                            control={form.control}
                            name="url"
                            render={({ field }) => (
                                <FormItem className="flex-1">
                                    <FormControl>
                                        <Input placeholder="Paste your long URL here" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <Button type="submit" disabled={isLoading} >
                            {isLoading ? (
                                <>
                                    <span className="mr-2 size-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                                    Shortening...
                                </>
                            ) : (
                                "Shorten"
                            )}
                        </Button>
                    </div>

                    {error && (
                        <div className="p-3 bg-destructive/10 text-destructive rounded-md text-sm">
                            {error}
                        </div>
                    )}

                    {shortUrl && (  // TODO Consider moving the result display into its own component like <ShortenedUrlCard url={shortUrl} />

                        <Card>
                            <CardContent className="p-4">
                                <p className="text-sm font-medium text-muted-foreground mb-2">
                                    Your shortened URL:
                                </p>
                                <div className="flex items-center gap-2">
                                    <Input type="text" value={shortUrl} readOnly className="font-medium" />
                                    <Button onClick={copyToClipboard} type="button" variant={"outline"} className="flex-shrink-0">
                                        <Copy className="size-4 mr-1" />
                                        Copy
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>
                    )}
                </form>

            </Form>
        </div>
    );
}