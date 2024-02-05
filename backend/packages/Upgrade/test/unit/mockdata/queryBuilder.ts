import sinon from 'sinon';
import { SelectQueryBuilder } from 'typeorm';

// export const selectQueryBuilderMock = (sandbox) => {
//   return sandbox.createStubInstance(SelectQueryBuilder, {
//     select: sinon.stub().returnsThis(),
//     where: sinon.stub().returnsThis(),
//     innerJoin: sinon.stub().returnsThis(),
//     groupBy: sinon.stub().returnsThis(),
//     execute: sinon.stub().resolves([]),
//   });
// };
// // calls by selectQueryBuilderMock(sandbox) in repo.test.ts

export const selectQueryBuilderMock = jest.fn(() => ({
  createQueryBuilder: jest.fn(() => ({
    select: jest.fn().mockReturnThis(),
    where: jest.fn().mockReturnThis(),
    innerJoin: jest.fn().mockReturnThis(),
    groupBy: jest.fn().mockReturnThis(),
    execute: jest.fn().mockResolvedValue([]),
  })),
}));
