import { useState, useEffect, type FormEvent, type KeyboardEvent } from 'react';
import { useAuth } from '../context/AuthContext';
import { getProfile, saveProfile, getProfileCompletion } from '../services/profileService';
import type { Profile } from '../types';

const YEAR_OPTIONS = ['1st Year', '2nd Year', '3rd Year', '4th Year', '5th Year', 'Postgraduate Year 1', 'Postgraduate Year 2', 'PhD Student'];
const AREA_OPTIONS = ['Web Development', 'Mobile Development', 'Machine Learning / AI', 'Data Science', 'Cloud Computing', 'Cybersecurity', 'DevOps / SRE', 'Blockchain / Web3', 'Product Management', 'UX / UI Design', 'Embedded Systems', 'Game Development', 'Computer Vision', 'NLP / Conversational AI', 'Fintech'];

function TagInput({ label, tags, onAdd, onRemove, placeholder, disabled }: {
  label: string;
  tags: string[];
  onAdd: (tag: string) => void;
  onRemove: (tag: string) => void;
  placeholder?: string;
  disabled?: boolean;
}) {
  const [input, setInput] = useState('');

  const handleAdd = () => {
    const val = input.trim();
    if (val && !tags.includes(val)) {
      onAdd(val);
      setInput('');
    }
  };

  const handleKey = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault();
      handleAdd();
    }
  };

  return (
    <div>
      <label className="form-label">{label}</label>
      <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '0.625rem' }}>
        <input
          type="text"
          className="input-field"
          placeholder={placeholder || `Add ${label.toLowerCase()} and press Enter`}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKey}
          disabled={disabled}
          style={{ flex: 1 }}
        />
        <button
          type="button"
          onClick={handleAdd}
          disabled={disabled || !input.trim()}
          className="btn-secondary"
          style={{ flexShrink: 0, padding: '0.625rem 1rem' }}
        >
          Add
        </button>
      </div>
      {tags.length > 0 && (
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.375rem' }}>
          {tags.map((tag) => (
            <span
              key={tag}
              className="tag"
              style={{ cursor: 'pointer', userSelect: 'none' }}
              onClick={() => !disabled && onRemove(tag)}
              title="Click to remove"
            >
              {tag}
              {!disabled && <span style={{ marginLeft: '0.375rem', opacity: 0.6, fontSize: '0.75rem' }}>✕</span>}
            </span>
          ))}
        </div>
      )}
    </div>
  );
}

function MultiSelect({ label, options, selected, onChange, disabled }: {
  label: string;
  options: string[];
  selected: string[];
  onChange: (val: string[]) => void;
  disabled?: boolean;
}) {
  const toggle = (opt: string) => {
    if (disabled) return;
    onChange(selected.includes(opt) ? selected.filter((s) => s !== opt) : [...selected, opt]);
  };
  return (
    <div>
      <label className="form-label">{label}</label>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
        {options.map((opt) => {
          const active = selected.includes(opt);
          return (
            <button
              key={opt}
              type="button"
              onClick={() => toggle(opt)}
              disabled={disabled}
              style={{
                background: active ? 'rgba(99,102,241,0.18)' : 'rgba(255,255,255,0.03)',
                border: `1px solid ${active ? 'rgba(99,102,241,0.45)' : 'rgba(255,255,255,0.07)'}`,
                borderRadius: 100,
                padding: '0.375rem 0.875rem',
                fontSize: '0.8125rem',
                color: active ? '#818CF8' : '#64748B',
                cursor: 'pointer',
                transition: 'all 0.15s ease',
                fontFamily: "'Outfit', sans-serif",
              }}
            >
              {active && <span style={{ marginRight: '0.25rem' }}>✓</span>}{opt}
            </button>
          );
        })}
      </div>
    </div>
  );
}

