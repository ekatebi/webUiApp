

export function getPath(pathname, index = 100, postfix) {
  const path = pathname
    .slice(1)
    .split('/')
    .slice(0, index)
    .join('/');
  return postfix ? `${path}/${postfix}` : path;
}
