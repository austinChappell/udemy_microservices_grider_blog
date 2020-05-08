const express = require('express');
const bodyParser = require('body-parser');
const { randomBytes } = require('crypto');
const cors = require('cors');
const axios = require('axios');

const app = express();
app.use(bodyParser.json());
app.use(cors());

const commentsByPostId = {};

app.get('/posts/:id/comments', (req, res) => {
  res.send(commentsByPostId[req.params.id] || []);
});

app.post('/posts/:id/comments', async (req, res) => {
  const commentId = randomBytes(4).toString('hex');
  const { content } = req.body;

  const comments = commentsByPostId[req.params.id] || [];
  const comment = { id: commentId, content, postId: req.params.id, status: 'pending' };

  console.log('comments : ', comments);

  comments.push(comment);

  await axios.post('http://localhost:4005/events', {
    data: comment,
    type: 'CommentCreated',
  });

  commentsByPostId[req.params.id] = comments;

  res.status(201).send(comments);
});

app.post('/events', async (req, res) => {
  console.log('Event received: ', req.body.type);
  const { data, type } = req.body;

  if (type === 'CommentModerated') {
    const {
      content,
      id,
      postId,
      status,
    } = data;

    const comments = commentsByPostId[postId];

    const comment = comments.find(c => c.id === id);

    if (comment) {
      comments.status = status;

      await axios.post('http://localhost:4005/events', {
        data: {
          id,
          content,
          postId,
          status,
        },
        type: 'CommentUpdated',
      })
    }
  }

  res.send({ });
});

app.listen(4001, () => {
  console.log('Comments service listening on 4001');
});
