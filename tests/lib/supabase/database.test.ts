// tests/lib/supabase/database.test.ts
import {
  getItemById,
  createItem,
  getComplexData,
  MyData
} from '@/lib/supabase/database'; // Import actual functions to test

import {
  resetSupabaseMock,
  createSupabaseQueryBuilderMock,
  mockFrom,
  // queryBuilderMock methods will be asserted, not necessarily all these global ones directly
  // mockSelect, mockEq, mockSingle, mockInsert, mockOrder, mockIlike
} from '../../../mocks/supabaseMock';

jest.mock('@/lib/supabase/client', () => {
  const { supabaseMock: requiredSupabaseMock } = require('../../../mocks/supabaseMock');
  const originalModule = jest.requireActual('@/lib/supabase/client'); // Keep other exports
  return {
    ...originalModule,
    supabase: requiredSupabaseMock, // Ensure database.ts uses this mock via its import { supabase } from './client'
    supabaseClient: requiredSupabaseMock, // For any legacy test code if it used this name
  };
});

describe('Database Functions', () => {
  beforeEach(() => {
    resetSupabaseMock();
  });

  describe('getItemById', () => {
    it('should fetch an item by id successfully', async () => {
      const mockItemId = 'item1';
      const mockItemData = { id: mockItemId, name: 'Fetched Item' };
      const tableName = 'items';

      const queryBuilderMock = createSupabaseQueryBuilderMock(mockItemData);
      mockFrom.mockImplementationOnce(() => queryBuilderMock);

      const result = await getItemById(tableName, mockItemId);

      expect(mockFrom).toHaveBeenCalledWith(tableName);
      expect(queryBuilderMock.select).toHaveBeenCalledWith('*');
      expect(queryBuilderMock.eq).toHaveBeenCalledWith('id', mockItemId);
      expect(queryBuilderMock.single).toHaveBeenCalledTimes(1);
      expect(result.data).toEqual(mockItemData);
      expect(result.error).toBeNull();
    });

    it('should handle error when fetching an item by id', async () => {
      const mockItemId = 'itemError';
      const tableName = 'items';
      const dbError = new Error('Fetch Error');
      const queryBuilderMock = createSupabaseQueryBuilderMock(null, dbError);
      mockFrom.mockImplementationOnce(() => queryBuilderMock);

      const result = await getItemById(tableName, mockItemId);

      expect(mockFrom).toHaveBeenCalledWith(tableName);
      expect(queryBuilderMock.select).toHaveBeenCalledWith('*');
      expect(queryBuilderMock.eq).toHaveBeenCalledWith('id', mockItemId);
      expect(queryBuilderMock.single).toHaveBeenCalledTimes(1);
      expect(result.data).toBeNull();
      expect(result.error).toEqual(dbError);
    });
  });

  describe('createItem', () => {
    it('should insert an item successfully', async () => {
      const newItemData = { name: 'New Item' };
      const createdItem = { id: 'created123', ...newItemData };
      const tableName = 'items';

      const queryBuilderMock = createSupabaseQueryBuilderMock(createdItem);
      mockFrom.mockImplementationOnce(() => queryBuilderMock);

      const result = await createItem(tableName, newItemData);

      expect(mockFrom).toHaveBeenCalledWith(tableName);
      expect(queryBuilderMock.insert).toHaveBeenCalledWith([newItemData]); // createItem wraps it in an array
      expect(queryBuilderMock.select).toHaveBeenCalledTimes(1);
      expect(queryBuilderMock.single).toHaveBeenCalledTimes(1);
      expect(result.data).toEqual(createdItem);
    });

    it('should handle error on insert', async () => {
      const newItemData = { name: 'Faulty New Item' };
      const tableName = 'items';
      const dbError = new Error('Insert Error');

      const queryBuilderMock = createSupabaseQueryBuilderMock(null, dbError);
      // Configure insert on this builder to be the one that resolves with an error
      // (because createItem awaits the full insert().select().single() chain)
      queryBuilderMock.insert.mockImplementationOnce(() => queryBuilderMock); // insert returns builder
      queryBuilderMock.select.mockImplementationOnce(() => queryBuilderMock); // select returns builder
      queryBuilderMock.single.mockResolvedValueOnce({data: null, error: dbError }); // single resolves with error


      mockFrom.mockImplementationOnce(() => queryBuilderMock);

      const result = await createItem(tableName, newItemData);

      expect(mockFrom).toHaveBeenCalledWith(tableName);
      expect(queryBuilderMock.insert).toHaveBeenCalledWith([newItemData]);
      expect(result.data).toBeNull();
      expect(result.error).toEqual(dbError);
    });
  });

  describe('getComplexData', () => {
    const testId = '1';
    const expectedTableName = 'my_table';
    const expectedSelectString = 'id, name, value';

    it('should call basic query without filter and then order', async () => {
      const mockDataArray: MyData[] = [{ id: testId, name: 'A' }];
      const queryBuilderMock = createSupabaseQueryBuilderMock(mockDataArray); // order is terminal
      mockFrom.mockImplementationOnce(() => queryBuilderMock);

      const result = await getComplexData(testId);

      expect(mockFrom).toHaveBeenCalledWith(expectedTableName);
      expect(queryBuilderMock.select).toHaveBeenCalledWith(expectedSelectString);
      expect(queryBuilderMock.eq).toHaveBeenCalledWith('id', testId);
      expect(queryBuilderMock.ilike).not.toHaveBeenCalled();
      expect(queryBuilderMock.order).toHaveBeenCalledWith('name');
      expect(result.data).toEqual(mockDataArray);
    });

    it('should call query with ilike filter and then order', async () => {
      const filterString = 'App';
      const mockDataArray: MyData[] = [{ id: testId, name: 'Apple' }];
      const queryBuilderMock = createSupabaseQueryBuilderMock(mockDataArray); // order is terminal
      mockFrom.mockImplementationOnce(() => queryBuilderMock);

      const result = await getComplexData(testId, filterString);

      expect(mockFrom).toHaveBeenCalledWith(expectedTableName);
      expect(queryBuilderMock.select).toHaveBeenCalledWith(expectedSelectString);
      expect(queryBuilderMock.eq).toHaveBeenCalledWith('id', testId);
      expect(queryBuilderMock.ilike).toHaveBeenCalledWith('name', `%${filterString}%`);
      expect(queryBuilderMock.order).toHaveBeenCalledWith('name');
      expect(result.data).toEqual(mockDataArray);
    });

    it('should handle error in getComplexData', async () => {
      const dbError = new Error('Complex Fetch Error');
      const queryBuilderMock = createSupabaseQueryBuilderMock(null, dbError); // order is terminal
      mockFrom.mockImplementationOnce(() => queryBuilderMock);

      const result = await getComplexData(testId);

      expect(mockFrom).toHaveBeenCalledWith(expectedTableName);
      expect(queryBuilderMock.select).toHaveBeenCalledWith(expectedSelectString);
      expect(queryBuilderMock.eq).toHaveBeenCalledWith('id', testId);
      expect(queryBuilderMock.order).toHaveBeenCalledWith('name');
      expect(result.data).toBeNull();
      expect(result.error).toEqual(dbError);
    });
  });
});
