import Svg, { Circle, Rect, Path } from "react-native-svg";

const ThemeIllustration = ({
    theme = "system",
  }: {
    theme: string | undefined;
  }) => {
    const illustrations: Record<string, JSX.Element> = {
      light: (
        <Svg width="200" height="160" viewBox="0 0 200 160" fill="none">
          <Rect width="200" height="160" rx="12" fill="#FFFFFF" />
          <Rect x="20" y="20" width="160" height="16" rx="8" fill="#E5E7EB" />
          <Rect x="20" y="48" width="120" height="12" rx="6" fill="#D1D5DB" />
          <Rect x="20" y="72" width="140" height="12" rx="6" fill="#D1D5DB" />
          <Circle cx="160" cy="120" r="20" fill="#a9ca8c" />
          <Path
            d="M160 108V132M148 120H172"
            stroke="#507435"
            strokeWidth="3"
            strokeLinecap="round"
          />
        </Svg>
      ),
      dark: (
        <Svg width="200" height="160" viewBox="0 0 200 160" fill="none">
          <Rect width="200" height="160" rx="12" fill="#1F2937" />
          <Rect x="20" y="20" width="160" height="16" rx="8" fill="#374151" />
          <Rect x="20" y="48" width="120" height="12" rx="6" fill="#4B5563" />
          <Rect x="20" y="72" width="140" height="12" rx="6" fill="#4B5563" />
          <Circle cx="160" cy="120" r="20" fill="#cdb142" />
          <Path
            d="M165 120C165 115.029 160.971 111 156 111C151.029 111 147 115.029 147 120C147 124.971 151.029 129 156 129C160.971 129 165 124.971 165 120Z"
            fill="#ab822d"
          />
        </Svg>
      ),
      system: (
        <Svg width="200" height="160" viewBox="0 0 200 160" fill="none">
          <Rect width="100" height="160" rx="12" fill="#FFFFFF" />
          <Rect x="100" width="100" height="160" rx="12" fill="#1F2937" />
          <Rect x="10" y="20" width="80" height="16" rx="8" fill="#E5E7EB" />
          <Rect x="110" y="20" width="80" height="16" rx="8" fill="#374151" />
          <Rect x="10" y="48" width="60" height="12" rx="6" fill="#D1D5DB" />
          <Rect x="110" y="48" width="60" height="12" rx="6" fill="#4B5563" />
          <Rect x="10" y="72" width="70" height="12" rx="6" fill="#D1D5DB" />
          <Rect x="110" y="72" width="70" height="12" rx="6" fill="#4B5563" />
          <Circle cx="80" cy="120" r="15" fill="#a9ca8c" />
          <Circle cx="160" cy="120" r="15" fill="#cdb142" />
        </Svg>
      ),
    };
  
    return illustrations[theme];
};

export default ThemeIllustration;