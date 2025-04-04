import TranslatorApp from "./components/translator-app";
import { Toaster } from "sonner";
import { useTheme } from "./providers/theme-provider";

const App = () => {
	const { theme } = useTheme();
	return (
		<>
			<TranslatorApp />
			<Toaster theme={theme} />
		</>
	);
};
export default App;
