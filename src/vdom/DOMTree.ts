type Child = DOMTree | String;

class DOMTree {
  tag:string;
  attributes: {[_:string]: string};
  children: Array<Child>;
  constructor(tag : string, attributes? : {[_:string]: string}, children?:Array<Child>) {
    this.tag = tag
    this.attributes = attributes ? attributes : {}
    this.children = children ? children : []
  }

  render() {
    const $el = document.createElement(this.tag)
    //set attributes
    for (const key of Object.keys(this.attributes)) {
      $el.setAttribute(key, this.attributes[key]);
    }
    
    // set children
    for (const child of this.children) {
      if(child instanceof DOMTree) {
        const $child = child.render();
        $el.appendChild($child);
      } else {
        $el.appendChild(document.createTextNode(`${child}`))
      }
    }
    return $el
  }
}

export default DOMTree
