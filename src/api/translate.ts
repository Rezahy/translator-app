import { Translate } from "@/@types/translate";
import axiosInstance from "@/services/axios/axiosInstance";

class TranslateApi {
	static async getTranslateData(
		query: string,
		firstLanguage: string,
		secondLanguage: string
	) {
		// ! This code below show space with %2520 instead %20
		// const response = await axiosInstance.get("get", {
		// 	params: {
		// 		q: encodeURI(query),
		// 		langpair: `${firstLanguage}|${secondLanguage}`,
		// 	},
		// });
		const response = await axiosInstance.get(
			`get?q=${encodeURIComponent(
				query
			)}&langpair=${firstLanguage}|${secondLanguage}`
		);
		if (response.status !== 200) {
			throw new Error("Something went wrong!");
		}
		if (response.data.responseStatus !== 200) {
			throw new Error("invalid language pair specified");
		}
		if (!response.data.responseData.translatedText) {
			throw new Error("Sorry.we could't find anything");
		}
		return response.data as Translate;
	}
}

export default TranslateApi;
