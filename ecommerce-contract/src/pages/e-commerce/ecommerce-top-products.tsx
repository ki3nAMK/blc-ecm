import type { CardProps } from '@mui/material/Card';
import type { TableHeadCustomProps } from 'src/components/table';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Table from '@mui/material/Table';
import Avatar from '@mui/material/Avatar';
import TableRow from '@mui/material/TableRow';
import TableCell from '@mui/material/TableCell';
import TableBody from '@mui/material/TableBody';
import CardHeader from '@mui/material/CardHeader';

import { fEth } from 'src/utils/format-number';

import { Label } from 'src/components/label';
import { Scrollbar } from 'src/components/scrollbar';
import { EmptyContent } from 'src/components/empty-content';
import { TableHeadCustom } from 'src/components/table';

// ----------------------------------------------------------------------

type Props = CardProps & {
  title?: string;
  subheader?: string;
  data: {
    id: string;
    name: string;
    coverUrl: string;
    units: number;
    revenue: number;
  }[];
};

const HEAD_LABEL: TableHeadCustomProps['headLabel'] = [
  { id: 'name', label: 'Product' },
  { id: 'units', label: 'Units sold', align: 'right' },
  { id: 'revenue', label: 'Revenue (ETH)', align: 'right' },
  { id: 'rank', label: 'Rank', align: 'right' },
];

const RANK_COLORS = ['primary', 'secondary', 'info', 'warning', 'default'] as const;

export function EcommerceTopProducts({ title, subheader, data, ...other }: Props) {
  return (
    <Card {...other}>
      <CardHeader title={title} subheader={subheader} sx={{ mb: 3 }} />

      {data.length === 0 ? (
        <EmptyContent title="No completed sales yet" sx={{ py: 8 }} />
      ) : (
        <Scrollbar>
          <Table sx={{ minWidth: 480 }}>
            <TableHeadCustom headLabel={HEAD_LABEL} />

            <TableBody>
              {data.map((row, index) => (
                <TableRow key={row.id}>
                  <TableCell>
                    <Box sx={{ gap: 2, display: 'flex', alignItems: 'center' }}>
                      <Avatar variant="rounded" alt={row.name} src={row.coverUrl} />
                      {row.name}
                    </Box>
                  </TableCell>

                  <TableCell align="right">{row.units}</TableCell>

                  <TableCell align="right">{fEth(row.revenue)}</TableCell>

                  <TableCell align="right">
                    <Label variant="soft" color={RANK_COLORS[index] ?? 'default'}>
                      {`Top ${index + 1}`}
                    </Label>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Scrollbar>
      )}
    </Card>
  );
}
