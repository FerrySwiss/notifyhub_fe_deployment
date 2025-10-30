import BreadcrumbComp from "@/app/(DashboardLayout)/layout/shared/breadcrumb/BreadcrumbComp";
import FollowersApp from "@/app/components/apps/userprofile/followers";
import type { Metadata } from "next";
export const metadata: Metadata = {
  title: "Department",
};

const BCrumb = [
  {
    to: "/",
    title: "Home",
  },
  {
    title: "Department",
  },
];
const Followers = () => {
  return (
    <>
      <BreadcrumbComp title="Department" items={BCrumb} />
      <FollowersApp />
    </>
  );
};

export default Followers;
