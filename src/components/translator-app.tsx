import { AppComboBox } from "./app-como-box";
import {
	ChevronDown,
	RefreshCw,
	Loader,
	Copy,
	Check,
	Play,
} from "lucide-react";
import { Button } from "./ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Textarea } from "./ui/textarea";
import useTranslate from "@/stores/translate";
import { useEffect, useMemo, useRef, useState } from "react";
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
	const inputTextareaRef = useRef<HTMLTextAreaElement | null>(null);
	const translateTextareaRef = useRef<HTMLTextAreaElement | null>(null);
	const [isClipboardClicked, setIsClipboardClicked] = useState(false);
	const voices = useMemo(() => {
		return speechSynthesis
			.getVoices()
			.filter((voice) => voice.lang === secondLanguage.value);
	}, [secondLanguage]);

	useEffect(() => {
		if (error) {
			toast.error(error.message);
		}
	}, [error]);

	const translateButtonClickHandler = async () => {
		if (inputTextareaRef.current) {
			const { value: query } = inputTextareaRef.current;
			const data = await getTranslateData(query);
			const error = useTranslate.getState().error;
			if (!error && translateTextareaRef.current) {
				const translatedText = data?.responseData.translatedText;
				translateTextareaRef.current.value = translatedText
					? decodeURI(translatedText)
					: "";
			} else if (error && !!translateTextareaRef.current) {
				translateTextareaRef.current.value = "";
			}
		}
	};
	const swapLanguageHandler = () => {
		swapLanguages();
		if (inputTextareaRef.current && translateTextareaRef.current) {
			const translateTextareaValue = translateTextareaRef.current.value;
			const inputTextareaValue = inputTextareaRef.current.value;
			[inputTextareaRef.current.value, translateTextareaRef.current.value] = [
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

	const playPronunciationAudio = () => {
		if (voices.length > 0 && translateTextareaRef.current) {
			const { value } = translateTextareaRef.current;
			if (value.length > 0) {
				const message = new SpeechSynthesisUtterance(value);
				message.voice = voices[0];
				speechSynthesis.speak(message);
			}
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
							ref={inputTextareaRef}
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
							ref={translateTextareaRef}
							dir={secondLanguage.dir}
							className="placeholder:text-left text-sm sm:text-base relative"
						/>
						<div className="flex  justify-between">
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
							<TooltipProvider>
								<Tooltip>
									<TooltipTrigger asChild>
										{translateData && voices.length > 0 && (
											<Button
												variant="outline"
												size="icon"
												onClick={playPronunciationAudio}
											>
												<Play />
											</Button>
										)}
									</TooltipTrigger>
									<TooltipContent>
										<p>Play pronunciation</p>
									</TooltipContent>
								</Tooltip>
							</TooltipProvider>
						</div>
					</CardContent>
				</Card>
			</section>
		</main>
	);
};
export default TranslatorApp;
