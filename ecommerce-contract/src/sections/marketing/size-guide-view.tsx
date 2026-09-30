import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Table from '@mui/material/Table';
import TableRow from '@mui/material/TableRow';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableHead from '@mui/material/TableHead';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import TableContainer from '@mui/material/TableContainer';

import { SimpleLayout } from 'src/layouts/simple';
import {
  SHOE_CHART,
  WAIST_CHART,
  APPAREL_CHART,
} from 'src/pages/products/components/size-chart-dialog';

// ----------------------------------------------------------------------

// Same reference data shown in the per-product "Size chart" dialog — this page is just the
// general, always-available version of it, reached from the footer instead of a specific
// product page.
export function SizeGuideView() {
  return (
    <SimpleLayout>
      <Container sx={{ py: { xs: 6, md: 10 }, maxWidth: 800, mx: 'auto' }}>
        <Typography variant="h2" sx={{ mb: 2 }}>
          Size Guide
        </Typography>
        <Typography variant="body1" sx={{ color: 'text.secondary', mb: 6 }}>
          Measurements are approximate — if you're between sizes, we recommend sizing up.
        </Typography>

        <Stack spacing={6}>
          <Box>
            <Typography variant="h5" sx={{ mb: 2 }}>
              Shoes
            </Typography>
            <Typography variant="body2" sx={{ color: 'text.secondary', mb: 2 }}>
              Sizes are listed in EU with US/UK equivalents and foot length in centimeters.
            </Typography>
            <TableContainer>
              <Table size="small">
                <TableHead>
                  <TableRow>
                    <TableCell>EU</TableCell>
                    <TableCell>US Men</TableCell>
                    <TableCell>US Women</TableCell>
                    <TableCell>UK</TableCell>
                    <TableCell>Foot length (cm)</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {SHOE_CHART.map((row) => (
                    <TableRow key={row.eu}>
                      <TableCell sx={{ fontWeight: 600 }}>{row.eu}</TableCell>
                      <TableCell>{row.usMen}</TableCell>
                      <TableCell>{row.usWomen}</TableCell>
                      <TableCell>{row.uk}</TableCell>
                      <TableCell>{row.cm}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Box>

          <Box>
            <Typography variant="h5" sx={{ mb: 2 }}>
              Apparel
            </Typography>
            <Typography variant="body2" sx={{ color: 'text.secondary', mb: 2 }}>
              Measurements are in centimeters.
            </Typography>
            <TableContainer>
              <Table size="small">
                <TableHead>
                  <TableRow>
                    <TableCell>Size</TableCell>
                    <TableCell>US</TableCell>
                    <TableCell>UK</TableCell>
                    <TableCell>EU</TableCell>
                    <TableCell>Chest</TableCell>
                    <TableCell>Waist</TableCell>
                    <TableCell>Hip</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {APPAREL_CHART.map((row) => (
                    <TableRow key={row.size}>
                      <TableCell sx={{ fontWeight: 600 }}>{row.size}</TableCell>
                      <TableCell>{row.us}</TableCell>
                      <TableCell>{row.uk}</TableCell>
                      <TableCell>{row.eu}</TableCell>
                      <TableCell>{row.chest}</TableCell>
                      <TableCell>{row.waist}</TableCell>
                      <TableCell>{row.hip}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Box>

          <Box>
            <Typography variant="h5" sx={{ mb: 2 }}>
              Belts & Waist Sizing
            </Typography>
            <Typography variant="body2" sx={{ color: 'text.secondary', mb: 2 }}>
              Sizes shown as waist measurement in inches with the centimeter equivalent.
            </Typography>
            <TableContainer>
              <Table size="small">
                <TableHead>
                  <TableRow>
                    <TableCell>Size (in)</TableCell>
                    <TableCell>Waist (cm)</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {WAIST_CHART.map((row) => (
                    <TableRow key={row.size}>
                      <TableCell sx={{ fontWeight: 600 }}>{row.size}</TableCell>
                      <TableCell>{row.cm}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Box>
        </Stack>
      </Container>
    </SimpleLayout>
  );
}
