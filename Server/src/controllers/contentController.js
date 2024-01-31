// contentController.js
import { updateAllContents } from '../services/contentService.js';


const updateAllContentsController = async (req, res) => {
  try {
    await updateAllContents();
    res.status(200).json({ message: 'All contents updated successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export { updateAllContentsController };
