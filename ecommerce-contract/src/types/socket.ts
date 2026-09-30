import type { Socket } from 'socket.io-client';

import { io } from 'socket.io-client';
import { isNil, isEmpty } from 'lodash';
import { STORAGE_KEY_AT } from '@/lib/constants';

export enum SocketNamespace {
    CLIENT = 'CLIENT',
    SELLER = 'SELLER',
    ADMIN = 'ADMIN',
}

const socketInstances: Record<SocketNamespace, Socket> = {} as any;

export const getSocketClient = (
    namespace: SocketNamespace,
    query: any = {}
): Socket | undefined => {
    const token = sessionStorage.getItem(STORAGE_KEY_AT);

    if (isNil(token) || isEmpty(token)) {
        return;
    }

    if (socketInstances[namespace]) {
        return socketInstances[namespace];
    }

    const socket = io(`${import.meta.env.VITE_SOCKET_URI}/${namespace}`, {
        autoConnect: false,
        transports: ['websocket'],
        withCredentials: true,
        timeout: 5000,
        query: {
            token,
            ...query,
        },
        reconnection: true,
        reconnectionDelay: 1000,
        reconnectionDelayMax: 5000,
        reconnectionAttempts: 10,
    });

    socketInstances[namespace] = socket;

    return socket;
};
