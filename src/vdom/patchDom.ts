import render from "./render";
import DOMTree from './DOMTree';

type Child = DOMTree | String;

const zip = (xs:any, ys:any) => {
  const zipped = [];
  for (let i = 0; i < Math.max(xs.length, ys.length); i++) {
    zipped.push([xs[i], ys[i]]);
  }
  return zipped;
};

const diffAttrs = (oldAttrs:any, newAttrs:any) => {
  const patches:Array<any> = [];

  // set new attributes
  for (const key of Object.keys(newAttrs)) {
    patches.push(($node:any) => {
      $node.setAttribute(key, newAttrs[key]);
      return $node;
    });
  }

  // remove old attributes
  for (const k in oldAttrs) {
    if (!(k in newAttrs)) {
      patches.push(($node:any) => {
        $node.removeAttribute(k);
        return $node;
      });
    }
  }

  return ($node:any) => {
    for (const patch of patches) {
      patch($node);
    }
  };
};

const diffChildren = (oldVChildren:Array<Child>, newVChildren:Array<Child>) => {
  const childPatches:Array<any> = [];
  oldVChildren.forEach((oldVChild:Child, i:number) => {
    childPatches.push(diff(oldVChild, newVChildren[i]));
  });

  const additionalPatches:Array<any> = [];
  for (const additionalVChild of newVChildren.slice(oldVChildren.length)) {
    additionalPatches.push(($node:any) => {
      $node.appendChild(render(additionalVChild));
      return $node;
    });
  }

  return ($parent:any) => {
    for (const [patch, child] of zip(childPatches, $parent.childNodes)) {
      patch(child);
    }

    for (const patch of additionalPatches) {
      patch($parent);
    }

    return $parent;
  };
};

const diff = (vOldNode:Child, vNewNode:Child) => {
  if (vNewNode === undefined) {
    return ($node:any) => {
      console.log($node);
      $node.remove();
      return undefined;
    };
  }

  if(vOldNode instanceof DOMTree && vNewNode instanceof DOMTree){
    if (vOldNode.tag !== vNewNode.tag) {
      return ($node:any) => {
        const $newNode = vNewNode.render;
        $node.replaceWith($newNode);
        return $newNode;
      };
    }
  
    const patchAttrs = diffAttrs(vOldNode.attributes, vNewNode.attributes);
    const patchChildren = diffChildren(vOldNode.children, vNewNode.children);

    return ($node:any) => {
      patchAttrs($node);
      patchChildren($node);
      return $node;
    };
  }

  if (vOldNode !== vNewNode) {
    return ($node:any) => {
      const $newNode = render(vNewNode);
      $node.replaceWith($newNode);
      return $newNode;
    };
  } else {
    return ($node:any) => undefined;
  }
};

export default diff;
