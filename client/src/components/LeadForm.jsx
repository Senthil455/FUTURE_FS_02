import { useState } from 'react';

const initial = { name: '', email: '', phone: '', source: 'website', status: 'new' };

export default function LeadForm({ onSubmit, initialData }) {
  const [form, setForm] = useState(initialData || initial);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(form);
    if (!initialData) setForm(initial);
  };

  return (
    <form onSubmit={handleSubmit} className="lead-form">
      <div className="form-row">
        <div className="form-group">
          <label>Name</label>
          <input name="name" value={form.name} onChange={handleChange} required />
        </div>
        <div className="form-group">
          <label>Email</label>
          <input name="email" type="email" value={form.email} onChange={handleChange} required />
        </div>
      </div>
      <div className="form-row">
        <div className="form-group">
          <label>Phone</label>
          <input name="phone" value={form.phone} onChange={handleChange} />
        </div>
        <div className="form-group">
          <label>Source</label>
          <select name="source" value={form.source} onChange={handleChange}>
            <option value="website">Website</option>
            <option value="referral">Referral</option>
            <option value="social_media">Social Media</option>
            <option value="email_campaign">Email Campaign</option>
            <option value="other">Other</option>
          </select>
        </div>
        <div className="form-group">
          <label>Status</label>
          <select name="status" value={form.status} onChange={handleChange}>
            <option value="new">New</option>
            <option value="contacted">Contacted</option>
            <option value="converted">Converted</option>
            <option value="closed">Closed</option>
          </select>
        </div>
      </div>
      <button type="submit" className="btn btn-primary">
        {initialData ? 'Update Lead' : 'Add Lead'}
      </button>
    </form>
  );
}
