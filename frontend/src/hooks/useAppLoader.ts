import { useState, useEffect } from 'react';

export const useAppLoader = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [connectionSpeed, setConnectionSpeed] = useState('unknown');

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  return { isLoading, connectionSpeed };
};