const express = require('express')
const con = require('./db.js');
const router = express.Router();

router.post("/events-list", (req, res) => { 
    try {
        if (!req.body.startdate || !req.body.enddate) {
            return res.status(400).json({ error: 'startdate and enddate are required in the request body' });
          }

        const startdate = req.body.startdate;
        const enddate = req.body.enddate;

        // const sql = `SELECT COUNT(DISTINCT A.schedule_id)
        //                 FROM scheduler_scheduling A
        //                 JOIN scheduler_participants B ON A.schedule_id = B.schedule_id_id
        //                 WHERE
        //                 event_approval_status = 'APPROVED'
        //                 AND (
        //                     (event_startdate BETWEEN '${startdate}' AND '${enddate}')
        //                     OR (event_enddate BETWEEN '${startdate}' AND '${enddate}')
        //                     OR (event_startdate <= '${startdate}' AND event_enddate >= '${enddate}')
        //                 )
        //                 `;

        const sql = `select * from scheduler_scheduling where event_approval_status = 'APPROVED'
                        AND (
                            (event_startdate BETWEEN '${startdate}' AND '${enddate}')
                            OR (event_enddate BETWEEN '${startdate}' AND '${enddate}')
                            OR (event_startdate <= '${startdate}' AND event_enddate >= '${enddate}')
                        )
         ORDER by schedule_id desc limit 10`;

         console.log("query", sql);


    con.query(sql, (err, result) => {

      if(err){
        console.log("Database connection error", err);
        callback(err, false);
      }
      else{        
        const filteredResult = result.map(item => ({ Event_id: item.schedule_id, standard: item.class_std, e_s_date: item.event_startdate, e_e_date: item.event_enddate }));
                
                console.log("Filtered Result:", filteredResult);

                // Send the filtered result as a response
                res.status(200).json({ data: filteredResult });
      } 
    });
    }catch (error) {
        console.error('Error:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

module.exports = router;
