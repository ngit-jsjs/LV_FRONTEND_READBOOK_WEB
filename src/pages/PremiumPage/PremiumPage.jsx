import { FaCrown, FaCoins } from 'react-icons/fa';
import { MdInfoOutline } from 'react-icons/md';
import './PremiumPage.css';

function PremiumPage() {
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

  return (
    <div className="premium-page">
      <div className="container">
        
        {/* Header giống ảnh 1 */}
        <div className="premium-header">
          <div className="premium-badge">
            <FaCrown className="premium-badge-icon" />
            Unlock unlimited reading
          </div>
          <h1 className="premium-title">
            Choose Your <span className="premium-title-highlight">Reading Plan</span>
          </h1>
          <p className="premium-subtitle">
            Get access to premium content, exclusive features, and unlimited stories
          </p>
        </div>

        {/* Nội dung các gói giống ảnh 2 */}
        <h2 className="premium-section-title">Chọn gói xu muốn nạp</h2>
        
        <div className="premium-cards-container">
          {packages.map(pkg => (
            <div key={pkg.id} className="premium-package-card">
              <div className="package-icon-wrapper">
                <FaCoins className="package-icon" />
              </div>
              <h3 className="package-name">{pkg.name}</h3>
              <p className="package-promo-text">Khuyến mãi lên tới</p>
              
              <div className="package-coins-info">
                <span className="package-coins-main">
                  {pkg.coins} <FaCoins className="coin-icon-small" />
                </span>
                <span className="package-coins-bonus">
                  {pkg.bonus} <FaCrown className="coin-icon-small" />
                </span>
                <MdInfoOutline className="package-info-icon" />
              </div>

              <div className="package-price">
                {pkg.price}
              </div>

              <button className="package-buy-btn">
                MUA GÓI
              </button>
            </div>
          ))}
        </div>

      </div>
    </div>
  );
}

export default PremiumPage;
