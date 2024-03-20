# babel-plugin-react-native-unistyles

Experimental Babel plugin for React Native Unistyles to automatically inject `useStyles` hook whenever stylesheet is referenced.

#### Before transformation:

```tsx
import { View } from "react-native";
import { createStyleSheet } from "react-native-unistyles";

function App() {
  return <View style={styles.container} />;
}

const styles = createStyleSheet({
  container: {
    width: 100,
    height: 100,
  }
});
```

#### After transformation:

```tsx
import { View } from "react-native";
import { createStyleSheet, useStyles as _useStyles } from "react-native-unistyles";

function App() {
  const { styles: _styles } = useStyles(_stylesheet);
  return <View style={_styles.container} />;
}

const _stylesheet = createStyleSheet({
  container: {
    width: 100,
    height: 100,
  }
});
```

## Installation

`pnpm install -D babel-plugin-react-native-unistyles`

After installing, make sure to update your Babel configuration by adding `"babel-plugin-react-native-unistyles"` to the `plugins` array. This allows Babel to apply the plugin during compilation and transform your code as needed.

## Contributing

Contributions are welcome. Please submit your pull requests or open issues to propose changes or report bugs.

[version-image]: https://img.shields.io/npm/v/babel-plugin-react-native-unistyles
[dl-image]: https://img.shields.io/npm/dw/babel-plugin-react-native-unistyles
