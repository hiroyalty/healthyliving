# healthyliving
A full featured web application with real time Chat developed with Node.js, Express, Mongoose, Socket.io, Passport, &amp; Redis.

## Installation

### Locally

Have <a href="https://nodejs.org">nodejs</a>, <a href="https://www.mongodb.com">mongodb</a> and <a href="https://npmjs.com">npm</a> installed

1. Clone or download the project
    ````
    $ git clone https://github.com/hiroyalty/healthyliving.git
    cd healthyliving
    ````
    
2. Install Dependencies
    npm install
  
3. Edit configuration file in app/config/config.json with your credentials. (Below)

4. Download and Install <a href="http://redis.io/download">redis</a>

5. Run redis server(As admin)
    ````
    $ redis server
    ````
    
6. Start Application
    ````
    npm start
    ````
    
  Your app should now be running on <a href="http://localhost:3000">localhost:3000</a>
  
  ### Deploying to Heroku
  
  Install and run <a href="https://toolbelt.heroku.com">Heroku Toolbelt</a>
  
  1. Create a heroku application and push your the healthyliving application to Git remote repository.
      ````
      $ heroku create
      $ git push heroku master
      ````
      or 
      https://heroku.com/deploy
    
 2. Set up configuration variables on Heroku.
    
    Go to Settings -> Reveal Config Vars.
    
    Add configuration variables. All needed variables are inside app/config/index.js.
    
    Typically, these are the configuration variables you need to assign: 
    { dbURI, sessionSecret, facebookClientID, facebookClientSecret, twitterConsumerKey, twitterConsumerSecret }
    (see Setup Configurations).
    
 3. One last step is to add Redis as an Add-on on Heroku.
    Go to Resources -> Add-ons
    Select Heroku Redis (You will be prompted to setup a billing account.)
    
 4. Open your chat application in the browser
    ````
    $heroku open
    ````
    
  ### Configuration
  
  Facebook and Twitter Set Up
    Register a new application on both Facebook and Twitter to get your tokens by which users can grant 
    access to your application, and login using their social accounts.
    
  Registering the App on Facebook
  1. Go to Facebook Developers
  2. Add new app, and fill the required information.
  3. Get your App ID, App Secret.
  4. Go to Add Product -> Facebook Login -> Valid OAuth redirect URIs
  5. Add Valid Callback URIs
  6. Go to App Review -> Make your application public.
  7. Now, you can assign the App ID to facebookClientID, and App Secret to facebookClientSecret.
    
  Registering the app on Twitter
  1. Go to Twitter Apps
  2. Create new app, and fill the required information.
  3. Add Website & Callback URL
  4. Get your Consumer Key, Consumer Secret.
  5. Now, assign the Consumer Key to twitterConsumerKey, and Consumer Secret to twitterConsumerSecret.
    
  The Callback URL
  It can point back to your localhost; http://localhost:3000/auth/facebook/callback
    
  When deploy to Heroku, you will have something look like this; http://health-app.herokuapp.com/auth/facebook/callback
    
    
    
    
       
    
