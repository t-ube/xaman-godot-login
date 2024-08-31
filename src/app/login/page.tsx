'use client'

import { useState, useEffect, useCallback } from 'react';
import { Xumm } from 'xumm';

const Sdk = new Xumm(process.env.NEXT_PUBLIC_XUMM_API_KEY, process.env.NEXT_PUBLIC_XUMM_API_SECRET);

export default function LoginPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [logined,  setLogined] = useState<boolean>(false);

  useEffect(() => {
    const handleReady = () => {
      console.log("Xumm SDK is ready");
    };

    const handleSuccess = async () => {
      console.log("Logined");
      try {
        const account = await Sdk.user.account;
        if (account) {
          setLogined(true);
          console.log("Xumm session retrieved for account:", account);
          launchGame(account);
        } else {
          setError("Failed to retrieve user account information");
        }
      } catch (error) {
        console.error("Error retrieving account:", error);
        setError("Failed to retrieve user account information");
      }
    };

    const handleError = (error: Error) => {
      console.error("Xumm SDK error:", error);
      setError("An error occurred while initializing Xumm SDK");
    };

    Sdk.on("ready", handleReady);
    Sdk.on("success", handleSuccess);
    Sdk.on("error", handleError);

    return () => {
      Sdk.off("ready", handleReady);
      Sdk.off("success", handleSuccess);
      Sdk.off("error", handleError);
    };
  }, []);

  const handleLogin = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      await Sdk.authorize();
      const pong = await Sdk.ping();
      if (!pong?.application?.name) {
        throw new Error("Failed to get application name");
      }
      console.log(pong?.application?.name);

    } catch (error) {
      console.error('Login error:', error);
      setError(error instanceof Error ? error.message : "An unknown error occurred");
    } finally {
      setIsLoading(false);
    }
  }, []);

  const handleLogout = useCallback(async () => {
    await Sdk.logout();
    setLogined(false);
  },[]);

  const launchGame = (account: string) => {
    // この関数は実際の実装に合わせて調整する必要があります
    console.log(`Launching game for account: ${account}`);
    // 例: const token = generateTemporaryToken(account);
    // const gameUrl = `godot://launch?token=${token}`;
    // window.location.href = gameUrl;
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <h1 className="text-3xl font-bold mb-6">Login with Xaman</h1>
      {logined === false ?
        (
          <button 
            onClick={handleLogin} 
            disabled={isLoading}
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline disabled:opacity-50"
          >
            {isLoading ? "Loading..." : "Login"}
          </button>
        ) :
        (
          <button 
            onClick={handleLogout} 
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline disabled:opacity-50"
          >
            {"Logout"}
          </button>
        )
      }
      {error && <p className="text-red-500 mt-4">{error}</p>}
    </div>
  );
}