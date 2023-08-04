const mysql = require('mysql');

const dbConfig = {
  host: "localhost", 
  user: "root",     
  database: "resume_form",
};

const pool = mysql.createPool(dbConfig);


// // Handle GET request to serve the index.html file
// app.get("/", (req, res) => {
//   res.sendFile(path.join(__dirname, "public", "index.html"));
// });

// Handle POST request to /submit
const userModel = {
  insertUser: (userData, callback) => {
    pool.query('INSERT INTO info (name, address, email) VALUES (?, ?, ?)', [userData.name, userData.address, userData.email], (err, results) => {
      if (err) {
        console.log(err);
        return callback(err, null);
      } else {
        console.log('users added');

        // pool.query('SELECT * FROM user_info', (err, result) => {
        //   if (err) {
        //     console.error('Error occurred:', err);
          
        //     return;
        //   }
        
        //   // Step 4: Display data in the console
        //   console.log('Data retrieved from the database:');
        //   console.log(result);
        //   return callback(null, result);
        
        // });

      }
    });
  }
};



// module.exports = userModel;




