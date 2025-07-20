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


export function UrlShortenerForm(){

    const form = useForm<UrlFormData>({
        resolver: zodResolver(urlSchema),
        defaultValues: {
            url: "",
        },
    });


    return (
        <div className="w-full max-w-2xl mx-auto">
            <Form {...form} >
                <form className="space-y-4">
                    <div className="flex flex-col sm:flex-row gap-2">
                        <FormField 
                            control={form.control}
                            name="url"
                            render={({field}) => (
                                <FormItem className="flex-1">
                                    <FormControl>
                                        <Input placeholder="Paste your long URL here" {...form} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <Button type="submit" disabled={false} >
                            Shorten
                        </Button>
                    </div>
                </form>

            </Form>
        </div>
    );
}