import { ReactNode, useState } from "react";
import { Theme, theme } from "theme/theme";
import { ThemeContext } from "contexts/theme_context";

type ThemeContainerProps = {
  children: ReactNode;
};

const ThemeContainer = (props: ThemeContainerProps): JSX.Element => {
  const [selectedTheme] = useState<Theme>(theme.light);

  return (
    <ThemeContext.Provider value={selectedTheme}>
      {props.children}
    </ThemeContext.Provider>
  );
};

export default ThemeContainer;
