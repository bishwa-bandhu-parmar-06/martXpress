// pages/BrandPage.jsx
import { useParams } from 'react-router-dom';

const BrandPage = () => {
  const { brandSlug } = useParams();
  
  return (
    <div>
      <h1>Brand: {brandSlug}</h1>
      {/* Brand-specific products/content */}
    </div>
  );
};

export default BrandPage;