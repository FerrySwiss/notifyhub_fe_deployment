"use client"
import { Badge, Table } from "flowbite-react";
import Image from "next/image";
import userimg1 from "/public/images/profile/user-3.jpg";
import userimg2 from "/public/images/profile/user-5.jpg";
import userimg3 from "/public/images/profile/user-6.jpg";
import userimg4 from "/public/images/profile/user-7.jpg";
import userimg5 from "/public/images/profile/user-8.jpg";

export default function RemindersPage() {
  const PerformersData = [
    {
      key:"performerData1",
      profileImg:userimg1,
      username:"Rajesh Kumar",
      designation:"Web Designer",
      project:"Review marketing plan",
      priority:"Low",
      color:"lightprimary",
      budget:"19 Sep 2025"
    },
    {
      key:"performerData2",
      profileImg:userimg2,
      username:"Priya Sharma",
      designation:"Web Developer",
      project:"Update website content",
      priority:"Medium",
      color:"lightwarning",
      budget:"25 Sep 2025"
    },
    {
      key:"performerData3",
      profileImg:userimg3,
      username:"Anil Verma",
      designation:"Web Manager",
      project:"Fix login issue",
      priority:"High",
      color:"lightwarning",
      budget:"22 Sep 2025"
    },
    {
      key:"performerData4",
      profileImg:userimg4,
      username:"Kavita Singh",
      designation:"Project Manager",
      project:"Submit timesheet",
      priority:"Low",
      color:"lightsuccess",
      budget:"20 Sep 2025"
    },
    {
      key:"performerData5",
      profileImg:userimg5,
      username:"Manoj Patel",
      designation:"Content Writer",
      project:"Client meeting preparation",
      priority:"High",
      color:"lighterror",
      budget:"18 Sep 2025"
    },
  ];

  return (
    <div className="p-6">
      <h2 className="text-xl font-bold mb-6">All Reminders</h2>
      <Table>
        <Table.Head>
          <Table.HeadCell className="text-sm font-semibold ps-0">
            Assigned
          </Table.HeadCell>
          <Table.HeadCell className="text-sm font-semibold">
            Reminders
          </Table.HeadCell>
          <Table.HeadCell className="text-sm font-semibold">
            Priority
          </Table.HeadCell>
          <Table.HeadCell className="text-sm font-semibold">
            Due Date
          </Table.HeadCell>
        </Table.Head>
        <Table.Body className="divide-y divide-border dark:divide-darkborder ">
          {PerformersData.map((item, index) => (
            <Table.Row key={index}>
              <Table.Cell className="whitespace-nowrap ps-0 md:min-w-auto min-w-[200px]">
                <div className="flex gap-3 items-center">
                  <Image
                    src={item.profileImg}
                    alt="icon"
                    className="h-8 w-8 rounded-full"
                  />
                  <div>
                    <h6 className="text-sm font-semibold mb-1">{item.username}</h6>
                    <p className="text-xs font-normal text-bodytext dark:text-darklink">
                      {item.designation}
                    </p>
                  </div>
                </div>
              </Table.Cell>
              <Table.Cell>
                <p className="text-link dark:text-darklink text-sm w-fit">
                  {item.project}
                </p>
              </Table.Cell>
              <Table.Cell>
                <Badge 
                  color={`${item.color}`} 
                  className="text-sm rounded-md py-1.1 px-2 w-11/12 justify-center" 
                >
                  {item.priority}
                </Badge>
              </Table.Cell>
              <Table.Cell>
                <p className="dark:text-darklink text-link text-sm">
                  {item.budget}
                </p>
              </Table.Cell>
            </Table.Row>
          ))}
        </Table.Body>
      </Table>
    </div>
  );
}
