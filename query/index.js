const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();

app.use(bodyParser.json());
app.use(cors());

const posts = {};

app.get('/posts', (req, res) => {
  res.send(posts);
});

app.post('/events', (req, res) => {
  const { data, type } = req.body;

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
    } = data;

    const post = posts[postId];

    post.comments.push({
      content,
      id,
    });
  }

  res.send({ });
});

app.listen(4002, () => {
  console.log('Query service listening on PORT 4002');
});
