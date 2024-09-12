const bcrypt = require("bcrypt")
const jwt = require("jsonwebtoken")

const { validateCreateAdminSchema, validateLoginAdmin } = require("../joischemas/admin");
const { resWrapper } = require("../utils");
const { uploadSingleToCloudinary } = require("../utils/cloudinary");

const Admin = require("../models/adminModel");

const includeObj = {
    attributes: {
        exclude: ["password"]
    }
}

const createAdmin = async (req, res) => {
    const { error, value: { name, email, password } } = validateCreateAdminSchema(req.body)
    if (error) return res.status(400).send(resWrapper(error.message, 400, null, error.message));

    const oldUser = await Admin.findOne({
        where: {
            email
        }
    });
    if (oldUser) return res.status(400).send(resWrapper("User With Email ALready Exist", 400, null, "Email With User Already Exist"));

    const { isSuccess, data, error: cloudError } = await uploadSingleToCloudinary(req.file, "admin")
    if (!isSuccess) return res.status(400).send(resWrapper("Failed to upload image", 400, null, cloudError));

    const hashedPassword = await bcrypt.hash(password, 10);
    if (!hashedPassword) return res.status(400).send(resWrapper("Error While Saving. Trying Again", 400, null, "Please Try Again Later"))

    const admin = await Admin.create({ name, email, password: hashedPassword, profilePic: data });

    const temp = await Admin.findByPk(admin.id, {
        ...includeObj
    });

    return res.status(201).send(resWrapper("Admin Created", 201, temp))
}


const login = async (req, res) => {
    const { error, value: { email, password } } = validateLoginAdmin(req.body)
    if (error) return res.status(400).send(resWrapper(error.message, 400, null, error.message));

    const admin = await Admin.findOne({
        where: {
            email
        },
    });

    if (!admin) return res.status(400).send(resWrapper("Email or Password Incorrect", 400, null, "Authorization Error"));

    const passChk = await bcrypt.compare(password, admin.password);
    if (!passChk) return res.status(400).send(resWrapper("Email or Password Incorrect", 400, null, "Authorization Error"))

    const jwtSecret = process.env.JWT_SECRET_KEY
    const token = jwt.sign({ email }, jwtSecret, {
        expiresIn: process.env.JWT_EXPIRY,
    });


    const { password: _, ...adminWithoutPassword } = admin.toJSON();
    return res.status(200).send(resWrapper("Logged In", 200, { admin: adminWithoutPassword, token }));
}



module.exports = { createAdmin, login }