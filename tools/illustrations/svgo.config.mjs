// SVGO settings for the illustrations: one decimal place is ample at these sizes.
// Classes, ids, <title>, <desc> and the <style> block are kept because the artwork's
// motion and accessible name depend on them.
export default {
  multipass: true,
  floatPrecision: 1,
  plugins: [{
    name: 'preset-default',
    params: {
      overrides: {
        removeDesc: false, cleanupIds: false, inlineStyles: false, minifyStyles: false,
        mergePaths: false, collapseGroups: false, moveElemsAttrsToGroup: false, moveGroupAttrsToElems: false,
        convertShapeToPath: false, removeUnknownsAndDefaults: { keepRoleAttr: true },
        convertPathData: { floatPrecision: 1, transformPrecision: 3 },
        convertTransform: { floatPrecision: 3 },
      },
    },
  }],
};
