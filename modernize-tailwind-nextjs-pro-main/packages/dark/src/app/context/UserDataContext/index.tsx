'use client'
import React, { createContext, useState, useEffect } from 'react';
import * as ApolloReact from '@apollo/client/react'; // Changed import
import { gql } from '@apollo/client'; // Keep gql from here
import { PostType, profiledataType } from '@/app/(DashboardLayout)/types/apps/userProfile';
import { Reminder } from '@/types/apps/invoice'; // Import Reminder type

export type UserDataContextType = {
    posts: PostType[];
    users: any[];
    user: any;
    gallery: any[];
    departments: any[];
    reminders: Reminder[]; // Add reminders to the type
    profileData: profiledataType;
    loading: boolean;
    error: null | any;
    userSearch: string;
    departmentSearch: string;
    setUserSearch: React.Dispatch<React.SetStateAction<string>>;
    setDepartmentSearch: React.Dispatch<React.SetStateAction<string>>;
    addGalleryItem: (item: any) => void;
    addReply: (postId: number, commentId: number, reply: string) => void;
    likePost: (postId: number) => void;
    addComment: (postId: number, comment: string) => void;
    likeReply: (postId: number, commentId: number) => void;
    toggleFollow: (id: number) => void;
    toggleDepartmentStatus: (id: number) => void;
};

export const UserDataContext = createContext<UserDataContextType>({
    posts: [],
    users: [],
    user: null,
    gallery: [],
    departments: [],
    reminders: [],
    profileData: {
        name: '',
        role: '',
        avatar: '',
        coverImage: '',
        postsCount: 0,
        followersCount: 0,
        followingCount: 0,
    },
    loading: true,
    error: null,
    userSearch: '',
    departmentSearch: '',
    setUserSearch: () => {},
    setDepartmentSearch: () => {},
    addGalleryItem: () => {},
    addReply: () => {},
    likePost: () => {},
    addComment: () => {},
    likeReply: () => {},
    toggleFollow: () => {},
    toggleDepartmentStatus: () => {},
});

const config = {
    posts: [], 
    users: [],
    gallery: [],
    departments: [],
    reminders: [],
    departmentSearch: '',
    loading: true,
};

// Define interfaces for the data returned by each query
interface MeData {
  me: any; // Define a more specific type if possible
}

interface UsersData {
  users: any[]; // Define a more specific type if possible
}

interface DepartmentsData {
  departments: any[]; // Define a more specific type if possible
}

interface RemindersData {
  reminders: Reminder[];
}

const ME_QUERY = gql`
  query Me {
    me {
      id
      username
      email
      firstName
      lastName
      company {
        id
        name
      }
    }
  }
`;

const LIST_USERS_QUERY = gql`
  query Users {
    users {
      id
      username
      email
      company {
        id
        name
        name
      }
    }
  }
`;

const LIST_DEPARTMENTS_QUERY = gql`
  query Departments {
    departments {
      id
      name
      company {
        id
        name
      }
    }
  }
`;

const LIST_REMINDERS_QUERY = gql`
  query Reminders($active: Boolean) {
    reminders(active: $active) {
      id
      title
      description
      reminderStartDate
      reminderEndDate
      active
    }
  }
`;

export const UserDataProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [posts, setPosts] = useState<PostType[]>(config.posts);
    const [user, setUser] = useState<any>(null);
    const [users, setUsers] = useState<any[]>([]);
    const [gallery, setGallery] = useState<any[]>(config.gallery);
    const [departments, setDepartments] = useState<any[]>(config.departments);
    const [reminders, setReminders] = useState<Reminder[]>(config.reminders);
    const [departmentSearch, setDepartmentSearch] = useState<string>(config.departmentSearch);
    const [userSearch, setUserSearch] = useState<string>('');
    const [error, setError] = useState<any>(null);
    const [loading, setLoading] = useState<boolean>(config.loading);

    // Check if we have a token before making queries
    const hasToken = typeof window !== 'undefined' && !!localStorage.getItem('notifyhub_access_token');

    const { data: meApolloData, loading: meLoading, error: meError } = ApolloReact.useQuery(ME_QUERY, {
        skip: !hasToken,
        errorPolicy: 'all',
    });
    const { data: usersApolloData, loading: usersLoading, error: usersError } = ApolloReact.useQuery(LIST_USERS_QUERY, {
        skip: !hasToken,
        errorPolicy: 'all',
    });
    const { data: deptsApolloData, loading: deptsLoading, error: deptsError } = ApolloReact.useQuery(LIST_DEPARTMENTS_QUERY, {
        skip: !hasToken,
        errorPolicy: 'all',
    });
    const { data: remindersApolloData, loading: remindersLoading, error: remindersError } = ApolloReact.useQuery(LIST_REMINDERS_QUERY, {
        variables: { active: true },
        skip: !hasToken,
        errorPolicy: 'all',
    });

    useEffect(() => {
        const meData = meApolloData as MeData | undefined;
        const usersData = usersApolloData as UsersData | undefined;
        const deptsData = deptsApolloData as DepartmentsData | undefined;
        const remindersData = remindersApolloData as RemindersData | undefined;

        if (meData?.me) {
            console.log("UserDataContext: Setting user data", meData.me);
            setUser(meData.me);
        } else if (!hasToken) {
            console.warn("UserDataContext: No auth token found, user data will not load");
        }
        if (usersData) setUsers(usersData.users);
        if (deptsData) setDepartments(deptsData.departments);
        if (remindersData) setReminders(remindersData.reminders);

        const anyError = meError || usersError || deptsError || remindersError;
        if (anyError) {
            console.error("Error fetching data in UserDataContext:", anyError);
            setError(anyError);
        }

        setLoading(meLoading || usersLoading || deptsLoading || remindersLoading);

    }, [meApolloData, usersApolloData, deptsApolloData, remindersApolloData, meLoading, usersLoading, deptsLoading, remindersLoading, meError, usersError, deptsError, remindersError, hasToken]);

    // Update profileData when user data is available
    const [profileData, setProfileData] = useState<profiledataType>({
        name: '',
        role: '',
        avatar: '/images/profile/user-1.jpg',
        coverImage: '/images/backgrounds/profilebg.jpg',
        postsCount: 0,
        followersCount: 0,
        followingCount: 0,
    });

    // Update profileData when user changes
    useEffect(() => {
        if (user) {
            const fullName = user.firstName && user.lastName 
                ? `${user.firstName} ${user.lastName}`
                : user.username || 'User';
            setProfileData(prev => ({
                ...prev,
                name: fullName,
                role: user.company?.name || 'User',
            }));
        }
    }, [user]);
    
    const filterDepartments = () => {
        if (departments && departmentSearch) {
            return departments.filter((t) =>
                (typeof t.name === 'string' && t.name.toLowerCase().includes(departmentSearch.toLowerCase())) 
            );
        }
        return departments;
    };

    return (
        <UserDataContext.Provider
            value={{
                posts,
                user,
                users,
                gallery,
                departments: filterDepartments(),
                reminders,
                profileData,
                loading,
                error,
                addGalleryItem: () => {},
                addReply: () => {},
                likePost: () => {},
                addComment: () => {},
                likeReply: () => {},
                toggleFollow: () => {},
                toggleDepartmentStatus: () => {},
                setDepartmentSearch,
                departmentSearch,
                userSearch,
                setUserSearch,
            }}
        >
            {children}
        </UserDataContext.Provider>
    );
};
  