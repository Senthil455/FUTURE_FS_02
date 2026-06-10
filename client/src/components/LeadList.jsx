import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../api/axios';
import LeadForm from './LeadForm';

export default function LeadList() {
  const [leads, setLeads] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [filters, setFilters] = useState({ status: '', source: '', search: '' });
  const [refresh, setRefresh] = useState(0);

  useEffect(() => {
    const params = new URLSearchParams();
    if (filters.status) params.append('status', filters.status);
    if (filters.source) params.append('source', filters.source);
    if (filters.search) params.append('search', filters.search);

    api.get(`/leads?${params}`).then(({ data }) => setLeads(data));
  }, [filters, refresh]);

  const addLead = async (form) => {
    await api.post('/leads', form);
    setShowForm(false);
    setRefresh((r) => r + 1);
  };

  const deleteLead = async (id) => {
    if (!window.confirm('Delete this lead?')) return;
    await api.delete(`/leads/${id}`);
    setRefresh((r) => r + 1);
  };

  return (
    <div>
      <div className="section-header">
        <h1>Leads</h1>
        <button className="btn btn-primary" onClick={() => setShowForm(!showForm)}>
          {showForm ? 'Cancel' : '+ Add Lead'}
        </button>
      </div>

      {showForm && <LeadForm onSubmit={addLead} />}

      <div className="filters">
        <input
          type="text"
          placeholder="Search name or email..."
          value={filters.search}
          onChange={(e) => setFilters({ ...filters, search: e.target.value })}
          className="search-input"
        />
        <select value={filters.status} onChange={(e) => setFilters({ ...filters, status: e.target.value })}>
          <option value="">All Statuses</option>
          <option value="new">New</option>
          <option value="contacted">Contacted</option>
          <option value="converted">Converted</option>
          <option value="closed">Closed</option>
        </select>
        <select value={filters.source} onChange={(e) => setFilters({ ...filters, source: e.target.value })}>
          <option value="">All Sources</option>
          <option value="website">Website</option>
          <option value="referral">Referral</option>
          <option value="social_media">Social Media</option>
          <option value="email_campaign">Email Campaign</option>
          <option value="other">Other</option>
        </select>
      </div>

      <table className="table">
        <thead>
          <tr>
            <th>Name</th>
            <th>Email</th>
            <th>Phone</th>
            <th>Source</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {leads.map((lead) => (
            <tr key={lead._id}>
              <td><Link to={`/leads/${lead._id}`}>{lead.name}</Link></td>
              <td>{lead.email}</td>
              <td>{lead.phone || '—'}</td>
              <td><span className="badge">{lead.source.replace('_', ' ')}</span></td>
              <td><span className={`badge badge-${lead.status}`}>{lead.status}</span></td>
              <td className="actions">
                <Link to={`/leads/${lead._id}`} className="btn btn-sm">View</Link>
                <button className="btn btn-sm btn-danger" onClick={() => deleteLead(lead._id)}>Delete</button>
              </td>
            </tr>
          ))}
          {leads.length === 0 && (
            <tr><td colSpan="6" className="text-center">No leads found</td></tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
