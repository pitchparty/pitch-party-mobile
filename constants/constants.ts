export const DEFAULT_AVATAR_URL = "https://api.dicebear.com/9.x/big-smile/svg?seed=Leah";
export const INPUT_LABEL_STYLE = "text-gray-700 dark:text-gray-300 text-sm font-medium mb-1";
export const INPUT_STYLE = "w-full px-2 py-2 bg-white dark:bg-gray-700 rounded-lg border-2 text-gray-900 border-gray-300";
export const INPUT_DISABLED = "bg-gray-100 dark:bg-gray-700 text-gray-400"

export const getInputBorderColor = (error: boolean, isFocused: boolean) => {
    if (error) return "border-red-500";
    if (isFocused) return "border-blue-500";
    return "border-gray-300";
  };