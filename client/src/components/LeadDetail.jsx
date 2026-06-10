import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../api/axios';
import LeadForm from './LeadForm';

export default function LeadDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [lead, setLead] = useState(null);
  const [editing, setEditing] = useState(false);
  const [note, setNote] = useState('');

  useEffect(() => {
    api.get(`/leads/${id}`).then(({ data }) => setLead(data));
  }, [id]);

  const updateLead = async (form) => {
    const { data } = await api.put(`/leads/${id}`, form);
    setLead(data);
    setEditing(false);
  };

  const addNote = async (e) => {
    e.preventDefault();
    if (!note.trim()) return;
    const { data } = await api.post(`/leads/${id}/notes`, { content: note });
    setLead(data);
    setNote('');
  };

  const deleteNote = async (noteId) => {
    if (!window.confirm('Delete this note?')) return;
    const { data } = await api.delete(`/leads/${id}/notes/${noteId}`);
    setLead(data);
  };

  if (!lead) return <div className="loading">Loading...</div>;

  return (
    <div className="lead-detail">
      <div className="section-header">
        <h1>{lead.name}</h1>
        <div>
          <button className="btn" onClick={() => setEditing(!editing)}>
            {editing ? 'Cancel' : 'Edit'}
          </button>
          <button className="btn btn-secondary" onClick={() => navigate('/leads')}>Back</button>
        </div>
      </div>

      {editing ? (
        <LeadForm onSubmit={updateLead} initialData={lead} />
      ) : (
        <div className="detail-card">
          <div className="detail-grid">
            <div><strong>Email:</strong> {lead.email}</div>
            <div><strong>Phone:</strong> {lead.phone || '—'}</div>
            <div><strong>Source:</strong> <span className="badge">{lead.source.replace('_', ' ')}</span></div>
            <div><strong>Status:</strong> <span className={`badge badge-${lead.status}`}>{lead.status}</span></div>
            <div><strong>Created:</strong> {new Date(lead.createdAt).toLocaleDateString()}</div>
            <div><strong>Updated:</strong> {new Date(lead.updatedAt).toLocaleDateString()}</div>
          </div>
        </div>
      )}

      <h2>Notes & Follow-ups</h2>
      <form onSubmit={addNote} className="note-form">
        <textarea
          value={note}
          onChange={(e) => setNote(e.target.value)}
          placeholder="Add a note or follow-up..."
          rows="3"
          required
        />
        <button type="submit" className="btn btn-primary">Add Note</button>
      </form>

      <div className="notes-list">
        {lead.notes.length === 0 && <p className="text-muted">No notes yet.</p>}
        {[...lead.notes].reverse().map((n) => (
          <div key={n._id} className="note-item">
            <div className="note-content">{n.content}</div>
            <div className="note-meta">
              <span>{new Date(n.createdAt).toLocaleString()}</span>
              <button className="btn btn-sm btn-danger" onClick={() => deleteNote(n._id)}>Delete</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
