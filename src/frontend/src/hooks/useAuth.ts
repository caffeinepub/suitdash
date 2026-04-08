import { useInternetIdentity } from "@caffeineai/core-infrastructure";

export function useAuth() {
  const {
    identity,
    loginStatus,
    login,
    clear,
    isLoginSuccess,
    isInitializing,
  } = useInternetIdentity();

  const isAuthenticated =
    isLoginSuccess || (loginStatus === "idle" && !!identity);
  const isLoading = isInitializing;

  return {
    identity,
    loginStatus,
    isAuthenticated,
    isLoading,
    login,
    logout: clear,
  };
}
