import { addNamed } from "@babel/helper-module-imports";
import { NodePath, TraverseOptions } from "@babel/traverse";
import * as t from "@babel/types";

export function injectUseStylesHook(
  programPath: NodePath<t.Program>,
  uniqueStylesheetId: t.Identifier
) {
  const useStylesHookId = addNamed(programPath, "useStyles", "react-native-unistyles");

  let existingUseStylesVariable: NodePath<t.VariableDeclarator> | null = null;
  let referencesStylesheet = false;

  const functionVisitor: TraverseOptions = {
    VariableDeclarator(path) {
      if (
        t.isCallExpression(path.node.init) &&
        t.isIdentifier(path.node.init.callee, { name: "useStyles" }) &&
        t.isIdentifier(path.node.init.arguments[0], { name: uniqueStylesheetId.name })
      ) {
        existingUseStylesVariable = path;
        path.skip();
      }
    },
    Identifier(path) {
      if (
        t.isIdentifier(path.node, { name: uniqueStylesheetId.name }) &&
        (t.isReferenced(path.node, path.parent) || t.isMemberExpression(path.parent))
      ) {
        referencesStylesheet = true;
        path.skip();
      }
    },
  };

  programPath.traverse({
    Function: {
      enter(path) {
        const functionBody = path.get("body");
        if (!functionBody.isBlockStatement()) {
          return;
        }

        functionBody.traverse(functionVisitor);

        if (!referencesStylesheet) {
          return;
        }

        const stylesPropId = t.identifier("styles");
        const uniqueStylesPropId = functionBody.scope.generateUidIdentifier("styles");

        if (!existingUseStylesVariable) {
          const variableDeclaration = t.variableDeclaration("const", [
            t.variableDeclarator(
              t.objectPattern([
                t.objectProperty(stylesPropId, uniqueStylesPropId, false),
              ]),
              t.callExpression(useStylesHookId, [uniqueStylesheetId])
            ),
          ]);

          functionBody.scope.rename(
            uniqueStylesheetId.name,
            uniqueStylesPropId.name,
            path.node
          );

          functionBody.unshiftContainer("body", variableDeclaration);
          return;
        }

        if (t.isObjectPattern(existingUseStylesVariable.node.id)) {
          const objectPattern = existingUseStylesVariable.node.id;
          const hasStylesProp = !!objectPattern.properties
            .filter((prop): prop is t.ObjectProperty => t.isObjectProperty(prop))
            .find((prop) => t.isIdentifier(prop.key) && prop.key.name === "styles");

          if (!hasStylesProp) {
            functionBody.scope.rename(
              uniqueStylesheetId.name,
              uniqueStylesPropId.name,
              path.node
            );

            existingUseStylesVariable.replaceWith(
              t.variableDeclarator(
                t.objectPattern([
                  t.objectProperty(stylesPropId, uniqueStylesPropId, false),
                  ...existingUseStylesVariable.node.id.properties,
                ]),
                t.callExpression(useStylesHookId, [uniqueStylesheetId])
              )
            );
          }
        }
      },
      exit() {
        existingUseStylesVariable = null;
        referencesStylesheet = false;
      },
    },
  });
}
