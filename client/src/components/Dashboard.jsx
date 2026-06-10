import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../api/axios';

export default function Dashboard() {
  const [stats, setStats] = useState(null);
  const [recentLeads, setRecentLeads] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      const { data } = await api.get('/leads');
      const total = data.length;
      const byStatus = {
        new: data.filter((l) => l.status === 'new').length,
        contacted: data.filter((l) => l.status === 'contacted').length,
        converted: data.filter((l) => l.status === 'converted').length,
        closed: data.filter((l) => l.status === 'closed').length,
      };
      setStats({ total, ...byStatus });
      setRecentLeads(data.slice(0, 5));
    };
    fetchData();
  }, []);

  if (!stats) return <div className="loading">Loading...</div>;

  return (
    <div>
      <h1>Dashboard</h1>
      <div className="stats-grid">
        <div className="stat-card"><h3>{stats.total}</h3><p>Total Leads</p></div>
        <div className="stat-card stat-new"><h3>{stats.new}</h3><p>New</p></div>
        <div className="stat-card stat-contacted"><h3>{stats.contacted}</h3><p>Contacted</p></div>
        <div className="stat-card stat-converted"><h3>{stats.converted}</h3><p>Converted</p></div>
      </div>

      <div className="section-header">
        <h2>Recent Leads</h2>
        <Link to="/leads" className="btn">View All</Link>
      </div>
      <table className="table">
        <thead>
          <tr>
            <th>Name</th>
            <th>Email</th>
            <th>Source</th>
            <th>Status</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {recentLeads.map((lead) => (
            <tr key={lead._id}>
              <td>{lead.name}</td>
              <td>{lead.email}</td>
              <td><span className="badge">{lead.source.replace('_', ' ')}</span></td>
              <td><span className={`badge badge-${lead.status}`}>{lead.status}</span></td>
              <td><Link to={`/leads/${lead._id}`} className="btn btn-sm">View</Link></td>
            </tr>
          ))}
          {recentLeads.length === 0 && (
            <tr><td colSpan="5" className="text-center">No leads yet</td></tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
