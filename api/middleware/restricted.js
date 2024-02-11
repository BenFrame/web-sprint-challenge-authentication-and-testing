const User = require('../user/user-model') ;
const {findBy} = require('../user/user-model')

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

const checkPassword = async (req, res, next) => {
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
        next({
          status: 401, 
          message: 'Invalid credentials'
        })
      } else {
        req.user = user
        next()
      }
     } catch (err) {
      next(err)
     }
}



module.exports = {
  tempMiddleware,
  checkUsernameExists,
  checkPassword
}

/*
  IMPLEMENT

  1- On valid token in the Authorization header, call next.

  2- On missing token in the Authorization header,
    the response body should include a string exactly as follows: "token required".

  3- On invalid or expired token in the Authorization header,
    the response body should include a string exactly as follows: "token invalid".
*/
