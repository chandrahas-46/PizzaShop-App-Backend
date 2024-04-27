// import { Jwt } from "jsonwebtoken";
import jwt from "jsonwebtoken";
// Hash password
import bcrypt from 'bcrypt';
import { userModel } from "./user.schema.js";

export default class UserController {
    async signUp(req, res){
        try{
            const { name, email, password, type } = req.body;
            // console.log("GET client REQ.BODY on SERVER: ",req.body)
            // console.log("GET client REQ.HEADER on SERVER: ",req.headers['authorization'])

            // Check if the user already exists /OR/ handled by [user.schema.js]-unique
            const existingUser = await userModel.findOne({ email });
            if (existingUser) {
                return res.status(400).send({
                    success: false,
                    message: 'User already exists'
                });
            }
            else{
                // 1. Create Hash password
                const hashedPassword = await bcrypt.hash(password, 3);

                const newUser = await userModel.create({ name, email, password: hashedPassword, type });
                //OR// const newUser = new userModel({name, email, password: hashedPassword});
                await newUser.save();
                return res.status(201).send({
                    success: true,
                    message: 'User created successfully',
                    user: newUser
                });
            }
        } 
        catch(err){
            console.log('Error while signing up:', err);
            return res.status(500).send({
                success: false,
                message: 'Error while signing up'
            });
        }
    }

    async signIn(req, res, next){
        try{
            const { email, password } = req.body;
            // 1. Find user by email
            const user = await userModel.findOne({ email });    //[findOne() : returns object {user.name} && find() returns array {user[0].name}]
            // console.log("signIn user ", user);
            if(!user){
                return res.status(400).send({
                    success: false,
                    message: "Invalid Email!!"
                });
            }
            else{
                // 2. Compare password with Hashed password
                // console.log("******bcrypt result *****");
                const result = await bcrypt.compare(req.body.password, user.password);
                // console.log("bcrypt result ", result);  //true/false
                if(result){
                    // a. create token.
                    const token = jwt.sign({
                            userID: user._id,
                            email: user.email,
                        },
                        process.env.JWT_SECRET,
                        {
                            expiresIn: '1h',
                        }
                    );
                    
                    // @@@@@@@@@@@@@@@@@@@@@@@@@@@@ 
                    const currentUser = {
                        name: user.name,
                        email: user.email,
                        type: user.type,
                        _id: user.id,
                    };
                    // @@@@@@@@@@@@@@@@@@@@@@@@@@@@@@
        
                    // b. send token.
                    res.status(200).send({
                        success: true,
                        message: 'User Login successfully',
                        currentUserData: currentUser,
                        token: token
                    });
                    // return res.status(200).send(token);
                }
                else{
                    return res.status(400).send({
                        success: false,
                        message: "Invalid Password!!"
                    });
                }
            }           
        }
        catch(err){
            console.log('Error while signing in:', err);
            res.status(500).send({
                success: false,
                message: 'Error while signing in'
            });
            // return res.status(200).send("Something went wrong");
        }
    }

    async resetPassword(req, res, next){
        const { newPassword } = req.body; 
        const hashedPassword = await bcrypt.hash(newPassword, 3);
        const userID = req.userID;
        try{
            let user = await userModel.findById(userID);
            if(user){
                user.password = hashedPassword;
                user.save();
            }
            res.status(200).send({
                success: true,
                message: "Password updated successfully",
                user: user
            });
        }
        catch(err){
            console.log('Error while reset password: ', err);
            res.status(500).send({
                success: false,
                message: 'Error while reset password'
            });
            next(err);
        }
    }

    // *************** ADMIN *********************
    async getAllUsers(req, res){
        try{
            const users = await userModel.find({});
            res.status(200).send(users);
        }
        catch(err){
            res.status(500).send({
                success: false,
                message: 'Error while get all users',
                error: err.stack
            });
        }
    }

    async deleteUser(req, res){
        const userid = req.body.userid;
        try{
            await userModel.findOneAndDelete({ _id: userid });
            res.status(200).send("User Deleted");
        }
        catch(err){
            res.status(500).send({
                success: false,
                message: 'Error while delete user',
                error: err.stack
            });
        }
    }
}


// router.get("/getallusers", async (req, res) => {
//     try {
//       const users = await User.find({});
//       res.status(200).send(users);
//     } catch (error) {
//       res.status(404).json({ message: error.stack });
//     }
//   });
  
//   router.post("/deleteuser", async (req, res) => {
//     const userid = req.body.userid;
//     try {
//       await User.findOneAndDelete({ _id: userid });
//       res.status(200).send("User Deleted");
//     } catch (error) {
//       res.status(404).json({ message: error.stack });
//     }
//   });
//   module.exports = router;
