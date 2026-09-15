const supabase = require('../services/supabase');

const VALID_TYPES = ['damage', 'spoilage', 'rejection', 'procurement_issue', 'queue_issue', 'payment_issue', 'other'];
const VALID_SEVERITIES = ['low', 'medium', 'high', 'critical'];
const VALID_STATUS_TRANSITIONS = {
  'open': ['investigating', 'resolved', 'dismissed'],
  'investigating': ['resolved', 'dismissed'],
  'resolved': [],
  'dismissed': []
};

// Helper: Emit realtime socket event
const emitIncidentUpdate = (req, lotId) => {
  const io = req.app.get('io');
  if (io) {
    io.emit('incident-updated', { lot_id: lotId });
  }
};

// POST /api/incidents
exports.createIncident = async (req, res) => {
  try {
    const { lot_id, incident_type, description, severity } = req.body;
    const userId = req.user.id;
    const userRole = req.user.role;

    // Validation
    if (!lot_id || !incident_type || !description || !severity) {
      return res.status(400).json({ error: 'Missing required fields.' });
    }
    if (description.trim() === '') {
      return res.status(400).json({ error: 'Description cannot be empty.' });
    }
    if (!VALID_TYPES.includes(incident_type)) {
      return res.status(400).json({ error: 'Invalid incident type.' });
    }
    if (!VALID_SEVERITIES.includes(severity)) {
      return res.status(400).json({ error: 'Invalid severity.' });
    }

    // Check Lot Ownership if Farmer
    const { data: lot, error: lotError } = await supabase
      .from('produce_lots')
      .select('farms(user_id)')
      .eq('id', lot_id)
      .single();

    if (lotError || !lot) {
      return res.status(404).json({ error: 'Produce lot not found.' });
    }

    if (userRole === 'farmer' && lot.farms?.user_id !== userId) {
      return res.status(403).json({ error: 'You do not have access to this lot.' });
    }

    // Insert Incident
    const { data: incident, error: insertError } = await supabase
      .from('incidents')
      .insert([{
        lot_id,
        reported_by: userId,
        incident_type,
        description: description.trim(),
        severity,
        status: 'open'
      }])
      .select()
      .single();

    if (insertError) {
      console.error('Error inserting incident:', insertError);
      return res.status(500).json({ error: 'Failed to report incident.' });
    }

    emitIncidentUpdate(req, lot_id);
    return res.status(201).json({ data: incident });
  } catch (error) {
    console.error('Create incident error:', error);
    return res.status(500).json({ error: 'Internal server error.' });
  }
};

// GET /api/incidents/:lot_id
exports.getIncidentsByLot = async (req, res) => {
  try {
    const lotId = req.params.lot_id;
    const userId = req.user.id;
    const userRole = req.user.role;

    // Check ownership if farmer
    const { data: lot, error: lotError } = await supabase
      .from('produce_lots')
      .select('farms(user_id)')
      .eq('id', lotId)
      .single();

    if (lotError || !lot) {
      return res.status(404).json({ error: 'Produce lot not found.' });
    }

    if (userRole === 'farmer' && lot.farms?.user_id !== userId) {
      return res.status(403).json({ error: 'You do not have access to this lot.' });
    }

    // Fetch Incidents
    const { data: incidents, error: fetchError } = await supabase
      .from('incidents')
      .select('*, users(name, role)') // join user details safely
      .eq('lot_id', lotId)
      .order('created_at', { ascending: false });

    if (fetchError) {
      console.error('Error fetching incidents:', fetchError);
      return res.status(500).json({ error: 'Failed to fetch incidents.' });
    }

    return res.status(200).json({ data: incidents });
  } catch (error) {
    console.error('Get incidents error:', error);
    return res.status(500).json({ error: 'Internal server error.' });
  }
};

// PATCH /api/incidents/:id
exports.updateIncident = async (req, res) => {
  try {
    const incidentId = req.params.id;
    const { status, resolution_notes, severity } = req.body;
    const userRole = req.user.role;

    // Only operators and admins can update incidents
    if (userRole === 'farmer') {
      return res.status(403).json({ error: 'Insufficient permissions.' });
    }

    // Fetch existing incident
    const { data: incident, error: fetchError } = await supabase
      .from('incidents')
      .select('*')
      .eq('id', incidentId)
      .single();

    if (fetchError || !incident) {
      return res.status(404).json({ error: 'Incident not found.' });
    }

    const updates = {};
    
    // Validate and update status
    if (status && status !== incident.status) {
      const allowedTransitions = VALID_STATUS_TRANSITIONS[incident.status] || [];
      if (!allowedTransitions.includes(status)) {
        return res.status(400).json({ error: 'Invalid incident status transition.' });
      }
      updates.status = status;
    }

    // Validate and update severity
    if (severity && severity !== incident.severity) {
      if (!VALID_SEVERITIES.includes(severity)) {
        return res.status(400).json({ error: 'Invalid severity.' });
      }
      updates.severity = severity;
    }

    // Update resolution notes
    if (resolution_notes !== undefined) {
      updates.resolution_notes = resolution_notes;
    }
    
    // updated_at is handled via postgres trigger, but we could also manually pass new Date().toISOString()
    // To be safe we'll let postgres handle it, we just update the other fields.
    if (Object.keys(updates).length === 0) {
      return res.status(200).json({ data: incident }); // no changes
    }

    const { data: updatedIncident, error: updateError } = await supabase
      .from('incidents')
      .update(updates)
      .eq('id', incidentId)
      .select()
      .single();

    if (updateError) {
      console.error('Error updating incident:', updateError);
      return res.status(500).json({ error: 'Failed to update incident.' });
    }

    emitIncidentUpdate(req, updatedIncident.lot_id);
    return res.status(200).json({ data: updatedIncident });
  } catch (error) {
    console.error('Update incident error:', error);
    return res.status(500).json({ error: 'Internal server error.' });
  }
};
