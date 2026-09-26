package routes

import (
	"github.com/gin-gonic/gin"
	"github.com/jackc/pgx/v5/pgxpool"

	"github.com/example/crud-app/controllers"
)

func PatientRoutes(router *gin.Engine, db *pgxpool.Pool) {

	router.GET("/patients", controllers.GetPatients(db))

	router.GET("/patients/:id", controllers.GetPatient(db))

	router.POST("/patients", controllers.CreatePatient(db))

	router.PUT("/patients/:id", controllers.UpdatePatient(db))
}
