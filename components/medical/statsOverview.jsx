import React from "react";
import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { 
    Calendar, 
    TrendingUp, 
    Clock, 
    Activity,
    AlertCircle,
    CheckCircle
} from "lucide-react";
import { differenceInDays, parseISO, subDays, isAfter } from "date-fns";

export default function StatsOverview({ illnesses }) {
    const currentDate = new Date();
    const thirtyDaysAgo = subDays(currentDate, 30);
    
    const ongoingIllnesses = illnesses.filter(illness => !illness.dateTo);
    const recentIllnesses = illnesses.filter(illness => 
        isAfter(parseISO(illness.dateFrom), thirtyDaysAgo)
    );
    
    const totalDaysSick = illnesses.reduce((total, illness) => {
        const startDate = parseISO(illness.dateFrom);
        const endDate = illness.dateTo ? parseISO(illness.dateTo) : currentDate;
        return total + differenceInDays(endDate, startDate) + 1;
    }, 0);
    
    const averageDuration = illnesses.length > 0 
        ? Math.round(totalDaysSick / illnesses.length) 
        : 0;

    const stats = [
        {
            title: "Total Entries",
            value: illnesses.length,
            icon: Activity,
            color: "blue",
            description: "All time"
        },
        {
            title: "Recent (30 days)",
            value: recentIllnesses.length,
            icon: TrendingUp,
            color: "purple",
            description: "This month"
        },
        {
            title: "Currently Ongoing",
            value: ongoingIllnesses.length,
            icon: AlertCircle,
            color: ongoingIllnesses.length > 0 ? "orange" : "green",
            description: ongoingIllnesses.length > 0 ? "Active illnesses" : "No active illnesses"
        },
        {
            title: "Avg. Duration",
            value: averageDuration > 0 ? `${averageDuration} days` : "N/A",
            icon: Clock,
            color: "indigo",
            description: "Per illness"
        }
    ];

    const colorClasses = {
        blue: {
            bg: "bg-blue-100",
            text: "text-blue-600",
            icon: "text-blue-500"
        },
        purple: {
            bg: "bg-purple-100",
            text: "text-purple-600", 
            icon: "text-purple-500"
        },
        orange: {
            bg: "bg-orange-100",
            text: "text-orange-600",
            icon: "text-orange-500"
        },
        green: {
            bg: "bg-green-100", 
            text: "text-green-600",
            icon: "text-green-500"
        },
        indigo: {
            bg: "bg-indigo-100",
            text: "text-indigo-600",
            icon: "text-indigo-500"
        }
    };

    if (illnesses.length === 0) return null;

    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            {stats.map((stat, index) => (
                <motion.div
                    key={stat.title}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                >
                    <Card className="border-0 shadow-md hover:shadow-lg transition-shadow duration-200 bg-white/80 backdrop-blur-sm">
                        <CardContent className="p-4">
                            <div className="flex items-center justify-between mb-2">
                                <div className={`w-10 h-10 ${colorClasses[stat.color].bg} rounded-lg flex items-center justify-center`}>
                                    <stat.icon className={`w-5 h-5 ${colorClasses[stat.color].icon}`} />
                                </div>
                                <div className="text-right">
                                    <p className={`text-2xl font-bold ${colorClasses[stat.color].text}`}>
                                        {stat.value}
                                    </p>
                                    <p className="text-xs text-slate-500">
                                        {stat.description}
                                    </p>
                                </div>
                            </div>
                            <h3 className="text-sm font-medium text-slate-700">{stat.title}</h3>
                        </CardContent>
                    </Card>
                </motion.div>
            ))}
        </div>
    );
}