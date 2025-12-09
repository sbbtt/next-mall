// app/shop/[id]/page.tsx
import { products, type Product } from '@/lib/data/products';
import { notFound } from 'next/navigation';

type Props = {
  params: Promise<{
    id: string;
  }>;
};
// 상품 상세 페이지
export default async function ProductDetailPage({ params }: Props) {
  const { id } = await params;
    console.log('id: '+id)
  // ID로 상품 찾기
  const product = products.find((p) => p.id === Number(id));

  if (!product) {
    notFound(); // 없는 상품이면 404
  }

  return (
    <div className="container mx-auto px-4 py-12">
      <h1 className="text-4xl font-bold mb-4">{product.name}</h1>
      <img src={product.image} alt={product.name} className="w-full max-w-md mb-6" />
      <p className="text-2xl font-semibold mb-4">${product.price}</p>
      <p className="text-gray-600">{product?.desc}</p>
    </div>
  );
}
