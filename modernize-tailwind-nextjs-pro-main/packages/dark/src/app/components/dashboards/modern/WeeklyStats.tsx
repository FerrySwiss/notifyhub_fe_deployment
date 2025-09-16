"use client"
import dynamic from "next/dynamic";
import { Icon } from "@iconify/react/dist/iconify.js";
const Chart = dynamic(() => import("react-apexcharts"), { ssr: false });
import CardBox from "../../shared/CardBox"
import { Badge } from "flowbite-react";

export const WeeklyStats = () => {
    const ChartData: any = {
        series: [
            {
                name: "Weekly Stats",
                color: "var(--color-primary)",
                data: [5, 15, 10, 20],
              },
        ],
        chart: {
            id: "sparkline3",
            type: "area",
            height: 180,
            sparkline: {
              enabled: true,
            },
            group: "sparklines",
            fontFamily: "inherit",
            foreColor: "#adb0bb",
          },
          stroke: {
            curve: "smooth",
            width: 2,
          },
          fill: {
            type: "gradient",
            gradient: {
              shadeIntensity: 0,
              inverseColors: false,
              opacityFrom: 0.1,
              opacityTo: 0,
              stops: [20, 280],
            },
          },
      
          markers: {
            size: 0,
          },
          tooltip: {
            theme: "dark",
            fixed: {
              enabled: true,
              position: "right",
            },
            x: {
              show: false,
            },
          },
    };
    const SalesData = [
        {
            key:"topSales",
            title:"Top Reminder",
            subtitle:"Submit timesheet",
            badgeColor:"lightprimary",
            bgcolor:"bg-lightprimary text-primary"
        },
        {
            key:"topSeller",
            title:"Most Urgent",
            subtitle:"Fix login issue",
            badgeColor:"lightsuccess",
            bgcolor:"bg-lightsuccess text-success"
        },
        {
            key:"topCommented",
            title:"Most Discussed",
            subtitle:"Client meeting preparation",
            badgeColor:"lighterror",
            bgcolor:"bg-lighterror text-error"
        }
    ]
    return (
        <CardBox>
            <h5 className="card-title">Reminder Stats</h5>
            <p className="card-subtitle">Upcoming tasks this week</p>
            <div className="my-6">
            <Chart
                 options={ChartData}
                 series={ChartData.series}
                 type="area"
                 height="170px"
                 width={"100%"}
               />
            </div>

            {SalesData.map((item)=>{
                return(
                    <div key={item.key} className="flex items-center justify-between mb-7 last:mb-0">
                    <div className="flex items-center gap-3">
                        <div className={`${item.bgcolor} h-10 w-10 flex justify-center items-center rounded-md`}>
                            <Icon icon="tabler:grid-dots" className=' text-xl' />
                        </div>
                        <div>
                            <h6 className="text-base">{item.title}</h6>
                            <p className=" dark:text-darklink ">{item.subtitle}</p>
                        </div>
                    </div>
                    <Badge color={`${item.badgeColor}`} className="py-1.1 rounded-md text-sm" >+68</Badge>
                </div>
                )
            })}
        </CardBox>


    )
}