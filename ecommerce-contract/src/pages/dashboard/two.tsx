import { isNil } from 'lodash';
import { useEffect } from 'react';
import { useParams } from 'react-router';
import { Helmet } from 'react-helmet-async';
import { useProducts } from '@/states/products';

import { CONFIG } from 'src/config-global';

import { ProductDetailsView } from '../products/ProductDetail';

// ----------------------------------------------------------------------

const metadata = { title: `Product details | Dashboard - ${CONFIG.site.name}` };

export default function Page() {
  const { id = '' } = useParams();

  const { product,
    productLoading,
    productError,
    setCurrentProductId } = useProducts();

  useEffect(() => {
    setCurrentProductId(id);
  }, [id]);


  return (
    <>
      <Helmet>
        <title> {metadata.title}</title>
      </Helmet>

      <ProductDetailsView product={isNil(product) ? undefined : product} loading={productLoading} error={productError} />
    </>
  );
}
