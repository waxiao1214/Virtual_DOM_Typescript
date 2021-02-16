import DOMTree from "./vdom/DOMTree";
import mount from "./vdom/mount";
import patchDOM from "./vdom/patchDom";

let count = 0;
const createVApp = (count:number) => {
  return new DOMTree(
    "div", 
    { id: 'app'}, 
    [
      new DOMTree("input"),
      String(count)
    ]
  )
}

let oldDOM = createVApp(count)

let $rootEl = mount(oldDOM.render(), document.getElementById("app"));

setInterval(() => {
  count++
  let newDOM = createVApp(count)
  const patch = patchDOM(oldDOM, newDOM);
  $rootEl = patch($rootEl);
  oldDOM = newDOM;
}, 1000);