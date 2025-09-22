import React, { useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { 
    X, 
    Download, 
    FileJson, 
    CheckCircle,
    Calendar,
    Database,
    FileText
} from "lucide-react";

export default function ExportModal({ illnesses, onClose }) {
    const [alert, setAlert] = useState(null);

    const downloadData = () => {
        const dataToExport = {
            exportDate: new Date().toISOString(),
            version: "1.0",
            totalEntries: illnesses.length,
            illnesses: illnesses
        };
        
        const dataStr = JSON.stringify(dataToExport, null, 2);
        const dataBlob = new Blob([dataStr], { type: 'application/json' });
        
        const url = URL.createObjectURL(dataBlob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `medical-diary-${new Date().toISOString().split('T')[0]}.json`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
        
        setAlert({
            type: "success",
            message: "Data exported successfully! Check your downloads folder."
        });

        setTimeout(() => {
            onClose();
        }, 2000);
    };

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={(e) => e.target === e.currentTarget && onClose()}
        >
            <motion.div
                initial={{ scale: 0.95, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.95, opacity: 0 }}
                className="w-full max-w-lg"
            >
                <Card className="border-0 shadow-2xl">
                    <CardHeader className="border-b bg-gradient-to-r from-blue-500 to-indigo-600 text-white">
                        <div className="flex justify-between items-center">
                            <CardTitle className="text-xl font-light flex items-center gap-3">
                                <Download className="w-6 h-6" />
                                Export Data
                            </CardTitle>
                            <Button
                                variant="ghost"
                                size="icon"
                                onClick={onClose}
                                className="text-white hover:bg-white/20 transition-colors duration-200"
                            >
                                <X className="w-5 h-5" />
                            </Button>
                        </div>
                    </CardHeader>
                    
                    <CardContent className="p-6 space-y-6">
                        {alert && (
                            <Alert>
                                <CheckCircle className="h-4 w-4" />
                                <AlertDescription>{alert.message}</AlertDescription>
                            </Alert>
                        )}
                        
                        <div className="space-y-4">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                                    <Database className="w-5 h-5 text-blue-600" />
                                </div>
                                <div>
                                    <h3 className="font-medium text-slate-800">Backup Your Data</h3>
                                    <p className="text-sm text-slate-600">
                                        Download your complete medical diary as a secure JSON file
                                    </p>
                                </div>
                            </div>
                            
                            <div className="bg-slate-50 p-4 rounded-lg space-y-3">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-2">
                                        <FileText className="w-4 h-4 text-slate-500" />
                                        <span className="text-sm font-medium text-slate-700">
                                            Current Data
                                        </span>
                                    </div>
                                    <span className="text-sm text-slate-600">
                                        {illnesses.length} entries
                                    </span>
                                </div>
                                
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-2">
                                        <Calendar className="w-4 h-4 text-slate-500" />
                                        <span className="text-sm font-medium text-slate-700">
                                            Export Date
                                        </span>
                                    </div>
                                    <span className="text-sm text-slate-600">
                                        {new Date().toLocaleDateString()}
                                    </span>
                                </div>
                            </div>
                            
                            <div className="bg-blue-50 border border-blue-100 rounded-lg p-4">
                                <div className="text-center">
                                    <FileJson className="w-12 h-12 text-blue-500 mx-auto mb-3" />
                                    <Button
                                        onClick={downloadData}
                                        className="bg-blue-600 hover:bg-blue-700 mb-2"
                                        disabled={illnesses.length === 0}
                                    >
                                        <Download className="w-4 h-4 mr-2" />
                                        Download JSON File
                                    </Button>
                                    <p className="text-xs text-blue-600">
                                        medical-diary-{new Date().toISOString().split('T')[0]}.json
                                    </p>
                                </div>
                            </div>
                            
                            <div className="space-y-2">
                                <h4 className="text-sm font-medium text-slate-800">What's included:</h4>
                                <ul className="text-sm text-slate-600 space-y-1">
                                    <li>• All illness entries with complete details</li>
                                    <li>• Medications, treatments, and dates</li>
                                    <li>• Export metadata for future imports</li>
                                    <li>• Compatible with future app versions</li>
                                </ul>
                            </div>
                        </div>
                        
                        <div className="border-t pt-4">
                            <p className="text-xs text-slate-500 text-center leading-relaxed">
                                Your data remains completely private. The JSON file is saved locally to your device only.
                            </p>
                        </div>
                    </CardContent>
                </Card>
            </motion.div>
        </motion.div>
    );
}