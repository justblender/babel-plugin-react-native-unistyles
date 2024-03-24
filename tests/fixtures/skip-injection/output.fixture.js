import { createStyleSheet, useStyles } from "react-native-unistyles";
function EmptyFunctionNoOp() {
  return;
}
function LocalStylesheetVariableNoOp() {
  const stylesheet = {
    x: {
      width: 100,
    },
  };
  return stylesheet.x;
}
function FunctionComponentWithUseStyles() {
  const { styles } = useStyles(stylesheet);
  return styles.x;
}
function FunctionComponentWithUseStylesWithoutStylesheetReference() {
  const { theme } = useStyles(stylesheet);
  return theme.name;
}
const ArrowFunctionComponentWithUseStyles = () => {
  const { styles } = useStyles(stylesheet);
  return styles.x;
};
const stylesheet = createStyleSheet({
  x: {
    width: 100,
  },
});
