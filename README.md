# Front End developer task
## Overview

We've set up as simple NodeJS application which gives you a bunch of API's to access and manipulate data in the server
via REST API's and can also render HTML pages. We're using jade for templating, if you want to change to something else or even roll with
simple HTML (I've already supplied a sample for this) feel free to make necessary changes in the server side code.

## API's
- GET /api/message/ - get a list of messages
- GET /api/message/:id - get one message
- DELETE /api/message/:id - delete one message

** Your task, will be to consume these API's & build a UI which looks beautiful & more importantly feels intutive for our users. **

Here are the details:
- Serves static content from the static_content & bower_compoenents directory
-- You can have your JS, CSS files & images/sprites in static_content & any plugins can go in bower_components
- Router is @ controllers/router.js
- Web controllers are @ controllers/web/
- API controllers are @ controller/api/

## How to setup
- Make sure you have got node & npm installed
- Clone
- Navigate into src directory
- execute npm install
- execute npm start