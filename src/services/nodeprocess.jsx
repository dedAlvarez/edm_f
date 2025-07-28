import axios from "axios";
import config from "../../public/config.json"; // Asegurate de que la ruta sea correcta

const API_BASE_URL = import.meta.env.VITE_API_URL || "https://apiconsolaadmqa.vantrustcapital.cl";
const API_KEY = config.apiKeyPm2;

export async function getPm2Processes() {
  const response = await axios.get(`${API_BASE_URL}/api/nodeprocesses/pm2`, {
    headers: {
      "x-api-key": API_KEY,
    },
  });
  return response.data;
}

export async function restartPm2Process(name) {
  const response = await axios.post(
    `${API_BASE_URL}/api/nodeprocesses/pm2/restart/${name}`,
    null,
    {
      headers: {
        "x-api-key": API_KEY,
      },
    }
  );
  return response.data;
}

export async function stopPm2Process(name) {
  const response = await axios.post(
    `${API_BASE_URL}/api/nodeprocesses/pm2/stop/${name}`,
    null,
    {
      headers: {
        "x-api-key": API_KEY,
      },
    }
  );
  return response.data;
}

export async function logPm2Process(name) {
  const response = await axios.get(
    `${API_BASE_URL}/api/nodeprocesses/pm2/logs/${name}`,
    {
      headers: {
        "x-api-key": API_KEY,
      },
    }
  );
  return response.data;
}
