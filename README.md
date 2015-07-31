# Pub Sockets

A pub trivia style game written in React and powered by websockets.

#### How to play

Coming soon!

#### Cool things about the development

The idea for this web game was to make something that would be played by several people in the same room, using websockets to synchronize data between clients. The structure of the game makes good use of React by keeping the bare minimum of state on the client, so there is no disagreement of the game state between the client and server. In fact, if the server resets, all clients will also reset immediately instead of being stuck in a broken game. They won't even have to reload the page!
