import { Helmet } from 'react-helmet-async';

import { useParams } from 'src/routes/hooks';

import { CONFIG } from 'src/config-global';

import { MessagesView } from '../messages/messages-view';

// ----------------------------------------------------------------------

const metadata = { title: `Messages | ${CONFIG.site.name}` };

export default function Page() {
    const { id } = useParams();

    return (
        <>
            <Helmet>
                <title> {metadata.title}</title>
            </Helmet>

            <MessagesView activeId={id} />
        </>
    );
}
