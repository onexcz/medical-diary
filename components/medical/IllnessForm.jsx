
import React, { useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { X, Save, Calendar, FileText, Pill, Activity, Plus, Trash2 } from "lucide-react";

export default function IllnessForm({ illness, onSubmit, onCancel }) {
    const [formData, setFormData] = useState({
        shortName: illness?.shortName || "",
        description: illness?.description || "",
        dateFrom: illness?.dateFrom || "",
        dateTo: illness?.dateTo || "",
        treatment: illness?.treatment || "",
        meds: Array.isArray(illness?.meds) ? illness.meds : (illness?.meds ? [illness.meds] : [])
    });

    const [errors, setErrors] = useState({});

    const handleChange = (field, value) => {
        setFormData(prev => ({
            ...prev,
            [field]: value
        }));
        
        if (errors[field]) {
            setErrors(prev => ({
                ...prev,
                [field]: ""
            }));
        }
    };

    const handleMedChange = (index, value) => {
        const newMeds = [...formData.meds];
        newMeds[index] = value;
        handleChange("meds", newMeds);
    };

    const addMedication = () => {
        handleChange("meds", [...formData.meds, ""]);
    };

    const removeMedication = (index) => {
        handleChange("meds", formData.meds.filter((_, i) => i !== index));
    };

    const validateForm = () => {
        const newErrors = {};
        
        if (!formData.shortName.trim()) {
            newErrors.shortName = "Short name is required";
        }
        
        if (!formData.dateFrom) {
            newErrors.dateFrom = "Start date is required";
        }
        
        if (formData.dateTo && formData.dateFrom && formData.dateTo < formData.dateFrom) {
            newErrors.dateTo = "End date cannot be before start date";
        }
        
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (validateForm()) {
            // Filter out empty medication strings before submitting
            const dataToSubmit = {
                ...formData,
                meds: formData.meds.filter(med => med.trim() !== "")
            };
            onSubmit(dataToSubmit);
        }
    };

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={(e) => e.target === e.currentTarget && onCancel()}
        >
            <motion.div
                initial={{ scale: 0.95, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.95, opacity: 0 }}
                className="w-full max-w-2xl max-h-[90vh] overflow-auto"
            >
                <Card className="border-0 shadow-2xl">
                    <CardHeader className="border-b bg-gradient-to-r from-blue-500 to-indigo-600 text-white">
                        <div className="flex justify-between items-center">
                            <CardTitle className="text-xl font-light">
                                {illness ? "Edit Illness Entry" : "Add New Illness Entry"}
                            </CardTitle>
                            <Button
                                variant="ghost"
                                size="icon"
                                onClick={onCancel}
                                className="text-white hover:bg-white/20 transition-colors duration-200"
                            >
                                <X className="w-5 h-5" />
                            </Button>
                        </div>
                    </CardHeader>
                    
                    <CardContent className="p-6">
                        <form onSubmit={handleSubmit} className="space-y-6">
                            {/* Short Name */}
                            <div className="space-y-2">
                                <Label htmlFor="shortName" className="text-slate-700 font-medium flex items-center gap-2">
                                    <Activity className="w-4 h-4" />
                                    Short Name *
                                </Label>
                                <Input
                                    id="shortName"
                                    value={formData.shortName}
                                    onChange={(e) => handleChange("shortName", e.target.value)}
                                    placeholder="e.g., Seasonal Flu, Common Cold"
                                    className={`transition-colors duration-200 ${errors.shortName ? "border-red-300 focus:border-red-500" : "border-slate-200 focus:border-blue-500"}`}
                                />
                                {errors.shortName && (
                                    <p className="text-red-500 text-sm">{errors.shortName}</p>
                                )}
                            </div>

                            {/* Description */}
                            <div className="space-y-2">
                                <Label htmlFor="description" className="text-slate-700 font-medium flex items-center gap-2">
                                    <FileText className="w-4 h-4" />
                                    Description
                                </Label>
                                <Textarea
                                    id="description"
                                    value={formData.description}
                                    onChange={(e) => handleChange("description", e.target.value)}
                                    placeholder="Describe symptoms, severity, or any additional notes..."
                                    className="min-h-[100px] resize-none border-slate-200 focus:border-blue-500 transition-colors duration-200"
                                />
                            </div>

                            {/* Dates */}
                            <div className="grid md:grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="dateFrom" className="text-slate-700 font-medium flex items-center gap-2">
                                        <Calendar className="w-4 h-4" />
                                        Start Date *
                                    </Label>
                                    <Input
                                        id="dateFrom"
                                        type="date"
                                        value={formData.dateFrom}
                                        onChange={(e) => handleChange("dateFrom", e.target.value)}
                                        className={`transition-colors duration-200 ${errors.dateFrom ? "border-red-300 focus:border-red-500" : "border-slate-200 focus:border-blue-500"}`}
                                    />
                                    {errors.dateFrom && (
                                        <p className="text-red-500 text-sm">{errors.dateFrom}</p>
                                    )}
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="dateTo" className="text-slate-700 font-medium flex items-center gap-2">
                                        <Calendar className="w-4 h-4" />
                                        End Date
                                        <span className="text-slate-400 text-xs">(leave empty if ongoing)</span>
                                    </Label>
                                    <Input
                                        id="dateTo"
                                        type="date"
                                        value={formData.dateTo}
                                        onChange={(e) => handleChange("dateTo", e.target.value)}
                                        className={`transition-colors duration-200 ${errors.dateTo ? "border-red-300 focus:border-red-500" : "border-slate-200 focus:border-blue-500"}`}
                                    />
                                    {errors.dateTo && (
                                        <p className="text-red-500 text-sm">{errors.dateTo}</p>
                                    )}
                                </div>
                            </div>

                            {/* Treatment */}
                            <div className="space-y-2">
                                <Label htmlFor="treatment" className="text-slate-700 font-medium flex items-center gap-2">
                                    <div className="w-4 h-4 bg-blue-100 rounded flex items-center justify-center">
                                        <div className="w-2 h-2 bg-blue-500 rounded"></div>
                                    </div>
                                    Treatment Plan
                                </Label>
                                <Textarea
                                    id="treatment"
                                    value={formData.treatment}
                                    onChange={(e) => handleChange("treatment", e.target.value)}
                                    placeholder="Describe the treatment approach, procedures, or recommendations..."
                                    className="min-h-[80px] resize-none border-slate-200 focus:border-blue-500 transition-colors duration-200"
                                />
                            </div>

                            {/* Medications */}
                            <div className="space-y-2">
                                <Label htmlFor="meds" className="text-slate-700 font-medium flex items-center gap-2">
                                    <Pill className="w-4 h-4" />
                                    Medications
                                </Label>
                                <div className="space-y-3">
                                    {formData.meds.map((med, index) => (
                                        <div key={index} className="flex items-center gap-2">
                                            <Input
                                                value={med}
                                                onChange={(e) => handleMedChange(index, e.target.value)}
                                                placeholder={`Medication #${index + 1}`}
                                                className="border-slate-200 focus:border-blue-500 transition-colors duration-200"
                                            />
                                            <Button
                                                type="button"
                                                variant="ghost"
                                                size="icon"
                                                onClick={() => removeMedication(index)}
                                                className="hover:bg-red-100 text-slate-500 hover:text-red-600 transition-colors duration-200 shrink-0"
                                            >
                                                <Trash2 className="w-4 h-4" />
                                            </Button>
                                        </div>
                                    ))}
                                </div>
                                <Button
                                    type="button"
                                    variant="outline"
                                    size="sm"
                                    onClick={addMedication}
                                    className="border-slate-200 hover:bg-slate-50 transition-all duration-200 flex items-center gap-2 mt-2"
                                >
                                    <Plus className="w-4 h-4" />
                                    Add Medication
                                </Button>
                            </div>

                            {/* Form Actions */}
                            <div className="flex justify-end gap-3 pt-6 border-t">
                                <Button
                                    type="button"
                                    variant="outline"
                                    onClick={onCancel}
                                    className="border-slate-200 hover:bg-slate-50 transition-all duration-200"
                                >
                                    Cancel
                                </Button>
                                <Button
                                    type="submit"
                                    className="bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 shadow-lg hover:shadow-xl transition-all duration-200"
                                >
                                    <Save className="w-4 h-4 mr-2" />
                                    {illness ? "Update Entry" : "Save Entry"}
                                </Button>
                            </div>
                        </form>
                    </CardContent>
                </Card>
            </motion.div>
        </motion.div>
    );
}
