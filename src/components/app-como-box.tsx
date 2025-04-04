import * as React from "react";
import { Check, ChevronsUpDown } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
	Command,
	CommandEmpty,
	CommandGroup,
	CommandInput,
	CommandItem,
	CommandList,
} from "@/components/ui/command";
import {
	Popover,
	PopoverContent,
	PopoverTrigger,
} from "@/components/ui/popover";
import { languagesAsLanguageTypeData } from "@/lib/languages";
import useMediaQuery from "@/hooks/use-media-query";
import { DrawerContent, DrawerTrigger, Drawer } from "./ui/drawer";
import { Language } from "@/@types/language";

const languages = languagesAsLanguageTypeData;
type AppComboBoxProps = {
	value: string;
	setValue: (lang: Language) => void;
};
export function AppComboBox({ value, setValue }: AppComboBoxProps) {
	const [open, setOpen] = React.useState(false);
	const isDesktop = useMediaQuery("(min-width: 768px)");
	if (isDesktop) {
		return (
			<Popover open={open} onOpenChange={setOpen}>
				<PopoverTrigger asChild>
					<Button
						variant="outline"
						role="combobox"
						aria-expanded={open}
						className="w-full justify-between"
					>
						{value
							? languages.find((lang) => lang.value === value)?.label
							: "Select language"}
						<ChevronsUpDown className="opacity-50" />
					</Button>
				</PopoverTrigger>
				<PopoverContent className="w-full p-0">
					<AppCommand value={value} setOpen={setOpen} setValue={setValue} />
				</PopoverContent>
			</Popover>
		);
	}
	return (
		<Drawer open={open} onOpenChange={setOpen}>
			<DrawerTrigger asChild>
				<Button
					variant="outline"
					role="combobox"
					aria-expanded={open}
					className="w-full justify-between text-xs"
				>
					{value
						? languages.find((lang) => lang.value === value)?.label
						: "Select language"}
					<ChevronsUpDown className="opacity-50" />
				</Button>
			</DrawerTrigger>
			<DrawerContent>
				<div className="mt-4 border-t">
					<AppCommand value={value} setOpen={setOpen} setValue={setValue} />
					{/* <StatusList setOpen={setOpen} setSelectedStatus={setSelectedStatus} /> */}
				</div>
			</DrawerContent>
		</Drawer>
	);
}
type AppCommandProps = {
	value: string;
	setOpen: React.Dispatch<React.SetStateAction<boolean>>;
	setValue: (lang: Language) => void;
};
const AppCommand = ({ setOpen, value, setValue }: AppCommandProps) => {
	return (
		<Command>
			<CommandInput placeholder="Search language" />
			<CommandList>
				<CommandEmpty>No language found.</CommandEmpty>
				<CommandGroup>
					{languages.map((lang) => (
						<CommandItem
							key={lang.value}
							value={lang.label}
							onSelect={(currentValue) => {
								const value = languages.find(
									(lang) => lang.label === currentValue
								)!;
								setValue(value);
								setOpen(false);
							}}
						>
							{lang.label}
							<Check
								className={cn(
									"ml-auto",
									value === lang.value ? "opacity-100" : "opacity-0"
								)}
							/>
						</CommandItem>
					))}
				</CommandGroup>
			</CommandList>
		</Command>
	);
};
export default AppCommand;
