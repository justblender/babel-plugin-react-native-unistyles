import { declare } from "@babel/helper-plugin-utils";
import { findStyleSheetIdentifier } from "./find-stylesheet-identifier";
import { injectUseStylesHook } from "./inject-use-style-hook";

export default declare((api) => {
  api.assertVersion(7);

  return {
    name: "react-native-unistyles/babel",
    visitor: {
      Program(path) {
        const uniqueStylesheetId = findStyleSheetIdentifier(path);
        if (uniqueStylesheetId) {
          injectUseStylesHook(path, uniqueStylesheetId);
        }
      },
    },
  };
});
