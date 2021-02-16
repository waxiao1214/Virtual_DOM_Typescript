const render = (vNode:any) => {
  if (typeof vNode === "string") {
    return document.createTextNode(vNode);
  }
};

export default render;

