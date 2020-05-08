const express = require('express');
const bodyParser = require('body-parser');
const axios = require('axios');
const cors = require('cors');

const app = express();

app.use(bodyParser.json());
app.use(cors());

const posts = {};

const handleEvent = (type, data) => {
  if (type === 'PostCreated') {
    const { id, title } = data;

    posts[id] = {
      comments: [],
      id,
      title,
    };
  } 
  
  if (type === 'CommentCreated')  {
    const {
      content,
      id,
      postId,
      status,
    } = data;

    const post = posts[postId];

    post.comments.push({
      content,
      id,
      status,
    });
  }

  if (type === 'CommentUpdated') {
    const {
      content,
      id,
      postId,
      status,
    } = data;

    const post = posts[postId];

    const { comments } = post;

    const comment = comments.find(c => c.id === id);

    if (comment) {
      comment.content = content;
      comment.status = status;
    }
  }
}

app.get('/posts', (req, res) => {
  res.send(posts);
});

app.post('/events', (req, res) => {
  const { data, type } = req.body;

  handleEvent(type, data);

  res.send({ });
});

app.listen(4002, async () => {
  console.log('Query service listening on PORT 4002');

  const res = await axios.get('http://localhost:4005/events');

  for (const event of res.data) {
    console.log('processing event ', event.type);

    handleEvent(event.type, event.data);
  }
});
