import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface CurriculumContextType {
  curriculum: string;
  selectedGrade: string;
  isInitialized: boolean;
  setCurriculum: (curriculum: string) => void;
  setSelectedGrade: (grade: string) => void;
}

const CurriculumContext = createContext<CurriculumContextType | undefined>(undefined);

export const CurriculumProvider = ({ children }: { children: ReactNode }) => {
  const [curriculum, setCurriculum] = useState<string>('');
  const [selectedGrade, setSelectedGrade] = useState<string>('9');
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    // Load curriculum and grade from localStorage
    const savedCurriculum = localStorage.getItem('curriculum');
    const savedGrade = localStorage.getItem('selectedGrade');
    
    if (savedCurriculum) setCurriculum(savedCurriculum);
    if (savedGrade) setSelectedGrade(savedGrade);
    
    setIsInitialized(true);
  }, []);

  // Save curriculum to localStorage when it changes
  useEffect(() => {
    if (curriculum) {
      localStorage.setItem('curriculum', curriculum);
    }
  }, [curriculum]);

  // Save selected grade to localStorage when it changes
  useEffect(() => {
    if (selectedGrade) {
      localStorage.setItem('selectedGrade', selectedGrade);
    }
  }, [selectedGrade]);

  return (
    <CurriculumContext.Provider value={{
      curriculum,
      selectedGrade,
      isInitialized,
      setCurriculum,
      setSelectedGrade,
    }}>
      {children}
    </CurriculumContext.Provider>
  );
};

export const useCurriculum = () => {
  const context = useContext(CurriculumContext);
  if (context === undefined) {
    throw new Error('useCurriculum must be used within a CurriculumProvider');
  }
  return context;
}; 