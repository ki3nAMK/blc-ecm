import Table from '@mui/material/Table';
import Dialog from '@mui/material/Dialog';
import TableRow from '@mui/material/TableRow';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableHead from '@mui/material/TableHead';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import TableContainer from '@mui/material/TableContainer';

import { Iconify } from 'src/components/iconify';

// ----------------------------------------------------------------------

export const APPAREL_CHART = [
  { size: 'XS', us: '0-2', uk: '4-6', eu: '32-34', chest: '78-81', waist: '60-63', hip: '86-89' },
  { size: 'S', us: '4-6', uk: '8-10', eu: '36-38', chest: '83-86', waist: '65-68', hip: '91-94' },
  { size: 'M', us: '8-10', uk: '12-14', eu: '40-42', chest: '89-92', waist: '71-74', hip: '97-100' },
  { size: 'L', us: '12-14', uk: '16-18', eu: '44-46', chest: '97-100', waist: '79-82', hip: '105-108' },
  { size: 'XL', us: '16-18', uk: '20-22', eu: '48-50', chest: '105-108', waist: '87-90', hip: '113-116' },
  { size: 'XXL', us: '20-22', uk: '24-26', eu: '52-54', chest: '113-116', waist: '95-98', hip: '121-124' },
];

export const SHOE_CHART = [
  { eu: '36', usMen: '4', usWomen: '5.5', uk: '3.5', cm: '23' },
  { eu: '37', usMen: '5', usWomen: '6.5', uk: '4.5', cm: '23.5' },
  { eu: '38', usMen: '6', usWomen: '7.5', uk: '5', cm: '24' },
  { eu: '39', usMen: '6.5', usWomen: '8', uk: '5.5', cm: '24.5' },
  { eu: '40', usMen: '7', usWomen: '8.5', uk: '6.5', cm: '25.5' },
  { eu: '41', usMen: '8', usWomen: '9.5', uk: '7', cm: '26' },
  { eu: '42', usMen: '8.5', usWomen: '10', uk: '8', cm: '26.5' },
  { eu: '43', usMen: '9.5', usWomen: '11', uk: '9', cm: '27.5' },
  { eu: '44', usMen: '10', usWomen: '11.5', uk: '9.5', cm: '28' },
  { eu: '45', usMen: '11', usWomen: '12.5', uk: '10.5', cm: '29' },
];

export const WAIST_CHART = [
  { size: '30', cm: '76' },
  { size: '32', cm: '81' },
  { size: '34', cm: '86' },
  { size: '36', cm: '91' },
  { size: '38', cm: '97' },
  { size: '40', cm: '102' },
];

export type SizeChartType = 'apparel' | 'shoe' | 'waist' | 'none';

export function getSizeChartType(sizes: string[]): SizeChartType {
  if (!sizes?.length || (sizes.length === 1 && sizes[0] === 'One Size')) return 'none';
  if (sizes.every((size) => /^(XXS|XS|S|M|L|XL|XXL)$/i.test(size))) return 'apparel';
  if (sizes.every((size) => Number(size) >= 30 && Number(size) <= 46)) {
    return Number(sizes[0]) >= 36 ? 'shoe' : 'waist';
  }
  return 'none';
}

type Props = {
  open: boolean;
  onClose: () => void;
  type: SizeChartType;
  currentSize?: string;
};

export function SizeChartDialog({ open, onClose, type, currentSize }: Props) {
  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        Size Chart
        <IconButton onClick={onClose}>
          <Iconify icon="mingcute:close-line" />
        </IconButton>
      </DialogTitle>

      <DialogContent sx={{ pb: 3 }}>
        {type === 'apparel' && (
          <>
            <Typography variant="body2" sx={{ color: 'text.secondary', mb: 2 }}>
              Measurements are in centimeters. If you are between sizes, we recommend sizing up.
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
                    <TableRow key={row.size} selected={row.size === currentSize}>
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
          </>
        )}

        {type === 'shoe' && (
          <>
            <Typography variant="body2" sx={{ color: 'text.secondary', mb: 2 }}>
              Sizes shown in EU with US/UK equivalents and foot length in centimeters.
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
                    <TableRow key={row.eu} selected={row.eu === currentSize}>
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
          </>
        )}

        {type === 'waist' && (
          <>
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
                    <TableRow key={row.size} selected={row.size === currentSize}>
                      <TableCell sx={{ fontWeight: 600 }}>{row.size}</TableCell>
                      <TableCell>{row.cm}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </>
        )}

        {type === 'none' && (
          <Typography variant="body2" sx={{ color: 'text.secondary' }}>
            This item is designed to fit most people — no size chart needed.
          </Typography>
        )}
      </DialogContent>
    </Dialog>
  );
}
