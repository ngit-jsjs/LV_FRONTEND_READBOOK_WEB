import { useState } from 'react';

export const usePremium = (user, addCoins) => {
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [selectedPackage, setSelectedPackage] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const packages = [
    {
      id: 1,
      name: 'GÓI XU 199K',
      price: '199.000Đ',
      coins: '9.050',
      bonus: '100',
    },
    {
      id: 2,
      name: 'GÓI XU 599K',
      price: '599.000Đ',
      coins: '28.050',
      bonus: '300',
    },
    {
      id: 3,
      name: 'GÓI XU 999K',
      price: '999.000Đ',
      coins: '50.050',
      bonus: '500',
    }
  ];

  const handleBuyClick = (pkg) => {
    if (!user) {
      alert("Vui lòng đăng nhập để thực hiện nạp xu!");
      return;
    }
    setSelectedPackage(pkg);
    setShowPaymentModal(true);
    setIsSuccess(false);
    setIsProcessing(false);
  };

  const handleConfirmPayment = () => {
    setIsProcessing(true);
    setTimeout(() => {
      setIsProcessing(false);
      setIsSuccess(true);
      const mainCoins = parseInt(selectedPackage.coins.replace(/\D/g, ''));
      const bonusCoins = parseInt(selectedPackage.bonus.replace(/\D/g, ''));
      addCoins(mainCoins + bonusCoins);
    }, 2000);
  };

  const closePaymentModal = () => {
    setShowPaymentModal(false);
  };

  return {
    packages,
    showPaymentModal,
    selectedPackage,
    isProcessing,
    isSuccess,
    handleBuyClick,
    handleConfirmPayment,
    closePaymentModal
  };
};
