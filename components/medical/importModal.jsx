import React, { useRef, useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { 
    X, 
    Upload, 
    FileJson, 
    AlertCircle, 
    CheckCircle,
    Database
} from "lucide-react";

export default function ImportModal({ onImport, onClose }) {
    const fileInputRef = useRef(null);
    const [alert, setAlert] = useState(null);
    const [isProcessing, setIsProcessing] = useState(false);

    const handleFileUpload = async (event) => {
        const file = event.target.files[0];
        if (!file) return;

        if (file.type !== 'application/json') {
            setAlert({
                type: "error",
                message: "Please select a valid JSON file."
            });
            return;
        }

        setIsProcessing(true);

        try {
            const text = await file.text();
            const data = JSON.parse(text);
            
            // Validate data structure
            let illnessesToImport = [];
            
            if (Array.isArray(data)) {
                illnessesToImport = data;
            } else if (data.illnesses && Array.isArray(data.illnesses)) {
                illnessesToImport = data.illnesses;
            } else {
                throw new Error("Invalid file format");
            }
            
            // Basic validation of illness entries
            const validatedIllnesses = illnessesToImport.map(illness => {
                const meds = (typeof illness.meds === 'string') 
                    ? illness.meds.split('\n').filter(Boolean)
                    : (Array.isArray(illness.meds) ? illness.meds : []);

                return {
                    id: illness.id || Date.now().toString() + Math.random(),
                    shortName: illness.shortName || "Unknown Illness",
                    description: illness.description || "",
                    dateFrom: illness.dateFrom || new Date().toISOString().split('T')[0],
                    dateTo: illness.dateTo || "",
                    treatment: illness.treatment || "",
                    meds: meds
                };
            });
            
            onImport(validatedIllnesses);
            
            setAlert({
                type: "success",
                message: `Successfully imported ${validatedIllnesses.length} illness entries!`
            });
            
            setTimeout(() => {
                onClose();
            }, 2000);
            
        } catch (error) {
            setAlert({
                type: "error",
                message: "Error reading file. Please make sure it's a valid medical diary JSON file."
            });
        }
        
        setIsProcessing(false);
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
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
                    <CardHeader className="border-b bg-gradient-to-r from-green-500 to-emerald-600 text-white">
                        <div className="flex justify-between items-center">
                            <CardTitle className="text-xl font-light flex items-center gap-3">
                                <Upload className="w-6 h-6" />
                                Import Data
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
                            <Alert variant={alert.type === "error" ? "destructive" : "default"}>
                                {alert.type === "success" ? (
                                    <CheckCircle className="h-4 w-4" />
                                ) : (
                                    <AlertCircle className="h-4 w-4" />
                                )}
                                <AlertDescription>{alert.message}</AlertDescription>
                            </Alert>
                        )}
                        
                        <div className="space-y-4">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                                    <Database className="w-5 h-5 text-green-600" />
                                </div>
                                <div>
                                    <h3 className="font-medium text-slate-800">Load Previous Data</h3>
                                    <p className="text-sm text-slate-600">
                                        Upload a previously exported JSON file to restore your medical diary
                                    </p>
                                </div>
                            </div>
                            
                            <div className="bg-slate-50 p-6 rounded-lg border-2 border-dashed border-slate-200">
                                <input
                                    ref={fileInputRef}
                                    type="file"
                                    accept=".json"
                                    onChange={handleFileUpload}
                                    className="hidden"
                                />
                                
                                <div className="text-center">
                                    <FileJson className="w-12 h-12 text-green-500 mx-auto mb-3" />
                                    <Button
                                        onClick={() => fileInputRef.current?.click()}
                                        disabled={isProcessing}
                                        className="bg-green-600 hover:bg-green-700 mb-2"
                                    >
                                        <Upload className="w-4 h-4 mr-2" />
                                        {isProcessing ? "Processing..." : "Choose JSON File"}
                                    </Button>
                                    <p className="text-xs text-slate-500">
                                        Select a medical-diary-*.json file
                                    </p>
                                </div>
                            </div>
                            
                            <div className="bg-red-50 border border-red-100 rounded-lg p-4">
                                <div className="flex gap-2">
                                    <AlertCircle className="w-4 h-4 text-red-500 mt-0.5 shrink-0" />
                                    <div>
                                        <p className="text-sm font-medium text-red-800">Warning</p>
                                        <p className="text-sm text-red-700">
                                            Importing will replace all your current data. Make sure to export your current data first if you want to keep it.
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                        
                        <div className="border-t pt-4">
                            <p className="text-xs text-slate-500 text-center leading-relaxed">
                                Only upload JSON files that were previously exported from this medical diary application.
                            </p>
                        </div>
                    </CardContent>
                </Card>
            </motion.div>
        </motion.div>
    );
}