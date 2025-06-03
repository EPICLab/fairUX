// models/personaStore.ts
import { create } from 'zustand';
import { Persona } from './types';

interface PersonaState {
  personas: Persona[];
  selectedPersona: Persona | null;
  selectPersona: (id: string) => void;
  updatePersonaBackground: (id: string, background: string) => void;
  initializePersonas: () => void;
}

export const usePersonaStore = create<PersonaState>((set, get) => ({
  personas: [],
  selectedPersona: null,
  
  selectPersona: (id: string) => {
    const persona = get().personas.find(p => p.id === id) || null;
    set({ selectedPersona: persona });
  },
  
  updatePersonaBackground: (id: string, background: string) => {
    set(state => ({
      personas: state.personas.map(p => 
        p.id === id ? { ...p, background } : p
      ),
      selectedPersona: state.selectedPersona?.id === id 
        ? { ...state.selectedPersona, background } 
        : state.selectedPersona
    }));
  },
  
  initializePersonas: () => set({
    personas: [
      {
        id: '1',
        name: 'Abi',
        avatar: '/assets/personas/abi.svg',
        descriptionItems: [
          {
            title: 'Motivations',
            highlight: ["to accomplish their tasks.", "already familiar and comfortable with, to keep their focus on the tasks they care about"],
            details: "Abi uses technologies to accomplish their tasks. They learn new technologies if and when they need to, but prefers to use methods they are already familiar and comfortable with, to keep their focus on the tasks they care about."
          },
          {
            title: 'Computer Self-Efficacy',
            highlight: ["lower self confidence than their peers about doing unfamiliar computing tasks", "blame themselves for these problems"],
            details: "Abi has lower self confidence than their peers about doing unfamiliar computing tasks. If problems arise with their technology, they often blame themselves for these problems. This affects whether and how they will persevere with a task if technology problems have arisen."
          },
          {
            title: 'Attitude toward Risk',
            highlight: ["rarely have spare time", "risk averse about using unfamiliar technologies that might need them to spend extra time on,"],
            details: "Abi's life is a little complicated and they rarely have spare time. They are risk averse about using unfamiliar technologies that might need them to spend extra time on, even if the new features might be relevant. They instead performs tasks using familiar features, because they're more predictable about what they will get from them and how much time they will take."
          },
          {
            title: 'Information Processing Style',
            highlight: ["gather information comprehensively to try to form a complete understanding of the problem before trying to solve it."],
            details: "Abi tends towards a comprehensive information processing style when they need to gather more information. So, instead of acting upon the first option that seems promising, they gather information comprehensively to try to form a complete understanding of the problem before trying to solve it. Thus, their style is 'burst-y'; first they read a lot, then they act on it in a batch of activity."
          },
          {
            title: 'Learning: by Process vs. by Tinkering',
            highlight: ["process-oriented learning", "They don't particularly like learning by tinkering with software"],
            details: "When learning new technology, Abi leans toward process-oriented learning, e.g., tutorials, step-by-step processes, wizards, online how-to videos, etc. They don't particularly like learning by tinkering with software (i.e., just trying out new features or commands to see what they do), but when they do tinker, it has positive effects on their understanding of the software."
          }
        ],
        background: "Abi is literate, but not tech-savvy. She is now trying to make her way into the digital world out of necessity. In her spare time, Abi likes to spend time in the puzzle section of the newspaper, especially sudoku puzzles and crosswords.",
        hasDisability: false
      },
      {
        id: '2',
        name: 'Tim',
        avatar: '/assets/personas/tim.svg',
        descriptionItems: [
          {
            title: 'Motivations',
            highlight: ["likes learning all the available functionality on all of their devices"],
            details: "Tim likes learning all the available functionality on all of their devices and computer systems they use, even when it may not be necessary to help them achieve their tasks. They sometimes find themselves exploring functions of one of their gadgets for so long that they lose sight of what they wanted to do with it to begin with."
          },
          {
            title: 'Computer Self-Efficacy',
            highlight: ["high confidence in their abilities with technology", "If they can't fix the problem, they blame it on the software vendor."],
            details: "Tim have high confidence in their abilities with technology, and thinks they're better than the average person at learning about new features. If they can't fix the problem, they blame it on the software vendor. It's not their fault if they can't get it to work."
          },
          {
            title: 'Attitude toward Risk',
            highlight: ["doesn't mind taking risks using features of technology"],
            details: "Tim doesn't mind taking risks using features of technology that haven't been proven to work. When they are presented with challenges because they have tried a new way that doesn't work, it doesn't change their attitude toward technology."
          },
          {
            title: 'Information Processing Style',
            highlight: ["delve into the first promising option", "if it doesn't work out they back out", "another option to try"],
            details: "Tim leans towards a selective information processing style or 'depth first' approach. That is, they usually delve into the first promising option, pursue it, and if it doesn't work out they back out and gather a bit more information until they see another option to try. Thus, their style is very incremental."
          },
          {
            title: 'Learning by Process vs. by Tinkering',
            highlight: ["like tinkering and exploring"],
            details: "Whenever Tim uses new technology, they try to construct their own understanding of how the software works internally. They like tinkering and exploring the menu items and functions of the software in order to build that understanding. Sometimes they play with features too much, losing focus on what they set out to do originally, but this helps them gain better understanding of the software."
          }
        ],
        background: "Tim is a technology enthusiast who keeps up with the latest tech trends. He is confident in learning new applications through exploration and doesn't mind taking risks. He works in IT and is an early adopter of new technologies.",
        hasDisability: false
      },
      // Other personas with their own unique sets of attributes...
    ]
  })

}));