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

        // Helper to group by key
        const counts: Record<string, { completed: number; pending: number }> = {};
        
        // Initialize based on period
        if (timePeriod === 'daily') {
             // Last 7 days
             const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
             const today = new Date();
             for (let i = 6; i >= 0; i--) {
                 const d = new Date(today);
                 d.setDate(today.getDate() - i);
                 const key = days[d.getDay()];
                 categories.push(key);
                 counts[key] = { completed: 0, pending: 0 };
             }

             reminders.forEach(r => {
                 const d = new Date(r.reminderStartDate);
                 const dayDiff = Math.floor((today.getTime() - d.getTime()) / (1000 * 3600 * 24));
                 if (dayDiff >= 0 && dayDiff <= 6) {
                     const key = days[d.getDay()];
                     if (counts[key]) {
                        if (r.active) counts[key].pending++;
                        else counts[key].completed++;
                     }
                 }
             });

        } else if (timePeriod === 'weekly') {
            // Last 4 weeks
            categories = ["Week 4", "Week 3", "Week 2", "Week 1"]; // Reversed chrono
            categories.forEach(c => counts[c] = { completed: 0, pending: 0 });
            
            const today = new Date();
            reminders.forEach(r => {
                 const d = new Date(r.reminderStartDate);
                 const dayDiff = Math.floor((today.getTime() - d.getTime()) / (1000 * 3600 * 24));
                 const weekIndex = Math.floor(dayDiff / 7);
                 
                 if (weekIndex >= 0 && weekIndex < 4) {
                     const key = categories[3 - weekIndex]; // Map 0->Week 1, 1->Week 2 etc
                     if (counts[key]) {
                        if (r.active) counts[key].pending++;
                        else counts[key].completed++;
                     }
                 }
            });

        } else if (timePeriod === 'monthly') {
            // Last 6 months
            const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
            const today = new Date();
            
            for (let i = 5; i >= 0; i--) {
                const d = new Date(today.getFullYear(), today.getMonth() - i, 1);
                const key = months[d.getMonth()];
                categories.push(key);
                 counts[key] = { completed: 0, pending: 0 };
            }

            reminders.forEach(r => {
                const d = new Date(r.reminderStartDate);
                // Check if within last 6 months window approx
                const monthDiff = (today.getFullYear() - d.getFullYear()) * 12 + (today.getMonth() - d.getMonth());
                if (monthDiff >= 0 && monthDiff <= 5) {
                    const key = months[d.getMonth()];
                     if (counts[key]) {
                        if (r.active) counts[key].pending++;
                        else counts[key].completed++;
                     }
                }
            });
        }

        // Fill data arrays from counts
        categories.forEach(cat => {
            completedData.push(counts[cat]?.completed || 0);
            pendingData.push(counts[cat]?.pending || 0);
        });

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
                stacked: true, // Stacked looks better for status comparison usually
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