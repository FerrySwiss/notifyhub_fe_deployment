"use client"
import { createContext, useEffect, useReducer, ReactNode } from 'react';
import { firebase } from '@/app/guards/firebase/Firebase';
// import { supabase } from '@/app/guards/supabase/supabaseClient'; // Comment out real import
const supabase: any = { // Dummy supabase object
    auth: {
        getSession: () => ({ data: { session: null } }),
        onAuthStateChange: () => ({ data: { subscription: { unsubscribe: () => {} } } }),
        signInWithOAuth: () => Promise.resolve(),
        signUp: () => Promise.resolve(),
        signInWithPassword: () => Promise.resolve(),
        signOut: () => Promise.resolve(),
    }
};
import { useSession, signIn, signOut } from 'next-auth/react';

// Define the initial state structure
interface InitialStateType {
    isAuthenticated: boolean;
    isInitialized: boolean;
    user: any | null;
    platform: 'Firebase' | 'Supabase' | 'NextAuth' | null;
}

const initialState: InitialStateType = {
    isAuthenticated: false,
    isInitialized: false,
    user: null,
    platform: 'NextAuth',
};

const reducer = (state: InitialStateType, action: any) => {
    switch (action.type) {
        case 'AUTH_STATE_CHANGED':
            return { ...state, ...action.payload, isInitialized: true };
        case 'SET_PLATFORM':
            return { ...state, platform: action.payload };
        default:
            return state;
    }
};

const AuthContext = createContext<any | null>({
    ...initialState,
    signup: () => Promise.resolve(),
    fetchAccessToken: () => Promise.resolve(), // Added fetchAccessToken
    signin: () => Promise.resolve(),
    logout: () => Promise.resolve(),
    setPlatform: () => { },
    loginWithProvider: () => Promise.resolve(),
    loginWithSupabase: () => Promise.resolve(),
});

// Helper function to store tokens
const storeTokens = (accessToken: string, refreshToken: string) => {
    localStorage.setItem('access_token', accessToken);
    localStorage.setItem('refresh_token', refreshToken);
};

// Helper function to clear tokens
const clearTokens = () => {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
};

export const AuthProvider = ({ children }: { children: ReactNode }) => {
    const [state, dispatch] = useReducer(reducer, initialState);
    const { data: session, status } = useSession();


    const setPlatform = (platform: 'Firebase' | 'Supabase' | 'NextAuth') => {
        dispatch({ type: 'SET_PLATFORM', payload: platform });
    };


    useEffect(() => {
        if (state.platform === 'Firebase') {

            const unsubscribeFirebase = firebase.auth().onAuthStateChanged((user) => {
                if (user) {
                    const fullName = user.displayName

                    dispatch({
                        type: 'AUTH_STATE_CHANGED',
                        payload: {
                            isAuthenticated: true,
                            user: {
                                id: user.uid,
                                email: user.email,
                                displayName: fullName,
                            },
                            platform: 'Firebase',
                        },
                    });
                } else {
                    dispatch({
                        type: 'AUTH_STATE_CHANGED',
                        payload: { isAuthenticated: false, user: null, platform: 'Firebase' },
                    });
                }
            });

            return () => unsubscribeFirebase();
        } else if (state.platform === 'NextAuth') {
            if (session?.user) {
                dispatch({
                    type: 'AUTH_STATE_CHANGED',
                    payload: {
                        isAuthenticated: true,
                        user: {
                            id: session.user,
                            email: session.user.email,
                            displayName: session.user.name || session.user.email,
                        },
                        platform: 'NextAuth',
                    },
                });
            } else {
                dispatch({
                    type: 'AUTH_STATE_CHANGED',
                    payload: { isAuthenticated: false, user: null, platform: 'NextAuth' },
                });
            }
        }
    }, [state.platform, session]);



    const loginWithProvider = async (provider: 'google' | 'github') => {
        if (state.platform === 'Firebase') {
            let providerInstance: any;
            switch (provider) {
                case 'google':
                    providerInstance = new firebase.auth.GoogleAuthProvider();
                    break;
                case 'github':
                    providerInstance = new firebase.auth.GithubAuthProvider();
                    break;
                default:
                    throw new Error('Provider not supported');
            }
            return firebase.auth().signInWithPopup(providerInstance);
        } else if (state.platform === 'NextAuth') { // This `else if` will now be correctly associated
            return signIn(provider);
        }
    };

    const fetchAccessToken = async ({ username, password_val }: { username: string, password_val: string }) => {
        const params = new URLSearchParams({
            grant_type: 'password',
            username,
            password: password_val,
            client_id: process.env.NEXT_PUBLIC_OAUTH_CLIENT_ID || "test_client_id",
            client_secret: process.env.NEXT_PUBLIC_OAUTH_CLIENT_SECRET || "test_client_secret",
        });

        const resp = await fetch('/o/token/', {
            method: 'POST',
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
            body: params,
        });
        const data = await resp.json();
        if (!resp.ok) throw new Error(data.error_description || 'OAuth error');

        storeTokens(data.access_token, data.refresh_token);
        return data.access_token;
    };


    const signup = async (email: string, password: string, userName: string) => {
        if (state.platform === 'Firebase') {
            try {

                const userCredential = await firebase.auth().createUserWithEmailAndPassword(email, password);
                const user = userCredential.user;


                if (user) {
                    await user.updateProfile({
                        displayName: userName,
                    });
                    await user.reload();

                }
            } catch (error: any) {
                console.error('Error signing up with Firebase:', error);
                throw new Error(error.message);
            }
        } else if (state.platform === 'NextAuth') {
            const resp = await fetch('/signup/', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ username: userName, email, password }),
            });
            if (!resp.ok) {
                const errorData = await resp.json();
                throw new Error(errorData.message || 'Signup failed');
            }
            // For now, assuming successful signup just needs a redirect, no token immediately
            return resp.json(); // May contain user data, etc.
        }
        return null;
    };






    const signin = async (email: string, password: string) => {
        if (state.platform === 'Firebase') {
            return firebase.auth().signInWithEmailAndPassword(email, password);
        } else if (state.platform === 'NextAuth') {
            const accessToken = await fetchAccessToken({ username: email, password_val: password });
            // Use NextAuth.js signIn to establish session, passing the obtained token
            // The credentials provider in route.js needs to handle this token
            return signIn('credentials', {
                email,
                password, // NextAuth CredentialsProvider might still expect these for validation
                accessToken: accessToken,
                redirect: false, // Prevent NextAuth.js from redirecting immediately
            });
        }
        return null;
    };

    const logout = async () => {
        if (state.platform === 'Firebase') {
            await firebase.auth().signOut();
        } else if (state.platform === 'NextAuth') {
            clearTokens(); // Clear tokens from localStorage
            await signOut();
        }
    };

    return (
        <AuthContext.Provider
            value={{
                ...state,
                setPlatform,
                loginWithProvider,
                signup,
                fetchAccessToken, // Added fetchAccessToken
                signin,
                logout,
            }}
        >
            {children}
        </AuthContext.Provider>
    );
};

export default AuthContext;
