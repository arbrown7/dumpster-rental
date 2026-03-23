import {
    checkAvailability
} from '../../models/rental/rental.js'; 

const handleCheckAvailability = async (req, res) => {
    const { size, date } = req.query;
    try {
        const available = await checkAvailability(size, date);
        res.json({ available });  // was missing entirely
    } catch (error) {
        console.error('Availability check failed:', error);
        res.status(500).json({ available: false });
    }
};

const formatDateTime = (ts) => {
  if (!ts) return "";
  const date = typeof ts.toDate === "function" ? ts.toDate() : new Date(ts);
  return date.toLocaleString("en-US", {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
    hour12: true
  }); // "March 21, 2026 at 10:08 PM"
};

const formatDate = (tsOrString) => {
  if (!tsOrString) return "";
  if (typeof tsOrString.toDate === "function") {
    return tsOrString.toDate().toLocaleDateString("en-US");
  }
  return tsOrString;
};

export {
    handleCheckAvailability,
    formatDate,
    formatDateTime
};