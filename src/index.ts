import { addNamed } from "@babel/helper-module-imports";
import { declare } from "@babel/helper-plugin-utils";
import * as t from "@babel/types";

import { injectUseStylesHooks } from "./inject-use-style-hooks";
import { retrieveStyleSheetBindings } from "./retrieve-stylesheet-binding";

export default declare((api) => {
  api.assertVersion(7);

  return {
    name: "babel-plugin-react-native-unistyles",
    visitor: {
      Program(path) {
        let _useStylesHookId: t.Identifier | null = null;

        const getStylesHookId = () => {
          _useStylesHookId ??= addNamed(path, "useStyles", "react-native-unistyles");
          return _useStylesHookId;
        };

        for (const stylesheetBinding of retrieveStyleSheetBindings(path)) {
          injectUseStylesHooks(getStylesHookId, stylesheetBinding);
        }
      },
    },
  };
});
