import BreadcrumbComp from "@/app/(DashboardLayout)/layout/shared/breadcrumb/BreadcrumbComp";
import CreateDepartmentApp from "@/app/components/apps/userprofile/departments/create";
import type { Metadata } from "next";
export const metadata: Metadata = {
  title: "Create Department",
};

const BCrumb = [
  {
    to: "/",
    title: "Home",
  },
  {
    to: "/apps/user-profile/followers",
    title: "Departments",
  },
  {
    title: "Create Department",
  },
];

const CreateDepartment = () => {
  return (
    <>
      <BreadcrumbComp title="Create Department" items={BCrumb} />
      <CreateDepartmentApp />
    </>
  );
};

export default CreateDepartment;
