'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '../../../lib/supabase'
import { v4 as uuidv4 } from 'uuid'
import Link from 'next/link'

export default function NouveauMembre() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [photo, setPhoto] = useState<File | null>(null)
  const [photoPreview, setPhotoPreview] = useState<string | null>(null)
  const [message, setMessage] = useState<{ type: string; texte: string }>({ type: '', texte: '' })

  const [form, setForm] = useState({
    nom: '', prenom: '', lieu_naissance: '', date_naissance: '',
    numero_cin: '', date_delivrance_cin: '',
    nom_pere: '', profession_pere: '', nom_mere: '', profession_mere: '',
    email: '', telephone: '', poste: '',
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) =>
    setForm({ ...form, [e.target.name]: e.target.value })

  const handlePhoto = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) { setPhoto(file); setPhotoPreview(URL.createObjectURL(file)) }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setMessage({ type: '', texte: '' })
    try {
      const qrData = uuidv4()
      let photoUrl = null
      if (photo) {
        const ext = photo.name.split('.').pop()
        const { error: uploadError } = await supabase.storage
          .from('photos-membres').upload(`${qrData}.${ext}`, photo)
        if (uploadError) throw uploadError
        const { data: urlData } = supabase.storage
          .from('photos-membres').getPublicUrl(`${qrData}.${ext}`)
        photoUrl = urlData.publicUrl
      }
      const { data, error } = await supabase.from('membres')
        .insert([{ ...form, photo_url: photoUrl, qr_code_data: qrData }])
        .select().single()
      if (error) throw error
      setMessage({ type: 'succes', texte: 'Membre ajouté avec succès !' })
      setTimeout(() => router.push(`/membre/${data.id}`), 1500)
    } catch (err: unknown) {
      const error = err as Error
      setMessage({ type: 'erreur', texte: 'Erreur : ' + error.message })
    } finally {
      setLoading(false)
    }
  }

  const card: React.CSSProperties = {
    background: '#ffffff', borderRadius: '24px',
    border: '1px solid #f2f2f2', padding: '28px', marginBottom: '20px',
  }

  const inputStyle: React.CSSProperties = {
    width: '100%', border: '1px solid #f2f2f2', borderRadius: '12px',
    padding: '12px 16px', fontSize: '14px', color: '#333', outline: 'none',
    fontFamily: 'var(--font-montserrat), Segoe UI, sans-serif',
    background: '#fcfcfc', boxSizing: 'border-box',
  }

  const labelStyle: React.CSSProperties = {
    display: 'block', fontSize: '12px', fontWeight: '600',
    color: '#828282', marginBottom: '6px', letterSpacing: '0.3px',
  }

  const sectionTitle: React.CSSProperties = {
    fontSize: '14px', fontWeight: '700', color: '#333',
    marginBottom: '20px', paddingBottom: '12px',
    borderBottom: '1px solid #f2f2f2',
  }

  const grid2: React.CSSProperties = {
    display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px',
  }

  return (
    <div style={{ maxWidth: '800px' }}>

      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '28px' }}>
        <div>
          <div style={{ fontSize: '22px', fontWeight: '700', color: '#1f1f1f' }}>Nouveau membre</div>
          <div style={{ fontSize: '13px', color: '#828282', marginTop: '2px' }}>
            Remplissez tous les champs obligatoires
          </div>
        </div>
        <Link href="/admin/membres" style={{
          display: 'flex', alignItems: 'center', gap: '6px',
          background: '#f9f9f9', border: '1px solid #f2f2f2',
          borderRadius: '20px', padding: '8px 16px',
          fontSize: '13px', fontWeight: '600', color: '#828282', textDecoration: 'none',
        }}>
          ← Retour
        </Link>
      </div>

      <form onSubmit={handleSubmit}>

        {/* Photo */}
        <div style={card}>
          <div style={sectionTitle}>Photo du membre</div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '24px' }}>
            <div style={{
              width: '96px', height: '96px', borderRadius: '20px',
              background: '#f9f9f9', border: '1px solid #f2f2f2',
              overflow: 'hidden', flexShrink: 0,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              {photoPreview
                ? <img src={photoPreview} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                : <svg width="32" height="32" fill="none" stroke="#bdbdbd" strokeWidth="1.5" viewBox="0 0 24 24">
                    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
                    <circle cx="12" cy="7" r="4"/>
                  </svg>
              }
            </div>
            <div>
              <label style={{
                display: 'inline-flex', alignItems: 'center', gap: '8px',
                background: '#333', color: '#fff', borderRadius: '12px',
                padding: '10px 20px', fontSize: '13px', fontWeight: '600',
                cursor: 'pointer',
              }}>
                <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
                  <polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/>
                </svg>
                Choisir une photo
                <input type="file" accept="image/*" onChange={handlePhoto} style={{ display: 'none' }} />
              </label>
              <div style={{ fontSize: '12px', color: '#bdbdbd', marginTop: '8px' }}>
                JPG, PNG — max 5 Mo
              </div>
            </div>
          </div>
        </div>

        {/* Identité */}
        <div style={card}>
          <div style={sectionTitle}>Identité</div>
          <div style={{ ...grid2, marginBottom: '16px' }}>
            <div>
              <label style={labelStyle}>Nom <span style={{ color: '#eb5757' }}>*</span></label>
              <input name="nom" value={form.nom} onChange={handleChange} required
                style={inputStyle} placeholder="Ex: RAKOTO" />
            </div>
            <div>
              <label style={labelStyle}>Prénom <span style={{ color: '#eb5757' }}>*</span></label>
              <input name="prenom" value={form.prenom} onChange={handleChange} required
                style={inputStyle} placeholder="Ex: Jean" />
            </div>
            <div>
              <label style={labelStyle}>Lieu de naissance <span style={{ color: '#eb5757' }}>*</span></label>
              <input name="lieu_naissance" value={form.lieu_naissance} onChange={handleChange} required
                style={inputStyle} placeholder="Ex: Antananarivo" />
            </div>
            <div>
              <label style={labelStyle}>Date de naissance <span style={{ color: '#eb5757' }}>*</span></label>
              <input type="date" name="date_naissance" value={form.date_naissance} onChange={handleChange} required
                style={inputStyle} />
            </div>
          </div>
        </div>

        {/* CIN */}
        <div style={card}>
          <div style={sectionTitle}>Carte d'Identité Nationale</div>
          <div style={grid2}>
            <div>
              <label style={labelStyle}>Numéro CIN <span style={{ color: '#eb5757' }}>*</span></label>
              <input name="numero_cin" value={form.numero_cin} onChange={handleChange} required
                style={inputStyle} placeholder="Ex: 101 234 567 890" />
            </div>
            <div>
              <label style={labelStyle}>Date de délivrance <span style={{ color: '#eb5757' }}>*</span></label>
              <input type="date" name="date_delivrance_cin" value={form.date_delivrance_cin} onChange={handleChange} required
                style={inputStyle} />
            </div>
          </div>
        </div>

        {/* Parents */}
        <div style={card}>
          <div style={sectionTitle}>Parents</div>
          <div style={{ ...grid2 }}>
            <div style={{ marginBottom: '16px' }}>
              <label style={labelStyle}>Nom du père <span style={{ color: '#eb5757' }}>*</span></label>
              <input name="nom_pere" value={form.nom_pere} onChange={handleChange} required
                style={inputStyle} placeholder="Nom complet du père" />
            </div>
            <div style={{ marginBottom: '16px' }}>
              <label style={labelStyle}>Profession du père <span style={{ color: '#eb5757' }}>*</span></label>
              <input name="profession_pere" value={form.profession_pere} onChange={handleChange} required
                style={inputStyle} placeholder="Ex: Agriculteur" />
            </div>
            <div>
              <label style={labelStyle}>Nom de la mère <span style={{ color: '#eb5757' }}>*</span></label>
              <input name="nom_mere" value={form.nom_mere} onChange={handleChange} required
                style={inputStyle} placeholder="Nom complet de la mère" />
            </div>
            <div>
              <label style={labelStyle}>Profession de la mère <span style={{ color: '#eb5757' }}>*</span></label>
              <input name="profession_mere" value={form.profession_mere} onChange={handleChange} required
                style={inputStyle} placeholder="Ex: Commerçante" />
            </div>
          </div>
        </div>

        {/* Contact */}
        <div style={card}>
          <div style={sectionTitle}>Contact & Poste</div>
          <div style={grid2}>
            <div>
              <label style={labelStyle}>Téléphone <span style={{ color: '#eb5757' }}>*</span></label>
              <input name="telephone" value={form.telephone} onChange={handleChange} required
                style={inputStyle} placeholder="+261 34 00 000 00" />
            </div>
            <div>
              <label style={labelStyle}>
                Email <span style={{ color: '#bdbdbd', fontWeight: '400' }}>(facultatif)</span>
              </label>
              <input type="email" name="email" value={form.email} onChange={handleChange}
                style={inputStyle} placeholder="jean@email.com" />
            </div>
            <div style={{ gridColumn: '1 / -1' }}>
              <label style={labelStyle}>Poste au sein de l'association <span style={{ color: '#eb5757' }}>*</span></label>
              <input name="poste" value={form.poste} onChange={handleChange} required
                style={inputStyle} placeholder="Ex: Président, Secrétaire, Trésorier, Membre..." />
            </div>
          </div>
        </div>

        {/* Message */}
        {message.texte && (
          <div style={{
            padding: '14px 20px', borderRadius: '14px', fontSize: '14px',
            fontWeight: '600', marginBottom: '16px',
            background: message.type === 'succes' ? '#dfeedb' : '#fee2e2',
            color: message.type === 'succes' ? '#89b27c' : '#eb5757',
            border: `1px solid ${message.type === 'succes' ? '#a6d997' : '#fca5a5'}`,
          }}>
            {message.type === 'succes' ? '✓' : '✕'} {message.texte}
          </div>
        )}

        {/* Bouton */}
        <button type="submit" disabled={loading} style={{
          width: '100%', background: loading ? '#bdbdbd' : '#333333',
          color: '#ffffff', border: 'none', borderRadius: '16px',
          padding: '16px', fontSize: '15px', fontWeight: '700',
          cursor: loading ? 'not-allowed' : 'pointer',
          fontFamily: 'var(--font-montserrat), Segoe UI, sans-serif',
          transition: 'background 0.2s',
        }}>
          {loading ? 'Enregistrement...' : 'Enregistrer le membre'}
        </button>

      </form>
    </div>
  )
}