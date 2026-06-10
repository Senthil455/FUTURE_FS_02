const express = require('express');
const Lead = require('../models/Lead');
const { protect } = require('../middleware/auth');

const router = express.Router();

router.get('/', protect, async (req, res) => {
  try {
    const { status, source, search } = req.query;
    const filter = {};

    if (status) filter.status = status;
    if (source) filter.source = source;
    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
      ];
    }

    const leads = await Lead.find(filter).sort({ createdAt: -1 });
    res.json(leads);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.get('/:id', protect, async (req, res) => {
  try {
    const lead = await Lead.findById(req.params.id);
    if (!lead) {
      return res.status(404).json({ message: 'Lead not found' });
    }
    res.json(lead);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.post('/', protect, async (req, res) => {
  try {
    const { name, email, phone, source, status } = req.body;
    const lead = await Lead.create({ name, email, phone, source, status });
    res.status(201).json(lead);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.put('/:id', protect, async (req, res) => {
  try {
    const { name, email, phone, source, status } = req.body;
    const lead = await Lead.findByIdAndUpdate(
      req.params.id,
      { name, email, phone, source, status },
      { new: true, runValidators: true }
    );
    if (!lead) {
      return res.status(404).json({ message: 'Lead not found' });
    }
    res.json(lead);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.delete('/:id', protect, async (req, res) => {
  try {
    const lead = await Lead.findByIdAndDelete(req.params.id);
    if (!lead) {
      return res.status(404).json({ message: 'Lead not found' });
    }
    res.json({ message: 'Lead removed' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.post('/:id/notes', protect, async (req, res) => {
  try {
    const lead = await Lead.findById(req.params.id);
    if (!lead) {
      return res.status(404).json({ message: 'Lead not found' });
    }

    lead.notes.push({
      content: req.body.content,
      createdBy: req.user._id,
    });

    const updatedLead = await lead.save();
    res.status(201).json(updatedLead);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.delete('/:id/notes/:noteId', protect, async (req, res) => {
  try {
    const lead = await Lead.findById(req.params.id);
    if (!lead) {
      return res.status(404).json({ message: 'Lead not found' });
    }

    lead.notes = lead.notes.filter(
      (note) => note._id.toString() !== req.params.noteId
    );

    await lead.save();
    res.json({ message: 'Note removed' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
