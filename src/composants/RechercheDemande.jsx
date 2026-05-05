import React, { useCallback, useEffect, useState } from 'react';
import { rechercherDemande } from '../api'; 
function RechercheDemande() {
  const [inputValue, setInputValue] = useState('');
  const [type, setType] = useState('passeport');
  const [result, setResult] = useState(null);
  const [error, setError] = useState('');

  const handleInputChange = (e) => {
    setInputValue(e.target.value);
  };

  const handleTypeChange = (e) => {
    setType(e.target.value);
    setInputValue('');
  };

  const runSearch = useCallback(async (data) => {
    setError('');
    setResult(null);
    try {
      const res = await rechercherDemande(data);
      setResult(res);
    } catch (err) {
      console.error(err);
      setError(err?.message || "Erreur lors de l'envoi vers le serveur.");
    }
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const data = {
      passeport: type === 'passeport' ? inputValue : null,
      demande: type === 'demande' ? inputValue : null,
    };
    await runSearch(data);
  };

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const passeport = params.get('passeport');
    const demande = params.get('demande');

    if (passeport) {
      setType('passeport');
      setInputValue(passeport);
      runSearch({ passeport, demande: null });
      return;
    }
    if (demande) {
      setType('demande');
      setInputValue(demande);
      runSearch({ passeport: null, demande });
    }
  }, [runSearch]);
  

  return (
    <div className="recherche-demande-container" style={{ maxWidth: 520, margin: '40px auto', padding: 24, boxShadow: '0 2px 8px #eee', borderRadius: 8 }}>
      <h2>Rechercher une demande</h2>
      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: 16 }}>
          <label>
            <input
              type="radio"
              value="passeport"
              checked={type === 'passeport'}
              onChange={handleTypeChange}
            />{' '}
            Numéro de Passeport
          </label>
          <label style={{ marginLeft: 16 }}>
            <input
              type="radio"
              value="demande"
              checked={type === 'demande'}
              onChange={handleTypeChange}
            />{' '}
            Numéro de Demande
          </label>
        </div>
        <input
          type="text"
          placeholder={type === 'passeport' ? 'Numéro de passeport' : 'Numéro de demande'}
          value={inputValue}
          onChange={handleInputChange}
          style={{ width: '100%', padding: 8, marginBottom: 16, borderRadius: 4, border: '1px solid #ccc' }}
          required
        />
        <button type="submit" style={{ width: '100%', padding: 10, borderRadius: 4, background: '#1976d2', color: '#fff', border: 'none', fontWeight: 'bold' }}>
          Rechercher
        </button>
      </form>

      {error ? (
        <div style={{ marginTop: 16, padding: 12, borderRadius: 6, background: '#fff1f2', border: '1px solid #fecdd3', color: '#881337' }}>
          {error}
        </div>
      ) : null}

      {result ? (
        <div style={{ marginTop: 16, padding: 12, borderRadius: 6, background: '#f8fafc', border: '1px solid #e2e8f0' }}>
          <div style={{ fontWeight: 700, marginBottom: 8 }}>Dernières informations</div>
          <div><strong>N° demande</strong> : {result.demandeId}</div>
          <div><strong>Passeport</strong> : {result.passeportNumero}</div>
          <div><strong>Demandeur</strong> : {result.demandeur}</div>
          <div><strong>Type visa</strong> : {result.typeVisa}</div>
          <div><strong>Statut</strong> : {result.statut}</div>
        </div>
      ) : null}
    </div>
  );
}

export default RechercheDemande;
