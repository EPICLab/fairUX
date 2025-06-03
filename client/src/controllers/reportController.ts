// controllers/reportController.ts
import { useReportStore } from '../models/reportStore';
import { useImageStore } from '../models/imageStore';
import { usePersonaStore } from '../models/personaStore';
import { Report } from '../models/types';

class ReportController {
  async generateReport(): Promise<Report | null> {
    try {
      const reportStore = useReportStore.getState();
      const images = useImageStore.getState().images;
      const selectedPersona = usePersonaStore.getState().selectedPersona;
      
      if (!selectedPersona) {
        throw new Error('No persona selected');
      }
      
      if (images.length === 0) {
        throw new Error('No images to analyze');
      }
      
      reportStore.setLoading(true);
      reportStore.setError(null);
      
      // Create FormData to send images and persona info
      const formData = new FormData();
      
      // Add all images to the form data
      images.forEach(image => {
        if (image.file) {
          formData.append('images', image.file);
        }
      });
      
      // Add persona information
      formData.append('persona', JSON.stringify({
        name: selectedPersona.name,
        background: selectedPersona.background
      }));
      
      // Call the backend API
      const response = await fetch('http://localhost:5000/api/analyze', {
        method: 'POST',
        body: formData
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to generate report');
      }
      
      const data = await response.json();
      
      // Create a report object
      const report: Report = {
        id: data.report_id,
        filename: data.report_filename,
        url: `http://localhost:5000/api/reports/${data.report_id}`,
        createdAt: new Date(),
        results: data.analysis_results || []
      };
      
      reportStore.setCurrentReport(report);
      return report;
      
    } catch (error) {
      useReportStore.getState().setError((error as Error).message);
      return null;
    } finally {
      useReportStore.getState().setLoading(false);
    }
  }
  
  getCurrentReport(): Report | null {
    return useReportStore.getState().currentReport;
  }
  
  isLoading(): boolean {
    return useReportStore.getState().loading;
  }
  
  getError(): string | null {
    return useReportStore.getState().error;
  }
  
  clearReport(): void {
    useReportStore.getState().clearReport();
  }
}

export default new ReportController();