export default ($node:HTMLElement | Text, $target:HTMLElement | null) => {
  $target?.replaceWith($node);
  return $node;
};