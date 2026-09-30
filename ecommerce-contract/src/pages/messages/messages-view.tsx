import type { IMessage, IConversation } from 'src/types/message';
import type { IProductItem } from 'src/types/product';

import { get } from 'lodash';
import { useRef, useMemo, useState, useEffect, useCallback } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import Badge from '@mui/material/Badge';
import Avatar from '@mui/material/Avatar';
import Divider from '@mui/material/Divider';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import InputBase from '@mui/material/InputBase';
import CircularProgress from '@mui/material/CircularProgress';

import { paths } from 'src/routes/paths';
import { RouterLink } from 'src/routes/components';

import { fToNow } from 'src/utils/format-time';
import { fEth } from 'src/utils/format-number';
import { useResponsive } from 'src/hooks/use-responsive';

import { useAuthContext } from '@/auth/hooks';
import { useNotify } from '@/states/socket/seller';
import messageService from '@/lib/service/message.service';
import productService from '@/lib/service/product.service';
import { toast } from 'src/components/snackbar';
import { Iconify } from 'src/components/iconify';
import { Scrollbar } from 'src/components/scrollbar';
import { EmptyContent } from 'src/components/empty-content';
import { usePopover, CustomPopover } from 'src/components/custom-popover';

// ----------------------------------------------------------------------

const COMMON_EMOJIS = [
  '😀', '😁', '😂', '🤣', '😊', '😍', '😘', '😜', '🤔', '😎',
  '😢', '😭', '😡', '😱', '🥳', '🙏', '👍', '👎', '👏', '🙌',
  '👋', '💪', '🤝', '❤️', '🧡', '💛', '💚', '💙', '💜', '🔥',
  '✨', '🎉', '🎁', '✅', '❌', '⭐', '💯', '👀', '😴', '🛍️',
];

type Props = {
  activeId?: string;
};

