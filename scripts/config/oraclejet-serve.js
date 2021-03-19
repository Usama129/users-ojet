/**
  Copyright (c) 2015, 2019, Oracle and/or its affiliates.
  The Universal Permissive License (UPL), Version 1.0
*/
'use strict';

/**
 * # oraclejet-serve.js
 * This script allows users to configure and customize the serve tasks.
 * Configurable tasks: connect, watch.
 * To configure a task, uncomment the corresponding sections below, and pass in your configurations.
 * Any options will be merged with default configuration found in node_modules/@oracle/oraclejet-tooling/lib/defaultconfig.js
 * Any fileList will replace the default configuration.
 */

module.exports = function () {
  return {
/**
 * # watch
 * This task watches a set of files and defines a series of customizable tasks if a change is detected.
 * Within the watch task config, by default there are three targets, sourceFiles, sass, themes. 
 * Users are encouraged to edit or add their own watch targets, be careful if rewrite the three default targets.
 * Within each watch target, users can specify three properties. 
 * 1. The files entry takes a list of glob patterns that identifies the set of files to watch
 * 2. The options.livereload specifies a boolean that indicates whether the browser should reload when files in this target are modified.
 * 3. The options.tasks property specifies custom commands to run. 'compileSass' and 'copyThemes' are reserved internal tasks.
 * Example commands: ['grunt copy', 'mocha test]. Once a change is detected, it will run grunt copy followed by mocha test
 * once the custom tasks completed, tooling will reload the browser if liverealod is set to true, then resume watching
 */
    // // Sub task watch default options
    // watch: {
    //   sourceFiles:
    //   {
    //     files: [],
    //     options: {
    //       livereload: true
    //     }
    //   },

    //   sass: {
    //     files: [],
    //     commands: ['compileSass']
    //   },

    //   themes: {
    //     files: [],
    //     options: {
    //       livereload: true
    //     },
    //     commands: ['copyThemes']
    //   },
    // }

/**
 * This is the web specific configuration. You can specify configurations targeted only for web apps. 
 * The web specific configurations will override the general configuration. 
 */
    web: {
/**
 * # connect
 * This task launches a web server for web App, does not work for hybrid App.
 * Support five connect options: 
 *   port, port number, default 8000
 *   hostname, a string of the domain name, default localhost
 *   livereload, a boolean for livereload, default true in dev mode, false in release mode (overwritten when )
 *   open, a boolean for wheather to launch browser, default to true
 *   base, a string of the target directory to be served, default to the staging area
 */
    // connect: {
    //   options: {}
    // },
    },

/**
 * This is the hybrid specific configuration. You can specify configurations targeted only for hybrid apps. 
 * The hybrid specific configurations will override the general configuration. 
 */
    hybrid: {
    }
  };
};

// Following are server-side endpoints for the frontend to use


const express = require("express")

var cors = require('cors')
const app = express()
const axios = require('axios');
const CircularJSON = require('circular-json');
const PORT = 5000
app.use(cors())


app.use(express.json()) // for parsing application/json
app.use(express.urlencoded({ extended: true })) // for parsing application/x-www-form-urlencoded

let server = 'http://localhost:8080'

app.get('/users', (req, res) => {
  axios.get(server + '/users')
  .then(response => {
    let json = CircularJSON.stringify(response.data);
    res.send(json);
  })
  .catch(error => {
    if (error.response) {
      // The request was made and the server responded with a status code
      // that falls out of the range of 2xx
      

      res.status(error.response.status)
      res.send(error.response.data)
    } else if (error.request) {
      // The request was made but no response was received
      // `error.request` is an instance of XMLHttpRequest in the browser and an instance of
      // http.ClientRequest in node.js
      res.status(503)
      res.send("Cannot reach server")
      console.log("Cannot reach server at " + server)
    } else {
      // Something happened in setting up the request that triggered an Error
      console.log('Error', error.message);
    }
  });

})

app.post('/add', function (req, res) {
  axios.post(server + '/add', req.body)
  .then(response => {
    let json = CircularJSON.stringify(response.data);
    res.send(json);
  })
  .catch(error => {
    if (error.response) {
      // The request was made and the server responded with a status code
      // that falls out of the range of 2xx
      

      res.status(error.response.status)
      res.send(error.response.data)
    } else if (error.request) {
      // The request was made but no response was received
      // `error.request` is an instance of XMLHttpRequest in the browser and an instance of
      // http.ClientRequest in node.js
      res.status(503)
      res.send("Cannot reach server")
      console.log("Cannot reach server at " + server)
    } else {
      // Something happened in setting up the request that triggered an Error
      console.log('Error', error.message);
    }
  });
})

app.put('/update', function (req, res) {
  axios.put(server + '/update', req.body)
  .then(response => {
    let json = CircularJSON.stringify(response.data);
    res.send(json);
  })
  .catch(error => {
    if (error.response) {
      // The request was made and the server responded with a status code
      // that falls out of the range of 2xx
      

      res.status(error.response.status)
      res.send(error.response.data)
    } else if (error.request) {
      // The request was made but no response was received
      // `error.request` is an instance of XMLHttpRequest in the browser and an instance of
      // http.ClientRequest in node.js
      res.status(503)
      res.send("Cannot reach server")
      console.log("Cannot reach server at " + server)
    } else {
      // Something happened in setting up the request that triggered an Error
      console.log('Error', error.message);
    }
  });
})

app.delete('/delete', function(req, res){
  
  axios.delete(server + '/delete', { params: { id: req.query.id } })
  .then(response => {
    let json = CircularJSON.stringify(response.data);
    res.send(json);
  }).catch(error => {
    if (error.response) {
      // The request was made and the server responded with a status code
      // that falls out of the range of 2xx
      

      res.status(error.response.status)
      res.send(error.response.data)
    } else if (error.request) {
      // The request was made but no response was received
      // `error.request` is an instance of XMLHttpRequest in the browser and an instance of
      // http.ClientRequest in node.js
      res.status(503)
      res.send("Cannot reach server")
      console.log("Cannot reach server at " + server)
    } else {
      // Something happened in setting up the request that triggered an Error
      console.log('Error', error.message);
    }
  });
})

app.listen(PORT, err => { console.log("Server side endpoints listening at port " + PORT)}) 