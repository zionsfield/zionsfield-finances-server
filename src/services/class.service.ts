import ClassRepo from "../repo/class.repo";

class ClassService {
  static async getAll() {
    try {
      const classes = await ClassRepo.findAll();
      return {
        msg: "Found classes",
        status: 200,
        classes,
      };
    } catch (err) {
      console.log(err);
      return { msg: "An error occurred", status: 500 };
    }
  }
}

export default ClassService;
