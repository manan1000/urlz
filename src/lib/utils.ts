import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}


export function isValidUrl(url:string):boolean {
  try {
    const urlObj = new URL(url.trim())
    return urlObj.protocol === "http:" || urlObj.protocol === "https:";
  } catch (error) {
    return false;
  }
}

export function ensureHttps(url:string):string {
  const urlObj = new URL(url.trim());
  if(urlObj.protocol==="http:"){
    urlObj.protocol="https:";
  }

  return urlObj.toString();
}


export function normalizeUrl(input: string): string | null {
  const trimmed = input.trim();

  // Prepend https:// if missing
  const fixed = /^https?:\/\//i.test(trimmed)
    ? trimmed
    : `https://${trimmed}`;

  try {
    const url = new URL(fixed);

    // Accept only http or https
    if (url.protocol === "http:" || url.protocol === "https:") {
      return url.toString();
    }

    return null;
  } catch {
    return null;
  }
}
