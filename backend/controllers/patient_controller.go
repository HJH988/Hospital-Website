package controllers

import (
	"context"
	"net/http"

	"github.com/gin-gonic/gin"
	"github.com/jackc/pgx/v5/pgxpool"

	"github.com/example/crud-app/models"
)

func GetPatients(db *pgxpool.Pool) gin.HandlerFunc {
	return func(c *gin.Context) {
		
		// Query the database for all patients
		rows, err := db.Query(
			context.Background(),
			"SELECT id, name, age, gender, phone, email, medical_notes FROM patients",
		)

		// Handle any errors that occur during the query
		if err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{
				"error": "Failed to get patients",
			})
			return
		}
		// Ensure that the rows are closed after we are done with them
		defer rows.Close()
		// Create a slice to hold the patients
		var patients []models.Patient
		// Iterate over the rows returned by the query
		for rows.Next() {

			var patient models.Patient

			err := rows.Scan(
				&patient.ID,
				&patient.Name,
				&patient.Age,
				&patient.Gender,
				&patient.Phone,
				&patient.Email,
				&patient.MedicalNotes,
			)

			if err != nil {
				c.JSON(http.StatusInternalServerError, gin.H{
					"error": "Failed to read patient",
				})
				return
			}
			// adds the current patient into the slice
			patients = append(patients, patient)
		}
		// return the patient's data to react
		c.JSON(http.StatusOK, patients)
	}
}

func GetPatient(db *pgxpool.Pool) gin.HandlerFunc {
	return func(c *gin.Context) {
		// Get the patient ID from the URL parameter
		id := c.Param("id")

		// One variable cause we are getting one patient data only
		var patient models.Patient

		// Query the database for the patient with the given ID
		err := db.QueryRow(
			context.Background(),
			`SELECT id, name, age, gender, phone, email, medical_notes
			 FROM patients
			 WHERE id = $1`,
			id,
		).Scan(
			&patient.ID,
			&patient.Name,
			&patient.Age,
			&patient.Gender,
			&patient.Phone,
			&patient.Email,
			&patient.MedicalNotes,
		)

		if err != nil {
			c.JSON(http.StatusNotFound, gin.H{
				"error": "Patient not found",
			})
			return
		}

		c.JSON(http.StatusOK, patient)
	}
}

func CreatePatient(db *pgxpool.Pool) gin.HandlerFunc {
	return func(c *gin.Context) {

		var patient models.Patient

		err := c.ShouldBindJSON(&patient)

		if err != nil {
			c.JSON(http.StatusBadRequest, gin.H{
				"error": "Invalid patient data",
			})
			return
		}

		err = db.QueryRow(
			context.Background(),
			`INSERT INTO patients
				(name, age, gender, phone, email, medical_notes)
			 VALUES
				($1, $2, $3, $4, $5, $6)
			 RETURNING id`,
			patient.Name,
			patient.Age,
			patient.Gender,
			patient.Phone,
			patient.Email,
			patient.MedicalNotes,
		).Scan(&patient.ID)

		if err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{
				"error": "Failed to create patient",
			})
			return
		}

		c.JSON(http.StatusCreated, patient)
	}
}

func UpdatePatient(db *pgxpool.Pool) gin.HandlerFunc {
	return func(c *gin.Context) {
		id := c.Param("id")

		var patient models.Patient

		err := c.ShouldBindJSON(&patient)

		if err != nil {
			c.JSON(http.StatusBadRequest, gin.H{
				"error": "Invalid patient data",
			})
			return
		}

		err = db.QueryRow(
			context.Background(),
			`UPDATE patients
			 SET name = $1,
			     age = $2,
			     gender = $3,
			     phone = $4,
			     email = $5,
			     medical_notes = $6
			 WHERE id = $7
			 RETURNING id, name, age, gender, phone, email, medical_notes`,
			patient.Name,
			patient.Age,
			patient.Gender,
			patient.Phone,
			patient.Email,
			patient.MedicalNotes,
			id,
		).Scan(
			&patient.ID,
			&patient.Name,
			&patient.Age,
			&patient.Gender,
			&patient.Phone,
			&patient.Email,
			&patient.MedicalNotes,
		)

		if err != nil {
			c.JSON(http.StatusNotFound, gin.H{
				"error": "Patient not found",
			})
			return
		}

		c.JSON(http.StatusOK, patient)
	}
}

func DeletePatient(db *pgxpool.Pool) gin.HandlerFunc {
	return func(c *gin.Context) {
		id := c.Param("id")

		result, err := db.Exec(
			context.Background(),
			"DELETE FROM patients WHERE id = $1",
			id,
		)

		if err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{
				"error": "Failed to delete patient",
			})
			return
		}

		if result.RowsAffected() == 0 {
			c.JSON(http.StatusNotFound, gin.H{
				"error": "Patient not found",
			})
			return
		}

		c.JSON(http.StatusOK, gin.H{
			"message": "Patient deleted successfully",
		})
	}
}
