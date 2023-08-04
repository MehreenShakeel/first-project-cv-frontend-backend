const userModel = require('../models/userModel.js'); 
const userController = {
  submitForm: (req, res) => {
    const { name, address, email } = req.body;

    const userData = {
      name: name,
      address: address, 
      email: email
    };

    userModel.insertUser(userData, (err, result) => {
      if (err) {
        console.error('Error submitting form:', err);
        return res.status(500).json({ error: 'An error occurred while submitting the form.' });
      } else {
        console.log('Form submitted successfully');
        return res.json({ message: "Form submitted successfully" });
        
      }
    });
  
  }

};

module.exports = userController;

