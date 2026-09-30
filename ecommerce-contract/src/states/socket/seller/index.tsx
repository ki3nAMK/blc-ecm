import type { Socket } from 'socket.io-client';

import { useAuthContext } from '@/auth/hooks';
import { get, isNil } from 'lodash';
import { getSocketClient, SocketNamespace } from '@/types/socket';
import {
    useState,
    useEffect,
    useContext,
    useCallback,
    createContext,
} from 'react';

interface INotifyContext {
    socket: Socket | null;
    disconnectSocket: VoidFunction;
}

export enum UserRole {
    CLIENT = 'CLIENT',
    SELLER = 'SELLER',
    ADMIN = 'ADMIN',
}

const notifyContext = createContext<INotifyContext>({
    socket: null,
    disconnectSocket: () => { },
});

export const NotifyProvider = ({ children }: { children: React.ReactNode }) => {
    const [socket, setSocket] = useState<Socket | null>(null);
    const { authenticated, user, loading } = useAuthContext();
    const userRole = get(user, 'role', UserRole.CLIENT);

    // A plain effect keyed on the primitive role (not the whole `user` object, which is a
    // fresh reference on every auth refresh) — connects once auth settles, reconnects if
    // the role changes (e.g. a client becomes a seller), and is otherwise a no-op.
    useEffect(() => {
        if (loading || !authenticated) {
            return undefined;
        }

        try {
            const namespace = userRole === UserRole.SELLER ? SocketNamespace.SELLER : SocketNamespace.CLIENT;
            const client = getSocketClient(namespace);

            if (isNil(client)) {
                return undefined;
            }

            client.connect();
            setSocket(client);
        } catch (error) {
            console.error('Error connecting to socket:', error);
            setSocket(null);
        }

        return undefined;
    }, [authenticated, loading, userRole]);

    const disconnectSocket = useCallback(() => {
        if (!isNil(socket) && socket?.connected) {
            socket.removeAllListeners();
            socket.disconnect();
        }
        setSocket(null);
    }, [socket]);

    useEffect(() =>
         () => {
            socket?.removeAllListeners();
            socket?.disconnect();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    , []);

    return (
        <notifyContext.Provider value={{ socket, disconnectSocket }}>
            {children}
        </notifyContext.Provider>
    );
};

export const useNotify = () => {
    const context = useContext(notifyContext);
    if (!context) {
        throw new Error('useNotify must be used within a NotifyProvider');
    }
    return context;
};
