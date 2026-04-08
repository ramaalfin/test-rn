import useAuthStore from '../../../stores/useAuthStore';

export const useAuth = () => {
    const {
        user,
        isAuthenticated,
        isLoading,
        error,
        login,
        loginWithGoogle,
        logout,
        clearError,
    } = useAuthStore();

    const handleLogin = async (email: string, password: string): Promise<void> => {
        try {
            await login(email, password);
        } catch (error) {
            throw error;
        }
    };

    const handleLoginWithGoogle = async (): Promise<void> => {
        try {
            await loginWithGoogle();
        } catch (error) {
            throw error;
        }
    };

    const handleLogout = async (): Promise<void> => {
        try {
            await logout();
        } catch (error) {
            throw error;
        }
    };

    return {
        user,
        isAuthenticated,

        isLoading,
        error,
        clearError,

        login: handleLogin,
        loginWithGoogle: handleLoginWithGoogle,
        logout: handleLogout,
    };
};

export default useAuth;
