import Web3 from 'web3';
import { toast } from 'sonner';
import { get, isNil, isEmpty } from 'lodash';
import authService from '@/lib/service/auth.service';
import { useRef, useMemo, useState, useEffect, useCallback } from 'react';
import { STORAGE_KEY_AT, STORAGE_KEY_RT, STORAGE_USER_INFO } from '@/lib/constants';

import { setSession } from './utils';
import { AuthContext } from '../auth-context';

// ----------------------------------------------------------------------

type Props = {
  children: React.ReactNode;
};

export function AuthProvider({ children }: Props) {
  const [web3, setWeb3] = useState<Web3 | null>(null);
  const [authenticated, setAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<any>(null);
  const didCheckSession = useRef(false);

  // ----------------------------------------------------------------------
  const checkUserSession = useCallback(async () => {
    setLoading(true);

    try {
      const accessToken = sessionStorage.getItem(STORAGE_KEY_AT);

      console.log("accessToken: ", accessToken)

      if (!isNil(accessToken)) {
        setSession(accessToken);

        const resp = await authService.getMe();

        console.log(resp);

        setUser(resp);
        setAuthenticated(true);
      } else {
        setUser(null);
        setAuthenticated(false);
      }
    } catch (error) {
      sessionStorage.removeItem(STORAGE_KEY_AT);
      sessionStorage.removeItem(STORAGE_KEY_RT);
      sessionStorage.removeItem(STORAGE_USER_INFO);

      console.error(error);
      setUser(null);
      setAuthenticated(false);
    } finally {
      setLoading(false);
    }
  }, []);

  const handleSignMessage = async ({
    publicAddress,
    nonce,
    web3Instance
  }: {
    publicAddress: string;
    nonce: string;
    web3Instance: Web3;
  }) => {
    if (isNil(web3Instance)) {
      toast.error("Web3 is not initiate in this app!")
      return null;
    };

    try {
      const signature = await web3Instance.eth.personal.sign(
        `I am signing my one-time nonce: ${nonce}`,
        publicAddress.toLowerCase(),
        ""
      );
      return { publicAddress: publicAddress.toLowerCase(), signature };
    } catch (err) {
      throw new Error(
        "You need to sign the message to be able to log in."
      );
    }
  };

  const handleLoginByMetamask = useCallback(async () => {
    let web3Instance = web3;

    if (!web3Instance) {
      const {ethereum} = (window as any);
      if (!ethereum) {
        toast.error("MetaMask not found!");
        return null;
      }
      try {
        await ethereum.request({ method: "eth_requestAccounts" });
        web3Instance = new Web3(ethereum);
      } catch (err) {
        toast.error("You need to allow MetaMask.");
        return null;
      }
    }

    const accounts = await web3Instance.eth.getAccounts();
    const publicAddress = accounts?.[0]?.toLowerCase();

    setUser(null);
    setLoading(true);
    setAuthenticated(false);

    let resp;
    try {
      resp = await authService.createUser({ publicAddress });
      if (!resp) {
        toast.error("Failed to create user.");
        return null;
      }
    } catch (err) {
      toast.error("Error creating user.");
      console.error("createUser error:", err);
      return null;
    }

    let payload;
    try {
      payload = await handleSignMessage({ publicAddress: resp.publicAddress, nonce: resp.nonce, web3Instance });
      if (!payload) {
        toast.error("Message signing canceled or failed.");
        return null;
      }
    } catch (err) {
      toast.error("Failed to sign message with MetaMask.");
      console.error("handleSignMessage error:", err);
      return null;
    }

    let authen;
    try {
      authen = await authService.authenticate({
        publicAddress: payload.publicAddress,
        signature: payload.signature,
      });

      const accessToken = get(authen, 'accessToken', '');
      const refreshToken = get(authen, 'refreshToken', '');
      const userInfo = get(authen, 'user', '');

      if (isEmpty(accessToken) || isEmpty(refreshToken) || isEmpty(userInfo)) {
        toast.error("Invalid response from authentication.");
        console.error('Invalid response from login:', authen);
        setUser(null);
        setAuthenticated(false);
        return null;
      }

      sessionStorage.setItem(STORAGE_KEY_AT, accessToken);
      sessionStorage.setItem(STORAGE_KEY_RT, refreshToken);
      sessionStorage.setItem(STORAGE_USER_INFO, JSON.stringify(userInfo));

      setUser(userInfo);
      setAuthenticated(true);
      return userInfo;
    } catch (err) {
      toast.error("Authentication failed.");
      console.error("authenticate error:", err);
      setUser(null);
      setAuthenticated(false);
    } finally {
      setLoading(false);
    }
  }, [web3]);


  const handleSignout = useCallback(async () => {
    await authService.logout();
    setUser(null);
    setAuthenticated(false);
  }, []);

  // ----------------------------------------------------------------------

  const memoizedValue = useMemo(
    () => ({
      user: user
        ? { ...user, role: user?.role ?? 'admin' }
        : null,
      checkUserSession,
      loading,
      authenticated,
      unauthenticated: !authenticated,
      loginByMetamask: handleLoginByMetamask,
      signOut: handleSignout,
    }),
    [user, authenticated, loading, checkUserSession, handleLoginByMetamask, handleSignout]
  );

  useEffect(() => {
    if (!didCheckSession.current) {
      checkUserSession();
      didCheckSession.current = true;
    }
  }, [checkUserSession]);


  return <AuthContext.Provider value={memoizedValue}>{children}</AuthContext.Provider>;
}