export function MessagesView({ activeId }: Props) {
  const isMobile = useResponsive('down', 'md');

  const { user } = useAuthContext();
  const { socket } = useNotify();
  const queryClient = useQueryClient();
  const [draft, setDraft] = useState('');
  const [uploading, setUploading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const [wrapperTop, setWrapperTop] = useState(0);

  // The header (+ announcement bar above it) is `position: sticky`, not fixed, and has
  // no single CSS var covering both — measure where our own content starts instead of
  // hardcoding pixel heights that would drift whenever the header/announcement bar changes.
  useEffect(() => {
    const measure = () => {
      if (wrapperRef.current) {
        setWrapperTop(wrapperRef.current.getBoundingClientRect().top);
      }
    };

    window.scrollTo({ top: 0 });
    measure();

    window.addEventListener('resize', measure);
    return () => window.removeEventListener('resize', measure);
  }, []);

  const { data: conversations = [] } = useQuery({
    queryKey: ['conversations'],
    queryFn: () => messageService.getConversations(),
    refetchInterval: 30000,
  });

  const { data: messagesResp } = useQuery({
    queryKey: ['messages', activeId],
    queryFn: () => messageService.getMessages(activeId!),
    enabled: !!activeId,
  });

  const messages = get(messagesResp, 'data', []) as IMessage[];
  const activeConversation = conversations.find((c) => c.id === activeId);

  // Products can only be mentioned from the shop side of the conversation — resolve
  // "the shop" whether the current user is the buyer (shop = other participant) or
  // the seller themselves (shop = me).
  const shopId = activeConversation
    ? activeConversation.otherParticipant?.role === 'SELLER'
      ? activeConversation.otherParticipant.id
      : user?.id
    : undefined;

  const mentionPopover = usePopover();
  const emojiPopover = usePopover();
  const draftInputRef = useRef<HTMLInputElement>(null);

  const { data: shopProductsResp } = useQuery({
    queryKey: ['shop-products-mention', shopId],
    queryFn: () => productService.getBySeller(shopId!, 1, 50),
    enabled: !!shopId && mentionPopover.open,
  });

  const shopProducts = get(shopProductsResp, 'data', []) as IProductItem[];

  // Group consecutive messages from the same sender, Messenger-style, so we only
  // show one avatar + one timestamp per burst instead of repeating it per bubble.
  const messageGroups = useMemo(() => {
    const groups: {
      senderId: string;
      isMine: boolean;
      sender: { id: string; name: string; avatar: string } | null;
      items: IMessage[];
    }[] = [];

    messages.forEach((message) => {
      const senderId = typeof message.senderId === 'object' ? message.senderId.id : message.senderId;
      const isMine = senderId === user?.id;
      const lastGroup = groups[groups.length - 1];

      if (lastGroup && lastGroup.senderId === senderId) {
        lastGroup.items.push(message);
      } else {
        groups.push({
          senderId,
          isMine,
          sender: typeof message.senderId === 'object' ? message.senderId : null,
          items: [message],
        });
      }
    });

    return groups;
  }, [messages, user?.id]);

  // Mark the open conversation as read once it has unread messages.
  useEffect(() => {
    if (activeId && activeConversation && activeConversation.unreadCount > 0) {
      messageService.markRead(activeId).then(() => {
        queryClient.invalidateQueries({ queryKey: ['conversations'] });
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeId, activeConversation?.unreadCount]);

  const scrollToBottom = useCallback(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight });
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages.length, scrollToBottom]);

  // Real-time: new message pushed over the socket already connected via NotifyProvider.
  useEffect(() => {
    if (!socket) return undefined;

    const handleNewMessage = (payload: { conversationId: string; message: IMessage }) => {
      if (payload.conversationId === activeId) {
        queryClient.setQueryData(['messages', activeId], (old: any) => ({
          ...old,
          data: [...(old?.data ?? []), payload.message],
        }));
      }
      queryClient.invalidateQueries({ queryKey: ['conversations'] });
    };

    socket.on('message:new', handleNewMessage);
    return () => {
      socket.off('message:new', handleNewMessage);
    };
  }, [socket, activeId, queryClient]);

  const appendMessage = useCallback(
    (message: IMessage) => {
      queryClient.setQueryData(['messages', activeId], (old: any) => ({
        ...old,
        data: [...(old?.data ?? []), message],
      }));
      queryClient.invalidateQueries({ queryKey: ['conversations'] });
    },
    [activeId, queryClient]
  );

  const handleSend = useCallback(async () => {
    const content = draft.trim();
    if (!content || !activeId) return;

    setDraft('');
    const message = await messageService.sendMessage(activeId, { content });
    appendMessage(message);
  }, [draft, activeId, appendMessage]);

  const handlePickImage = useCallback(() => {
    fileInputRef.current?.click();
  }, []);

  const handleImageSelected = useCallback(
    async (event: React.ChangeEvent<HTMLInputElement>) => {
      const file = event.target.files?.[0];
      event.target.value = '';
      if (!file || !activeId) return;

      setUploading(true);
      try {
        const { url } = await productService.uploadImage(file);
        const message = await messageService.sendMessage(activeId, { imageUrl: url });
        appendMessage(message);
      } catch (error) {
        toast.error('Failed to send image');
      } finally {
        setUploading(false);
      }
    },
    [activeId, appendMessage]
  );

  const handlePickEmoji = useCallback((emoji: string) => {
    setDraft((prev) => `${prev}${emoji}`);
    draftInputRef.current?.focus();
  }, []);

  const handleMentionProduct = useCallback(
    async (productId: string) => {
      if (!activeId) return;
      mentionPopover.onClose();
      const message = await messageService.sendMessage(activeId, { productId });
      appendMessage(message);
    },
    [activeId, appendMessage, mentionPopover]
  );

  const renderConversationList = (
    <Card
      sx={{
        width: { xs: 1, md: 320 },
        flexShrink: 0,
        borderRadius: 0,
        display: { xs: isMobile && activeId ? 'none' : 'flex', md: 'flex' },
        flexDirection: 'column',
      }}
    >
      <Typography variant="h6" sx={{ p: 2.5, pb: 1.5 }}>
        Messages
      </Typography>
      <Divider />
      <Scrollbar sx={{ flexGrow: 1 }}>
        {conversations.length === 0 ? (
          <EmptyContent title="No conversations yet" sx={{ py: 8 }} />
        ) : (
          conversations.map((conversation: IConversation) => (
            <Box
              key={conversation.id}
              component={RouterLink}
              href={paths.dashboard.messages.details(conversation.id)}
              sx={{
                p: 2,
                gap: 1.5,
                display: 'flex',
                textDecoration: 'none',
                alignItems: 'center',
                cursor: 'pointer',
                bgcolor: conversation.id === activeId ? 'action.selected' : 'transparent',
                '&:hover': { bgcolor: 'action.hover' },
              }}
            >
              <Badge
                color="error"
                badgeContent={conversation.unreadCount}
                invisible={!conversation.unreadCount}
              >
                <Avatar src={conversation.otherParticipant?.avatar} alt={conversation.otherParticipant?.name} />
              </Badge>
              <Box sx={{ minWidth: 0, flexGrow: 1 }}>
                <Typography variant="subtitle2" noWrap sx={{ color: 'text.primary' }}>
                  {conversation.otherParticipant?.name}
                </Typography>
                <Typography variant="body2" color="text.secondary" noWrap>
                  {conversation.lastMessage || 'Say hello!'}
                </Typography>
              </Box>
              {conversation.lastMessageAt && (
                <Typography variant="caption" color="text.disabled" sx={{ flexShrink: 0 }}>
                  {fToNow(conversation.lastMessageAt)}
                </Typography>
              )}
            </Box>
          ))
        )}
      </Scrollbar>
    </Card>
  );

  const renderThread = (
    <Card
      sx={{
        flexGrow: 1,
        borderRadius: 0,
        minWidth: 0,
        display: { xs: isMobile && !activeId ? 'none' : 'flex', md: 'flex' },
        flexDirection: 'column',
      }}
    >
      {!activeConversation ? (
        <EmptyContent title="Select a conversation" sx={{ height: 1 }} />
      ) : (
        <>
          <Stack direction="row" alignItems="center" spacing={1.5} sx={{ p: 2 }}>
            {isMobile && (
              <IconButton component={RouterLink} href={paths.dashboard.messages.root} edge="start">
                <Iconify icon="eva:arrow-ios-back-fill" />
              </IconButton>
            )}
            <Avatar src={activeConversation.otherParticipant?.avatar} alt={activeConversation.otherParticipant?.name} />
            <Typography variant="subtitle1">{activeConversation.otherParticipant?.name}</Typography>
          </Stack>

          <Divider />

          <Scrollbar ref={scrollRef} sx={{ flexGrow: 1, p: 2.5 }}>
            <Stack spacing={2}>
              {messageGroups.map((group, groupIndex) => (
                <Stack
                  key={groupIndex}
                  direction="row"
                  spacing={1}
                  alignItems="flex-end"
                  justifyContent={group.isMine ? 'flex-end' : 'flex-start'}
                >
                  {!group.isMine && (
                    <Avatar
                      src={group.sender?.avatar}
                      alt={group.sender?.name}
                      sx={{ width: 28, height: 28 }}
                    />
                  )}

                  <Stack spacing={0.5} alignItems={group.isMine ? 'flex-end' : 'flex-start'} sx={{ maxWidth: 0.72 }}>
                    {group.items.map((message, i) => {
                      if (message.imageUrl) {
                        return (
                          <Box
                            key={message.id}
                            component="img"
                            src={message.imageUrl}
                            alt="attachment"
                            onLoad={scrollToBottom}
                            onClick={() => window.open(message.imageUrl, '_blank', 'noopener,noreferrer')}
                            sx={{
                              maxWidth: 260,
                              maxHeight: 260,
                              borderRadius: 2,
                              cursor: 'pointer',
                              objectFit: 'cover',
                              display: 'block',
                              '&:hover': { opacity: 0.92 },
                            }}
                          />
                        );
                      }

                      if (message.productId && typeof message.productId === 'object') {
                        const product = message.productId;
                        return (
                          <Box
                            key={message.id}
                            component={RouterLink}
                            href={paths.dashboard.product.details(product.id)}
                            sx={{
                              p: 1,
                              gap: 1.5,
                              width: 240,
                              display: 'flex',
                              alignItems: 'center',
                              textDecoration: 'none',
                              borderRadius: 2,
                              bgcolor: 'background.paper',
                              border: (t) => `solid 1px ${t.vars.palette.divider}`,
                              '&:hover': { bgcolor: 'action.hover' },
                            }}
                          >
                            <Box
                              component="img"
                              src={product.coverUrl}
                              alt={product.name}
                              sx={{ width: 48, height: 48, borderRadius: 1, objectFit: 'cover', flexShrink: 0 }}
                            />
                            <Box sx={{ minWidth: 0 }}>
                              <Typography variant="body2" noWrap sx={{ color: 'text.primary', fontWeight: 600 }}>
                                {product.name}
                              </Typography>
                              <Typography variant="caption" sx={{ color: 'primary.main' }}>
                                {fEth(product.price)} ETH
                              </Typography>
                            </Box>
                          </Box>
                        );
                      }

                      return (
                        <Box
                          key={message.id}
                          sx={{
                            px: 1.75,
                            py: 1,
                            borderRadius: 2.5,
                            typography: 'body2',
                            wordBreak: 'break-word',
                            color: group.isMine ? 'primary.contrastText' : 'text.primary',
                            bgcolor: group.isMine ? 'primary.main' : 'background.neutral',
                            ...(i === group.items.length - 1 && {
                              ...(group.isMine
                                ? { borderBottomRightRadius: 4 }
                                : { borderBottomLeftRadius: 4 }),
                            }),
                          }}
                        >
                          {message.content}
                        </Box>
                      );
                    })}

                    <Typography variant="caption" color="text.disabled" sx={{ px: 0.5 }}>
                      {fToNow(group.items[group.items.length - 1].created_at)}
                    </Typography>
                  </Stack>
                </Stack>
              ))}
            </Stack>
          </Scrollbar>

          <Divider />

          <Stack
            direction="row"
            alignItems="center"
            spacing={1}
            component="form"
            onSubmit={(event) => {
              event.preventDefault();
              handleSend();
            }}
            sx={{ p: 1.5 }}
          >
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              hidden
              onChange={handleImageSelected}
            />

            <IconButton onClick={handlePickImage} disabled={uploading} sx={{ flexShrink: 0 }}>
              {uploading ? (
                <CircularProgress size={20} />
              ) : (
                <Iconify icon="solar:gallery-add-bold" width={22} />
              )}
            </IconButton>

            {shopId && (
              <IconButton onClick={mentionPopover.onOpen} sx={{ flexShrink: 0 }}>
                <Iconify icon="solar:bag-smile-bold" width={22} />
              </IconButton>
            )}

            <IconButton onClick={emojiPopover.onOpen} sx={{ flexShrink: 0 }}>
              <Iconify icon="eva:smiling-face-fill" width={22} />
            </IconButton>

            <InputBase
              inputRef={draftInputRef}
              fullWidth
              value={draft}
              onChange={(event) => setDraft(event.target.value)}
              placeholder="Type a message..."
              sx={{
                px: 2,
                py: 1,
                borderRadius: 5,
                typography: 'body2',
                bgcolor: 'background.neutral',
                border: (t) => `solid 1px ${t.vars.palette.divider}`,
              }}
            />
            <IconButton
              type="submit"
              color="primary"
              disabled={!draft.trim()}
              sx={{
                flexShrink: 0,
                bgcolor: draft.trim() ? 'primary.main' : 'transparent',
                color: draft.trim() ? 'primary.contrastText' : 'text.disabled',
                '&:hover': { bgcolor: draft.trim() ? 'primary.dark' : 'action.hover' },
              }}
            >
              <Iconify icon="solar:plain-bold" width={20} />
            </IconButton>
          </Stack>

          <CustomPopover
            open={emojiPopover.open}
            anchorEl={emojiPopover.anchorEl}
            onClose={emojiPopover.onClose}
            slotProps={{ paper: { sx: { width: 240 } } }}
          >
            <Box
              sx={{
                p: 1.5,
                gap: 0.5,
                display: 'grid',
                gridTemplateColumns: 'repeat(8, 1fr)',
              }}
            >
              {COMMON_EMOJIS.map((emoji) => (
                <IconButton
                  key={emoji}
                  size="small"
                  onClick={() => handlePickEmoji(emoji)}
                  sx={{ fontSize: 20 }}
                >
                  {emoji}
                </IconButton>
              ))}
            </Box>
          </CustomPopover>

          <CustomPopover
            open={mentionPopover.open}
            anchorEl={mentionPopover.anchorEl}
            onClose={mentionPopover.onClose}
            slotProps={{ paper: { sx: { width: 280 } } }}
          >
            <Typography variant="subtitle2" sx={{ px: 2, pt: 1.5, pb: 1 }}>
              Share a product
            </Typography>
            <Scrollbar sx={{ maxHeight: 320 }}>
              {shopProducts.length === 0 ? (
                <Typography variant="body2" color="text.secondary" sx={{ px: 2, pb: 2 }}>
                  No products found
                </Typography>
              ) : (
                shopProducts.map((product) => (
                  <Stack
                    key={product.id}
                    direction="row"
                    alignItems="center"
                    spacing={1.5}
                    onClick={() => handleMentionProduct(product.id)}
                    sx={{ px: 2, py: 1, cursor: 'pointer', '&:hover': { bgcolor: 'action.hover' } }}
                  >
                    <Box
                      component="img"
                      src={product.coverUrl}
                      alt={product.name}
                      sx={{ width: 40, height: 40, borderRadius: 1, objectFit: 'cover', flexShrink: 0 }}
                    />
                    <Box sx={{ minWidth: 0 }}>
                      <Typography variant="body2" noWrap>
                        {product.name}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        {fEth(product.price)} ETH
                      </Typography>
                    </Box>
                  </Stack>
                ))
              )}
            </Scrollbar>
          </CustomPopover>
        </>
      )}
    </Card>
  );

  return (
    <Box
      ref={wrapperRef}
      sx={{
        width: 1,
        display: 'flex',
        height: wrapperTop ? `calc(100vh - ${wrapperTop}px)` : '80vh',
      }}
    >
      {renderConversationList}
      {renderThread}
    </Box>
  );
}
