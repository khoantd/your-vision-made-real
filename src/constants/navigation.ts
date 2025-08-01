import { MessageSquare, Radio, Image, Hammer, History } from "lucide-react";
import { NavigationItem } from "@/types";

export const NAVIGATION_ITEMS: NavigationItem[] = [
  { icon: MessageSquare, label: "Chat", view: "chat" },
  { icon: Radio, label: "Stream", view: "stream" },
  { icon: Image, label: "Generate Media", view: "generate-media" },
  { icon: Hammer, label: "Build", view: "build" },
  { icon: History, label: "History", hasDropdown: true },
];

export const HEADER_LINKS = [
  { label: "Prompting guide", href: "#" },
  { label: "FAQ", href: "#" },
  { label: "Updates", href: "#" },
];

export const FOOTER_TEXT = "Google AI models may make mistakes, so double-check outputs.";