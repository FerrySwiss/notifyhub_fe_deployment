"use client";

import { CustomizerContext } from "@/app/context/CustomizerContext";

import { Card } from "flowbite-react";
import React, { useContext } from "react";


interface MyAppProps {
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
}
const CardBox: React.FC<MyAppProps> = ({ children, className, onClick }) => {
  const { activeMode, isCardShadow, isBorderRadius } = useContext(CustomizerContext);
  return (
    <Card 
      className={`card p-6  ${isCardShadow ? 'dark:shadow-dark-md shadow-md ' : 'shadow-none border border-ld'} ${className}`}
      style={{
        borderRadius: `${isBorderRadius}px`,
      }}
      onClick={onClick}
    >{children}</Card>
  );

};

export default CardBox;
