import type { BoxProps } from '@mui/material/Box';
import type { NavSectionProps } from 'src/components/nav-section';

import { useState, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import parse from 'autosuggest-highlight/parse';
import match from 'autosuggest-highlight/match';

import Box from '@mui/material/Box';
import SvgIcon from '@mui/material/SvgIcon';
import InputBase from '@mui/material/InputBase';
import Typography from '@mui/material/Typography';
import { useTheme } from '@mui/material/styles';
import IconButton from '@mui/material/IconButton';
import InputAdornment from '@mui/material/InputAdornment';
import Dialog, { dialogClasses } from '@mui/material/Dialog';

import { paths } from 'src/routes/paths';
import { useRouter } from 'src/routes/hooks';

import { fEth } from 'src/utils/format-number';

import { useBoolean } from 'src/hooks/use-boolean';
import { useEventListener } from 'src/hooks/use-event-listener';

import { varAlpha } from 'src/theme/styles';

import { Label } from 'src/components/label';
import { Iconify } from 'src/components/iconify';
import { Scrollbar } from 'src/components/scrollbar';
import { SearchNotFound } from 'src/components/search-not-found';

import { ResultItem } from './result-item';
import { useProductSearchResults } from './use-product-search';

// ----------------------------------------------------------------------

export type SearchbarProps = BoxProps & {
  data?: NavSectionProps['data'];
};

export function Searchbar({ data: _navItems, sx, ...other }: SearchbarProps) {
  const theme = useTheme();

  const router = useRouter();

  const search = useBoolean();

  const [searchQuery, setSearchQuery] = useState('');

  const handleClose = useCallback(() => {
    search.onFalse();
    setSearchQuery('');
  }, [search]);

  const handleKeyDown = (event: KeyboardEvent) => {
    if (event.key === 'k' && event.metaKey) {
      search.onToggle();
      setSearchQuery('');
    }
  };

  useEventListener('keydown', handleKeyDown);

  const handleClick = useCallback(
    (path: string) => {
      router.push(path);
      handleClose();
    },
    [handleClose, router]
  );

  const handleSearch = useCallback((event: React.ChangeEvent<HTMLTextAreaElement>) => {
    setSearchQuery(event.target.value);
  }, []);

  const { results: dataFiltered, isSuggestion } = useProductSearchResults(searchQuery);

  const notFound = !isSuggestion && !dataFiltered.length;

  const renderItems = () => (
    <>
      {isSuggestion && dataFiltered.length > 0 && (
        <Typography variant="overline" sx={{ color: 'text.disabled', px: 1 }}>
          Best Sellers
        </Typography>
      )}
      <Box component="ul">
        {dataFiltered.map((product) => {
          const partsTitle = parse(product.name, match(product.name, searchQuery));

          return (
            <Box component="li" key={product.id} sx={{ display: 'flex' }}>
              <ResultItem
                path={[{ text: `${product.category} · ${fEth(product.price)} ETH`, highlight: false }]}
                title={partsTitle}
                groupLabel=""
                onClickItem={() => handleClick(paths.dashboard.product.details(product.id))}
              />
            </Box>
          );
        })}
      </Box>
    </>
  );

  const renderButton = (
    <Box
      display="flex"
      alignItems="center"
      onClick={search.onTrue}
      sx={{
        pr: { sm: 1 },
        borderRadius: { sm: 1.5 },
        cursor: { sm: 'pointer' },
        bgcolor: { sm: varAlpha(theme.vars.palette.grey['500Channel'], 0.08) },
        ...sx,
      }}
      {...other}
    >
      <IconButton disableRipple>
        {/* https://icon-sets.iconify.design/eva/search-fill/ */}
        <SvgIcon sx={{ width: 20, height: 20 }}>
          <path
            fill="currentColor"
            d="m20.71 19.29l-3.4-3.39A7.92 7.92 0 0 0 19 11a8 8 0 1 0-8 8a7.92 7.92 0 0 0 4.9-1.69l3.39 3.4a1 1 0 0 0 1.42 0a1 1 0 0 0 0-1.42M5 11a6 6 0 1 1 6 6a6 6 0 0 1-6-6"
          />
        </SvgIcon>
      </IconButton>

      <Label
        sx={{
          fontSize: 12,
          color: 'grey.800',
          bgcolor: 'common.white',
          boxShadow: theme.customShadows.z1,
          display: { xs: 'none', sm: 'inline-flex' },
        }}
      >
        ⌘K
      </Label>
    </Box>
  );

  return (
    <>
      {renderButton}

      <Dialog
        fullWidth
        disableRestoreFocus
        maxWidth="sm"
        open={search.value}
        onClose={handleClose}
        transitionDuration={{ enter: theme.transitions.duration.shortest, exit: 0 }}
        PaperProps={{ sx: { mt: 15, overflow: 'unset' } }}
        sx={{ [`& .${dialogClasses.container}`]: { alignItems: 'flex-start' } }}
      >
        <Box sx={{ p: 3, borderBottom: `solid 1px ${theme.vars.palette.divider}` }}>
          <InputBase
            fullWidth
            autoFocus
            placeholder="Search..."
            value={searchQuery}
            onChange={handleSearch}
            startAdornment={
              <InputAdornment position="start">
                <Iconify icon="eva:search-fill" width={24} sx={{ color: 'text.disabled' }} />
              </InputAdornment>
            }
            endAdornment={<Label sx={{ letterSpacing: 1, color: 'text.secondary' }}>esc</Label>}
            inputProps={{ sx: { typography: 'h6' } }}
          />
        </Box>

        {notFound ? (
          <SearchNotFound query={searchQuery} sx={{ py: 15 }} />
        ) : (
          <Scrollbar sx={{ px: 3, pb: 3, pt: 2, height: 400 }}>{renderItems()}</Scrollbar>
        )}
      </Dialog>
    </>
  );
}

export function SearchbarExtended({ data: _navItems, sx, ...other }: SearchbarProps) {
  const theme = useTheme();
  const { t } = useTranslation();

  const router = useRouter();

  const search = useBoolean();

  // Single query drives both the always-visible header input and the dialog's input, so
  // typing into either one keeps the other in sync instead of silently going nowhere.
  const [searchQuery, setSearchQuery] = useState('');

  const handleOpen = () => search.onTrue();

  const handleClose = useCallback(() => {
    search.onFalse();
    setSearchQuery('');
  }, [search]);

  const handleKeyDown = (event: KeyboardEvent) => {
    if (event.key === 'k' && event.metaKey) {
      search.onToggle();
      setSearchQuery('');
    }
  };

  useEventListener('keydown', handleKeyDown);

  const handleClick = useCallback(
    (path: string) => {
      router.push(path);
      handleClose();
    },
    [handleClose, router]
  );

  const handleSearch = useCallback(
    (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      setSearchQuery(event.target.value);
      search.onTrue();
    },
    [search]
  );

  const { results: dataFiltered, isSuggestion } = useProductSearchResults(searchQuery);

  const notFound = !isSuggestion && !dataFiltered.length;

  const renderItems = () => (
    <>
      {isSuggestion && dataFiltered.length > 0 && (
        <Typography variant="overline" sx={{ color: 'text.disabled', px: 1 }}>
          Best Sellers
        </Typography>
      )}
      <Box component="ul">
        {dataFiltered.map((product) => {
          const partsTitle = parse(product.name, match(product.name, searchQuery));

          return (
            <Box component="li" key={product.id} sx={{ display: 'flex' }}>
              <ResultItem
                path={[{ text: `${product.category} · ${fEth(product.price)} ETH`, highlight: false }]}
                title={partsTitle}
                groupLabel=""
                onClickItem={() => handleClick(paths.dashboard.product.details(product.id))}
              />
            </Box>
          );
        })}
      </Box>
    </>
  );

  return (
    <>
      {/* Thanh tìm kiếm dài */}
      <Box
        onClick={handleOpen}
        sx={{
          width: '100%',
          display: 'flex',
          alignItems: 'center',
          height: 40,
          bgcolor: 'background.neutral',
          borderRadius: 1,
          px: 1.5,
          cursor: 'pointer',
          transition: 'all 0.2s',
          '&:hover': { bgcolor: 'action.hover' },
        }}
      >
        <InputAdornment position="start">
          <Iconify icon="eva:search-fill" width={20} sx={{ color: 'text.disabled' }} />
        </InputAdornment>

        <InputBase
          placeholder={t('header.searchPlaceholder')}
          value={searchQuery}
          onChange={handleSearch}
          onClick={handleOpen}
          sx={{
            ml: 1,
            flex: 1,
            typography: 'body2',
            color: 'text.primary',
            '&::placeholder': { color: 'text.secondary', opacity: 1 },
          }}
        />

        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            bgcolor: 'background.paper',
            borderRadius: 0.5,
            px: 0.5,
            py: 0.25,
            fontSize: 11,
            fontWeight: 600,
            color: 'text.secondary',
          }}
        >
          ⌘K
        </Box>
      </Box>

      {/* Dialog tìm kiếm (giống cũ) */}
      <Dialog
        fullWidth
        disableRestoreFocus
        maxWidth="sm"
        open={search.value}
        onClose={handleClose}
        transitionDuration={{ enter: theme.transitions.duration.shortest, exit: 0 }}
        PaperProps={{ sx: { mt: 15, overflow: 'unset' } }}
        sx={{ [`& .${dialogClasses.container}`]: { alignItems: 'flex-start' } }}
      >
        <Box sx={{ p: 3, borderBottom: `solid 1px ${theme.vars.palette.divider}` }}>
          <InputBase
            fullWidth
            autoFocus
            placeholder="Search..."
            value={searchQuery}
            onChange={handleSearch}
            startAdornment={
              <InputAdornment position="start">
                <Iconify icon="eva:search-fill" width={24} sx={{ color: 'text.disabled' }} />
              </InputAdornment>
            }
            endAdornment={<Label sx={{ letterSpacing: 1, color: 'text.secondary' }}>esc</Label>}
            inputProps={{ sx: { typography: 'h6' } }}
          />
        </Box>

        {notFound ? (
          <SearchNotFound query={searchQuery} sx={{ py: 15 }} />
        ) : (
          <Scrollbar sx={{ px: 3, pb: 3, pt: 2, height: 400 }}>{renderItems()}</Scrollbar>
        )}
      </Dialog>    </>
  );
}