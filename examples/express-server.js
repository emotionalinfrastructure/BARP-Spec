const express = require('express');
const { EISClient } = require('../dist');

const app = express();
const client = new EISClient();

app.get('/ctid', (_req, res) => {
  res.json({ ctid: client.createCTID({ prefix: 'api' }) });
});

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`EIS demo server running on port ${port}`);
});
