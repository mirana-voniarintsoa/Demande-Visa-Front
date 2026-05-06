function logApiRequest(label, url, options) {
  console.info(`[API] ${label}`, {
    url,
    method: options?.method,
    headers: options?.headers,
    body: options?.body,
  });
}

export async function rechercherDemande(query) {
  const baseUrl = import.meta.env.VITE_API_BASE_URL || '';
  const url = `${baseUrl}/api/recherche`;
  const options = {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(query), // query est une chaîne ou un objet selon ton besoin
  };

  logApiRequest('Appel de recherche demande', url, options);

  const response = await fetch(url, options);

  console.info('[API] Réponse recherche demande', {
    url,
    status: response.status,
    ok: response.ok,
  });

  if (!response.ok) {
    let message = '';
    try {
      const maybeJson = await response.json();
      if (maybeJson && typeof maybeJson.message === 'string') {
        message = maybeJson.message;
      }
    } catch {
      message = await response.text().catch(() => '');
    }
    throw new Error(message || `HTTP ${response.status}`);
  }
  return response.json();
}

export async function getHistoriqueStatuts(demandeId) {
  const baseUrl = import.meta.env.VITE_API_BASE_URL || '';
  const url = `${baseUrl}/api/demandes/${encodeURIComponent(demandeId)}/statuts`;
  const options = {
    method: 'GET',
    headers: { 'Accept': 'application/json' },
  };

  logApiRequest('Appel historique statuts', url, options);

  const response = await fetch(url, options);

  console.info('[API] Réponse historique statuts', {
    url,
    status: response.status,
    ok: response.ok,
  });

  if (!response.ok) {
    let message = '';
    try {
      const maybeJson = await response.json();
      if (maybeJson && typeof maybeJson.message === 'string') {
        message = maybeJson.message;
      }
    } catch {
      message = await response.text().catch(() => '');
    }
    throw new Error(message || `HTTP ${response.status}`);
  }
  return response.json();
}