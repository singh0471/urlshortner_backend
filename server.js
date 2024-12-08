// const express = require("express");
// const application = express();
// const dotenv = require("dotenv");
// dotenv.config();
// const { StatusCodes } = require('http-status-codes');
// const PORT = process.env.PORT;
// const cors = require("cors");
// const axios = require("axios");
// const cookieParser = require("cookie-parser");
// const routeConfig = require("./app/config/route-config");
// const NotFoundError = require("./app/errors/notFoundError");
// function configureApplication(app){
//     app.use(cors());
//     app.use((req,res,next)=> {
//         res.set("Access-Control-Allow-Origin","*");
//         res.set("Access-Control-Allow-Headers", "Origin,X-Requested-With,Content-Type,Accept");
//         res.set('Access-Control-Expose-Headers', 'X-Total-Count');
//         next();
//     })
//     app.use(cookieParser());
//     app.use(express.json());
// }

// function configureRoutes(app){
//     routeConfig.registerRoutes(app);
// }

// function configureErrorHandler(app) {
//     function configureErrorHandler(app) {
      
//         app.use((req, res, next) => {
//             const error = new NotFoundError("API Not Found");
//             error.statusCode = StatusCodes.NOT_FOUND;
//             next(error);
//         });
    
        
//         app.use((err, req, res, next) => {
//             console.log('Error for Request');
//             console.log(`Requested API: ${req.url}`);
//             console.log(`Method: ${req.method}`);
//             console.log(`Request Authorization header: ${req.get('Authorization')}`);
//             console.log('Error stack');
//             console.log(err);
    
            
//             const errorStatusCode = err.statusCode || StatusCodes.INTERNAL_SERVER_ERROR;
            
             
//             const errorJson = {
//                 message: err.message,
//                 stack: err.stack  
//             };
            
//             res.status(errorStatusCode).json(errorJson);
//         });
//     }
    
    
//   }

//   function startServer(app) {
//     app.listen(PORT, ()=>{
//      console.log(`started at ${PORT}`)
//     })
//    }
//    function configureWorker(app) {
//      configureApplication(app);
//      configureRoutes(app);
//      configureErrorHandler(app);
//      startServer(app);
//    }
   
//    configureWorker(application);

const express = require("express");
const application = express();
const dotenv = require("dotenv");
dotenv.config();
const { StatusCodes } = require('http-status-codes');
const PORT = process.env.PORT;
const cors = require("cors");
const cookieParser = require("cookie-parser");
const routeConfig = require("./app/config/route-config");
const NotFoundError = require("./app/errors/notFoundError");
const ShrinkItError = require("./app/errors/shrinkItError");  // Assuming this is your base error class

// Configure application with necessary middleware
function configureApplication(app) {
  app.use(cors());
  app.use((req, res, next) => {
    res.set("Access-Control-Allow-Origin", "*");
    res.set("Access-Control-Allow-Headers", "Origin,X-Requested-With,Content-Type,Accept");
    res.set('Access-Control-Expose-Headers', 'X-Total-Count');
    next();
  });
  app.use(cookieParser());
  app.use(express.json());
}

// Register routes
function configureRoutes(app) {
  routeConfig.registerRoutes(app);
}

// General error handler middleware
function configureErrorHandler(app) {
  // Handle 404 errors for undefined routes
  app.use((req, res, next) => {
    const error = new NotFoundError("API Not Found");
    error.statusCode = StatusCodes.NOT_FOUND;
    next(error);  // Pass the error to the next middleware (error handler)
  });

  // Global error handler
  app.use((err, req, res, next) => {
    console.log('Error for Request');
    console.log(`Requested API: ${req.url}`);
    console.log(`Method: ${req.method}`);
    console.log(`Request Authorization header: ${req.get('auth')}`);
    console.log('Error stack');
    console.log(err);

    // If it's a custom error like ShrinkItError (your base class)
    if (err instanceof ShrinkItError) {
      // You can access the `httpStatusCode` and `specificMessage` from your custom error class
      const errorStatusCode = err.statusCode || StatusCodes.INTERNAL_SERVER_ERROR;

      const errorJson = {
        message: err.message,
        specificMessage: err.specificMessage || null,  // Custom message if any
        stack: process.env.NODE_ENV === 'development' ? err.stack : undefined,  // Show stack only in development
      };

      return res.status(errorStatusCode).json(errorJson);
    }

    // Default error handler for unexpected errors
    const errorStatusCode = err.statusCode || StatusCodes.INTERNAL_SERVER_ERROR;
    const errorJson = {
      message: "Internal Server Error",
      stack: process.env.NODE_ENV === 'development' ? err.stack : undefined,  // Show stack trace in dev only
    };

    res.status(errorStatusCode).json(errorJson);
  });
}

// Start the server
function startServer(app) {
  app.listen(PORT, () => {
    console.log(`Server started on port ${PORT}`);
  });
}

// Wire everything together
function configureWorker(app) {
  configureApplication(app);  // Setup middleware
  configureRoutes(app);  // Register routes
  configureErrorHandler(app);  // Set up error handler middleware
  startServer(app);  // Start the server
}

configureWorker(application);  // Start the application
