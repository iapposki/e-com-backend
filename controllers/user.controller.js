const {createUser} = require('../services/user.service')

const signUp = async (req, res) => {
    
    const {name, email, password, confirmPassword, phoneNumber, dob} = req.body;
    // console.log("Initializing user creation");

    var condition = true;

    // Check if all fields are present
    if (!(name && email && password && phoneNumber && confirmPassword)) {
        res.status(400).json({msg: 'Insufficient information'});
        condition = false;
    }

    // Check if password and confirm password match
    if (password !== confirmPassword) {
        res.status(400).json({msg: 'Passwords do not match'});
        condition = false;
    }
    if (condition) {
        try {
            await createUser({name, email, password, phoneNumber, dob});
            // await prisma.user.create({
            //     data: {
            //         name, email, password, phoneNumber, dob 
            //     }
            // })
            res.status(201).json({msg: 'User created successfully'});
        } catch (error) {
            console.log(error.stack);
            res.status(500).json({msg: 'Something Failed'});
        }
    }
}

const login = async (req, res) => {

}

module.exports = {
    login,
    signUp
}