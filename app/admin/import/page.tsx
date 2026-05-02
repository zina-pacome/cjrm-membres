'use client'

import { useState, useRef } from 'react'
import { supabase } from '../../../lib/supabase'
import * as XLSX from 'xlsx'
import { saveAs } from 'file-saver'

type Membre = {
  nom?: string
  prenom?: string
  lieu_naissance?: string
  date_naissance?: string
  numero_cin?: string
  date_delivrance_cin?: string
  nom_pere?: string
  profession_pere?: string
  nom_mere?: string
  profession_mere?: string
  telephone?: string
  email?: string
  [key: string]: string | undefined
}

export default function ImportExport() {
  const [importing, setImporting] = useState(false)
  const [exporting, setExporting] = useState(false)
  const [resultats, setResultats] = useState<{ succes: number; erreurs: number } | null>(null)
  const [message, setMessage] = useState<{ type: string; texte: string }>({ type: '', texte: '' })
  const fileRef = useRef<HTMLInputElement>(null)

  const exporterExcel = async () => {
    setExporting(true)
    const { data } = await supabase.from('membres').select('*').order('numero_membre')
    if (data) {
      const rows = data.map(m => ({
        'N° Membre': m.numero_membre,
        'Nom': m.nom,
        'Prénom': m.prenom,
        'Lieu de naissance': m.lieu_naissance,
        'Date de naissance': m.date_naissance,
        'Numéro CIN': m.numero_cin,
        'Date délivrance CIN': m.date_delivrance_cin,
        'Nom du père': m.nom_pere,
        'Profession du père': m.profession_pere,
        'Nom de la mère': m.nom_mere,
        'Profession de la mère': m.profession_mere,
        'Téléphone': m.telephone,
        'Email': m.email || '',
        'Statut': m.statut,
        'Date adhésion': m.date_adhesion,
      }))
      const ws = XLSX.utils.json_to_sheet(rows)
      const wb = XLSX.utils.book_new()
      XLSX.utils.book_append_sheet(wb, ws, 'Membres CJRM')
      const buf = XLSX.write(wb, { bookType: 'xlsx', type: 'array' })
      saveAs(new Blob([buf]), `membres-cjrm-${new Date().toISOString().split('T')[0]}.xlsx`)
    }
    setExporting(false)
  }

  const exporterCSV = async () => {
    setExporting(true)
    const { data } = await supabase.from('membres').select('*').order('numero_membre')
    if (data) {
      const rows = data.map(m => ({
        'N° Membre': m.numero_membre,
        'Nom': m.nom,
        'Prénom': m.prenom,
        'Lieu de naissance': m.lieu_naissance,
        'Date de naissance': m.date_naissance,
        'Numéro CIN': m.numero_cin,
        'Téléphone': m.telephone,
        'Email': m.email || '',
        'Statut': m.statut,
      }))
      const ws = XLSX.utils.json_to_sheet(rows)
      const csv = XLSX.utils.sheet_to_csv(ws)
      saveAs(new Blob([csv], { type: 'text/csv' }), `membres-cjrm-${new Date().toISOString().split('T')[0]}.csv`)
    }
    setExporting(false)
  }

  const telechargerModele = () => {
    const modele = [{
      nom: 'RAKOTO',
      prenom: 'Jean',
      lieu_naissance: 'Antananarivo',
      date_naissance: '2000-01-01',
      numero_cin: '101 234 567 890',
      date_delivrance_cin: '2020-01-01',
      nom_pere: 'RAKOTO Pierre',
      profession_pere: 'Agriculteur',
      nom_mere: 'RASOA Marie',
      profession_mere: 'Commerçante',
      telephone: '+261 34 00 000 00',
      email: 'jean@email.com',
    }]
    const ws = XLSX.utils.json_to_sheet(modele)
    const wb = XLSX.utils.book_new()
    XLSX.utils.book_append_sheet(wb, ws, 'Modèle')
    const buf = XLSX.write(wb, { bookType: 'xlsx', type: 'array' })
    saveAs(new Blob([buf]), 'modele-import-cjrm.xlsx')
  }

  const importerFichier = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    setImporting(true)
    setMessage({ type: '', texte: '' })
    setResultats(null)
    try {
      const buffer = await file.arrayBuffer()
      const wb = XLSX.read(buffer, { type: 'array' })
      const ws = wb.Sheets[wb.SheetNames[0]]
      const rows = XLSX.utils.sheet_to_json(ws) as Membre[]
      let succes = 0
      let erreurs = 0
      for (const row of rows) {
        const { error } = await supabase.from('membres').insert([{
          nom: row.nom ?? row['Nom'],
          prenom: row.prenom ?? row['Prénom'],
          lieu_naissance: row.lieu_naissance ?? row['Lieu de naissance'],
          date_naissance: row.date_naissance ?? row['Date de naissance'],
          numero_cin: row.numero_cin ?? row['Numéro CIN'],
          date_delivrance_cin: row.date_delivrance_cin ?? row['Date délivrance CIN'],
          nom_pere: row.nom_pere ?? row['Nom du père'],
          profession_pere: row.profession_pere ?? row['Profession du père'],
          nom_mere: row.nom_mere ?? row['Nom de la mère'],
          profession_mere: row.profession_mere ?? row['Profession de la mère'],
          telephone: row.telephone ?? row['Téléphone'],
          email: row.email ?? row['Email'] ?? null,
          qr_code_data: crypto.randomUUID(),
        }])
        if (error) erreurs++
        else succes++
      }
      setResultats({ succes, erreurs })
      setMessage({
        type: 'succes',
        texte: `Import terminé : ${succes} membre(s) ajouté(s)${erreurs > 0 ? `, ${erreurs} erreur(s)` : ''}.`,
      })
    } catch (err: unknown) {
      const error = err as Error
      setMessage({ type: 'erreur', texte: "Erreur lors de l'import : " + error.message })
    } finally {
      setImporting(false)
      if (fileRef.current) fileRef.current.value = ''
    }
  }

  const card: React.CSSProperties = {
    background: '#ffffff', borderRadius: '24px',
    border: '1px solid #f2f2f2', padding: '28px', marginBottom: '20px',
  }

  const sectionTitle: React.CSSProperties = {
    fontSize: '16px', fontWeight: '700', color: '#1f1f1f', marginBottom: '6px',
  }

  const sectionDesc: React.CSSProperties = {
    fontSize: '13px', color: '#828282', marginBottom: '20px',
  }

  const btnPrimary: React.CSSProperties = {
    display: 'inline-flex', alignItems: 'center', gap: '8px',
    background: '#333333', color: '#ffffff', border: 'none',
    borderRadius: '12px', padding: '11px 20px',
    fontSize: '13px', fontWeight: '600', cursor: 'pointer',
    fontFamily: 'var(--font-montserrat), Segoe UI, sans-serif',
  }

  const btnSecondary: React.CSSProperties = {
    display: 'inline-flex', alignItems: 'center', gap: '8px',
    background: '#f9f9f9', color: '#333', border: '1px solid #f2f2f2',
    borderRadius: '12px', padding: '11px 20px',
    fontSize: '13px', fontWeight: '600', cursor: 'pointer',
    fontFamily: 'var(--font-montserrat), Segoe UI, sans-serif',
  }

  return (
    <div style={{ maxWidth: '800px' }}>

      {/* Header */}
      <div style={{ marginBottom: '28px' }}>
        <div style={{ fontSize: '22px', fontWeight: '700', color: '#1f1f1f' }}>Import / Export</div>
        <div style={{ fontSize: '13px', color: '#828282', marginTop: '2px' }}>
          Gérez vos données membres en masse
        </div>
      </div>

      {/* Export */}
      <div style={card}>
        <div style={sectionTitle}>Exporter les membres</div>
        <div style={sectionDesc}>
          Téléchargez la liste complète des membres en Excel ou CSV.
        </div>
        <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
          <button onClick={exporterExcel} disabled={exporting} style={btnPrimary}>
            <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
              <polyline points="7 10 12 15 17 10"/>
              <line x1="12" y1="15" x2="12" y2="3"/>
            </svg>
            {exporting ? 'Export...' : 'Exporter Excel (.xlsx)'}
          </button>
          <button onClick={exporterCSV} disabled={exporting} style={btnSecondary}>
            <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
              <polyline points="7 10 12 15 17 10"/>
              <line x1="12" y1="15" x2="12" y2="3"/>
            </svg>
            Exporter CSV
          </button>
        </div>
      </div>

      {/* Import */}
      <div style={card}>
        <div style={sectionTitle}>Importer des membres</div>
        <div style={sectionDesc}>
          Ajoutez plusieurs membres à la fois via un fichier Excel.
          Téléchargez d'abord le modèle pour respecter le bon format.
        </div>

        {/* Étapes */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '12px', marginBottom: '24px' }}>
          {[
            { num: '1', titre: 'Télécharger le modèle', desc: 'Utilisez notre template Excel' },
            { num: '2', titre: 'Remplir les données', desc: 'Une ligne par membre' },
            { num: '3', titre: 'Importer le fichier', desc: 'Upload et validation auto' },
          ].map(e => (
            <div key={e.num} style={{
              background: '#f9f9f9', borderRadius: '14px', padding: '16px',
              border: '1px solid #f2f2f2',
            }}>
              <div style={{
                width: '28px', height: '28px', borderRadius: '8px',
                background: '#333', color: '#fff', fontWeight: '700',
                fontSize: '13px', display: 'flex', alignItems: 'center',
                justifyContent: 'center', marginBottom: '10px',
              }}>{e.num}</div>
              <div style={{ fontSize: '13px', fontWeight: '600', color: '#333', marginBottom: '4px' }}>{e.titre}</div>
              <div style={{ fontSize: '11px', color: '#828282' }}>{e.desc}</div>
            </div>
          ))}
        </div>

        <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
          <button onClick={telechargerModele} style={btnSecondary}>
            <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
              <polyline points="14 2 14 8 20 8"/>
            </svg>
            Télécharger le modèle
          </button>
          <label style={{ ...btnPrimary, opacity: importing ? 0.6 : 1 }}>
            <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
              <polyline points="17 8 12 3 7 8"/>
              <line x1="12" y1="3" x2="12" y2="15"/>
            </svg>
            {importing ? 'Import en cours...' : 'Importer un fichier Excel'}
            <input
              ref={fileRef}
              type="file"
              accept=".xlsx,.xls,.csv"
              onChange={importerFichier}
              style={{ display: 'none' }}
            />
          </label>
        </div>
      </div>

      {/* Message */}
      {message.texte && (
        <div style={{
          padding: '16px 20px', borderRadius: '14px',
          background: message.type === 'succes' ? '#dfeedb' : '#fee2e2',
          border: `1px solid ${message.type === 'succes' ? '#a6d997' : '#fca5a5'}`,
          color: message.type === 'succes' ? '#89b27c' : '#eb5757',
          fontSize: '14px', fontWeight: '600', marginBottom: '16px',
          display: 'flex', alignItems: 'center', gap: '10px',
        }}>
          <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
            {message.type === 'succes'
              ? <polyline points="20 6 9 17 4 12"/>
              : <><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></>
            }
          </svg>
          {message.texte}
        </div>
      )}

      {/* Résultats */}
      {resultats && (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
          <div style={{ ...card, marginBottom: 0, textAlign: 'center', borderTop: '3px solid #89b27c' }}>
            <div style={{ fontSize: '36px', fontWeight: '700', color: '#89b27c' }}>{resultats.succes}</div>
            <div style={{ fontSize: '13px', color: '#828282', marginTop: '4px' }}>Membre(s) ajouté(s)</div>
          </div>
          <div style={{ ...card, marginBottom: 0, textAlign: 'center', borderTop: '3px solid #eb5757' }}>
            <div style={{ fontSize: '36px', fontWeight: '700', color: '#eb5757' }}>{resultats.erreurs}</div>
            <div style={{ fontSize: '13px', color: '#828282', marginTop: '4px' }}>Erreur(s)</div>
          </div>
        </div>
      )}

    </div>
  )
}