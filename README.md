# Code Together

Toy multiplayer code editor inspired by [Khan Academy's Embedded Editor](https://www.khanacademy.org/computer-programming/new/pjs).

Code Together was intended to aid small-group peer tutoring.

## TODO

- [ ] Editor frontend
    - [x] Fix editor styling
    - [ ] Add documentation section
    - [ ] Add "Load from Khan Academy" option
    - [ ] Add "Save to Khan Academy" option
    - [ ] Fix editor width
    - [ ] Add noise/noiseSeed/loadPixels/updatePixels/imageData globals
    - [x] Fix backticks in code messing stuff up

- [x] Signaling server
    - [x] Fix EC2 instance to properly accept HTTP traffic
    - [x] Wait for DNS to propagate
    - [x] Order HTTPS certificate from LetsEncrypt
    - [x] Switch HTTP server to HTTPS (80 -> 443)
    - [x] Change `ws:` to `wss:` protocol