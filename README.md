# contacts

Make a CRUD app to store, update and delete contacts using a react app.

# requirements

    - Node v12.16.0
    - docker & docker-compose

# how to launch the app

- First, make a `docker-compose up -d` to run `mongodb` inside a container.
- Run `npm start` to init the server.
- Navigate to `http://localhost:9000` to see the contacts App.

# tests

Several tests were created:

`npm run unit-tdd`: to launch unit tests
`npm run integration-tdd`: to launch integration tests between repository and mongodb
`npm run acceptance-tdd`: to verify that the app fulfills the main requirements
