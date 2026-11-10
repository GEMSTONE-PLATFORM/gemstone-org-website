type ClassValue = string | false | null | undefined;

/**
 * Joins optional class names without changing the component's token classes.
 * Kept local so the primitives do not require a styling runtime dependency.
 */
export function cn(...values: ClassValue[]): string {
  return values.filter(Boolean).join(" ");
}

export { safeExternalRel } from "@/lib/external-links";
