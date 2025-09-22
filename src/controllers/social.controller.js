const jwt = require("jsonwebtoken");
const { User } = require("../models/User");


// Social Login API
// async function socialLogin(req, res) {
//   try {
//     const { login_source, email, name, social_auth, os_type } = req.body;

//     if (!email || !login_source || !social_auth) {
//       return res.status(400).json({
//         status: false,
//         message: "Email, login_source, and social_auth are required",
//       });
//     }

//     // check if user exists
//     let user = await User.findOne({ email });

//     if (!user) {
//       // create new user
//       user = await User.create({
//         email,
//         name,
//         login_source,
//         social_auth,
//         os_type,
//       });
//     } else {
//       // update details if changed
//       user.login_source = login_source;
//       user.social_auth = social_auth;
//       user.os_type = os_type;
//       user.name = name || user.name;
//       await user.save();
//     }

//     // generate JWT token
//     const token = jwt.sign(
//       { id: user._id, email: user.email },
//       process.env.JWT_SECRET,
//       { expiresIn: "7d" }
//     );

//     return res.status(200).json({
//       status: true,
//       data: {
//         _id: user._id,
//         email: user.email,
//         name: user.name,
//         username: user.username || "", // in case you want profile completion later
//         token,
//         refresh_token: token, // optional: generate separate refresh token if needed
//       },
//     });
//   } catch (err) {
//     console.error("Social login error:", err);
//     return res.status(500).json({
//       status: false,
//       message: "Server error in social login",
//     });
//   }
// }



async function socialLogin(req, res) {
  try {
    const { login_source, email, name, social_auth, os_type } = req.body;

    if (!email || !login_source || !social_auth) {
      return res.status(400).json({
        status: false,
        message: "Email, login_source, and social_auth are required",
      });
    }

    let user = await User.findOne({ email });

    if (!user) {
      user = await User.create({
        email,
        name,
        login_source,
        social_auth,
        os_type,
      });
    } else {
      user.login_source = login_source;
      user.social_auth  = social_auth;
      user.os_type      = os_type;
      user.name         = name || user.name;
      await user.save();
    }

    
   
    const token = jwt.sign(
      { uid: user._id, email: user.email, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    return res.status(200).json({
      status: true,
      data: {
        _id: user._id,
        email: user.email,
        name: user.name,
        username: user.username || "",
        token,
        refresh_token: token,   // optional: generate separate refresh token if needed
      },
    });
  } catch (err) {
    console.error("Social login error:", err);
    return res.status(500).json({
      status: false,
      message: "Server error in social login",
    });
  }
}

module.exports = { socialLogin };
