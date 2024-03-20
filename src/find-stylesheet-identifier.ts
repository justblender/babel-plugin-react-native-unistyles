import { NodePath } from "@babel/traverse";
import * as t from "@babel/types";

export function findStyleSheetIdentifier(programPath: NodePath<t.Program>) {
  let uniqueStylesheetId: t.Identifier | undefined;

  programPath.traverse({
    VariableDeclarator(path) {
      if (
        t.isIdentifier(path.node.id) &&
        t.isCallExpression(path.node.init) &&
        t.isIdentifier(path.node.init.callee, { name: "createStyleSheet" })
      ) {
        uniqueStylesheetId = path.scope.generateUidIdentifier("stylesheet");
        path.scope.rename(path.node.id.name, uniqueStylesheetId.name);
        path.stop();
      }
    },
  });

  return uniqueStylesheetId;
}
