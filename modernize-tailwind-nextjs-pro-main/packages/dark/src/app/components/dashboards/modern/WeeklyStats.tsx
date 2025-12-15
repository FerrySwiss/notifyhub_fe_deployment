"use client"
import dynamic from "next/dynamic";
import { Icon } from "@iconify/react/dist/iconify.js";
import React, { useState, useEffect, useContext } from "react";
import { UserDataContext } from "@/app/context/UserDataContext";
const Chart = dynamic(() => import("react-apexcharts"), { ssr: false });
import CardBox from "../../shared/CardBox"
import { Badge, Button } from "flowbite-react";
import { Reminder } from "@/types/apps/invoice";

type TimePeriod = 'daily' | 'weekly' | 'monthly';
type StatusFilter = 'all' | 'completed' | 'pending';

export const WeeklyStats = () => {
    // Consume context instead of useQuery directly
    const { reminders } = useContext(UserDataContext);
    
    // Filter states
    const [timePeriod, setTimePeriod] = useState<TimePeriod>('weekly');
    const [statusFilter, setStatusFilter] = useState<StatusFilter>('all');
    
    // Stats state
    const [activeRemindersCount, setActiveRemindersCount] = useState<number>(0);
    const [weeklyRemindersCount, setWeeklyRemindersCount] = useState<number>(0);
    const [todaysRemindersCount, setTodaysRemindersCount] = useState<number>(0);
    const [completedRemindersCount, setCompletedRemindersCount] = useState<number>(0);

    // Filter reminders whenever they update (from context)
    useEffect(() => {
        if (reminders) {
            // Calculate active reminders
            const active = reminders.filter((rem: Reminder) => rem.active);
            setActiveRemindersCount(active.length);
            
            // Calculate completed (inactive)
            setCompletedRemindersCount(reminders.length - active.length);

            // Calculate weekly reminders
            const startOfWeek = new Date();
            startOfWeek.setDate(startOfWeek.getDate() - startOfWeek.getDay()); // Start of current week (Sunday)
            startOfWeek.setHours(0, 0, 0, 0);

            const endOfWeek = new Date(startOfWeek);
            endOfWeek.setDate(startOfWeek.getDate() + 6); // End of current week (Saturday)
            endOfWeek.setHours(23, 59, 59, 999);

            const weekly = reminders.filter((rem: Reminder) => {
                const reminderDate = new Date(rem.reminderStartDate);
                return reminderDate >= startOfWeek && reminderDate <= endOfWeek;
            });
            setWeeklyRemindersCount(weekly.length);

            // Calculate today's reminders
            const today = new Date();
            today.setHours(0, 0, 0, 0);
            const tomorrow = new Date(today);
            tomorrow.setDate(today.getDate() + 1);

            const todays = reminders.filter((rem: Reminder) => {
                const reminderDate = new Date(rem.reminderStartDate);
                return reminderDate >= today && reminderDate < tomorrow;
            });
            setTodaysRemindersCount(todays.length);
        }
    }, [reminders]);

    // Get chart data based on time period
    const getBarChartData = () => {
        let categories: string[] = [];
        let completedData: number[] = [];
        let pendingData: number[] = [];

        switch (timePeriod) {
            case 'daily':
                categories = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
                completedData = [0, 5, 20, 15, 25, 22, 30];
                pendingData = [15, 10, 15, 20, 12, 10, 5];
                break;
            case 'weekly':
                categories = ["Week 1", "Week 2", "Week 3", "Week 4"];
                completedData = [45, 60, 75, 90];
                pendingData = [55, 45, 35, 25];
                break;
            case 'monthly':
                categories = ["Jan", "Feb", "Mar", "Apr", "May", "Jun"];
                completedData = [120, 150, 180, 200, 220, 250];
                pendingData = [80, 70, 60, 55, 50, 40];
                break;
        }

        return {
            series: [
                { name: "Completed", data: completedData },
                { name: "Pending", data: pendingData },
            ],
            chart: {
                toolbar: { show: false },
                foreColor: "#adb0bb",
                fontFamily: "inherit",
                type: "bar" as const,
                height: 250,
                stacked: false,
            },
            plotOptions: {
                bar: {
                    horizontal: false,
                    columnWidth: '55%',
                    borderRadius: 4,
                },
            },
            dataLabels: {
                enabled: false
            },
            colors: ["var(--color-primary)", "var(--color-secondary)"],
            grid: { 
                borderColor: "rgba(0,0,0,0.1)", 
                strokeDashArray: 3,
                xaxis: { lines: { show: false } }
            },
            xaxis: {
                categories: categories,
                axisBorder: { show: false },
                axisTicks: { show: false } 
            },
            yaxis: {
                labels: {
                    show: true,
                }
            },
            legend: {
                show: true,
                position: 'top' as const,
                horizontalAlign: 'right' as const,
            },
            tooltip: { 
                theme: "dark",
                y: {
                    formatter: function (val: number) {
                        return val + " notifications"
                    }
                }
            }
        };
    };

    // Get pie chart data based on status filter
    const getPieChartData = () => {
        let series: number[] = [];
        let labels: string[] = [];

        switch (statusFilter) {
            case 'all':
                series = [activeRemindersCount, completedRemindersCount];
                labels = ["Active", "Completed"];
                break;
            case 'completed':
                // Show breakdown of completed reminders (example: by priority or type)
                series = [completedRemindersCount * 0.6, completedRemindersCount * 0.4];
                labels = ["On Time", "Delayed"];
                break;
            case 'pending':
                // Show breakdown of pending reminders
                series = [activeRemindersCount * 0.7, activeRemindersCount * 0.3];
                labels = ["Urgent", "Normal"];
                break;
        }

        return {
            series: series,
            options: {
                labels: labels,
                chart: { 
                    type: "donut" as const, 
                    height: 250,
                    fontFamily: "inherit",
                    foreColor: "#adb0bb",
                    toolbar: { show: false }
                },
                colors: ["var(--color-primary)", "var(--color-lightprimary)"],
                plotOptions: {
                    pie: {
                        donut: {
                            size: '75%',
                            labels: {
                                show: true,
                                name: { show: true, fontSize: '12px', offsetY: 0, color: '#adb0bb' },
                                value: { show: true, fontSize: '24px', offsetY: 10, color: '#adb0bb' },
                                total: { 
                                    show: true, 
                                    label: labels[0], 
                                    color: '#adb0bb',
                                    formatter: () => series[0].toString()
                                }
                            }
                        },
                    },
                },
                stroke: { show: false },
                dataLabels: { enabled: false },
                legend: { position: "bottom" as const, show: true },
                tooltip: { theme: "dark", fillSeriesColor: false },
            }
        };
    };

    const BarChartData = getBarChartData();
    const PieChartData = getPieChartData();

    const SalesData = [
        {
            key:"topSales",
            title:"Active Notifications",
            subtitle:"Need attention",
            badgeColor:"lightprimary",
            bgcolor:"bg-lightprimary text-primary",
            count: activeRemindersCount 
        },
        {
            key:"topSeller",
            title:"Weekly Notifications",
            subtitle:"This week",
            badgeColor:"lightsuccess",
            bgcolor:"bg-lightsuccess text-success",
            count: weeklyRemindersCount 
        },
        {
            key:"topCommented",
            title:"Todays Notifications",
            subtitle:"Due today",
            badgeColor:"lighterror",
            bgcolor:"bg-lighterror text-error",
            count: todaysRemindersCount 
        }
    ]

    const timePeriodTabs: { value: TimePeriod; label: string }[] = [
        { value: 'daily', label: 'Daily' },
        { value: 'weekly', label: 'Weekly' },
        { value: 'monthly', label: 'Monthly' },
    ];

    const statusTabs: { value: StatusFilter; label: string }[] = [
        { value: 'all', label: 'All' },
        { value: 'completed', label: 'Completed' },
        { value: 'pending', label: 'Pending' },
    ];

    return (
        <CardBox>
            <h5 className="card-title">Notification Stats</h5>
            <p className="card-subtitle">Overview of notification tasks</p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 my-6">
                {/* Line Graph */}
                <div className="bg-lightprimary/20 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-4">
                        <h6 className="font-semibold">Weekly Trend</h6>
                        <div className="flex gap-1">
                            {timePeriodTabs.map((tab) => (
                                <Button
                                    key={tab.value}
                                    size="xs"
                                    color={timePeriod === tab.value ? "blue" : "gray"}
                                    onClick={() => setTimePeriod(tab.value)}
                                    className={`px-3 py-1 text-xs ${
                                        timePeriod === tab.value 
                                            ? 'bg-primary text-white' 
                                            : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
                                    }`}
                                >
                                    {tab.label}
                                </Button>
                            ))}
                        </div>
                    </div>
                    <Chart
                        options={BarChartData}
                        series={BarChartData.series}
                        type="bar"
                        height="250px"
                        width={"100%"}
                    />
                </div>

                {/* Pie Chart */}
                <div className="bg-lightwarning/10 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-4">
                        <h6 className="font-semibold">Distribution</h6>
                        <div className="flex gap-1">
                            {statusTabs.map((tab) => (
                                <Button
                                    key={tab.value}
                                    size="xs"
                                    color={statusFilter === tab.value ? "blue" : "gray"}
                                    onClick={() => setStatusFilter(tab.value)}
                                    className={`px-3 py-1 text-xs ${
                                        statusFilter === tab.value 
                                            ? 'bg-primary text-white' 
                                            : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
                                    }`}
                                >
                                    {tab.label}
                                </Button>
                            ))}
                        </div>
                    </div>
                    <Chart
                        options={PieChartData.options}
                        series={PieChartData.series}
                        type="pie"
                        height="250px"
                        width={"100%"}
                    />
                </div>
            </div>

            {/* Existing Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                 {SalesData.map((item)=>{
                    return(
                        <div key={item.key} className="flex items-center justify-between p-4 border rounded-lg border-border">
                            <div className="flex items-center gap-3">
                                <div className={`${item.bgcolor} h-10 w-10 flex justify-center items-center rounded-md`}>
                                    <Icon icon="tabler:grid-dots" className=' text-xl' />
                                </div>
                                <div>
                                    <h6 className="text-base font-semibold">{item.title}</h6>
                                    <p className="text-xs dark:text-darklink">{item.subtitle}</p>
                                </div>
                            </div>
                            <Badge color={`${item.badgeColor}`} className="py-1 px-2 rounded-md text-sm" >{item.count}</Badge>
                        </div>
                    )
                })}
            </div>
        </CardBox>
    )
}