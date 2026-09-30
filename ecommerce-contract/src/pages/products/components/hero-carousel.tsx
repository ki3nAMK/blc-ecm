import Autoplay from 'embla-carousel-autoplay';
import { useTranslation } from 'react-i18next';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Button from '@mui/material/Button';
import { useTheme } from '@mui/material/styles';
import Typography from '@mui/material/Typography';

import { paths } from 'src/routes/paths';
import { RouterLink } from 'src/routes/components';

import { Iconify } from 'src/components/iconify';
import { Carousel, useCarousel } from 'src/components/carousel';

// ----------------------------------------------------------------------

const HERO_LIST = [
    {
        id: '1',
        name: 'Summer Sale 2025 - Up to 50% Off',
        coverUrl: '/assets/background-1.jpg',
    },
    {
        id: '2',
        name: 'Exclusive Deals on New Items',
        coverUrl: '/assets/background-2.webp',
    },
    {
        id: '3',
        name: 'Exclusive Deals on New Items today',
        coverUrl: '/assets/background-3.jpg',
    },
];

// ----------------------------------------------------------------------

export default function HeroCarousel() {
    const theme = useTheme();
    const { t } = useTranslation();
    const carousel = useCarousel({ loop: true }, [Autoplay({ playOnInit: true, delay: 8000 })]);

    return (
        <Card sx={{ position: 'relative', borderRadius: 2, overflow: 'hidden' }}>
            {/* Carousel chỉ chứa ảnh */}
            <Carousel carousel={carousel}>
                {HERO_LIST.map((item) => (
                    <Box
                        key={item.id}
                        sx={{
                            width: 1,
                            height: { xs: 300, md: 665 },
                            position: 'relative',
                        }}
                    >
                        <img
                            src={item.coverUrl}
                            alt={item.name}
                            style={{
                                position: 'absolute',
                                top: 0,
                                left: 0,
                                width: '100%',
                                height: '100%',
                                objectFit: 'cover',
                            }}
                        />

                    </Box>
                ))}
            </Carousel>

            <Box
                sx={{
                    position: 'absolute',
                    top: '50%',
                    left: '50%',
                    transform: 'translate(-50%, -50%)',
                    zIndex: 2,
                    maxWidth: 600,
                    textAlign: 'center',
                    color: 'common.white',
                    px: 3,
                }}
            >
                <Typography variant="h2" sx={{ mb: 2, fontWeight: 800 }}>
                    {t('home.heroTitle')}
                </Typography>
                <Button
                    component={RouterLink}
                    href={paths.dashboard.root}
                    size="large"
                    variant="contained"
                    color="primary"
                    startIcon={<Iconify icon="mingcute:shopping-bag-2-line" />}
                >
                    {t('home.shopNow')}
                </Button>
            </Box>
        </Card>

    );
}
