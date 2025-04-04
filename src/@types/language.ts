import { languages } from "@/lib/languages";

export type Dir = "ltr" | "rtl";

export type LanguageCode = keyof typeof languages;

export type Language = {
	label: (typeof languages)[keyof typeof languages];
	value: LanguageCode;
	dir: Dir;
};
