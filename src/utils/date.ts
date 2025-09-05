import { format, parseISO, isValid } from 'date-fns';

export const formatDate = (date: string | Date): string => {
  try {
    let dateObj: Date;
    
    // Se já é um objeto Date
    if (date instanceof Date) {
      dateObj = date;
    } 
    // Se é uma string ISO
    else if (typeof date === 'string') {
      // Tenta fazer parse da string ISO
      dateObj = parseISO(date);
      
      // Se não conseguiu fazer parse, tenta criar Date diretamente
      if (!isValid(dateObj)) {
        dateObj = new Date(date);
      }
    }
    // Fallback para outros tipos
    else {
      dateObj = new Date(date);
    }
    
    // Verifica se a data é válida
    if (!isValid(dateObj)) {
      return '';
    }
    
    // Formata para HH:mm DD/MM/YYYY
    return format(dateObj, 'dd/MM/yyyy, HH:mm');
  } catch (error) {
    return '';
  }
};