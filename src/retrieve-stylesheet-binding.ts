import { Binding, NodePath } from "@babel/traverse";
import * as t from "@babel/types";

export function retrieveStyleSheetBindings(programPath: NodePath<t.Program>) {
  let stylesheetBindings: Array<Binding> = [];

  programPath.traverse({
    VariableDeclarator(path) {
      if (
        t.isIdentifier(path.node.id) &&
        t.isCallExpression(path.node.init) &&
        t.isIdentifier(path.node.init.callee, { name: "createStyleSheet" })
      ) {
        const binding = path.scope.getBinding(path.node.id.name);
        if (binding) {
          stylesheetBindings.push(binding);
        }
      }
    },
  });

  return stylesheetBindings;
}
