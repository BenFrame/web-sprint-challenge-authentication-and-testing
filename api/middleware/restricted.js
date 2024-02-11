const User = require('../user/user-model') ;

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



module.exports = {
  tempMiddleware
}

/*
  IMPLEMENT

  1- On valid token in the Authorization header, call next.

  2- On missing token in the Authorization header,
    the response body should include a string exactly as follows: "token required".

  3- On invalid or expired token in the Authorization header,
    the response body should include a string exactly as follows: "token invalid".
*/
