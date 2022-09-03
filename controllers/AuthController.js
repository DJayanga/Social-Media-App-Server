import UserModel from "../models/UserModel.js";
import bcrypt from "bcrypt";

//Registering a new user
export const RegisterUser = async (req, res) => {
  const { userName, password, firstName, lastName } = req.body;

  // const user = await UserModal.findOne({ userName });
  // if (user) {
  // return res.status(400).json({ message: "User already exists" });
  // }

  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);

  const newUser = new UserModel({
    userName,
    password: hashedPassword,
    firstName,
    lastName,
  });

  try {
    await newUser.save();
    res.status(200).json({ newUser });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

//Logging a user
export const LoginUser = async (req, res) => {
  const { userName, password } = req.body;
  try {
    const user = await UserModel.findOne({ userName });

    if (user) {
      const validity = await bcrypt.compare(password, user.password);
      validity
        ? res.status(200).json(user)
        : res.status(400).json("Wrong password");
    }
    else {
      res.status(404).json("User does not exist");
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
