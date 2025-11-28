import sqlite3 from 'sqlite3';
sqlite3.verbose();
import { open } from 'sqlite';

/**
 * Open database connection
 * @returns {Promise} Promise that resolves to database connection object
 */
const db = await open({
    filename: "./db.sqlite",
    driver: sqlite3.Database,
});

import express from "express";

const api = express.Router();

let errors = {}

/**
 * GET endpoint to retrieve all grades from the database
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @returns {Promise<void>} Sends JSON response with array of grade records
 */
api.get(
    "/grades",
    async (req, res) => {
        // Query to select all records from grade table
        const q = "SELECT * FROM grade";
        await db.all(q).then((result) => {
            res.json(result)
        });
    },
);

/**
 * DELETE endpoint to remove a grade record by student ID
 * @param {Object} req - Express request object containing student ID in params
 * @param {Object} res - Express response object
 * @returns {Promise<void>} Sends JSON response confirming deletion
 */
api.delete(
    "/grade/:sid",
    async (req, res) => {
        // Parse student ID from request parameters
        const sid = parseInt(req.params['sid'])
        // SQL query to delete record by student ID
        const q = "DELETE FROM grade WHERE studentId = ?";
        await db.run(q, [sid]).then((result) => {
            if (result.changes === 0) {
                res.status(404).json({ "error": "Student not found" });
                return;
            }
            res.json(result);
        });
    }
);

function body_validator(req, form={}) {
    const data = req.body;
    const required = (val) => val !== undefined && val !== "";
    const validate_grade = (grade) => required(grade) && grade >= 0 && grade <= 100;
    const validators = [
        {
            field: ["name"],
            test: {
                POST: () => required(data.name),
            },
            set_form: ([name]) => {
                form[`$${name}`] = data.name
            }
        },
        {
            field: ["englishGrade", "mathGrade", "peGrade"],
            test: {
                PUT: () => validate_grade(data.englishGrade) || validate_grade(data.mathGrade) || validate_grade(data.peGrade),
                POST: () => validate_grade(data.englishGrade) && validate_grade(data.peGrade) && validate_grade(data.mathGrade),
            },
            set_form: ([eng, math, pe]) => {
                if (required(data[eng])) form[`$${eng}`] = data.englishGrade
                if (required(data[math])) form[`$${math}`] = data.mathGrade
                if (required(data[pe])) form[`$${pe}`] = data.peGrade
            }
        }
    ]

    Object.keys(data).forEach(field => {
        if (!validators.some(v => v.field.includes(field))) {
            errors[field] = "Invalid field"
        }
    })
    return validators.filter(v => v.test[req.method]).every(({field, test, set_form}) => {
        if (!test[req.method](field)) {
            errors[field] = "Invalid grade"
            return false;
        } else {
            set_form(field)
            return true;
        }
    })
}



/**
 * POST endpoint to create a new grade record
 * @param {Object} req - Express request object containing grade data in body
 * @param {Object} res - Express response object
 * @returns {Promise<void>} Sends JSON response with created record or error status
 */
api.post(
    '/grade',
    async (req, res) => {
        // Validate required fields in request body
        if (!body_validator(req)) {
            res.status(400).json(errors);
            errors = {};
            return;
        }

        // Prepare grade object with request data
        const grades = {
            $name: req.body['name'],
            $englishGrade: req.body['englishGrade'],
            $mathGrade: req.body['mathGrade'],
            $peGrade: req.body['peGrade'],
        }

        // SQL query to insert new grade record
        const q = `
            INSERT INTO grade (name, englishGrade, mathGrade, peGrade)
            VALUES ($name, $englishGrade, $mathGrade, $peGrade)
        `;

        await db.run(q, grades);
        res.json({"Created": grades});
    }
);


/**
 * PUT route handler for updating student grades
 * @param {Object} req - Express request object containing student data in body and student ID in params
 * @param {Object} res - Express response object used to send responses back to client
 * @returns {Promise<void>} No direct return value, but sends HTTP response
 */
api.put(
    '/grade/:sid',
    async (req, res) => {
        let errors = {}

        // Prepare grade data object for database update
        const grades = {
            $sid: req.params['sid'],
        }

        // Validate the request body before processing
        if(!body_validator(req, grades)) {
            res.status(400).json(errors);
            errors = {};
            return;
        }

        // SQL query to update student grades in the database
        const q = `
            UPDATE grade SET ${Object.keys(grades).filter(key => key !== '$sid').map(key => `${key.slice(1, key.length)} = ${key}`).join(", ")}
            WHERE studentId = $sid
        `;

        // Execute the database update operation
        await db.run(q, grades).then((result) => {
            if (result.changes === 0) {
                res.status(404).json({ "error": "Student not found" });
                return;
            }
            res.json(result)
        }).catch((err) => {
            res.status(404).json(err)
        });
    }
);


export default api;
