import User from "../models/User.js";

export default class UserController {
  // Lista todos os usuários, exceto o logado
  static async listOthers(req, res) {
    try {
      const users = await User.find({ _id: { $ne: req.user.id } })
        .select("name")
        .sort({ name: 1 });

      return res.status(200).json({ users });
    } catch (error) {
      return res
        .status(500)
        .json({ message: "Falha ao buscar usuários", error: error.message });
    }
  }
}