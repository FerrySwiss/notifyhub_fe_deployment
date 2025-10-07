'use client'
import React, { createContext, useState, useEffect } from 'react';
import { PostType, profiledataType } from '@/app/(DashboardLayout)/types/apps/userProfile';
import { userService, departmentService } from '@/app/services/api';

// Define context type
export type UserDataContextType = {
    posts: PostType[];
    users: any[];
    gallery: any[];
    followers: any[];
    departments: any[];
    profileData: profiledataType;
    loading: boolean;
    error: null | any;
    followerSearch: string;
    departmentSearch: string;
    setFollowerSearch: React.Dispatch<React.SetStateAction<string>>;
    setDepartmentSearch: React.Dispatch<React.SetStateAction<string>>;
    addGalleryItem: (item: any) => void;
    addReply: (postId: number, commentId: number, reply: string) => void;
    likePost: (postId: number) => void;
    addComment: (postId: number, comment: string) => void;
    likeReply: (postId: number, commentId: number) => void;
    toggleFollow: (id: number) => void;
    toggleDepartmentStatus: (id: number) => void;
};

// Create context
export const UserDataContext = createContext<UserDataContextType | undefined>(undefined);

// Default config values
const config = {
    posts: [],
    users: [],
    gallery: [],
    followers: [],
    departments: [],
    followerSearch: '',
    departmentSearch: '',
    loading: true,
};

export const UserDataProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [posts, setPosts] = useState<PostType[]>(config.posts);
    const [users, setUsers] = useState<any[]>(config.users);
    const [gallery, setGallery] = useState<any[]>(config.gallery);
    const [followers, setFollowers] = useState<any[]>(config.followers);
    const [departments, setDepartments] = useState<any[]>(config.departments);
    const [followerSearch, setFollowerSearch] = useState<string>(config.followerSearch);
    const [departmentSearch, setDepartmentSearch] = useState<string>(config.departmentSearch);
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
                setLoading(true);
                const usersResponse = await userService.getUsers();
                const deptsResponse = await departmentService.getDepartments();
                setUsers(usersResponse.data);
                setFollowers(usersResponse.data);
                setDepartments(deptsResponse.data);
            } catch (err) {
                setError(err);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    // Function to filter followers based on search input
    const filterFollowers = () => {
        if (followers) {
            return followers.filter((t) =>
                t.name.toLowerCase().includes(followerSearch.toLowerCase())
            );
        }
        return followers;
    };
    
    // Function to filter departments based on search input
   
const filterDepartments = () => {
    if (departments && departmentSearch) {
        return departments.filter((t) =>
            (typeof t.title === 'string' && t.title.toLowerCase().includes(departmentSearch.toLowerCase())) 
        );
    }
    return departments;
};

    return (
        <UserDataContext.Provider
            value={{
                posts,
                users,
                gallery,
                followers: filterFollowers(),
                departments: filterDepartments(),
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
                setFollowerSearch,
                followerSearch,
                setDepartmentSearch,
                departmentSearch,
            }}
        >
            {children}
        </UserDataContext.Provider>
    );
};