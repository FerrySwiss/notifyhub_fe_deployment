'use client'
import React, { createContext, useState, useEffect } from 'react';
import { PostType, profiledataType } from '@/app/(DashboardLayout)/types/apps/userProfile';
import { userService, departmentService, reminderService } from '../../services/api';
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

export const UserDataContext = createContext<UserDataContextType | undefined>(undefined);

const config = {
    posts: [], 
    users: [], // Still here for config, but not used for state
    gallery: [],
    followers: [], // Still here for config, but not used for state
    departments: [],
    reminders: [], // Initialize reminders in config
    followerSearch: '',
    departmentSearch: '',
    loading: true,
};

export const UserDataProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [posts, setPosts] = useState<PostType[]>(config.posts);
    const [user, setUser] = useState<any>(null); // Changed from users
    const [users, setUsers] = useState<any[]>([]); // Add this
    const [gallery, setGallery] = useState<any[]>(config.gallery);
    // const [followers, setFollowers] = useState<any[]>(config.followers); // Removed
    const [departments, setDepartments] = useState<any[]>(config.departments);
    const [reminders, setReminders] = useState<Reminder[]>(config.reminders); // Add reminders state
    // const [followerSearch, setFollowerSearch] = useState<string>(config.followerSearch); // Removed
    const [departmentSearch, setDepartmentSearch] = useState<string>(config.departmentSearch);
    const [userSearch, setUserSearch] = useState<string>('');
    const [error, setError] = useState<any>(null);
    const [loading, setLoading] = useState<boolean>(config.loading);

    const [profileData, setProfileData] = useState<profiledataType>({
        name: 'Mathew Anderson',
        role: 'Designer',
        avatar: '/images/profile/user-1.jpg',
        coverImage: '/images/backgrounds/profilebg.jpg',
        postsCount: 938,
        followersCount: 3586,
        followingCount: 2659,
    });

    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true)
                const userResponse = await userService.getMe(); // Changed from usersResponse
                const usersResponse = await userService.getAllUsers(); // Add this
                const deptsResponse = await departmentService.getDepartments();
                const remindersResponse = await reminderService.getReminders(); // Fetch reminders
                setUser(userResponse); // Changed from setUsers(usersResponse.data)
                setUsers(usersResponse); // Add this
                // setFollowers(usersResponse.data); // Removed
                setDepartments(deptsResponse);
                setReminders(remindersResponse); // Set reminders state
            } catch (err) {
                console.error("Error fetching data in UserDataContext:", err);
                setError(err);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    
    // const filterFollowers = () => { // Removed
    //     if (followers) {
    //         return followers.filter((t) =>
    //             t.name.toLowerCase().includes(followerSearch.toLowerCase())
    //         );
    //     }
    //     return followers;
    // };
    
   
const filterDepartments = () => {
    if (departments && departmentSearch) {
        return departments.filter((t) =>
            (typeof t.name === 'string' && t.name.toLowerCase().includes(departmentSearch.toLowerCase())) 
        ); // Changed t.title to t.name
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
                reminders, // Provide reminders in context
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
                // setFollowerSearch, // Removed
                // followerSearch, // Removed
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