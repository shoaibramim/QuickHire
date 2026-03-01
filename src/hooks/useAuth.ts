/**
 * useAuth — convenience hook for consuming AuthContext.
 *
 * Usage:
 *   const { user, signIn, signOut, openAuthModal } = useAuth();
 */

import { useAuthContext } from "@/context/AuthContext";

export const useAuth = useAuthContext;
export default useAuthContext;
