import { useEffect } from 'react';
import { Helmet } from 'react-helmet-async';

import { CONFIG } from 'src/config-global';
import { useAuthContext } from 'src/auth/hooks';
import { useRouter } from 'src/routes/hooks';

import EcommerceHomeView from '../products/ProductHome';

// ----------------------------------------------------------------------

const metadata = { title: `Ecommerce | home page - ${CONFIG.site.name}` };

export default function Page() {
  const { user } = useAuthContext();
  const router = useRouter();

  useEffect(() => {
    if (user?.role === 'SELLER') {
      router.replace('/seller/order');
    }
  }, [user, router]);

  return (
    <>
      <Helmet>
        <title> {metadata.title}</title>
      </Helmet>

      <EcommerceHomeView />
    </>
  );
}

