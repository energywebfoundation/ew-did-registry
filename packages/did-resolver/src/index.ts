import { IResolver, IOperator } from './interface';
import { IDIDDocument } from './models';

const add = (left: number, right: number): number => left + right;

export {
  add,
  IResolver,
  IOperator,
  IDIDDocument,
};
