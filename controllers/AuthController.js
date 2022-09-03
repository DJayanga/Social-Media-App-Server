import UserModel from "../models/UserModel.js";

//Registering a new user
export const RegisterUser = async (req, res) => {
  const { userName, password, firstName, lastName } = req.body;

  // const user = await UserModal.findOne({ userName });
  // if (user) {
  // return res.status(400).json({ message: "User already exists" });
  // }

  const newUser = new UserModel({
    userName,
    password,
    firstName,
    lastName,
  })

  try {
    await newUser.save()
    res.status(200).json({ newUser })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}
