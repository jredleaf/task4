import { useEffect, useState } from 'react';

interface ZoomConfig {
  version?: string;
  capabilities?: string[];
}

interface ZoomUser {
  userName?: string;
  userId?: string;
}

declare global {
  interface Window {
    zoomSdk?: {
      config: (options: any) => Promise<any>;
      onMyUserContextChange: (callback: () => void) => void;
      onRunningContextChange: (callback: () => void) => void;
      getUser: () => Promise<ZoomUser>;
    };
  }
}

export function useZoom(config: ZoomConfig = {}) {
  const [isConfigured, setIsConfigured] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [userName, setUserName] = useState<string>('Unidentified User');

  const updateUserName = async () => {
    try {
      if (!window.zoomSdk) {
        console.log('Zoom SDK not available, using default user');
        return 'Unidentified User';
      }

      const user = await window.zoomSdk.getUser();
      const name = user?.userName || 'Unidentified User';
      setUserName(name);
      return name;
    } catch (err) {
      console.warn('Failed to get Zoom user, using default');
      return 'Unidentified User';
    }
  };

  useEffect(() => {
    let mounted = true;

    const configureZoom = async () => {
      if (!mounted) return;

      try {
        if (!window.zoomSdk) {
          console.log('Running in preview mode - Zoom SDK not available');
          setIsConfigured(true);
          setError(null);
          return;
        }

        await window.zoomSdk.config({
          version: config.version || '0.16.0',
          capabilities: config.capabilities || [
            'shareApp',
            'authorize',
            'promptAuthorize',
            'getUserContext',
            'connect'
          ],
          popoutSize: { width: 480, height: 720 },
        });

        window.zoomSdk.onMyUserContextChange(() => {
          if (mounted) {
            updateUserName();
          }
        });

        window.zoomSdk.onRunningContextChange(() => {
          if (mounted) {
            updateUserName();
          }
        });

        setIsConfigured(true);
        setError(null);
        await updateUserName();
      } catch (err) {
        if (mounted) {
          console.warn('Zoom configuration failed, running in fallback mode');
          setIsConfigured(true);
          setError(null);
        }
      }
    };

    configureZoom();

    return () => {
      mounted = false;
    };
  }, [config.version, config.capabilities?.join(',')]);

  return { isConfigured, error, userName };
}

export default useZoom;