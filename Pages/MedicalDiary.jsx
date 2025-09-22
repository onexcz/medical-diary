import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Plus, Download, Upload, Calendar, Heart, Activity, Stethoscope } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

import IllnessForm from "../components/medical/IllnessForm";
import IllnessCard from "../components/medical/IllnessCard";
import StatsOverview from "../components/medical/StatsOverview";
import ImportModal from "../components/medical/ImportModal";
import ExportModal from "../components/medical/ExportModal";

export default function MedicalDiary() {
    const [illnesses, setIllnesses] = useState([]);
    const [showForm, setShowForm] = useState(false);
    const [editingIllness, setEditingIllness] = useState(null);
    const [showImportModal, setShowImportModal] = useState(false);
    const [showExportModal, setShowExportModal] = useState(false);

    useEffect(() => {
        loadDataFromStorage();
    }, []);

    const loadDataFromStorage = () => {
        const savedData = localStorage.getItem('medicalDiaryData');
        if (savedData) {
            try {
                const parsedData = JSON.parse(savedData);
                const migratedData = parsedData.map(illness => {
                    if (typeof illness.meds === 'string') {
                        return { ...illness, meds: illness.meds.split('\n').filter(Boolean) };
                    }
                    if (!illness.meds) {
                        return { ...illness, meds: [] };
                    }
                    return illness;
                });
                setIllnesses(migratedData);
            } catch (error) {
                console.error('Error loading data from storage:', error);
            }
        }
    };

    const saveDataToStorage = (data) => {
        localStorage.setItem('medicalDiaryData', JSON.stringify(data));
    };

    const handleSubmit = (illnessData) => {
        let updatedIllnesses;
        
        if (editingIllness) {
            updatedIllnesses = illnesses.map(illness => 
                illness.id === editingIllness.id ? illnessData : illness
            );
        } else {
            const newIllness = {
                ...illnessData,
                id: Date.now().toString()
            };
            updatedIllnesses = [newIllness, ...illnesses];
        }
        
        // Ensure meds are always an array
        const finalUpdatedIllnesses = updatedIllnesses.map(illness => ({
            ...illness,
            meds: Array.isArray(illness.meds) ? illness.meds : []
        }));

        setIllnesses(finalUpdatedIllnesses);
        saveDataToStorage(finalUpdatedIllnesses);
        setShowForm(false);
        setEditingIllness(null);
    };

    const handleEdit = (illness) => {
        setEditingIllness(illness);
        setShowForm(true);
    };

    const handleDelete = (illnessId) => {
        if (window.confirm('Are you sure you want to delete this illness entry?')) {
            const updatedIllnesses = illnesses.filter(illness => illness.id !== illnessId);
            setIllnesses(updatedIllnesses);
            saveDataToStorage(updatedIllnesses);
        }
    };

    const handleDataImport = (importedData) => {
        const migratedData = importedData.map(illness => {
            if (typeof illness.meds === 'string') {
                return { ...illness, meds: illness.meds.split('\n').filter(Boolean) };
            }
            if (!illness.meds) {
                return { ...illness, meds: [] };
            }
            return illness;
        });
        setIllnesses(migratedData);
        saveDataToStorage(migratedData);
    };

    const sortedIllnesses = illnesses.sort((a, b) => {
        const dateA = new Date(a.dateFrom);
        const dateB = new Date(b.dateFrom);
        return dateB - dateA;
    });

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/20">
            <div className="max-w-6xl mx-auto p-6 pb-24 md:pb-6">
                {/* Header Section */}
                <motion.div 
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mb-8"
                >
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 md:w-16 md:h-16 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl flex items-center justify-center shadow-lg shrink-0">
                                <Stethoscope className="w-6 h-6 md:w-8 md:h-8 text-white" />
                            </div>
                            <div>
                                <h1 className="text-3xl md:text-4xl font-light text-slate-800 mb-1 md:mb-2">Personal Medical Diary</h1>
                                <p className="text-slate-600 text-base md:text-lg">Track your health journey with complete privacy</p>
                            </div>
                        </div>
                        
                        <div className="flex gap-3">
                            <Button
                                variant="outline"
                                onClick={() => setShowImportModal(true)}
                                className="border-slate-200 hover:bg-slate-50 transition-all duration-200"
                            >
                                <Upload className="w-4 h-4 md:mr-2" />
                                <span className="hidden md:inline">Import</span>
                            </Button>
                            <Button
                                variant="outline" 
                                onClick={() => setShowExportModal(true)}
                                className="border-slate-200 hover:bg-slate-50 transition-all duration-200"
                            >
                                <Download className="w-4 h-4 md:mr-2" />
                                <span className="hidden md:inline">Export</span>
                            </Button>
                            <Button 
                                onClick={() => setShowForm(true)}
                                className="bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 shadow-lg hover:shadow-xl transition-all duration-200 hidden md:inline-flex"
                            >
                                <Plus className="w-4 h-4 mr-2" />
                                Add New Entry
                            </Button>
                        </div>
                    </div>
                </motion.div>

                {/* Stats Overview */}
                <StatsOverview illnesses={illnesses} />

                {/* Main Content */}
                <div className="space-y-6">
                    {illnesses.length === 0 ? (
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                        >
                            <Card className="border-0 shadow-xl bg-white/80 backdrop-blur-sm">
                                <CardContent className="p-12 text-center">
                                    <div className="w-24 h-24 bg-gradient-to-br from-blue-100 to-indigo-100 rounded-full flex items-center justify-center mx-auto mb-6">
                                        <Heart className="w-12 h-12 text-blue-500" />
                                    </div>
                                    <h3 className="text-2xl font-light text-slate-800 mb-4">Welcome to Your Medical Diary</h3>
                                    <p className="text-slate-600 mb-8 max-w-md mx-auto">
                                        Start tracking your health journey by adding your first illness entry. 
                                        All data stays private on your device.
                                    </p>
                                    <Button 
                                        onClick={() => setShowForm(true)}
                                        className="bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700"
                                    >
                                        <Plus className="w-4 h-4 mr-2" />
                                        Add Your First Entry
                                    </Button>
                                </CardContent>
                            </Card>
                        </motion.div>
                    ) : (
                        <>
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                className="flex items-center gap-3 mb-6"
                            >
                                <Activity className="w-5 h-5 text-blue-500" />
                                <h2 className="text-xl font-light text-slate-800">Health Timeline</h2>
                                <div className="h-px bg-gradient-to-r from-blue-200 to-transparent flex-1"></div>
                            </motion.div>

                            <div className="space-y-4">
                                <AnimatePresence>
                                    {sortedIllnesses.map((illness, index) => (
                                        <IllnessCard
                                            key={illness.id}
                                            illness={illness}
                                            onEdit={handleEdit}
                                            onDelete={handleDelete}
                                            index={index}
                                        />
                                    ))}
                                </AnimatePresence>
                            </div>
                        </>
                    )}
                </div>
            </div>

            {/* Mobile "Add New Entry" FAB */}
            <motion.div 
                initial={{ y: 100, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ type: "spring", stiffness: 100, damping: 20 }}
                className="md:hidden fixed bottom-0 left-0 right-0 p-4 flex justify-center z-40 pointer-events-none"
            >
                <Button
                    onClick={() => setShowForm(true)}
                    className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-full shadow-2xl h-14 px-6 flex items-center gap-3 pointer-events-auto"
                >
                    <Plus className="w-5 h-5" />
                    <span className="text-lg font-medium">Add New Entry</span>
                </Button>
            </motion.div>

            {/* Modals */}
            <AnimatePresence>
                {showForm && (
                    <IllnessForm
                        illness={editingIllness}
                        onSubmit={handleSubmit}
                        onCancel={() => {
                            setShowForm(false);
                            setEditingIllness(null);
                        }}
                    />
                )}
            </AnimatePresence>

            <AnimatePresence>
                {showImportModal && (
                    <ImportModal
                        onImport={handleDataImport}
                        onClose={() => setShowImportModal(false)}
                    />
                )}
            </AnimatePresence>

            <AnimatePresence>
                {showExportModal && (
                    <ExportModal
                        illnesses={illnesses}
                        onClose={() => setShowExportModal(false)}
                    />
                )}
            </AnimatePresence>
        </div>
    );
}
