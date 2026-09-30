import type { IOrder, IOrderItem } from 'src/types/order';

import Box from '@mui/material/Box';
import Link from '@mui/material/Link';
import Paper from '@mui/material/Paper';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Avatar from '@mui/material/Avatar';
import MenuList from '@mui/material/MenuList';
import Collapse from '@mui/material/Collapse';
import MenuItem from '@mui/material/MenuItem';
import TableRow from '@mui/material/TableRow';
import Checkbox from '@mui/material/Checkbox';
import TableCell from '@mui/material/TableCell';
import IconButton from '@mui/material/IconButton';
import ListItemText from '@mui/material/ListItemText';

import { useBoolean } from 'src/hooks/use-boolean';

import { fCurrency, fEth } from 'src/utils/format-number';
import { fDate, fTime } from 'src/utils/format-time';

import { Label } from 'src/components/label';
import { Iconify } from 'src/components/iconify';
import { ConfirmDialog } from 'src/components/custom-dialog';
import { usePopover, CustomPopover } from 'src/components/custom-popover';
import { get } from 'lodash';
import { useAuthContext } from '@/auth/hooks';

// ----------------------------------------------------------------------

type Props = {
  row: IOrderItem;
  selected: boolean;
  onViewRow: () => void;
  onSelectRow: () => void;
  onDeleteRow: () => void;
};

export function OrderTableRow({ row, selected, onViewRow, onSelectRow, onDeleteRow }: Props) {
  const confirm = useBoolean();
  const { user } = useAuthContext()

  const collapse = useBoolean();

  const popover = usePopover();

  const totalQuantity = row.items.reduce((sum, item) => sum + item.quantity, 0);

  const subtotal = row.items.reduce(
    (sum, item) => sum + ((item.productId as any)?.price || 0) * item.quantity,
    0
  );

  const renderPrimary = (
    <TableRow hover selected={selected}>
      <TableCell padding="checkbox">
        <Checkbox
          checked={selected}
          onClick={onSelectRow}
          inputProps={{ id: `row-checkbox-${row.id}`, 'aria-label': `Row checkbox` }}
        />
      </TableCell>

      <TableCell>
        <Link color="inherit" onClick={onViewRow} underline="always" sx={{ cursor: 'pointer' }}>
          {row.id.slice(0, 4)}
        </Link>
      </TableCell>

      <TableCell>
        <Stack spacing={2} direction="row" alignItems="center">
          <Avatar alt={row.customer?.name} src={row.customer?.avatarUrl} />

          <Stack sx={{ typography: 'body2', flex: '1 1 auto', alignItems: 'flex-start' }}>
            <Box component="span">{row.customer?.name}</Box>
            <Box component="span" sx={{ color: 'text.disabled' }}>
              {row.customer?.email}
            </Box>
          </Stack>
        </Stack>
      </TableCell>

      <TableCell>
        <ListItemText
          primary={fDate(row.createdAt)}
          secondary={fTime(row.createdAt)}
          primaryTypographyProps={{ typography: 'body2', noWrap: true }}
          secondaryTypographyProps={{ mt: 0.5, component: 'span', typography: 'caption' }}
        />
      </TableCell>

      <TableCell align="center"> {totalQuantity} </TableCell>

      <TableCell>
        <Stack direction="row" spacing={0.5} alignItems="center">
          <Box
            component="img"
            src="/assets/eth.png"
            width={16}
            height={16}
            sx={{ display: 'inline-block' }}
          />
          <span>{fEth(subtotal)}</span>
        </Stack>
      </TableCell>

      <TableCell>
        <Label
          variant="soft"
          color={
            (row.status === 'completed' && 'success') ||
            (row.status === 'pending' && 'warning') ||
            (row.status === 'cancelled' && 'error') ||
            (row.status === 'refunded' && 'secondary') ||
            'default'
          }
        >
          {row.status}
        </Label>
      </TableCell>

      <TableCell align="right" sx={{ px: 1, whiteSpace: 'nowrap' }}>
        <IconButton
          color={collapse.value ? 'inherit' : 'default'}
          onClick={collapse.onToggle}
          sx={{ ...(collapse.value && { bgcolor: 'action.hover' }) }}
        >
          <Iconify icon="eva:arrow-ios-downward-fill" />
        </IconButton>

        <IconButton color={popover.open ? 'inherit' : 'default'} onClick={popover.onOpen}>
          <Iconify icon="eva:more-vertical-fill" />
        </IconButton>
      </TableCell>
    </TableRow>
  );

  const renderSecondary = (
    <TableRow>
      <TableCell sx={{ p: 0, border: 'none' }} colSpan={8}>
        <Collapse
          in={collapse.value}
          timeout="auto"
          unmountOnExit
          sx={{ bgcolor: 'background.neutral' }}
        >
          <Paper sx={{ m: 1.5, p: 1 }}>
            {row.items.length === 0 && (
              <Box sx={{ p: 2, textAlign: 'center', color: 'text.disabled' }}>
                Không có sản phẩm
              </Box>
            )}

            {row.items.map((item, index) => {
              const p = item.productId;

              if (!p) {
                console.log("❌ productId bị null:", item);
                return null;
              }

              return (
                <Stack
                  key={item.orderContractId || index}
                  direction="row"
                  alignItems="center"
                  spacing={2}
                  sx={{
                    py: 1.5,
                    px: 2,
                    '&:not(:last-of-type)': {
                      borderBottom: (theme) =>
                        `solid 1px ${theme.vars.palette.divider}`,
                    },
                  }}
                >
                  <Avatar
                    src={p.coverUrl}
                    variant="rounded"
                    sx={{ width: 48, height: 48 }}
                  />

                  <ListItemText
                    primary={p.name}
                    secondary={p.sku}
                    primaryTypographyProps={{ typography: 'body2' }}
                    secondaryTypographyProps={{
                      component: 'span',
                      color: 'text.disabled',
                      mt: 0.5,
                    }}
                  />

                  <Box sx={{ ml: 'auto', fontWeight: 600 }}>x{item.quantity}</Box>
                  <Box sx={{ width: 120, textAlign: 'right' }}>
                    <Stack direction="row" spacing={0.5} alignItems="center" justifyContent="flex-end">
                      <Box
                        component="img"
                        src="/assets/eth.png"
                        width={16}
                        height={16}
                        sx={{ display: 'inline-block' }}
                      />
                      <span>{fEth(p.price)}</span>
                    </Stack>
                  </Box>

                </Stack>
              );
            })}
          </Paper>
        </Collapse>
      </TableCell>
    </TableRow>
  );


  return (
    <>
      {renderPrimary}

      {renderSecondary}

      <CustomPopover
        open={popover.open}
        anchorEl={popover.anchorEl}
        onClose={popover.onClose}
        slotProps={{ arrow: { placement: 'right-top' } }}
      >
        <MenuList>
          <MenuItem
            onClick={() => {
              confirm.onTrue();
              popover.onClose();
            }}
            sx={{ color: 'error.main' }}
          >
            <Iconify icon="solar:trash-bin-trash-bold" />
            Delete
          </MenuItem>

          <MenuItem
            onClick={() => {
              onViewRow();
              popover.onClose();
            }}
          >
            <Iconify icon="solar:eye-bold" />
            View
          </MenuItem>
        </MenuList>
      </CustomPopover>

      <ConfirmDialog
        open={confirm.value}
        onClose={confirm.onFalse}
        title="Delete"
        content="Are you sure want to delete?"
        action={
          <Button variant="contained" color="error" onClick={onDeleteRow}>
            Delete
          </Button>
        }
      />
    </>
  );
}
