import React from 'react';

export default ({ comments }) => (
  <ul>
    {comments.map(comment => (
      <li key={comment.id}>
        {comment.content}
      </li>
    ))}
  </ul>
);
