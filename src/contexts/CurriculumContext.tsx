import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface CurriculumContextType {
  curriculum: string;
  level: string;
  grade: string;
  isInitialized: boolean;
  setCurriculum: (curriculum: string) => void;
  setLevel: (level: string) => void;
  setGrade: (grade: string) => void;
}

const CurriculumContext = createContext<CurriculumContextType | undefined>(undefined);

export const CurriculumProvider = ({ children }: { children: ReactNode }) => {
  const [curriculum, setCurriculum] = useState<string>('');
  const [level, setLevel] = useState<string>('');
  const [grade, setGrade] = useState<string>('');
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    // Load values from localStorage
    const savedCurriculum = localStorage.getItem('curriculum');
    const savedLevel = localStorage.getItem('level');
    const savedGrade = localStorage.getItem('grade');
    
    if (savedCurriculum) setCurriculum(savedCurriculum);
    if (savedLevel) setLevel(savedLevel);
    if (savedGrade) setGrade(savedGrade);
    
    setIsInitialized(true);
  }, []);

  // Save values to localStorage when they change
  useEffect(() => {
    if (curriculum) {
      localStorage.setItem('curriculum', curriculum);
    }
  }, [curriculum]);

  useEffect(() => {
    if (level) {
      localStorage.setItem('level', level);
    }
  }, [level]);

  useEffect(() => {
    if (grade) {
      localStorage.setItem('grade', grade);
    }
  }, [grade]);

  return (
    <CurriculumContext.Provider value={{
      curriculum,
      level,
      grade,
      isInitialized,
      setCurriculum,
      setLevel,
      setGrade,
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