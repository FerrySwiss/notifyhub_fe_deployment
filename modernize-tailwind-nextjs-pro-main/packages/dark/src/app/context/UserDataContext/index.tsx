'use client'
import React, { createContext, useState, useEffect } from 'react';
import { PostType, profiledataType } from '@/app/(DashboardLayout)/types/apps/userProfile';
import { getFetcher, postFetcher } from '@/app/api/globalFetcher';
import useSWR from 'swr';

// Define context type
export type UserDataContextType = {
    posts: PostType[];
    users: any[];
    gallery: any[];
    followers: any[];
    departments: any[];                     // 👈 Renamed from userDepartments to departments
    profileData: profiledataType;
    loading: boolean;
    error: null | any;
    followerSearch: string;                  // 👈 Renamed search for clarity
    departmentSearch: string;               // 👈 New state for department search
    setFollowerSearch: React.Dispatch<React.SetStateAction<string>>; // 👈 Renamed setSearch
    setDepartmentSearch: React.Dispatch<React.SetStateAction<string>>; // 👈 New setter for department search
    addGalleryItem: (item: any) => void;
    addReply: (postId: number, commentId: number, reply: string) => void;
    likePost: (postId: number) => void;
    addComment: (postId: number, comment: string) => void;
    likeReply: (postId: number, commentId: number) => void;
    toggleFollow: (id: number) => void;
    toggleDepartmentStatus: (id: number) => void; // 👈 New function
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
    departmentSearch: '', // 👈 New default
    loading: true,
};

export const UserDataProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [posts, setPosts] = useState<PostType[]>(config.posts);
    const [users, setUsers] = useState<any[]>(config.users);
    const [gallery, setGallery] = useState<any[]>(config.gallery);
    const [followers, setFollowers] = useState<any[]>(config.followers);
    const [departments, setDepartments] = useState<any[]>(config.departments); // 👈 Renamed and initialized
    const [followerSearch, setFollowerSearch] = useState<string>(config.followerSearch); // 👈 Renamed state
    const [departmentSearch, setDepartmentSearch] = useState<string>(config.departmentSearch); // 👈 New state
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

    // APIs
    const { data: postsData, isLoading: isPostsLoading, error: postsError, mutate } = useSWR("/api/userprofile", getFetcher);
    const { data: usersData, isLoading: isUsersLoading, error: usersError } = useSWR("/api/userprofile/get-users", getFetcher);
    const { data: galleryData, isLoading: isGalleryLoading, error: galleryError } = useSWR("/api/userprofile/get-gallery", getFetcher);
    const { data: deptData, isLoading: isDeptLoading, error: deptError } = useSWR("/api/userprofile/get-usernames-departments", getFetcher); // 👈 Renamed useSWR variable

    useEffect(() => {
        if (postsData && usersData && galleryData) {
            setPosts(postsData.data);
            setUsers(usersData.data);
            setFollowers(usersData.data); // followers = users
            setGallery(galleryData.data);
        }

        if (deptData) {
            setDepartments(deptData.data); // 👈 set departments
        }

        if (postsError) setError(postsError);
        else if (usersError) setError(usersError);
        else if (galleryError) setError(galleryError);
        else if (deptError) setError(deptError);

        setLoading(isPostsLoading || isUsersLoading || isGalleryLoading || isDeptLoading);
    }, [postsData, usersData, galleryData, deptData]);

    // Function to add a new item to the gallery
    const addGalleryItem = (item: any) => {
        setGallery((prevGallery) => [...prevGallery, item]);
    };

    // Function to toggle follow/unfollow status of a user
    const toggleFollow = (id: number) => {
        setFollowers((prevFollowers) =>
            prevFollowers.map((follower) =>
                follower.id === id ? { ...follower, isFollowed: !follower.isFollowed } : follower
            )
        );
    };
    
    // Function to toggle the Active/Inactive status of a department
    const toggleDepartmentStatus = (id: number) => {
        setDepartments((prevDepartments) =>
            prevDepartments.map((department) =>
                // Assuming department objects have an 'id' and an 'isActive' property
                department.id === id ? { ...department, isActive: !department.isActive } : department
            )
        );
    };


    // Function to filter followers based on search input
    const filterFollowers = () => {
        if (followers) {
            return followers.filter((t) =>
                t.name.toLowerCase().includes(followerSearch.toLowerCase()) // 👈 Uses followerSearch
            );
        }
        return followers;
    };
    
    // Function to filter departments based on search input
   
const filterDepartments = () => {
    if (departments && departmentSearch) {
        return departments.filter((t) =>
            // Check if t.name is a string before calling toLowerCase()
            (typeof t.name === 'string' && t.name.toLowerCase().includes(departmentSearch.toLowerCase())) 
        );
    }
    return departments;
};


    // Add comment to a post
    const addComment = async (postId: number, comment: string) => {
        try {
            await mutate(postFetcher('/api/userprofile/add-comments', { postId, comment }));
        } catch (error) {
            console.error('Error adding comment:', error);
        }
    };

    // Add reply to a comment
    const addReply = async (postId: number, commentId: number, reply: string) => {
        try {
            await mutate(postFetcher('/api/userprofile/add-replies', { postId, commentId, reply }));
        } catch (error) {
            console.error('Error adding reply:', error);
        }
    };

    // Function to toggle like/unlike a post
    const likePost = async (postId: number) => {
        try {
            await mutate(postFetcher('/api/userprofile', { postId }));
        } catch (error) {
            console.error('Error liking post:', error);
        }
    };

    // Function to toggle like/unlike a reply
    const likeReply = async (postId: number, commentId: number) => {
        try {
            await mutate(postFetcher('/api/userprofile/replies-like', { postId, commentId }));
        } catch (error) {
            console.error('Error liking reply:', error);
        }
    };

    return (
        <UserDataContext.Provider
            value={{
                posts,
                users,
                gallery,
                followers: filterFollowers(),
                departments: filterDepartments(), // 👈 Filtered departments provided here
                profileData,
                loading,
                error,
                addGalleryItem,
                addReply,
                likePost,
                addComment,
                likeReply,
                toggleFollow,
                toggleDepartmentStatus,         // 👈 New function provided
                setFollowerSearch,              // 👈 Renamed setter provided
                followerSearch,                 // 👈 Renamed state provided
                setDepartmentSearch,            // 👈 New setter provided
                departmentSearch,               // 👈 New state provided
            }}
        >
            {children}
        </UserDataContext.Provider>
    );
};