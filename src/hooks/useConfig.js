import { useState, useEffect } from 'react';

export default function useConfig() {
  const [config, setConfig] = useState(null);

  useEffect(() => {
    fetch('/config.json')
      .then(res => res.json())
      .then(setConfig)
      .catch(err => {
        console.error("Error cargando config.json", err);
      });
  }, []);

  return config;
}
