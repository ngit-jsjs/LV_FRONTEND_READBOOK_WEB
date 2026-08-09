import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import categoryService from '../services/categoryService';
import { useCategoryCreation } from './useCategoryCreation';

vi.mock('../services/categoryService', () => ({
  default: { createCategory: vi.fn() },
}));

describe('useCategoryCreation', () => {
  const submitEvent = () => ({ preventDefault: vi.fn() });

  beforeEach(() => {
    vi.spyOn(console, 'error').mockImplementation(() => {});
    vi.stubGlobal('alert', vi.fn());
    categoryService.createCategory.mockResolvedValue({});
  });

  it('rejects an empty or whitespace-only name', async () => {
    const { result } = renderHook(() => useCategoryCreation());
    act(() => result.current.setCatName('   '));

    const event = submitEvent();
    await act(async () => {
      await result.current.handleSaveCategory(event);
    });

    expect(event.preventDefault).toHaveBeenCalled();
    expect(categoryService.createCategory).not.toHaveBeenCalled();
    expect(alert).toHaveBeenCalledWith('Vui lòng điền tên thể loại!');
  });

  it('trims the payload and clears the form on success', async () => {
    const { result } = renderHook(() => useCategoryCreation());
    act(() => {
      result.current.setCatName('  Trinh thám  ');
      result.current.setCatDesc('  mô tả  ');
    });

    await act(async () => {
      await result.current.handleSaveCategory(submitEvent());
    });

    expect(categoryService.createCategory).toHaveBeenCalledWith({
      name: 'Trinh thám',
      description: 'mô tả',
    });
    expect(result.current.catName).toBe('');
    expect(result.current.catDesc).toBe('');
    expect(result.current.catSubmitting).toBe(false);
    expect(alert).toHaveBeenCalledWith('Thêm thể loại thành công!');
  });

  it('keeps the form values and reports the error on failure', async () => {
    categoryService.createCategory.mockRejectedValue({
      response: { data: { message: 'Trùng tên' } },
    });
    const { result } = renderHook(() => useCategoryCreation());
    act(() => result.current.setCatName('Trinh thám'));

    await act(async () => {
      await result.current.handleSaveCategory(submitEvent());
    });

    expect(alert).toHaveBeenCalledWith('Lỗi khi lưu thể loại: Trùng tên');
    expect(result.current.catName).toBe('Trinh thám');
    expect(result.current.catSubmitting).toBe(false);
  });
});
