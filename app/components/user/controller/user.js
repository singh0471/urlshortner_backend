// controllers/user/UserController.js
const UserService = require("../service/user");
const { HttpStatusCode } = require("axios");
const { createUUID, validateUUID } = require("../../../utils/uuid");
const Logger = require("../../../utils/logger");
const InvalidError = require("../../../errors/invalidError");
const NotFoundError = require("../../../errors/notFoundError");
const { setXTotalCountHeader } = require("../../../utils/response");
const {Payload} = require("../../../middleware/authentication");

const bcrypt = require("bcrypt");
class UserController {
  constructor() {
    this.userService = new UserService();
  }

  
  
async  verifyToken(req, res, next)  {
  try {
    Logger.info("verifyToken controller started");
    const {token} = req.body;
    console.log(token)
    const bearerRemoved = token.split(" ")[1];
    if(!token){
      throw new NotFoundError("token not found")
    }
    
    let data = Payload.verifyToken(bearerRemoved) 
    
    if(!data){
      throw new Error("token verification failed");
    } 

    
    res.status(HttpStatusCode.Ok).json(data);
    
    Logger.info("verifyToken controller ended...");
  } catch (error) {
    next(error);
  }
}

  async login(req,res,next)  {
    try{
        Logger.info("login method started");

        const {username,password} = req.body;

        if(!username || typeof username !== "string"){
            throw new InvalidError("invalid username");
        }
        if(!password || typeof password !== "string"){
            throw new InvalidError("invalid password");
        }

        const user = await this.userService.getUserByUsername(username);
        
        if(!user){
            throw new NotFoundError("user does not exists");
        }

        if(await bcrypt.compare(password,user.password)){
           const payload = new Payload(user.id,user.isAdmin,user.status);
           
            let token = payload.signPayload();
            res.cookie("auth", `Bearer ${token}`);

            

            res.set("auth", `Bearer ${token}`);
            if(user.status==='blacklisted'){
              throw new InvalidError("Your account has been blacklisted. mail at shrinkit4@gmail.com for more info.")
            }
            res.status(200).send(token);
            
        }else{
            throw new InvalidError("incorrect password")
        }

        
        Logger.info("login completed");

    }
    catch(error){
        next(error);
    }
}

  async createAdminUser(req, res, next) {
    try {
      Logger.info("create admin user controller started");

      const { username, firstName, lastName, email, password } = req.body;

      if(!username || typeof username !== "string")
        throw new InvalidError("Invalid first name");

      if(!firstName || typeof firstName !== "string")
        throw new InvalidError("Invalid first name");

      if(!lastName || typeof lastName !== "string")
        throw new InvalidError("Invalid last name");

      if(!email || typeof email !== "string")
        throw new InvalidError("Invalid email");
      
      if(!password || typeof password !== "string")
        throw new InvalidError("Invalid password");

      const user = await this.userService.createUser(createUUID(), username,firstName, lastName, email, password, true);
      Logger.info("create admin user controller completed");

      res.status(HttpStatusCode.Created).json(user);
    } catch (error) {
      next(error);
    }
  }

  // Create User (Normal User)
  async createUser(req, res, next) {
    try {
      Logger.info("create user controller started");

      const { username,firstName, lastName, email, password } = req.body;

      if(!username || typeof username !== "string")
        throw new InvalidError("Invalid first name");

      if(!firstName || typeof firstName !== "string")
        throw new InvalidError("Invalid first name");

      if(!lastName || typeof lastName !== "string")
        throw new InvalidError("Invalid last name");

      if(!email || typeof email !== "string")
        throw new InvalidError("Invalid email");
      
      if(!password || typeof password !== "string")
        throw new InvalidError("Invalid password");

      

      const user = await this.userService.createUser(createUUID(), username,firstName, lastName, email, password, false);
      Logger.info("create user controller completed");

      res.status(HttpStatusCode.Created).json(user);
    } catch (error) {
      next(error);
    }
  }

  // Update User
  async updateUser(req, res, next) {
    try {
      Logger.info("update user controller started");

      const { userId } = req.params;
      const updates = req.body;

      if (!validateUUID(userId)) {
        throw new InvalidError("Invalid user ID.");
      }

      const user = await this.userService.updateUser(userId, updates);
      Logger.info("update user controller completed");

      res.status(HttpStatusCode.Ok).json({
        user
      });
    } catch (error) {
      next(error);
    }
  }

  // Delete User
  async deleteUser(req, res, next) {
    try {
      Logger.info("delete user controller started");

      const { userId } = req.params;

      if (!validateUUID(userId)) {
        throw new InvalidError("Invalid user ID.");
      }

      await this.userService.deleteUser(userId);
      Logger.info("delete user controller completed");

      res.status(HttpStatusCode.Ok).json({
        message: `User with ID ${userId} has been deleted successfully`,
      });
    } catch (error) {
      next(error);
    }
  }

  // Get All Users
  async getAllUsers(req, res, next) {
    try {
      Logger.info("get all users controller started");

      const { count, rows } = await this.userService.getAllUsers(req.query);
      
      setXTotalCountHeader(res, count);
      res.status(HttpStatusCode.Ok).json(rows);

      Logger.info("get all users controller completed");
    } catch (error) {
      next(error);
    }
  }

  async getUserById(req, res, next) {
    try {
        Logger.info("get user by id controller started");

        const { userId } = req.params;

        
        if (!validateUUID(userId)) {
            throw new InvalidError("Invalid user ID.");
        }

        
        const user = await this.userService.getUserById(userId,req.query);

        Logger.info("get user by id controller completed");

        res.status(HttpStatusCode.Ok).json(user);
    } catch (error) {
        next(error);
    }
}

}

const userController = new UserController();
module.exports = userController;
