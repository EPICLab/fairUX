// controllers/navigationController.ts
import { NavigateFunction } from 'react-router-dom';

class NavigationController {
  private navigate: NavigateFunction | null = null;
  
  setNavigate(navigate: NavigateFunction): void {
    this.navigate = navigate;
  }
  
  goTo(path: string): void {
    if (this.navigate) {
      this.navigate(path);
    } else {
      console.error('Navigation function not set');
    }
  }
    
  goToUpload(): void {
    this.goTo('/upload');
  }
  
  goToPreview(): void {
    this.goTo('/preview');
  }
  
  goToSelectPersona(): void {
    this.goTo('/select-persona');
  }
  
  goToPersonaDetails(): void {
    this.goTo('/persona-details');
  }
  
  goToReview(): void {
    this.goTo('/review');
  }
  
  goToResults(): void {
    this.goTo('/results');
  }
}

export default new NavigationController();