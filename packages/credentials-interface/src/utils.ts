import { isPlainObject, has } from 'lodash';

export function isObject(obj: unknown): obj is object {
  return isPlainObject(obj);
}

export function hasOwnProperty<X extends object, Y extends PropertyKey>(
  obj: X,
  key: Y
): obj is X & Record<Y, unknown> {
  return has(obj, key);
}

export function hasRequiredProperties(
  obj: object,
  requiredProperties: string[]
): boolean {
  return requiredProperties.map((key) => has(obj, key)).every(Boolean);
}
