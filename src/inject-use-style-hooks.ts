import { Binding, NodePath } from "@babel/traverse";
import * as t from "@babel/types";

export function injectUseStylesHooks(
  getStylesHookId: () => t.Identifier,
  stylesheetBinding: Binding
) {
  const reducedReferencePaths: Record<
    string,
    Array<NodePath>
  > = stylesheetBinding.referencePaths.reduce((acc, path) => {
    const functionPath = path.getFunctionParent();
    if (functionPath) {
      const functionName = getFunctionName(functionPath);
      if (functionName) {
        acc[functionName] = [...(acc[functionName] ?? []), path];
      }
    }
    return acc;
  }, {});

  for (const [functionName, referencePaths] of Object.entries(reducedReferencePaths)) {
    for (const referencePath of referencePaths) {
      const functionPath = referencePath.getFunctionParent();
      const functionNode = functionPath?.node;

      if (!functionNode) {
        continue;
      }

      const functionBody = functionPath.get("body");
      if (!functionBody.isBlockStatement()) {
        continue;
      }

      const stylesPropId = t.identifier("styles");
      const uniqueStylesPropId = functionPath.scope.generateUidIdentifier(
        stylesPropId.name
      );

      if (
        t.isCallExpression(referencePath.parent) &&
        t.isIdentifier(referencePath.parent.callee, { name: "useStyles" })
      ) {
        const variableDeclaratorPath = referencePath.parentPath?.parentPath;
        const variableDeclatarorNode = variableDeclaratorPath?.node;

        if (!variableDeclaratorPath || !t.isVariableDeclarator(variableDeclatarorNode)) {
          throw referencePath.parentPath?.buildCodeFrameError(
            `"useStyles" is called, but its return value was never assigned to a variable. Correct usage: \`const { styles } = useStyles(${
              (referencePath.node as t.Identifier).name
            })\``
          );
        }

        if (!t.isObjectPattern(variableDeclatarorNode.id)) {
          throw referencePath.parentPath?.buildCodeFrameError(
            `Plain variable assigning is currently unsupported by "babel-plugin-react-native-unistyles". Did you mean to use object destructuring here? \`const { styles } = useStyles(${
              (referencePath.node as t.Identifier).name
            })\``
          );
        }

        const pattern = variableDeclatarorNode.id;
        const stylesProp = pattern.properties
          .filter((prop): prop is t.ObjectProperty => t.isObjectProperty(prop))
          .find((prop) => t.isIdentifier(prop.key) && prop.key.name === "styles");

        if (!stylesProp) {
          const totalRefCount = reducedReferencePaths[functionName].length;
          if (totalRefCount === 1) {
            // Skipping this because user doesn't destructure `styles` and there are no
            // other references to the stylesheet within the function scope.
            continue;
          }

          functionPath.scope.rename(
            stylesheetBinding.identifier.name,
            uniqueStylesPropId.name,
            functionNode
          );

          variableDeclaratorPath.replaceWith(
            t.variableDeclarator(
              t.objectPattern([
                t.objectProperty(stylesPropId, uniqueStylesPropId, false),
                ...pattern.properties,
              ]),
              t.callExpression(getStylesHookId(), [
                t.identifier(stylesheetBinding.identifier.name),
              ])
            )
          );
        }
        continue;
      }

      functionPath.scope.rename(
        stylesheetBinding.identifier.name,
        uniqueStylesPropId.name,
        functionNode
      );

      functionBody.unshiftContainer(
        "body",
        t.variableDeclaration("const", [
          t.variableDeclarator(
            t.objectPattern([t.objectProperty(stylesPropId, uniqueStylesPropId, false)]),
            t.callExpression(getStylesHookId(), [
              t.identifier(stylesheetBinding.identifier.name),
            ])
          ),
        ])
      );
    }
  }

  function getFunctionName(path: NodePath<t.Function>) {
    if (t.isFunctionDeclaration(path.node)) {
      return path.node.id?.name;
    } else if (
      t.isVariableDeclarator(path.parentPath.node) &&
      t.isIdentifier(path.parentPath.node.id)
    ) {
      return path.parentPath.node.id.name;
    }
  }
}
