import { useState, useEffect } from 'react';
import planService from '../services/planService';
import paymentService from '../services/paymentService';
import { getErrorMessage } from '../services/apiClient';

export const usePremium = (user) => {
  const [packages, setPackages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchPlans = async () => {
      try {
        setLoading(true);
        const res = await planService.getAllPlans();
        if (res.result) {
          const formatted = res.result.map(plan => ({
            id: plan.id,
            name: plan.name,
            description: plan.description,
            price: new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(plan.price),
            coins: new Intl.NumberFormat('vi-VN').format(plan.amount),
            bonus: '0',
          }));
          setPackages(formatted);
        }
      } catch (err) {
        console.error("Lỗi khi tải gói xu:", err);
        setError(getErrorMessage(err));
      } finally {
        setLoading(false);
      }
    };

    fetchPlans();
  }, []);

  const handleBuyClick = async (pkg) => {
    if (!user) {
      alert("Vui lòng đăng nhập để thực hiện nạp xu!");
      return;
    }

    if (user && !user.verified) {
      alert("Tài khoản của bạn chưa được xác thực email. Hệ thống sẽ chuyển hướng bạn đến trang xác thực OTP.");
      window.location.href = `/verify-email?email=${encodeURIComponent(user.email)}`;
      return;
    }
    
    try {
      setIsProcessing(true);
      setError('');
      const res = await paymentService.buyPackage(pkg.id);
      if (res.result) {
        window.location.href = res.result;
      } else {
        throw new Error("Không nhận được link thanh toán từ VNPay");
      }
    } catch (err) {
      console.error("Lỗi tạo hóa đơn:", err);
      alert(getErrorMessage(err));
    } finally {
      setIsProcessing(false);
    }
  };

  return {
    packages,
    loading,
    isProcessing,
    error,
    handleBuyClick
  };
};
