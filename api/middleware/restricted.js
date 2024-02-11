const User = require('../user/user-model') ;
const {findBy} = require('../user/user-model') ;
const jwt = require('jsonwebtoken') ;
const {JWT_SECRET} = require('../secrets/secrets-index')

const tempMiddleware = async ( req, res, next ) => {
  const { username, password } = req.body;

  if (! username || ! password) {
    return res.status(400).json({ error: "username and password required" });
  }

  const existingUsersWithThisUsername = await User.findBy({ username });

  if ( existingUsersWithThisUsername.length > 0 ) {
    return res.status(400).json({ error: "username taken" });
  }
  next();
}

const checkUsernameAndPassword = async (req, res, next) => {
  const { username, password } = req.body;

  if (! username || ! password) {
    return res.status(400).json({ error: "username and password required" });
  }
  next()
}




const checkUsernameExists = async (req, res, next) => {
  
    try{
      const [user] = await findBy({username: req.body.username})

      if(!user) {
        res.status(401).json({message: "invalid credentials"})
      } else {
        req.user = user
        next()
      }
     } catch (err) {
      
      next(err)
     }
}

const restricted = (req, res, next) => {
  const token = req.headers.authorization;
  if( ! token ) {
    res.status(401).json({message: 'token required'})
  }
  jwt.verify(token, JWT_SECRET, (err, decodedToken) => {
    if(err){
      res.status(401).json({message: 'token invalid'})
    } else {
      req.decodedJwt = decodedToken
      next();
    }
  })
}



module.exports = {
  tempMiddleware,
  checkUsernameExists,
  checkUsernameAndPassword,
  restricted
}

/*
  IMPLEMENT

  1- On valid token in the Authorization header, call next.

  2- On missing token in the Authorization header,
    the response body should include a string exactly as follows: "token required".

  3- On invalid or expired token in the Authorization header,
    the response body should include a string exactly as follows: "token invalid".
*/
