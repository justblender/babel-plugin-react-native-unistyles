import { createStyleSheet, useStyles } from "react-native-unistyles";

function FunctionComponentWithoutUseStyles() {
  return stylesheet.x;
}

function FunctionComponentWithUseStylesWithoutStylesProp() {
  const { theme, ...rest } = useStyles(stylesheet);
  return stylesheet.x;
}

const ArrowFunctionComponentWithoutUseStyles = () => {
  return stylesheet.x;
};

const stylesheet = createStyleSheet({
  x: {
    width: 100,
  },
});
