'use client'
import React, { createContext, useState, useEffect, ReactNode, Dispatch, SetStateAction } from 'react';
import { BlogType, BlogPostType } from '../../(DashboardLayout)/types/apps/blog';
import { getFetcher } from '@/app/api/globalFetcher';
import useSWR from 'swr'


export interface BlogContextProps {
    posts: BlogPostType[];
    sortBy: string;
    selectedPost: BlogPostType | null;
    isLoading: boolean;
    setPosts: Dispatch<SetStateAction<BlogPostType[]>>;
    setSortBy: Dispatch<SetStateAction<string>>;
    setSelectedPost: Dispatch<SetStateAction<BlogPostType | null>>;
    setLoading: Dispatch<SetStateAction<boolean>>;
    addComment: (postId: number, newComment: BlogType) => void;
    fetchPostById: (id: number) => void;
    error:null
}

export const BlogContext = createContext<BlogContextProps>({
    posts: [],
    sortBy: 'newest',
    selectedPost: null,
    isLoading: true,
    setPosts: () => { },
    setSortBy: () => { },
    setSelectedPost: () => { },
    setLoading: () => { },
    addComment: () => { },
    fetchPostById: (id:number) => { },
    error:null
});

export const BlogProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [posts, setPosts] = useState<BlogPostType[]>([]);
    const [sortBy, setSortBy] = useState<string>('newest');
    const [selectedPost, setSelectedPost] = useState<BlogPostType | null>(null);
    const [isLoading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<any>(null);

   
    const {data:postsData,isLoading:isPostsLoading , error:postsError} = useSWR('/api/blog',getFetcher);

    useEffect(() => {
        if(postsData){
            setPosts(postsData.data);
            setLoading(isPostsLoading);
        }
        else if(postsError){
          setError(postsError);
          setLoading(isPostsLoading);
        }
        else{
            setLoading(isPostsLoading);
        }
    }, [postsData,postsError]);

    
    const addComment = (postId: number, newComment: BlogType) => {
        setPosts((prevPosts) =>
            prevPosts.map((post) =>
                post.id === postId ? { ...post, comments: [newComment, ...(post.comments || [])] } : post
            )
        );
    }

    
    const fetchPostById =  (id: number) => {
            const {data:specificPostData,isLoading:isSpecificPostLoading , error:isSpecificPostError} = useSWR(`/api/blog/${id}`,getFetcher);
            if(specificPostData){
                setLoading(isSpecificPostLoading);
                setSelectedPost(specificPostData);
            }else if(isSpecificPostError){
                setError(isSpecificPostError);
                setLoading(isSpecificPostLoading);
            }else{
                setLoading(isSpecificPostLoading);
            }
    };

    const value: BlogContextProps = {
        posts,
        sortBy,
        selectedPost,
        isLoading,
        setPosts,
        setSortBy,
        setSelectedPost,
        setLoading,
        addComment,
        fetchPostById,
        error
    };

    return <BlogContext.Provider value={value}>{children}</BlogContext.Provider>;
};
