import type { NavSectionProps } from 'src/components/nav-section';

import { toast } from 'sonner';
import { m } from 'framer-motion';
import { useQuery } from '@tanstack/react-query';
import { useRouter } from '@/routes/hooks';

import Box from '@mui/material/Box';
import Link from '@mui/material/Link';
import Badge from '@mui/material/Badge';
import Button from '@mui/material/Button';
import { styled } from '@mui/material/styles';

import { useTranslation } from 'react-i18next';

import { paths } from 'src/routes/paths';
import { RouterLink } from 'src/routes/components';

import { useFavorites } from '@/states/favorites';
import messageService from '@/lib/service/message.service';

import { Logo } from 'src/components/logo';
import { Iconify } from 'src/components/iconify';

import { useAuthContext } from 'src/auth/hooks';

import { HeaderSection } from './header-section';
import { AccountDrawer } from '../components/account-drawer';
import { LanguagePopover } from '../components/language-popover';
import { Searchbar, SearchbarExtended } from '../components/searchbar';
import { NotificationsDrawer } from '../components/notifications-drawer';

import type { HeaderSectionProps } from './header-section';
import type { AccountDrawerProps } from '../components/account-drawer';
import type { ContactsPopoverProps } from '../components/contacts-popover';
import type { LanguagePopoverProps } from '../components/language-popover';
import type { WorkspacesPopoverProps } from '../components/workspaces-popover';
import type { NotificationsDrawerProps } from '../components/notifications-drawer';

// ----------------------------------------------------------------------

const StyledDivider = styled('span')(({ theme }) => ({
  width: 1,
  height: 10,
  flexShrink: 0,
  display: 'none',
  position: 'relative',
  alignItems: 'center',
  flexDirection: 'column',
  marginLeft: theme.spacing(2.5),
  marginRight: theme.spacing(2.5),
  backgroundColor: 'currentColor',
  color: theme.vars.palette.divider,
  '&::before, &::after': {
    top: -5,
    width: 3,
    height: 3,
    content: '""',
    flexShrink: 0,
    borderRadius: '50%',
    position: 'absolute',
    backgroundColor: 'currentColor',
  },
  '&::after': { bottom: -5, top: 'auto' },
}));

// ----------------------------------------------------------------------

export type HeaderBaseProps = HeaderSectionProps & {
  onOpenNav: () => void;
  data?: {
    nav?: NavSectionProps['data'];
    account?: AccountDrawerProps['data'];
    langs?: LanguagePopoverProps['data'];
    contacts?: ContactsPopoverProps['data'];
    workspaces?: WorkspacesPopoverProps['data'];
    notifications?: NotificationsDrawerProps['data'];
  };
  slots?: {
    navMobile?: {
      topArea?: React.ReactNode;
      bottomArea?: React.ReactNode;
    };
  };
  slotsDisplay?: {
    signIn?: boolean;
    account?: boolean;
    helpLink?: boolean;
    settings?: boolean;
    purchase?: boolean;
    contacts?: boolean;
    searchbar?: boolean;
    workspaces?: boolean;
    menuButton?: boolean;
    localization?: boolean;
    notifications?: boolean;
  };
};

