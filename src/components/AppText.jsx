import { Text } from "react-native";
import { cn } from "../utils/cn";

export function AppText({
  children,
  size = "medium",
  bold = false,
  color = "primary",
  center = false,
  className,
}) {
  return (
    <Text
      className={cn(
        size === "small" && "text-sm mb-2",
        size === "medium" && "text-base mb-3",
        size === "large" && "text-lg mb-4",
        size === "heading" && "text-xl mb-5",
        bold && "font-bold",
        color === "primary" && "text-black",
        color === "secondary" && "text-gray-500",
        color === "tertiary" && "text-gray-400",
        center && "text-center",
        className,
      )}
    >
      {children}
    </Text>
  );
}