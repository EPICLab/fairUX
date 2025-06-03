// controllers/personaController.ts
import { usePersonaStore } from '../models/personaStore';
import { Persona } from '../models/types';

class PersonaController {
  initializePersonas(): void {
    usePersonaStore.getState().initializePersonas();
  }

  selectPersona(id: string): void {
    usePersonaStore.getState().selectPersona(id);
  }

  updatePersonaBackground(id: string, background: string): void {
    usePersonaStore.getState().updatePersonaBackground(id, background);
  }

  getPersonas(): Persona[] {
    return usePersonaStore.getState().personas;
  }

  getSelectedPersona(): Persona | null {
    return usePersonaStore.getState().selectedPersona;
  }
}

export default new PersonaController();