# Code Together

Toy multiplayer code editor inspired by [Khan Academy's Embedded Editor](https://www.khanacademy.org/computer-programming/new/pjs).

Code Together was intended to aid small-group peer tutoring.

## TODO

- Editor frontend
    - [] Add documentation section
    - [] Add "Load from Khan Academy" option
    - [] Add "Save to Khan Academy" option

- Signaling server
    - [] Fix EC2 instance to properly accept HTTP traffic
    - [] Wait for DNS to propagate
    - [] Order HTTPS certificate from LetsEncrypt
    - [] Switch HTTP server to HTTPS (80 -> 443)