const { AppDataSource } = require("../data-source");
const userRepo = AppDataSource.getRepository("User");

exports.getMe = async (req, res) => {
  try {
    const user = await userRepo.findOneBy({ id: req.user.id });
    if (!user) return res.status(404).json({ error: "User not found" });

    const { id, mobile, name, createdAt } = user;
    res.status(200).json({ id, mobile, name, createdAt });
  } catch (err) {
    res.status(500).json({ error: "Something went wrong" });
  }
};
