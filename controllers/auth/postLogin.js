const User = require('../../models/user')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')

const postLogin = async (req, res) => {
    try {
        const { mail, password } = req.body;

        // check if user exists
        const user = await User.findOne({mail: mail});

        if(user && (await bcrypt.compare(password, user.password))) {
            // send new token
            const token = jwt.sign(
                {
                    userId: user._id,
                    mail: user.mail
                },
                process.env.TOKEN_KEY,
                {
                    expiresIn: '24h'
                }
            );

            return res.status(200).json({
                userDetails: {
                    mail: user.mail,
                    token: token,
                    username: user.username,
                }
            })
        }

        return res.status(404).send("Invalid credentials. Please try again")

    } catch (error) {
        return res.status(500).send('Error occured. Please try again')
    }
}

module.exports = postLogin;