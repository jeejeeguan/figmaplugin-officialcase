figma.showUI(__html__);

figma.ui.onmessage = (msg) => {
    if (msg.type === "create-rectangles") {
        const nodes = [];
        for (let i = 0; i < msg.count; i++) {
            const rect = figma.createRectangle();
            rect.x = i * 200;
            rect.fills = [{ type: "SOLID", color: { r: 0, g: 0, b: 0 } }];
            figma.currentPage.appendChild(rect);
            nodes.push(rect);
        }
        figma.currentPage.selection = nodes;
        figma.viewport.scrollAndZoomIntoView(nodes);
    } else if (msg.type === "half-opacity") {
        for (const node of figma.currentPage.selection) {
            if ("opacity" in node) {
                node.opacity *= 0.5;
            }
        }
    } else if (msg.type === "recursive") {
        let count = 0;
        function traverse(node) {
            if ("children" in node) {
                count++;
                if (node.type !== "INSTANCE") {
                    for (const child of node.children) {
                        traverse(child);
                    }
                }
            }
        }
        traverse(figma.root);
        // 向 UI 发送信息
        figma.ui.postMessage(count);
    } else if (msg.type === "cancel") {
        figma.closePlugin();
    }
};
