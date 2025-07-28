import { PublicClientApplication } from "@azure/msal-browser";

let msalInstance; // Variable para almacenar la instancia

export const initializeMSAL = async () => {
  const response = await fetch('/config.json');
  const { clientId, tenantId, redirectUri } = await response.json();
  
  msalInstance = new PublicClientApplication({
    auth: {
      clientId,
      authority: `https://login.microsoftonline.com/${tenantId}`,
      redirectUri
    },
    cache: {
      cacheLocation: "sessionStorage"
    }
  });
  
  return msalInstance;
};