import { defineHastPlugin } from "satteri";

const satteriUnwrapImagesPlugin = defineHastPlugin({
  name: "test",
  element: {
    filter: ["p"],
    visit(node, ctx) {
      const containsOnlyImages =
        node.children.length > 0 &&
        node.children.every(
          (child) =>
            // Every child is an image...
            (child.type === "element" && child.tagName === "img") ||
            // ...or empty whitespace (ignore)
            (child.type === "text" && child.value.trim() === ""),
        );

      // Inserts children into parent node and deletes paragraph node
      if (containsOnlyImages) {
        ctx.insertBefore(node, node.children);
        ctx.removeNode(node);
      }

      return;
    },
  },
});

export { satteriUnwrapImagesPlugin };
