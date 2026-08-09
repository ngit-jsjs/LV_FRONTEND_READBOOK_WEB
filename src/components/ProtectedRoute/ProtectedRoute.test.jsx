import React from 'react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { ROUTES } from '../../config/routes';
import ProtectedRoute from './ProtectedRoute';

vi.mock('../../context/AuthContext', () => ({
  useAuth: vi.fn(),
}));

const renderRoute = (props = {}, path = '/profile?tab=info') =>
  render(
    <MemoryRouter initialEntries={[path]}>
      <ProtectedRoute {...props}>
        <div>secret content</div>
      </ProtectedRoute>
    </MemoryRouter>
  );

describe('ProtectedRoute', () => {
  beforeEach(() => {
    useAuth.mockReturnValue({ user: { roles: ['USER'] }, loading: false });
  });

  it('shows a loading state while the session is resolving', () => {
    useAuth.mockReturnValue({ user: null, loading: true });

    renderRoute();

    expect(screen.getByText('Đang tải...')).toBeInTheDocument();
    expect(screen.queryByText('secret content')).not.toBeInTheDocument();
  });

  it('prompts anonymous visitors to log in with a redirect back to the page', () => {
    useAuth.mockReturnValue({ user: null, loading: false });

    renderRoute();

    const link = screen.getByRole('link', { name: 'Đăng nhập' });
    expect(link).toHaveAttribute(
      'href',
      `${ROUTES.LOGIN}?redirect=${encodeURIComponent('/profile?tab=info')}`
    );
    expect(screen.queryByText('secret content')).not.toBeInTheDocument();
  });

  it('renders children for an authenticated user when no roles are required', () => {
    renderRoute();

    expect(screen.getByText('secret content')).toBeInTheDocument();
  });

  it('renders children when the user has one of the allowed roles', () => {
    useAuth.mockReturnValue({ user: { roles: ['USER', 'ADMIN'] }, loading: false });

    renderRoute({ allowedRoles: ['ADMIN'] });

    expect(screen.getByText('secret content')).toBeInTheDocument();
  });

  it('ignores an empty allowed roles list', () => {
    renderRoute({ allowedRoles: [] });

    expect(screen.getByText('secret content')).toBeInTheDocument();
  });

  it('blocks users lacking the required role', () => {
    renderRoute({ allowedRoles: ['ADMIN'] });

    expect(screen.getByText('Bạn không có quyền truy cập trang này')).toBeInTheDocument();
    expect(screen.getByText('Yêu cầu quyền hạn tối thiểu: ADMIN')).toBeInTheDocument();
    expect(screen.queryByText('secret content')).not.toBeInTheDocument();
  });

  it('blocks users with no roles at all', () => {
    useAuth.mockReturnValue({ user: {}, loading: false });

    renderRoute({ allowedRoles: ['ADMIN', 'STAFF'] });

    expect(screen.getByText('Yêu cầu quyền hạn tối thiểu: ADMIN, STAFF')).toBeInTheDocument();
  });
});
