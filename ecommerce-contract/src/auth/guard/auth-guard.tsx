import { useState, useEffect } from 'react';

import { paths } from 'src/routes/paths';
import { useRouter } from 'src/routes/hooks';

import { SplashScreen } from 'src/components/loading-screen';

import { useAuthContext } from '../hooks';

// ----------------------------------------------------------------------

type Props = {
  children: React.ReactNode;
};

export function AuthGuard({ children }: Props) {
  const router = useRouter();

  const { authenticated, loading, checkUserSession } = useAuthContext();

  const [isChecking, setIsChecking] = useState<boolean>(true);

  const checkPermissions = async (): Promise<void> => {
    console.log("loading: ", loading);
    if (loading) {
      return;
    }

    console.log("authenticated: ", authenticated);
    if (!authenticated) {
      setIsChecking(false);
      router.replace(paths.dashboard.root);
      return;
    }

    setIsChecking(false);
  };

  useEffect(() => {
    checkPermissions();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [authenticated, loading]);

  // useEffect(() => {
  //   checkUserSession()
  // }, [])

  if (isChecking) {
    return <SplashScreen />;
  }

  return <>{children}</>;
}
