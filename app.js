const path = require('path')
const express = require('express');
const app = express();
const bodyParser = require("body-parser");
const multer = require("multer");
const port = 4006;
const mysql = require('mysql');



// const updateRoute = require("./public/update");
const deleteRoute = require("./public/delete");
const viewRoute = require("./public/view");


// app.use("/", updateRoute);
app.use("/", deleteRoute);
app.use("/", viewRoute);


// Configure multer for file upload
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/"); // Directory to save the uploaded files
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname);
  },
});

const upload = multer({ storage: storage });

// Parse JSON body
app.use(bodyParser.json());

// Serve static files from the "public" directory
app.use(express.static(path.join(__dirname, "public")));

// Serve static files from the "uploads" directory
app.use(express.static(path.join(__dirname, "uploads")));



app.post("/submit", upload.single("profileImage"), (req, res) => {
  // Access the submitted resume data
  const resumeData = req.body;
  console.log(resumeData);
  const profileImage = req.file;
  console.log(profileImage);
  

  // Process the resume data and profile image as needed
  // ...

  // Insert resume data into the MySQL database
  pool.getConnection((err, connection) => {
    if (err) {
      console.error("Error connecting to the database");
      throw err;
    }

    // Insert the resume data into the 'resumes' table
    const resumeSql =
      "INSERT INTO info(profile_image, name, email, dob, phoneno,cnic, address) VALUES (?, ?, ?, ?, ?, ?,?)";
    const resumeValues = [
      profileImage.filename,
      resumeData.name,
      resumeData.email,
      resumeData.dob,
      resumeData.phoneno,
      resumeData.cnic,
      resumeData.address
      
    ];
    console.log(resumeValues);

    connection.query(resumeSql, resumeValues, (err, resumeResult) => {
      if (err) {
        connection.release();
        console.error("Error executing the SQL query");
        throw err;
      }

      // Retrieve the inserted resume ID
      const resumeId = resumeResult.insertId;

      // Insert the degrees data into the 'degrees' table
      if (resumeData.degrees && Array.isArray(resumeData.degrees)) {
        const degrees = resumeData.degrees.map((degree) => [
          resumeId,
          degree.degree,
          degree.university,
          degree.year,
          degree.gpa,
        ]);
        console.log(degrees)
        // degreesSql.shift();
        console.log(degrees);
        const degreesSql =
        "INSERT INTO degrees (resume_id, degree, university, year, GPA) VALUES ?";

        connection.query(degreesSql, [degrees], (err, degreesResult) => {
          if (err) {
            connection.release();
            console.error("Error executing the SQL query");
            throw err;
          }

          // Insert the experiences data into the 'experiences' table
          if (resumeData.experiences && Array.isArray(resumeData.experiences)) {
            const experiences = resumeData.experiences.map((experience) => [
              resumeId,
              experience.company,
              experience.position,
              experience.joining,
              experience.resign,
            ]);
            const experiencesSql =
              "INSERT INTO experiences (resume_id, company, position, joining, resign) VALUES ?";

            connection.query(
              experiencesSql,[experiences], (err, experiencesResult) => {
                if (err) {
                  connection.release();
                  console.error("Error executing the SQL query");
                  throw err;
                }

                // Insert the skills data into the 'skills' table
                if (resumeData.skills && Array.isArray(resumeData.skills)) {
                  const skills = resumeData.skills.map((skill) => [
                    resumeId,
                    skill,
                  ]);
                  const skillsSql =
                    "INSERT INTO skills (resume_id, skill) VALUES ?";

                  connection.query(skillsSql, [skills], (err, skillsResult) => {
                    connection.release();
                    if (err) {
                      console.error("Error executing the SQL query");
                      throw err;
                    }

                    // Handle other database operations as needed

                    // Send a response back to the client
                    res.send("Resume submitted successfully!");
                  });
                } else {
                  connection.release();
                  // Send a response back to the client
                  res.send("Resume submitted successfully!");
                }
              }
            );
          } else {
            connection.release();
            // Send a response back to the client
            res.send("Resume submitted successfully!");
          }
        });
      } else {
        connection.release();
        // Send a response back to the client
        res.send("Resume submitted successfully!");
      }
    });
  });
});









const dbConfig = {
  host: "localhost", 
  user: "root",     
  database: "resume_form",
};

const pool = mysql.createPool(dbConfig);






app.get("/resumeViews", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "cv.html"));
});









// Import routes
const userRoutes = require('./routes/userRoutes');
// const { resolve } = require('path/posix');

// Set up the view engine
app.set('view engine', 'ejs');

// Middleware to parse request body
app.use(express.urlencoded({ extended: true }));
app.use(express.json());


// Serve static files from the public directory
app.use(express.static('/public')); // Use 'public' instead of '/public'

// Use the userRoutes for '/submit' endpoint
app.use('/submit', userRoutes);
// app.post("/submit", (req,res)=>{
//   console.log(submit);
// })
// Route to render the userForm view using layout.ejs as the layout
app.get('/', (req, res) => {
  res.render('userForm', { title: 'User Information Form' });
});
app.get('/table', (req, res) => {
  res.sendFile(path.join(__dirname+"/public/table.html"))
});
app.get('/showData',async(req ,res)=>{
  pool.getConnection((err,connection)=>{
    if(err){
      console.log(err);
      return res.status(500).json({message:"database error"});
    }
    const selectResumeSql="select * from  info";
    connection.query(selectResumeSql,(err,result)=>{
      if(err){
        console.log(err);
      }
      // console.log(result);
      res.send(result);
    });
  });
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
