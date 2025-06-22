import { useParams } from 'react-router-dom';

const ShopCategoryPage = () => {
  const { category } = useParams();

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold">Showing products for: {category}</h1>
      {/* You can now fetch/filter products based on `category` */}
    </div>
  );
};

export default ShopCategoryPage;
