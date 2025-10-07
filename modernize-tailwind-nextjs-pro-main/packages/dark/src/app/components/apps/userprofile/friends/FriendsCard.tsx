import React, { useContext } from "react";
import {
  TbBrandFacebook,
  TbBrandGithub,
  TbBrandInstagram,
  TbBrandTwitter,
} from "react-icons/tb";
import { Badge, TextInput, Button } from "flowbite-react";
import { Icon } from "@iconify/react";
import CardBox from "@/app/components/shared/CardBox";
import Image from "next/image";
import Link from "next/link";
import { UserDataContext } from "@/app/context/UserDataContext/index";
import { StaticImport } from "next/dist/shared/lib/get-img-props";

const socialiconCard = [
  {
    icon: <TbBrandFacebook size={17} />,
    color: "primary",
  },
  {
    icon: <TbBrandInstagram size={17} />,
    color: "error",
  },
  {
    icon: <TbBrandGithub size={17} />,
    color: "info",
  },
  {
    icon: <TbBrandTwitter size={17} />,
    color: "secondary",
  },
];

const FriendsCard = () => {
  const { followers, setFollowerSearch, departments }: any =
    useContext(UserDataContext);

  return (
    <>
      <div className="md:flex justify-between mb-6">
        <h5 className="text-2xl flex gap-3 items-center sm:my-0 my-4">
          Users<Badge color={"secondary"}>{followers.length}</Badge>
        </h5>
        <div className="flex gap-3">
          <TextInput
            icon={() => <Icon icon="tabler:search" height={18} />}
            type="text"
            sizing="md"
            className="form-control "
            placeholder="Search Friends"
            onChange={(e) => setFollowerSearch(e.target.value)}
          />
          <Link href="/apps/user-profile/users/create">
            <Button color="primary">Add User</Button>
          </Link>
        </div>
      </div>
      <div className="grid grid-cols-12 gap-6">
        {followers.map(
          (profile: {
            id: React.Key | null | undefined;
            name: string;
            username: string;
            email: string;
          }) => {
            return (
              <div
                className="lg:col-span-4 md:col-span-4 sm:col-span-6 col-span-12"
                key={profile.id}
              >
                <CardBox className="px-0 pb-0 text-center overflow-hidden">
                  <div className="flex items-center justify-center w-20 h-20 bg-lightprimary rounded-full mx-auto">
                    <Icon icon="tabler:user" height="48" className="text-primary" />
                  </div>
                  <div>
                    <h5 className="text-lg mt-3">{profile.name}</h5>
                    <p className="text-xs text-darklink">@{profile.username}</p>
                    <p className="text-xs text-gray-500">{profile.email}</p>
                  </div>
                  <div className="flex justify-center gap-4 items-center border-t border-border dark:border-darkborder mt-4 pt-4 bg-lightgray pb-4 dark:bg-darkmuted">
                    {socialiconCard.map((soc, index) => (
                      <Link
                        href={"#"}
                        className={`text-${soc.color}`}
                        key={index}
                      >
                        {soc.icon}
                      </Link>
                    ))}
                  </div>
                </CardBox>
              </div>
            );
          }
        )}
      </div>
    </>
  );
};

export default FriendsCard;
