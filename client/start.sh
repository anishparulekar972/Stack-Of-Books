#Script to run the express server in the background and serve the built react app
node ./server.js &
serve -s build -l 3000