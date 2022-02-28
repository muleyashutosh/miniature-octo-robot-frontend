# miniature-octo-robot-frontend

This is the repo where the Frontend of our Final year project lives

## First setup instructions

  1. Make sure to have LTS version of node and npm installed [nodejs](http://nodejs.org)

    node --version
    > v16.13.2

    npm --version 
    > 8.1.2

  2. Clone repository to local

    git clone git@github.com:muleyashutosh/miniature-octo-robot-frontend.git

  3. Change directory to project directory
  
    cd miniature-octo-robot-frontend

  4. Install package dependencies.

    npm i
  
  5. create a `.env` file in root directory and add env vars using command

    echo "REACT_APP_API_URL = https://projectapi.elcarto.xyz" > .env


## Available Scripts

In the project directory, you can run:

### `npm start`

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in your browser.

The page will reload when you make changes.\
You may also see any lint errors in the console.

### `npm test`

Launches the test runner in the interactive watch mode.\
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

### `npm run build`

Builds the app for production to the `build` folder.\
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.\
Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.
