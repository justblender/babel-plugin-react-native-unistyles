import {
  createStyleSheet,
  useStyles,
  useStyles as _useStyles,
} from "react-native-unistyles";
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
  const { styles } = useStyles(_stylesheet);
  return styles.x;
}
function FunctionComponentWithUseStylesWithoutStylesheetReference() {
  const { theme } = useStyles(_stylesheet);
  return theme.name;
}
const ArrowFunctionComponentWithUseStyles = () => {
  const { styles } = useStyles(_stylesheet);
  return styles.x;
};
const _stylesheet = createStyleSheet({
  x: {
    width: 100,
  },
});
