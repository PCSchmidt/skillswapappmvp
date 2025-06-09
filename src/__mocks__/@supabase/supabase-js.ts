// src/__mocks__/@supabase/supabase-js.ts

// Define AND EXPORT the functions that will be part of the chain returned by select()
export const mockSelectEq = jest.fn();
export const mockSelectOrder = jest.fn();
export const mockSelectLimit = jest.fn();
export const mockSelectRange = jest.fn().mockResolvedValue({ data: [], error: null });
export const mockSelectSingle = jest.fn().mockResolvedValue({ data: { id: 'default-single-id' }, error: null });

const selectableMethods = {
  eq: mockSelectEq,
  order: mockSelectOrder,
  limit: mockSelectLimit,
  range: mockSelectRange,
  single: mockSelectSingle,
};

// Configure chainable methods
mockSelectEq.mockImplementation(() => selectableMethods);
mockSelectOrder.mockImplementation(() => selectableMethods);
mockSelectLimit.mockImplementation(() => selectableMethods);
// range and single resolve promises, so they don't return selectableMethods by default.

// Mock for .insert(...).select().single()
const mockInsertSelectSingleInternal = jest.fn().mockResolvedValue({ data: { id: 'mock-notification-id' }, error: null });
const mockInsertSelect = jest.fn().mockReturnValue({ single: mockInsertSelectSingleInternal });
const mockInsert = jest.fn().mockReturnValue({ select: mockInsertSelect });

// Mocks for .update(...).eq(...) and .delete(...).eq(...)
const mockUpdateEqInternal = jest.fn().mockResolvedValue({ data: { id: 'mock-notification-id' }, error: null });
const mockDeleteEqInternal = jest.fn().mockResolvedValue({ data: {}, error: null });
const mockUpdate = jest.fn().mockReturnValue({ eq: mockUpdateEqInternal });
const mockDelete = jest.fn().mockReturnValue({ eq: mockDeleteEqInternal });

// fromMethods will hold methods directly available after from()
const fromMethods = {
  select: jest.fn().mockReturnValue(selectableMethods),
  insert: mockInsert,
  update: mockUpdate,
  delete: mockDelete,
  // eq for from().eq() if ever used directly - assigned below
};
fromMethods.eq = jest.fn().mockReturnValue(fromMethods);

// Export the createClient function, which is what Supabase uses.
export const createClient = jest.fn(() => ({
  from: jest.fn().mockReturnValue(fromMethods),
}));
