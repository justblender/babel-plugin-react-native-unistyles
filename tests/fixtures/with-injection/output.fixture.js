import {
  createStyleSheet,
  useStyles,
  useStyles as _useStyles,
} from "react-native-unistyles";
function FunctionComponentWithoutUseStyles() {
  const { styles: _styles } = _useStyles(stylesheet);
  return _styles.x;
}
function FunctionComponentWithUseStylesWithoutStylesProp() {
  const { styles: _styles2, theme, ...rest } = _useStyles(stylesheet);
  return _styles2.x;
}
const ArrowFunctionComponentWithoutUseStyles = () => {
  const { styles: _styles3 } = _useStyles(stylesheet);
  return _styles3.x;
};
const stylesheet = createStyleSheet({
  x: {
    width: 100,
  },
});
