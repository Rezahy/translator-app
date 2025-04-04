import { Language } from "@/@types/language";
import { Translate } from "@/@types/translate";
import TranslateApi from "@/api/translate";
import { create } from "zustand";
import { immer } from "zustand/middleware/immer";

type State = {
	firstLanguage: Omit<Language, "label">;
	secondLanguage: Omit<Language, "label">;
	translateData: Translate | null;
	loading: boolean;
	error: Error | null;
};
type Actions = {
	swapLanguages: () => void;
	getTranslateData: (query: string) => Promise<Translate | undefined>;
	changeFirstLanguage: (lang: Language) => void;
	changeSecondLanguage: (lang: Language) => void;
	isValidate: () => boolean;
};

const useTranslate = create<State & Actions>()(
	immer((set, get) => ({
		firstLanguage: {
			value: "en-GB",
			dir: "ltr",
		},
		secondLanguage: {
			value: "no-NO",
			dir: "ltr",
		},
		translateData: null,
		loading: false,
		error: null,
		swapLanguages: () => {
			set((state) => {
				[state.firstLanguage, state.secondLanguage] = [
					state.secondLanguage,
					state.firstLanguage,
				];
			});
		},
		getTranslateData: async (query: string) => {
			set((state) => {
				state.translateData = null;
				state.loading = true;
				state.error = null;
			});
			try {
				if (query.trim().length === 0) {
					throw new Error("The text is empty");
				}
				if (get().isValidate()) {
					const data = await TranslateApi.getTranslateData(
						query,
						get().firstLanguage.value,
						get().secondLanguage.value
					);
					set((state) => {
						state.translateData = data;
						state.loading = false;
						state.error = null;
					});
					return data;
				}
			} catch (error) {
				console.log(error);
				set((state) => {
					state.loading = false;
					state.translateData = null;
					state.error = error as Error;
				});
			}
		},
		isValidate: () => {
			if (
				get().firstLanguage.value.length === 0 &&
				get().secondLanguage.value.length === 0
			) {
				throw new Error("please select two distinct languages");
			} else if (
				get().firstLanguage.value.length === 0 ||
				get().secondLanguage.value.length === 0
			) {
				throw new Error("Language input is empty");
			} else {
				return true;
			}
		},
		changeFirstLanguage: (lang: Language) => {
			set((state) => {
				state.firstLanguage = lang;
			});
		},
		changeSecondLanguage: (lang: Language) => {
			set((state) => {
				state.secondLanguage = lang;
			});
		},
	}))
);

export default useTranslate;
