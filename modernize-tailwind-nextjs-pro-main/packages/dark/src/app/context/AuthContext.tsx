"use client";
import { createContext, useEffect, useReducer, ReactNode } from "react";
import { authService } from "@/app/services/api";
import { useRouter } from "next/navigation";

interface AuthState {
  isAuthenticated: boolean;
  isInitialized: boolean;
  user: any | null;
}

interface AuthContextType extends AuthState {
  signup: (email: string, password: string, username: string) => Promise<any>;
  signin: (email: string, password: string) => Promise<any>;
  logout: () => Promise<void>;
  mfaVerify: (challengeId: string, otp: string) => Promise<any>;
}

const initialState: AuthState = {
  isAuthenticated: false,
  isInitialized: false,
  user: null,
};

const reducer = (state: AuthState, action: any) => {
  switch (action.type) {
    case "AUTH_STATE_CHANGED":
      return { ...state, ...action.payload, isInitialized: true };
    default:
      return state;
  }
};

const AuthContext = createContext<AuthContextType>({
  ...initialState,
  signup: () => Promise.resolve(),
  signin: () => Promise.resolve(),
  logout: () => Promise.resolve(),
  mfaVerify: () => Promise.resolve(),
});

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const router = useRouter();
  const [state, dispatch] = useReducer(reducer, initialState);

  // Check local JWT on startup
  useEffect(() => {
    const token = localStorage.getItem("notifyhub_access_token");
    if (token) {
      dispatch({
        type: "AUTH_STATE_CHANGED",
        payload: { isAuthenticated: true },
      });
    } else {
      dispatch({
        type: "AUTH_STATE_CHANGED",
        payload: { isAuthenticated: false },
      });
    }
  }, []);

  const signup = async (email: string, password: string, username: string) => {
    const result = await authService.signup({ email, password, username });
    return result; // MFA handled by UI
  };

  const signin = async (email: string, password: string) => {
    const result = await authService.passwordStep(email, password);

    if (result.mfa_required) {
      // UI will redirect to OTP screen
      sessionStorage.setItem(
        "notifyhub_login_session",
        JSON.stringify({
          username: email,
          password,
          mfa_challenge_id: result.mfa_challenge_id,
        })
      );
      return { mfa_required: true };
    }

    // No MFA required — get token
    // No MFA required — get token
    // FIX: Check if login already returned token, otherwise try fetchAccessToken (though it might fail)
    let accessToken = result.access_token || result.token;
    
    if (!accessToken) {
        console.warn("Login response did not contain token, attempting legacy fetchAccessToken flow...");
        const tokenData = await authService.fetchAccessToken({
            username: email,
            password: password,
        });
        accessToken = tokenData.access_token;
    }

    localStorage.setItem("notifyhub_access_token", accessToken);
    dispatch({
      type: "AUTH_STATE_CHANGED",
      payload: { isAuthenticated: true },
    });

    router.push("/");
    return { success: true };
  };

  const mfaVerify = async (challengeId: string, otp: string) => {
    const verifyResp = await authService.verifyTotp(challengeId, otp);
    
    // FIX: Use token from verify response if available
    let accessToken = verifyResp.access_token || verifyResp.token;

    if (!accessToken) {
        console.warn("MFA Verify response did not contain token, attempting legacy fetchAccessToken flow...");
        const tokenData = await authService.fetchAccessToken({
            username: verifyResp.username,
            password: verifyResp.password,
            mfaToken: verifyResp.mfa_token,
        });
        accessToken = tokenData.access_token;
    }

    localStorage.setItem("notifyhub_access_token", accessToken);
    dispatch({
      type: "AUTH_STATE_CHANGED",
      payload: { isAuthenticated: true },
    });

    router.push("/");
  };

  const logout = async () => {
    localStorage.removeItem("notifyhub_access_token");
    dispatch({
      type: "AUTH_STATE_CHANGED",
      payload: { isAuthenticated: false, user: null },
    });
    router.push("/auth/auth1/login");
  };

  return (
    <AuthContext.Provider
      value={{
        ...state,
        signup,
        signin,
        logout,
        mfaVerify,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
