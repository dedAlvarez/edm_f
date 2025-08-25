import { useState, useEffect } from 'react';

export default function useConfig() {
  const [config, setConfig] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetch('/config.json')
      .then((res) => {
        if (!res.ok) {
          throw new Error(`HTTP error ${res.status}`);
        }
        return res.json();
      })
      .then(setConfig)
      .catch((err) => {
        console.error('Error cargando config.json', err);
        setError(err);
      });
  }, []);

  return config;
}
