
import React from "react";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
    Calendar, 
    Edit3, 
    Trash2, 
    Clock, 
    Pill, 
    FileText, 
    CheckCircle,
    AlertCircle 
} from "lucide-react";
import { format, differenceInDays, parseISO } from "date-fns";

export default function IllnessCard({ illness, onEdit, onDelete, index }) {
    const startDate = parseISO(illness.dateFrom);
    const endDate = illness.dateTo ? parseISO(illness.dateTo) : null;
    const isOngoing = !illness.dateTo;
    const duration = endDate ? differenceInDays(endDate, startDate) + 1 : differenceInDays(new Date(), startDate) + 1;

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ delay: index * 0.1 }}
            className="group"
        >
            <Card className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 bg-white/90 backdrop-blur-sm overflow-hidden">
                <div className="h-1 bg-gradient-to-r from-blue-500 to-indigo-600"></div>
                
                <CardHeader className="pb-4">
                    <div className="flex justify-between items-start">
                        <div className="flex-1">
                            <div className="flex items-center gap-3 mb-2">
                                <h3 className="text-xl font-medium text-slate-800">{illness.shortName}</h3>
                                <Badge 
                                    variant={isOngoing ? "destructive" : "secondary"}
                                    className={`${
                                        isOngoing 
                                            ? "bg-orange-100 text-orange-700 border-orange-200" 
                                            : "bg-green-100 text-green-700 border-green-200"
                                    } font-medium`}
                                >
                                    {isOngoing ? (
                                        <>
                                            <AlertCircle className="w-3 h-3 mr-1" />
                                            Ongoing
                                        </>
                                    ) : (
                                        <>
                                            <CheckCircle className="w-3 h-3 mr-1" />
                                            Recovered
                                        </>
                                    )}
                                </Badge>
                            </div>
                            
                            <div className="flex items-center gap-4 text-sm text-slate-600 mb-3">
                                <div className="flex items-center gap-2">
                                    <Calendar className="w-4 h-4" />
                                    <span>
                                        {format(startDate, "MMM d, yyyy")}
                                        {endDate && ` - ${format(endDate, "MMM d, yyyy")}`}
                                    </span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <Clock className="w-4 h-4" />
                                    <span>{duration} day{duration !== 1 ? 's' : ''}</span>
                                </div>
                            </div>
                        </div>
                        
                        <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                            <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => onEdit(illness)}
                                className="h-8 w-8 p-0 hover:bg-blue-100 hover:text-blue-600 transition-colors duration-200"
                            >
                                <Edit3 className="w-4 h-4" />
                            </Button>
                            <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => onDelete(illness.id)}
                                className="h-8 w-8 p-0 hover:bg-red-100 hover:text-red-600 transition-colors duration-200"
                            >
                                <Trash2 className="w-4 h-4" />
                            </Button>
                        </div>
                    </div>
                </CardHeader>
                
                <CardContent className="pt-0">
                    {illness.description && (
                        <div className="mb-4">
                            <div className="flex items-center gap-2 mb-2">
                                <FileText className="w-4 h-4 text-slate-500" />
                                <span className="text-sm font-medium text-slate-700">Description</span>
                            </div>
                            <p className="text-sm text-slate-600 leading-relaxed pl-6">
                                {illness.description}
                            </p>
                        </div>
                    )}
                    
                    <div className="grid md:grid-cols-2 gap-4">
                        {illness.treatment && (
                            <div>
                                <div className="flex items-center gap-2 mb-2">
                                    <div className="w-4 h-4 bg-blue-100 rounded flex items-center justify-center">
                                        <div className="w-2 h-2 bg-blue-500 rounded"></div>
                                    </div>
                                    <span className="text-sm font-medium text-slate-700">Treatment</span>
                                </div>
                                <p className="text-sm text-slate-600 leading-relaxed pl-6">
                                    {illness.treatment}
                                </p>
                            </div>
                        )}
                        
                        {illness.meds && illness.meds.length > 0 && (
                            <div>
                                <div className="flex items-center gap-2 mb-2">
                                    <Pill className="w-4 h-4 text-slate-500" />
                                    <span className="text-sm font-medium text-slate-700">Medications</span>
                                </div>
                                <ul className="list-disc list-inside pl-6 space-y-1">
                                    {illness.meds.map((med, medIndex) => (
                                        med && <li key={medIndex} className="text-sm text-slate-600">{med}</li>
                                    ))}
                                </ul>
                            </div>
                        )}
                    </div>
                </CardContent>
            </Card>
        </motion.div>
    );
}
