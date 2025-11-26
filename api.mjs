import sqlite3 from 'sqlite3';
sqlite3.verbose();
import { open } from 'sqlite';

/**
 * Open database connection
 * @returns {Promise} Promise that resolves to database connection object
 */
const bd = await open({
    filename: "./db.sqlite",
    driver: sqlite3.Database,
});

import express from "express";

const api = express.Router();

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
        const result = await bd.all(q);
        res.json(result)
    },
)

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
        const sid = parseInt(req.params.sid)
        // SQL query to delete record by student ID
        const q = "DELETE FROM grade WHERE studentId = ?";
        await bd.run(q, [sid]);
        res.json({ "deleted": sid });
    }
)

/**
 * POST endpoint to create a new grade record
 * @param {Object} req - Express request object containing grade data in body
 * @param {Object} res - Express response object
 * @returns {Promise<void>} Sends JSON response with created record or error status
 */
api.post(
    '/grade',
    async (req, res) => {
        console.log(req.body);
        // Validate required fields in request body
        if(
            req.body['name'] === undefined ||
            req.body['englishGrade'] === undefined ||
            req.body['mathGrade'] === undefined ||
            req.body['peGrade'] === undefined
        ) {
            res.sendStatus(400);
            return;
        }

        // Prepare grade object with request data
        const grade = {
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

        await bd.run(q, grade);
        res.json({ "Created": grade });
    }
)

export default api;
