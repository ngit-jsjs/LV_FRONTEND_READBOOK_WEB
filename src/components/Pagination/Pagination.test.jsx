import React from 'react';
import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Pagination from './Pagination';

describe('Pagination', () => {
  it('renders nothing for a single page or fewer', () => {
    const { container, rerender } = render(
      <Pagination currentPage={1} totalPages={1} onPageChange={vi.fn()} />
    );
    expect(container).toBeEmptyDOMElement();

    rerender(<Pagination currentPage={1} totalPages={0} onPageChange={vi.fn()} />);
    expect(container).toBeEmptyDOMElement();
  });

  it('disables the backwards controls on the first page', () => {
    render(<Pagination currentPage={1} totalPages={5} onPageChange={vi.fn()} />);

    expect(screen.getByTitle('Trang Đầu')).toBeDisabled();
    expect(screen.getByTitle('Trang Trước')).toBeDisabled();
    expect(screen.getByTitle('Trang Sau')).toBeEnabled();
    expect(screen.getByTitle('Trang Cuối')).toBeEnabled();
    expect(screen.getByText('Trang 1 / 5')).toBeInTheDocument();
  });

  it('disables the forwards controls on the last page', () => {
    render(<Pagination currentPage={5} totalPages={5} onPageChange={vi.fn()} />);

    expect(screen.getByTitle('Trang Sau')).toBeDisabled();
    expect(screen.getByTitle('Trang Cuối')).toBeDisabled();
    expect(screen.getByTitle('Trang Đầu')).toBeEnabled();
  });

  it('reports the requested page for each control', async () => {
    const onPageChange = vi.fn();
    render(<Pagination currentPage={3} totalPages={5} onPageChange={onPageChange} />);

    await userEvent.click(screen.getByTitle('Trang Đầu'));
    await userEvent.click(screen.getByTitle('Trang Trước'));
    await userEvent.click(screen.getByTitle('Trang Sau'));
    await userEvent.click(screen.getByTitle('Trang Cuối'));

    expect(onPageChange.mock.calls.map(([page]) => page)).toEqual([1, 2, 4, 5]);
  });
});
