import React from 'react';

import Grid2 from '@mui/material/Unstable_Grid2';
import { Box, Card, Stack, Divider, Skeleton, Container, CardContent } from '@mui/material';

// ----------------------------------------------------------------------

export function CartSkeleton() {
    return (
        <Container maxWidth="lg" sx={{ py: { xs: 4, md: 6 } }}>
            {/* Title */}
            <Skeleton variant="text" width={300} height={48} sx={{ mb: 4 }} />

            <Grid2 container spacing={4}>
                {/* Danh sách sản phẩm */}
                <Grid2 xs={12} lg={8}>
                    <Stack spacing={3}>
                        {[1, 2, 3].map((item) => (
                            <Card key={item} sx={{ display: 'flex', alignItems: 'center', p: 2, gap: 3 }}>
                                {/* Hình ảnh */}
                                <Skeleton variant="rectangular" width={120} height={120} sx={{ borderRadius: 2 }} />

                                {/* Nội dung */}
                                <Box sx={{ flexGrow: 1, minWidth: 0 }}>
                                    <Skeleton variant="text" width="60%" height={24} />
                                    <Skeleton variant="text" width="40%" height={20} sx={{ mt: 1 }} />

                                    {/* Giá và quantity */}
                                    <Stack direction="row" spacing={1} sx={{ mt: 2, alignItems: 'center' }}>
                                        <Skeleton variant="text" width={60} height={24} />
                                        <Skeleton variant="rectangular" width={60} height={36} />
                                        <Skeleton variant="text" width={40} height={24} />
                                    </Stack>
                                </Box>

                                {/* Button xóa */}
                                <Skeleton variant="circular" width={32} height={32} />
                            </Card>
                        ))}
                    </Stack>
                </Grid2>

                {/* Tóm tắt đơn hàng */}
                <Grid2 xs={12} lg={4}>
                    <Card sx={{ position: 'sticky', top: 100 }}>
                        <CardContent sx={{ p: 3 }}>
                            <Stack spacing={2}>
                                <Skeleton variant="text" width={150} height={24} />
                                <Skeleton variant="text" width="100%" height={20} />
                                <Divider sx={{ my: 2 }} />
                                <Stack direction="row" justifyContent="space-between">
                                    <Skeleton variant="text" width={80} height={24} />
                                    <Skeleton variant="text" width={80} height={24} />
                                </Stack>
                                <Stack direction="row" justifyContent="space-between">
                                    <Skeleton variant="text" width={80} height={24} />
                                    <Skeleton variant="text" width={80} height={24} />
                                </Stack>
                                <Stack direction="row" justifyContent="space-between">
                                    <Skeleton variant="text" width={80} height={24} />
                                    <Skeleton variant="text" width={80} height={24} />
                                </Stack>
                                <Divider sx={{ my: 2 }} />
                                <Stack direction="row" justifyContent="space-between">
                                    <Skeleton variant="text" width={100} height={32} />
                                    <Skeleton variant="text" width={100} height={32} />
                                </Stack>

                                {/* Nút checkout */}
                                <Skeleton variant="rectangular" width="100%" height={48} sx={{ mt: 2 }} />
                            </Stack>
                        </CardContent>
                    </Card>
                </Grid2>
            </Grid2>
        </Container>
    );
}
