import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { renderHook, waitFor, act } from '@testing-library/react';
import planService from '../services/planService';
import paymentService from '../services/paymentService';
import { usePremium } from './usePremium';

vi.mock('../services/planService', () => ({
  default: { getAllPlans: vi.fn() },
}));

vi.mock('../services/paymentService', () => ({
  default: { buyPackage: vi.fn() },
}));

describe('usePremium', () => {
  const verifiedUser = { email: 'an@test.com', verified: true };
  let originalLocation;

  beforeEach(() => {
    vi.spyOn(console, 'error').mockImplementation(() => {});
    vi.stubGlobal('alert', vi.fn());
    originalLocation = window.location;
    delete window.location;
    window.location = { href: '' };
    planService.getAllPlans.mockResolvedValue({
      result: [{ id: 1, name: 'Gói 1', description: 'd', price: 50000, amount: 1000 }],
    });
    paymentService.buyPackage.mockResolvedValue({ result: 'https://vnpay.test/pay' });
  });

  afterEach(() => {
    window.location = originalLocation;
  });

  it('formats plan prices and coin amounts for display', async () => {
    const { result } = renderHook(() => usePremium(verifiedUser));

    await waitFor(() => expect(result.current.loading).toBe(false));
    expect(result.current.packages).toHaveLength(1);
    const pkg = result.current.packages[0];
    expect(pkg).toMatchObject({ id: 1, name: 'Gói 1', description: 'd', bonus: '0' });
    expect(pkg.price).toBe(
      new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(50000)
    );
    expect(pkg.coins).toBe(new Intl.NumberFormat('vi-VN').format(1000));
  });

  it('leaves packages empty when the response has no result', async () => {
    planService.getAllPlans.mockResolvedValue({});

    const { result } = renderHook(() => usePremium(verifiedUser));

    await waitFor(() => expect(result.current.loading).toBe(false));
    expect(result.current.packages).toEqual([]);
  });

  it('exposes an error when loading plans fails', async () => {
    planService.getAllPlans.mockRejectedValue({ response: { data: { message: 'Lỗi gói' } } });

    const { result } = renderHook(() => usePremium(verifiedUser));

    await waitFor(() => expect(result.current.loading).toBe(false));
    expect(result.current.error).toBe('Lỗi gói');
  });

  it('asks anonymous visitors to log in instead of buying', async () => {
    const { result } = renderHook(() => usePremium(null));
    await waitFor(() => expect(result.current.loading).toBe(false));

    await act(async () => {
      await result.current.handleBuyClick({ id: 1 });
    });

    expect(alert).toHaveBeenCalledWith('Vui lòng đăng nhập để thực hiện nạp xu!');
    expect(paymentService.buyPackage).not.toHaveBeenCalled();
  });

  it('redirects unverified users to email verification', async () => {
    const { result } = renderHook(() => usePremium({ email: 'a+b@test.com', verified: false }));
    await waitFor(() => expect(result.current.loading).toBe(false));

    await act(async () => {
      await result.current.handleBuyClick({ id: 1 });
    });

    expect(window.location.href).toBe('/verify-email?email=a%2Bb%40test.com');
    expect(paymentService.buyPackage).not.toHaveBeenCalled();
  });

  it('redirects to the payment gateway link', async () => {
    const { result } = renderHook(() => usePremium(verifiedUser));
    await waitFor(() => expect(result.current.loading).toBe(false));

    await act(async () => {
      await result.current.handleBuyClick({ id: 3 });
    });

    expect(paymentService.buyPackage).toHaveBeenCalledWith(3);
    expect(window.location.href).toBe('https://vnpay.test/pay');
    expect(result.current.isProcessing).toBe(false);
  });

  it('alerts when no payment link is returned', async () => {
    paymentService.buyPackage.mockResolvedValue({});
    const { result } = renderHook(() => usePremium(verifiedUser));
    await waitFor(() => expect(result.current.loading).toBe(false));

    await act(async () => {
      await result.current.handleBuyClick({ id: 3 });
    });

    expect(alert).toHaveBeenCalledWith('Không nhận được link thanh toán từ VNPay');
    expect(window.location.href).toBe('');
  });

  it('alerts when creating the invoice fails', async () => {
    paymentService.buyPackage.mockRejectedValue({ response: { data: { result: 'Hết hạn mức' } } });
    const { result } = renderHook(() => usePremium(verifiedUser));
    await waitFor(() => expect(result.current.loading).toBe(false));

    await act(async () => {
      await result.current.handleBuyClick({ id: 3 });
    });

    expect(alert).toHaveBeenCalledWith('Hết hạn mức');
    expect(result.current.isProcessing).toBe(false);
  });
});
