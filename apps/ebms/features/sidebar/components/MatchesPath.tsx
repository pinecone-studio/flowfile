export function matchesPath(pathname: string, href: string) {
  if (href === '/employees') {
    return pathname === '/' || pathname.startsWith('/employees');
  }

  return pathname.startsWith(href);
}