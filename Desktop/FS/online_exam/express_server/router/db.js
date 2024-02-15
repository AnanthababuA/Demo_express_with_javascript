const mysql = require('mysql')

const con = mysql.createConnection({
    host: "tnschools-cluster.cvxfty5zotmt.ap-south-1.rds.amazonaws.com",
    user: "cdac",
    password: "h>$nP7yL4SFw5*`Q",
    database: "tnschools_working"
});


con.connect((err) => {
    if (err) {
        console.error("Error connecting to database:", err);
    } else {
        console.log("Connected to database EMIS DB");
    }
});


module.exports = con;