import BreadcrumbComp from "@/app/(DashboardLayout)/layout/shared/breadcrumb/BreadcrumbComp";
import UserProfileApp from "@/app/components/apps/userprofile/profile";
import type { Metadata } from "next";
export const metadata: Metadata = {
  title: "Account Settings",
};

const BCrumb = [
  {
    to: "/",
    title: "Home",
  },
  {
    title: "Account Settings",
  },
];
const UserProfile = () => {
  return (
    <>
      <BreadcrumbComp title="Account Settings" items={BCrumb} />
      <UserProfileApp />
    </>
  );
};

export default UserProfile;
