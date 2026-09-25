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

		rows, err := db.Query(
			context.Background(),
			"SELECT id, name, age, gender, phone, email, medical_notes FROM patients",
		)

		if err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{
				"error": "Failed to get patients",
			})
			return
		}

		defer rows.Close()

		var patients []models.Patient

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

			patients = append(patients, patient)
		}

		c.JSON(http.StatusOK, patients)
	}
}

func GetPatient(db *pgxpool.Pool) gin.HandlerFunc {
	return func(c *gin.Context) {

		id := c.Param("id")

		var patient models.Patient

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
