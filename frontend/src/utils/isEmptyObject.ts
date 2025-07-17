export function isEmptyObject(obj: object | null): boolean {
  if (obj === null || obj === undefined) {
    return true;
  }
  return Object.keys(obj).length === 0 && obj.constructor === Object;
}
