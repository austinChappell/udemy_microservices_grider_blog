const express = require('express');
const bodyParser = require('body-parser');
const axios = require('axios');

const app = express();

app.use(bodyParser.json());

app.post('/events', async (req, res) => {
  const { data, type } = req.body;

  if (type === 'CommentCreated') {
    const status = data.content.toLowerCase().includes('orange') ? 'rejected' : 'approved';

    await axios.post('http://localhost:4005/events', {
      data: {
        ...data,
        status,
      },
      type: 'CommentModerated',
    });
  }

  res.send({ });
});

app.listen(4003, () => {
  console.log('Moderation service running on PORT 4003');
});
