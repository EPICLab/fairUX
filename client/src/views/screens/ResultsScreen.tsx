// views/screens/ResultsScreen.tsx
import React, { useEffect, useState } from 'react';
import Button from '../components/Button';
import HtmlReportViewer from '../components/HtmlReportViewer';
import navigationController from '../../controllers/navigationController';
import reportController from '../../controllers/reportController';
import { DownloadCloud, ArrowLeft, Home } from 'lucide-react';
import { Rule } from '../../models/types';

const ResultsScreen: React.FC = () => {
  const [isDownloading, setIsDownloading] = useState(false);
  const [rules, setRules] = useState<Rule[]>([]);
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  
  const report = reportController.getCurrentReport();
  const loading = reportController.isLoading();
  const error = reportController.getError();
  
  useEffect(() => {
    // If no report is available, go back to persona selection
    if (!report && !loading) {
      navigationController.goToPersonaDetails();
    }
  }, [report, loading]);

  useEffect(() => {
    // Fetch rules data for displaying rule names
    const fetchRules = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/rules');
        if (response.ok) {
          const rulesData = await response.json();
          setRules(rulesData);
        }
      } catch (error) {
        console.log('Could not fetch rules data:', error);
        // Continue without rules data - component will show rule IDs instead
      }
    };

    if (report) {
      fetchRules();
    }
  }, [report]);

  const handleDownloadPDF = async () => {
    if (report?.url) {
      setIsDownloading(true);
      try {
        // Create a temporary anchor element to trigger download
        const link = document.createElement('a');
        link.href = report.url;
        link.download = report.filename || 'inclusivity-report.pdf';
        link.target = '_blank';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      } catch (error) {
        console.error('Download failed:', error);
      } finally {
        setIsDownloading(false);
      }
    }
  };

  const handleBack = () => {
    setShowConfirmDialog(true);
  };

  const handleConfirmBack = () => {
    setShowConfirmDialog(false);
    window.location.href = "/";
  };

  const handleCancelBack = () => {
    setShowConfirmDialog(false);
  };

  const handleNewAnalysis = () => {
    // Clear current report and go back to upload
    reportController.clearReport();
    navigationController.goToUpload();
  };

  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-blue-600 border-solid mx-auto mb-4"></div>
          <h2 className="text-2xl font-medium">Generating inclusivity report...</h2>
          <p className="text-gray-600 mt-2">
            This may take a few moments. We're analyzing your designs for inclusivity issues.
          </p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="h-screen flex items-center justify-center bg-gray-50">
        <div className="max-w-md w-full mx-4">
          <div className="bg-red-50 p-6 rounded-lg border border-red-200">
            <h2 className="text-2xl font-medium text-red-700 mb-4">An error occurred</h2>
            <p className="text-red-600 mb-4">{error}</p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Button onClick={handleBack} className="flex-1">
                Back to Home
              </Button>
              <Button variant="outline" onClick={handleNewAnalysis} className="flex-1">
                Try New Analysis
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!report) {
    return null;
  }

  return (
    <div className="h-screen flex flex-col bg-white overflow-hidden">
      {/* Confirmation Dialog */}
      {showConfirmDialog && (
        <div className="fixed inset-0 bg-gray-900 bg-opacity-75 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full mx-4 p-6">
            <div className="flex items-center justify-center w-12 h-12 mx-auto bg-yellow-100 rounded-full mb-4">
              <svg className="w-6 h-6 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
              </svg>
            </div>
            
            <h3 className="text-lg font-medium text-gray-900 text-center mb-4">
              Go Back To Home?
            </h3>
            
            <p className="text-sm text-gray-500 text-center mb-6">
              Your generated bug report will be lost if you leave this page. Make sure to download the bug report PDF if you want to keep the results.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-3">
              <button
                onClick={handleCancelBack}
                className="flex-1 px-4 py-2 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg font-medium transition-colors"
              >
                Stay on Page
              </button>
              <button
                onClick={handleConfirmBack}
                className="flex-1 px-4 py-2 bg-red-600 text-white hover:bg-red-700 rounded-lg font-medium transition-colors"
              >
                Leave Anyway
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Top Action Bar - Fixed Header */}
      <div className="flex justify-between items-center p-4 bg-white border-b border-gray-200 shadow-sm z-10 flex-shrink-0">
        <button
          onClick={handleBack}
          className="flex items-center px-3 py-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-lg transition-colors"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          <span className="hidden sm:inline">Back to Home</span>
          <span className="sm:hidden">Back</span>
        </button>
        
        <button
          onClick={handleDownloadPDF}
          disabled={isDownloading}
          className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <DownloadCloud className="w-4 h-4 mr-2" />
          <span className="hidden sm:inline">
            {isDownloading ? 'Preparing...' : 'Download Report'}
          </span>
          <span className="sm:hidden">PDF</span>
        </button>
      </div>
      
      {/* Full-Screen Report Viewer */}
      <div className="flex-1 overflow-hidden">
        <HtmlReportViewer report={report} rules={rules} />
      </div>
    </div>
  );
};

export default ResultsScreen;