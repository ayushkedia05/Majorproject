const sendtoken = (user, statusCode, res) => {
    const token = user.getJWTtoken();

    const option = {
        maxAge: process.env.JWT_EXPIRE,
        httpOnly: true,
        secure:true
    };

    res.status(statusCode).cookie("token", token, option).json({
        success: true,
        user,
        token
    });
}
module.exports = sendtoken; 