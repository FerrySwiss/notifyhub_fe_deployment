"use client";
import React, { createContext, useContext, useState, useEffect } from "react";
import ProfileBanner from "./ProfileBanner";
import CardBox from "@/app/components/shared/CardBox";
import { Label, TextInput, Textarea } from 'flowbite-react';

import { Button } from 'flowbite-react'; 
// Create the context for user data
const UserDataContext = createContext(null);

// This provider component will manage the user's state
const UserDataProvider = ({ children }) => {
  // Use a mock user data state for demonstration
  const [userData, setUserData] = useState({
    name: "Jane Doe",
    bio: "Passionate developer and lifelong learner.",
    department: "Engineering"
  });

  // The value provided to the consumers of this context
  const value = {
    userData,
    setUserData,
  };

  return (
    <UserDataContext.Provider value={value}>
      {children}
    </UserDataContext.Provider>
  );
};

// A mock component to display an introduction
const Introduction = () => {
  const { userData } = useContext(UserDataContext);
  return (
    <div className="bg-white p-6 rounded-lg shadow-md mb-6">
      <h2 className="text-xl font-bold mb-4">Introduction</h2>
      <p className="text-gray-700">{userData.bio}</p>
    </div>
  );
};

// A mock component for the profile banner
<ProfileBanner/>




// The new profile form component
const ProfileForm = () => {
  // Get the userData and the setter function from context
  const { userData, setUserData } = useContext(UserDataContext);

  // Use local state to manage the form inputs
  const [formData, setFormData] = useState(userData);
  const [isSaved, setIsSaved] = useState(false);

  // Update local form state when context data changes (e.g., initial load)
  useEffect(() => {
    setFormData(userData);
  }, [userData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
    setIsSaved(false); // Reset saved status on change
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Save the data to the context
    setUserData(formData);
    setIsSaved(true);
  };

  return (
    <div>
      <CardBox>
        <div className="flex justify-between">
          <h4 className="text-lg font-semibold mb-4">Edit Profile</h4>
          {/* Assuming a component like RoundInputsCodes exists to show the code */}
          {/* <RoundInputsCodes /> */} 
        </div>

        <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
          <div>
            <div className="mb-2 block">
              <Label htmlFor="name" value="Name" />
            </div>
            <TextInput
              id="name"
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              className="form-control-rounded"
            />
          </div>
          <div>
            <div className="mb-2 block">
              <Label htmlFor="department" value="Department" />
            </div>
            <TextInput
              id="department"
              type="text"
              name="department"
              value={formData.department}
              onChange={handleChange}
              required
              className="form-control-rounded"
            />
          </div>
          <div>
  <div className="mb-2 block">
    <Label htmlFor="bio" value="Bio" />
  </div>
  <Textarea
    id="bio"
    name="bio"
    rows={4}
    value={formData.bio}
    onChange={handleChange}
    required
    className="form-control-rounded"
  />
</div>
          <div className="flex items-center justify-between">
            <Button type="submit" color="primary" className="rounded-xl">
              Save Profile
            </Button>
            {isSaved && (
              <span className="text-green-500 text-sm font-semibold">Saved!</span>
            )}
          </div>
        </form>
      </CardBox>
    </div>
  );
};


const UserProfileApp = () => {
  return (
    <>
      <UserDataProvider>
        <div className="grid grid-cols-12 gap-6">
          {/* Banner */}
          <div className="col-span-12">
            <ProfileBanner />
          </div>
          <div className=" col-span-12">
            <div className="grid grid-cols-12">
              <div className="col-span-12 mb-30">
                <ProfileForm />
              </div>
            
            </div>
          </div>
         
        </div>
      </UserDataProvider>
    </>
  );
};

export default UserProfileApp;