export default function ProfilePage() {
  const { user } = useAuth();
  const [form, setForm] = useState<Omit<Profile, 'userId' | 'updatedAt'>>({
    name: '',
    degree: '',
    year: '',
    academicBackground: '',
    skills: [],
    interests: [],
    careerGoals: '',
    preferredAreas: [],
  });
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [completion, setCompletion] = useState(0);

  useEffect(() => {
    if (!user) return;
    const existing = getProfile(user.id);
    if (existing) {
      const { userId: _uid, updatedAt: _upd, ...rest } = existing;
      setForm(rest);
      setCompletion(getProfileCompletion(existing));
    } else {
      setForm((f) => ({ ...f, name: user.name }));
    }
  }, [user]);

  useEffect(() => {
    if (!user) return;
    const mock = { ...form, userId: user.id, updatedAt: '' };
    setCompletion(getProfileCompletion(mock));
  }, [form, user]);

  const set = <K extends keyof typeof form>(key: K, val: (typeof form)[K]) => {
    setForm((f) => ({ ...f, [key]: val }));
    setSaved(false);
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!user) return;
    setSaving(true);
    await new Promise((r) => setTimeout(r, 400));
    saveProfile({ ...form, userId: user.id, updatedAt: '' });
    setSaving(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <div className="mesh-bg" style={{ minHeight: '100vh', padding: '2rem 1.5rem' }}>
      <div style={{ maxWidth: 860, margin: '0 auto' }}>
        {/* Header */}
        <div style={{ marginBottom: '2rem' }}>
          <p style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '0.8rem', color: '#6366F1', letterSpacing: '0.08em', textTransform: 'uppercase', margin: '0 0 0.5rem' }}>
            Your Profile
          </p>
          <h1 style={{ fontSize: '2rem', fontWeight: 800, color: '#E8EAF6', margin: '0 0 0.75rem', letterSpacing: '-0.02em' }}>
            Build your career profile
          </h1>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', flexWrap: 'wrap' }}>
            <div style={{ flex: 1, minWidth: 200 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.375rem' }}>
                <span style={{ fontSize: '0.8125rem', color: '#475569' }}>Profile completion</span>
                <span style={{ fontSize: '0.8125rem', color: '#818CF8', fontFamily: "'JetBrains Mono', monospace" }}>{completion}%</span>
              </div>
              <div className="progress-bar">
                <div className="progress-fill" style={{ width: `${completion}%` }} />
              </div>
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>

            {/* Basic info */}
            <div className="card">
              <h2 style={{ fontSize: '1rem', fontWeight: 700, color: '#E8EAF6', margin: '0 0 1.5rem' }}>Basic information</h2>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.25rem' }}>
                <div style={{ gridColumn: 'span 2' }}>
                  <label className="form-label">Full name</label>
                  <input className="input-field" value={form.name} onChange={(e) => set('name', e.target.value)} placeholder="Your full name" />
                </div>
                <div>
                  <label className="form-label">Degree / Course</label>
                  <input className="input-field" value={form.degree} onChange={(e) => set('degree', e.target.value)} placeholder="e.g., B.Tech Computer Science" />
                </div>
                <div>
                  <label className="form-label">Current year / semester</label>
                  <select
                    className="input-field"
                    value={form.year}
                    onChange={(e) => set('year', e.target.value)}
                    style={{ cursor: 'pointer' }}
                  >
                    <option value="">Select year</option>
                    {YEAR_OPTIONS.map((y) => <option key={y} value={y}>{y}</option>)}
                  </select>
                </div>
                <div style={{ gridColumn: 'span 2' }}>
                  <label className="form-label">Academic background</label>
                  <textarea
                    className="input-field"
                    value={form.academicBackground}
                    onChange={(e) => set('academicBackground', e.target.value)}
                    placeholder="Briefly describe your academic background, notable courses, projects, GPA, etc."
                    rows={3}
                    style={{ resize: 'vertical' }}
                  />
                </div>
              </div>
            </div>

            {/* Skills & Interests */}
            <div className="card">
              <h2 style={{ fontSize: '1rem', fontWeight: 700, color: '#E8EAF6', margin: '0 0 1.5rem' }}>Skills & interests</h2>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                <TagInput
                  label="Technical skills"
                  tags={form.skills}
                  onAdd={(t) => set('skills', [...form.skills, t])}
                  onRemove={(t) => set('skills', form.skills.filter((s) => s !== t))}
                  placeholder="e.g., Python, React, SQL — press Enter to add"
                />
                <TagInput
                  label="Personal interests"
                  tags={form.interests}
                  onAdd={(t) => set('interests', [...form.interests, t])}
                  onRemove={(t) => set('interests', form.interests.filter((s) => s !== t))}
                  placeholder="e.g., Machine Learning, Open Source, Gaming — press Enter to add"
                />
              </div>
            </div>

            {/* Goals & Areas */}
            <div className="card">
              <h2 style={{ fontSize: '1rem', fontWeight: 700, color: '#E8EAF6', margin: '0 0 1.5rem' }}>Goals & technology areas</h2>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                <div>
                  <label className="form-label">Career goals</label>
                  <textarea
                    className="input-field"
                    value={form.careerGoals}
                    onChange={(e) => set('careerGoals', e.target.value)}
                    placeholder="What do you hope to achieve in your career? What kind of impact do you want to make?"
                    rows={3}
                    style={{ resize: 'vertical' }}
                  />
                </div>
                <MultiSelect
                  label="Preferred technology / domain areas"
                  options={AREA_OPTIONS}
                  selected={form.preferredAreas}
                  onChange={(val) => set('preferredAreas', val)}
                />
              </div>
            </div>

            {/* Submit */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', justifyContent: 'flex-end' }}>
              {saved && (
                <span style={{ color: '#34D399', fontSize: '0.9rem', display: 'flex', alignItems: 'center', gap: '0.375rem' }}>
                  <span>✓</span> Profile saved successfully
                </span>
              )}
              <button type="submit" className="btn-primary" disabled={saving} style={{ padding: '0.75rem 2rem' }}>
                {saving ? 'Saving...' : 'Save profile →'}
              </button>
            </div>

          </div>
        </form>
      </div>
    </div>
  );
}
