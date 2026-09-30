import { Helmet } from 'react-helmet-async';
import { CONFIG } from 'src/config-global';
import orderService from '@/lib/service/order.service';
import { useParams } from 'react-router';
import { useEffect, useState } from 'react';
import { OrderDetailsView } from '../order/view';

export default function Page() {
    const { id = '' } = useParams();
    const [order, setOrder] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchOrder() {
            try {
                const res = await orderService.getOrdersDetail(id);
                setOrder(res as any);
            } finally {
                setLoading(false);
            }
        }
        fetchOrder();
    }, [id]);

    if (loading) {
        return <div>Loading...</div>;
    }

    return (
        <>
            <Helmet>
                <title>{`Order details | Dashboard - ${CONFIG.site.name}`}</title>
            </Helmet>

            <OrderDetailsView order={order!} id={id} />
        </>
    );
}
