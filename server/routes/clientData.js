import express from 'express';
const router = express.Router();

router.get('/api/data', (req, res) => {
  const groupKeys = JSON.parse(req.query.groupKeys || '[]');

  if (groupKeys.length === 0) {
    res.json([
      { clientId: '1', name: 'Acme Corp', group: true },
      { clientId: '2', name: 'Beta LLC', group: true },
    ]);
  } else {
    const clientId = groupKeys[0];
    const mockContacts = {
      '1': [
        { name: 'John Smith', email: 'john@acme.com' },
        { name: 'Jane Doe', email: 'jane@acme.com' }
      ],
      '2': [
        { name: 'Alice Brown', email: 'alice@beta.com' }
      ]
    };

    res.json(mockContacts[clientId] || []);
  }
});

export default router;
