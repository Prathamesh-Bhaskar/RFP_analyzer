import React, { useState, useRef } from "react";
import axios from "axios";
import { Button } from "@/components/ui/button";
import { useReactToPrint } from 'react-to-print';
import { saveAs } from 'file-saver';
import * as htmlToImage from 'html-to-image';
import jsPDF from 'jspdf';
import {
  CheckCircle2,
  XCircle,
  AlertTriangle,
  Clock,
  FileText,
  ChevronRight,
  Download,
  Printer,
  Share2,
  FileSearch,
  FileCheck,
  Shield,
  Gavel,
  ClipboardList
} from "lucide-react";
import AgentVisualization from "../dashboard/visualization/AgentVisualization"; 

const Reports = () => {
  const [report, setReport] = useState(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  const reportRef = useRef(null);

  // Process API data (modified to not use GoogleGenAI)
  async function processRfpData(rfpData) {
    try {
      console.log(`Processing RFP data...`);
      
      // Since GoogleGenAI isn't available, we'll simulate processing
      // In a real application, you would process the data here or send it to your backend
      
      // Simple parsing function that returns the original data or transforms it if needed
      const processedData = typeof rfpData === 'string' ? JSON.parse(rfpData) : rfpData;
      
      return processedData;
    } catch (error) {
      console.error('Error processing RFP data:', error);
      throw error;
    }
  }

  const handleAnalysisComplete = () => {
    // This function is called when the visualization is complete
    console.log("Analysis visualization completed");
  };

  const handleSubmit = async () => {
    try {
      setIsAnalyzing(true);
      
      const session_id = localStorage.getItem("session_id");
      console.log('Session ID:', session_id);
      
      // Start the actual API call after a delay to show visualization
      setTimeout(async () => {
        try {
          const res = await axios.post("http://127.0.0.1:5000/api/analyze", { session_id });
          
          // Process the response
          const processedData = await processRfpData(res.data);
          console.log("Processed Response", processedData);
          
          // Update state with the new report data
          setReport(processedData);
        } catch (error) {
          console.error("Error analyzing RFP:", error);
          setIsAnalyzing(false);
        }
      }, 18000); // Wait for visualization to complete (approx. 18 seconds)
      
    } catch (error) {
      console.error(error);
      setIsAnalyzing(false);
    }
  };

  // Print functionality (fixed)
  const handlePrint = useReactToPrint({
    content: () => reportRef.current,
    documentTitle: "RFP-Analysis-Report",
    onBeforePrint: () => {
      document.body.classList.add('printing');
    },
    onAfterPrint: () => {
      document.body.classList.remove('printing');
    }
  });

  const onPrint = (e) => {
    e.preventDefault();
    handlePrint();
  };

  // Export as PDF functionality
  const handleExport = async () => {
    if (!reportRef.current) return;
    setIsExporting(true);
    try {
      const dataUrl = await htmlToImage.toPng(reportRef.current, {
        quality: 1,
        pixelRatio: 2,
        backgroundColor: '#f9fafb'
      });
      const pdf = new jsPDF('p', 'mm', 'a4');
      const imgProps = pdf.getImageProperties(dataUrl);
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;
      pdf.addImage(dataUrl, 'PNG', 0, 0, pdfWidth, pdfHeight);
      pdf.save(`${report?.id || 'report'}-report.pdf`);
    } catch (error) {
      console.error('Error exporting report:', error);
    } finally {
      setIsExporting(false);
    }
  };

  // If no report data is available, render a placeholder or the visualization
  if (!report) {
    return (
      <div className="flex flex-col h-screen bg-gray-50 p-6">
        <div className="max-w-4xl mx-auto w-full">
          <h1 className="text-2xl font-bold mb-6">RFP Analysis</h1>
          
          {!isAnalyzing ? (
            <div className="bg-white p-8 rounded-lg border shadow-md text-center">
              <img 
                src="/placeholder.svg" 
                alt="RFP Analysis" 
                className="mx-auto mb-6"
                style={{ width: "240px", height: "160px" }}
              />
              <h2 className="text-xl font-semibold mb-2">Ready to Analyze Your RFP</h2>
              <p className="text-gray-600 mb-6">
                Our AI-powered system will analyze your RFP for compliance, risks, and opportunities.
              </p>
              <Button 
                onClick={handleSubmit}
                className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white"
                size="lg"
              >
                Start Analysis
              </Button>
            </div>
          ) : (
            <AgentVisualization 
              isAnalyzing={isAnalyzing} 
              onAnalysisComplete={handleAnalysisComplete}
            />
          )}
        </div>
      </div>
    );
  }

  // Placeholder for rendering the report (simplified for this example)
  return (
    <div className="flex h-screen bg-gray-50">
      <div className="flex-1 flex flex-col overflow-hidden">
        <main className="flex-1 overflow-auto p-6" ref={reportRef}>
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-bold">Analysis Results</h1>
            <Button 
              onClick={() => {
                setReport(null);
                setIsAnalyzing(false);
              }}
              variant="outline"
            >
              New Analysis
            </Button>
          </div>

          {/* Simple report display */}
          <div className="bg-white p-6 rounded-lg border shadow-md mb-6">
            <h2 className="text-xl font-medium mb-4">RFP Analysis Report</h2>
            <pre className="bg-gray-50 p-4 rounded overflow-auto text-sm">
              {JSON.stringify(report, null, 2)}
            </pre>
          </div>
          
          {/* Actions section for export/print/share */}
          <div className="flex justify-end gap-3 pt-4">
            <Button variant="outline" className="gap-2" onClick={handleExport} disabled={isExporting}>
              <Download className="h-4 w-4" />
              {isExporting ? 'Exporting...' : 'Export Report'}
            </Button>
            <Button variant="outline" className="gap-2" onClick={onPrint}>
              <Printer className="h-4 w-4" />
              Print
            </Button>
            <Button className="gap-2">
              <Share2 className="h-4 w-4" />
              Share with Team
            </Button>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Reports;