export function HeaderBase({
  sx,
  data,
  slots,
  slotProps,
  onOpenNav,
  layoutQuery,
  slotsDisplay: {
    signIn = true,
    account = true,
    helpLink = true,
    settings = true,
    purchase = true,
    contacts = true,
    searchbar = true,
    workspaces = true,
    menuButton = true,
    localization = true,
    notifications = true,
  } = {},
  ...other
}: HeaderBaseProps) {
  const { authenticated, loading, loginByMetamask } = useAuthContext();
  const router = useRouter();
  const { favoriteCount } = useFavorites();
  const { t } = useTranslation();

  const { data: conversations = [] } = useQuery({
    queryKey: ['conversations'],
    queryFn: () => messageService.getConversations(),
    enabled: authenticated,
    refetchInterval: 30000,
  });
  const unreadMessageCount = conversations.reduce((sum, c) => sum + (c.unreadCount || 0), 0);

  return (
    <HeaderSection
      sx={sx}
      layoutQuery={layoutQuery}
      slots={{
        ...slots,
        leftAreaStart: slots?.leftAreaStart,
        leftArea: (
          <>
            {slots?.leftAreaStart}

            {/* -- Menu button -- */}
            {/* {menuButton && (
              <MenuButton
                data-slot="menu-button"
                onClick={onOpenNav}
                sx={{ mr: 1, ml: -1, [theme.breakpoints.up(layoutQuery)]: { display: 'none' } }}
              />
            )} */}

            {/* -- Logo -- */}
            <Logo width={80} height={60} />

            {/* -- Divider -- */}
            <StyledDivider data-slot="divider" />

            {/* -- Workspace popover -- */}
            {/* {workspaces && <WorkspacesPopover data-slot="workspaces" data={data?.workspaces} />} */}

            {slots?.leftAreaEnd}
          </>
        ),
        rightArea: (
          <>
            {slots?.rightAreaStart}

            <Box
              data-area="right"
              sx={{
                display: 'flex',
                alignItems: 'center',
                gap: { xs: 0.5, sm: 1 },
                flexGrow: 1, // cho phép mở rộng
                justifyContent: 'flex-end',
              }}
            >
              {/* -- Help link -- */}
              {helpLink && (
                <Link
                  href={paths.faqs}
                  component={RouterLink}
                  color="inherit"
                  sx={{
                    typography: 'subtitle2',
                    display: { xs: 'none', md: 'block' } // ẩn mobile
                  }}
                >
                  {t('header.needHelp')}
                </Link>
              )}

              {/* -- Searchbar: 2 phiên bản -- */}
              {searchbar && (
                <>
                  {/* Mobile: chỉ icon */}
                  <Box sx={{ display: { xs: 'flex', md: 'none' } }}>
                    <Searchbar data={data?.nav} />
                  </Box>

                  {/* Desktop: thanh dài */}
                  <Box
                    sx={{
                      display: { xs: 'none', md: 'flex' },
                      flexGrow: 1,
                      maxWidth: 600,
                      mx: 2,
                    }}
                  >
                    <SearchbarExtended data={data?.nav} />
                  </Box>
                </>
              )}

              {/* -- Language -- */}
              {localization && <LanguagePopover data={data?.langs} />}

              {authenticated && !loading ? (<>
                {/* -- Notifications -- */}
                {notifications && <NotificationsDrawer data={data?.notifications} />}

                {/* -- Favorites -- */}
                {account && (
                  <m.div
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                    transition={{ type: 'spring', stiffness: 300 }}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      cursor: 'pointer',
                    }}
                    onClick={() => router.push(paths.dashboard.product.favorites)}
                  >
                    <Badge badgeContent={favoriteCount} color="error" max={99}>
                      <Iconify icon="solar:heart-bold-duotone" width={26} height={26} />
                    </Badge>
                  </m.div>
                )}

                {/* -- Messages -- */}
                {account && (
                  <m.div
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                    transition={{ type: 'spring', stiffness: 300 }}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      cursor: 'pointer',
                    }}
                    onClick={() => router.push(paths.dashboard.messages.root)}
                  >
                    <Badge badgeContent={unreadMessageCount} color="error" max={99}>
                      <Iconify icon="solar:chat-round-dots-bold-duotone" width={26} height={26} />
                    </Badge>
                  </m.div>
                )}

                {/* -- Cart -- */}
                {account && (
                  <m.div
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                    transition={{ type: 'spring', stiffness: 300 }}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      cursor: 'pointer',
                    }}
                    onClick={() => router.push(paths.dashboard.product.cart)}

                  >
                    <Iconify
                      icon="solar:cart-bold-duotone"
                      width={26}
                      height={26}
                    />
                  </m.div>
                )}

                {/* -- Account -- */}
                {account && <AccountDrawer data={data?.account} />}
              </>) : <Button
                variant="contained"
                color="warning"
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 1,
                  px: 2,
                  py: 1,
                  borderRadius: 2,
                  textTransform: 'none',
                }}
                onClick={async () => {
                  if (typeof (window as any).ethereum !== 'undefined') {
                    const loggedInUser = await loginByMetamask();
                    if (loggedInUser && loggedInUser.role === 'SELLER') {
                      router.push('/seller/order');
                    } else if (loggedInUser && loggedInUser.role === 'AFFILIATE') {
                      router.push('/affiliate');
                    }
                  } else {
                    toast.error('MetaMask not installed!');
                  }
                }}
              >
                <Box
                  component="img"
                  src="/assets/metamask.png"
                  alt="metamask"
                  sx={{ width: 22, height: 22 }}
                />
                {t('header.loginWithMetamask')}
              </Button>}
            </Box>

            {slots?.rightAreaEnd}
          </>
        ),
      }}
      slotProps={slotProps}
      {...other}
    />
  );
}
