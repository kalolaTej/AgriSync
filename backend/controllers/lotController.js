const supabase = require('../services/supabaseClient');

// Helper to determine grading service URL
const GRADING_SERVICE_URL = process.env.GRADING_SERVICE_URL || 'http://127.0.0.1:8001';

const createLot = async (req, res) => {
  try {
    const userId = req.user.id;
    const { farm_id, crop_type, quantity_kg, quality_notes } = req.body;
    const files = req.files;

    // 1. Validate required fields
    if (!farm_id) {
      return res.status(400).json({ error: 'farm_id is required' });
    }
    if (!crop_type || crop_type.trim() === '') {
      return res.status(400).json({ error: 'crop_type is required' });
    }
    if (quantity_kg === undefined || quantity_kg === null) {
      return res.status(400).json({ error: 'quantity_kg is required' });
    }
    const numericQuantity = parseFloat(quantity_kg);
    if (isNaN(numericQuantity) || numericQuantity <= 0) {
      return res.status(400).json({ error: 'quantity_kg must be a positive number' });
    }

    // 2. Validate files (at least one image required)
    if (!files || files.length === 0) {
      return res.status(400).json({ error: 'at least one photo is required' });
    }

    const validMimeTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/jpg'];
    for (const file of files) {
      if (!validMimeTypes.includes(file.mimetype)) {
        return res.status(400).json({ error: `invalid file type: ${file.mimetype}. only images are allowed.` });
      }
    }

    // 3. Check farm ownership
    const { data: farm, error: farmError } = await supabase
      .from('farms')
      .select('id')
      .eq('id', farm_id)
      .eq('user_id', userId)
      .single();

    if (farmError || !farm) {
      return res.status(403).json({ error: 'farm not found or does not belong to the authenticated user' });
    }

    // 4. Upload images to Supabase Storage
    const photoUrls = [];
    // We attempt to upload all files. If one fails, we don't have a massive abstraction for cleanup 
    // but we can try to delete the ones that succeeded before throwing.
    for (const file of files) {
      const fileExt = file.originalname ? file.originalname.split('.').pop() : 'jpg';
      const fileName = `lot_${farm_id}_${Date.now()}_${Math.random().toString(36).substring(2, 8)}.${fileExt}`;
      const filePath = `lots/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('images')
        .upload(filePath, file.buffer, {
          contentType: file.mimetype,
          upsert: false,
        });

      if (uploadError) {
        // Attempt cleanup for already uploaded photos
        if (photoUrls.length > 0) {
          const pathsToDelete = photoUrls.map(url => {
            const parts = url.split('/images/');
            return parts.length > 1 ? parts[1] : null;
          }).filter(Boolean);
          if (pathsToDelete.length > 0) {
            await supabase.storage.from('images').remove(pathsToDelete);
          }
        }
        return res.status(500).json({ error: `failed to upload photo: ${uploadError.message}` });
      }

      const { data: publicUrlData } = supabase.storage
        .from('images')
        .getPublicUrl(filePath);

      if (publicUrlData && publicUrlData.publicUrl) {
        photoUrls.push(publicUrlData.publicUrl);
      }
    }

    // 5. Run grading service on primary photo (files[0])
    let grade = null;
    let defectFlags = null;
    let combinedQualityNotes = quality_notes || '';

    try {
      const primaryFile = files[0];
      const formData = new FormData();
      const blob = new Blob([primaryFile.buffer], { type: primaryFile.mimetype });
      formData.append('image', blob, primaryFile.originalname || 'image.jpg');

      const gradingResponse = await fetch(`${GRADING_SERVICE_URL}/grade`, {
        method: 'POST',
        body: formData,
        signal: AbortSignal.timeout(3000) // 3 second timeout
      });

      if (gradingResponse.ok) {
        const gradingData = await gradingResponse.json();
        grade = gradingData.grade || null;
        defectFlags = gradingData.defect_flags || [];
        
        // Append grading notes to farmer's quality notes if both exist
        if (gradingData.notes) {
          if (combinedQualityNotes) {
            combinedQualityNotes = `${combinedQualityNotes}\n\n[Automated Grading]: ${gradingData.notes}`;
          } else {
            combinedQualityNotes = `[Automated Grading]: ${gradingData.notes}`;
          }
        }
      } else {
        console.warn(`[grading] service returned status ${gradingResponse.status}. Lot creation will proceed without automated grade.`);
      }
    } catch (gradingError) {
      // grading failure MUST NOT block lot creation
      console.warn(`[grading] service failed or timed out: ${gradingError.message}. Lot creation will proceed without automated grade.`);
    }

    // 6. Insert into produce_lots
    const { data: newLot, error: dbError } = await supabase
      .from('produce_lots')
      .insert([
        {
          farm_id: farm_id,
          crop_type: crop_type,
          quantity_kg: numericQuantity,
          quality_notes: combinedQualityNotes || null,
          photo_urls: photoUrls,
          grade: grade,
          defect_flags: defectFlags,
          status: 'listed'
        }
      ])
      .select()
      .single();

    if (dbError) {
      // Attempt cleanup of uploaded photos if DB insert fails
      const pathsToDelete = photoUrls.map(url => {
        const parts = url.split('/images/');
        return parts.length > 1 ? parts[1] : null;
      }).filter(Boolean);
      if (pathsToDelete.length > 0) {
        await supabase.storage.from('images').remove(pathsToDelete);
      }
      return res.status(500).json({ error: `failed to save produce lot: ${dbError.message}` });
    }

    return res.status(201).json({ data: newLot });
  } catch (err) {
    return res.status(500).json({ error: `internal server error: ${err.message}` });
  }
};

const getLots = async (req, res) => {
  try {
    const userId = req.user.id;

    // To get lots belonging to the authenticated user, we need to join with farms
    const { data: lots, error } = await supabase
      .from('produce_lots')
      .select(`
        *,
        farms!inner ( user_id )
      `)
      .eq('farms.user_id', userId)
      .order('created_at', { ascending: false });

    if (error) {
      return res.status(500).json({ error: `failed to fetch lots: ${error.message}` });
    }

    // Remove the joined farms data to keep the response clean
    const formattedLots = (lots || []).map(lot => {
      const { farms, ...lotData } = lot;
      return lotData;
    });

    return res.status(200).json({ data: formattedLots });
  } catch (err) {
    return res.status(500).json({ error: `internal server error: ${err.message}` });
  }
};

const getLotById = async (req, res) => {
  try {
    const userId = req.user.id;
    const { id } = req.params;

    const { data: lot, error } = await supabase
      .from('produce_lots')
      .select(`
        *,
        farms!inner ( user_id )
      `)
      .eq('id', id)
      .eq('farms.user_id', userId)
      .single();

    if (error || !lot) {
      return res.status(404).json({ error: 'Lot not found' });
    }

    const { farms, ...lotData } = lot;
    return res.status(200).json({ data: lotData });
  } catch (err) {
    return res.status(500).json({ error: `internal server error: ${err.message}` });
  }
};

module.exports = {
  createLot,
  getLots,
  getLotById
};
