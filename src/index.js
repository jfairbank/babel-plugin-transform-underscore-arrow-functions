export default function ({ types: t }) {
  return {
    visitor: {
      ArrowFunctionExpression(path) {
        const { params } = path.node;
        const hasUnderscoreParam = params.length === 1 && params[0].name === '_';
        const topBinding = path.scope.getBinding('_');
        let underScoreParamUsed = false;

        path.traverse({
          ReferencedIdentifier(nestedPath) {
            const hasBoundUnderscore = (
              nestedPath.node.name === '_' && nestedPath.scope.hasBinding('_')
            );

            if (hasBoundUnderscore) {
              const nestedBinding = nestedPath.scope.getBinding('_');

              if (nestedBinding === topBinding) {
                underScoreParamUsed = true;
              }
            }
          },
        });

        if (hasUnderscoreParam && !underScoreParamUsed) {
          path.replaceWith(t.arrowFunctionExpression([], path.node.body));
        }
      },
    },
  };
}
