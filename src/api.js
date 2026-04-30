export async function rechercherDemande(query) {
  const baseUrl = import.meta.env.VITE_API_BASE_URL || '';
  const response = await fetch(`${baseUrl}/api/recherche`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(query), // query est une chaîne ou un objet selon ton besoin
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