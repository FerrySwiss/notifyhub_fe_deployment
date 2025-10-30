import React, { useContext } from "react";
import { Icon } from "@iconify/react";
import { Avatar, AvatarImageProps, Badge, Button, TextInput } from "flowbite-react";
import Link from "next/link";
import CardBox from "@/app/components/shared/CardBox";
import { UserDataContext } from '@/app/context/UserDataContext/index';


const FollowerCard = () => {
  const { departments, toggleDepartmentStatus, setDepartmentSearch }: any = useContext(UserDataContext);
  return (
    <>
      <div className="md:flex justify-between mb-6">
        <h5 className="text-2xl flex gap-3 items-center sm:my-0 my-4">
          Departments<Badge color={"secondary"} className="rounded-md">{departments.length}</Badge>
        </h5>
        <div className="flex gap-3">
          <TextInput
            icon={() => <Icon icon="tabler:search" height={18} />}
            type="text"
            sizing="md"
            className="form-control "
            placeholder="Search Departments"
            onChange={(e) => setDepartmentSearch(e.target.value)}
          />
          <Link href="/apps/user-profile/departments/create">
            <Button color="primary">Add Department</Button>
          </Link>
        </div>
      </div>
      <div className="grid grid-cols-12 gap-6">
        {departments.map((department: { id: React.Key | null | undefined; title: string; body: string; user: { name: string }; }) => {
          return (
            <div
              className="lg:col-span-4 md:col-span-6 sm:col-span-6 col-span-12"
              key={department.id}
            >
              <CardBox>
                <div className="flex gap-3">
                  <div className="flex items-center justify-center w-12 h-12 bg-lightprimary rounded-full">
                    <Icon icon="tabler:building" height="24" className="text-primary" />
                  </div>
                  <div>
                    <h6 className="text-base">{department.title}</h6>
                    <p className="text-darklink text-sm">{department.body}</p>
                    <p className="text-darklink text-xs">Created by: {department.user.name}</p>
                  </div>
                </div>
              </CardBox>
            </div>
          );
        })}
      </div>
    </>
  );
};
export default FollowerCard;
