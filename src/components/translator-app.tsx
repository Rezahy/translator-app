import { AppComboBox } from "./app-como-box";
import { ChevronDown, RefreshCw, Loader, Copy, Check } from "lucide-react";
import { Button } from "./ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Textarea } from "./ui/textarea";
import useTranslate from "@/stores/translate";
import { useEffect, useRef, useState } from "react";
import {
	Tooltip,
	TooltipContent,
	TooltipProvider,
	TooltipTrigger,
} from "./ui/tooltip";
import copy from "copy-to-clipboard";
import { toast } from "sonner";
import { ModeToggle } from "./mode-toggle";

const TranslatorApp = () => {
	const firstLanguage = useTranslate((state) => state.firstLanguage);
	const secondLanguage = useTranslate((state) => state.secondLanguage);
	const translateData = useTranslate((state) => state.translateData);
	const loading = useTranslate((state) => state.loading);
	const error = useTranslate((state) => state.error);
	const changeFirstLanguage = useTranslate(
		(state) => state.changeFirstLanguage
	);
	const changeSecondLanguage = useTranslate(
		(state) => state.changeSecondLanguage
	);
	const getTranslateData = useTranslate((state) => state.getTranslateData);
	const swapLanguages = useTranslate((state) => state.swapLanguages);
	const inputTextarea = useRef<HTMLTextAreaElement | null>(null);
	const translateTextarea = useRef<HTMLTextAreaElement | null>(null);
	const [isClipboardClicked, setIsClipboardClicked] = useState(false);

	useEffect(() => {
		if (error) {
			toast.error(error.message);
		}
	}, [error]);

	const translateButtonClickHandler = async () => {
		if (inputTextarea.current) {
			const { value: query } = inputTextarea.current;
			const data = await getTranslateData(query);
			const error = useTranslate.getState().error;
			if (!error && translateTextarea.current) {
				const translatedText = data?.responseData.translatedText;
				translateTextarea.current.value = translatedText
					? decodeURI(translatedText)
					: "";
			} else if (error && !!translateTextarea.current) {
				translateTextarea.current.value = "";
			}
		}
	};
	const swapLanguageHandler = () => {
		swapLanguages();
		if (inputTextarea.current && translateTextarea.current) {
			const translateTextareaValue = translateTextarea.current.value;
			const inputTextareaValue = inputTextarea.current.value;
			[inputTextarea.current.value, translateTextarea.current.value] = [
				translateTextareaValue,
				inputTextareaValue,
			];
		}
	};
	const copyToClipboard = () => {
		const translatedText = translateData?.responseData.translatedText;
		if (translatedText) {
			copy(translatedText);
			setIsClipboardClicked(true);
			toast.success("Copied to clipboard");
			setTimeout(() => {
				setIsClipboardClicked(false);
			}, 5000);
		}
	};
	return (
		<main className="w-screen h-screen flex justify-center items-center px-5 sm:px-10 py-10">
			<section className="w-lg">
				<Card>
					<CardHeader className="flex justify-between items-center">
						<CardTitle>Translator app</CardTitle>
						<ModeToggle />
					</CardHeader>
					<CardContent className="flex flex-col  gap-y-3">
						<div className="flex space-x-3">
							<div className="flex-1">
								<AppComboBox
									value={firstLanguage.value}
									setValue={changeFirstLanguage}
								/>
							</div>
							<Button
								variant="outline"
								size="icon"
								onClick={swapLanguageHandler}
							>
								<RefreshCw />
							</Button>
							<div className="flex-1 ">
								<AppComboBox
									value={secondLanguage.value}
									setValue={changeSecondLanguage}
								/>
							</div>
						</div>
						<Textarea
							placeholder="Enter text"
							ref={inputTextarea}
							dir={firstLanguage.dir}
							className="placeholder:text-left text-sm sm:text-base"
						/>
						<Button
							variant="outline"
							size="icon"
							className="mx-auto"
							disabled={loading}
							onClick={translateButtonClickHandler}
						>
							{loading ? <Loader className="animate-spin" /> : <ChevronDown />}
						</Button>
						<Textarea
							placeholder="Translation"
							readOnly
							ref={translateTextarea}
							dir={secondLanguage.dir}
							className="placeholder:text-left text-sm sm:text-base relative"
						/>
						<TooltipProvider>
							<Tooltip>
								<TooltipTrigger asChild>
									{translateData && (
										<Button
											variant="outline"
											size="icon"
											onClick={copyToClipboard}
										>
											{isClipboardClicked ? <Check /> : <Copy />}
										</Button>
									)}
								</TooltipTrigger>
								<TooltipContent>
									<p>Copy to clipboard</p>
								</TooltipContent>
							</Tooltip>
						</TooltipProvider>
					</CardContent>
				</Card>
			</section>
		</main>
	);
};
export default TranslatorApp;
