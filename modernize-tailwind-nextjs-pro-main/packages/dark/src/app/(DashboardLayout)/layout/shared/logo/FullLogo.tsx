"use client";
import React from "react";
import Image from "next/image";
import Logo from "@/app/(DashboardLayout)/layout/shared/logo/NotifyHub/image.png";
import Logowhite from "@/app/(DashboardLayout)/layout/shared/logo/NotifyHub/NotifyHubdarklogo-removebg-preview.png";
import Link from "next/link";
const FullLogo = () => {
  return (
    <Link href={"/"}>
      {/* Dark Logo   */}
      <Image src={Logo} alt="logo" className="block dark:hidden rtl:scale-x-[-1] w-[300px]" />
      {/* Light Logo  */}
      <Image src={Logowhite} alt="logo" className="hidden dark:block rtl:scale-x-[-1] w-[300px]" />
    </Link>
  );
};

export default FullLogo;
