import type express from 'express'
import path from 'node:path'

const addStaticRoutes = (app: express.Application) => {
  app.get("/", (request, response) => {
    response.sendFile(path.join(__dirname, '../../public/chat.html'));

  });
};

export default addStaticRoutes