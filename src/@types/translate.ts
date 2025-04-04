export interface Translate {
	responseData: TranslateResponseData;
	quotaFinished: boolean;
	responseDetails: string;
	responseStatus: number;
}

export interface TranslateResponseData {
	translatedText: string;
	match: number;
}
