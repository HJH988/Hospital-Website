package controllers

import (
	"net/http"
	"os"

	"github.com/gin-gonic/gin"
)

func DetectBreastCancer() gin.HandlerFunc {
	return func(c *gin.Context) {

		// Get uploaded file
		file, err := c.FormFile("image")

		if err != nil {
			c.JSON(http.StatusBadRequest, gin.H{
				"error": "No image uploaded",
			})
			return
		}

		// Create uploads folder if it doesn't exist
		err = os.MkdirAll("uploads", os.ModePerm)

		if err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{
				"error": "Could not create upload folder",
			})
			return
		}

		// Save image
		filePath := "uploads/" + file.Filename

		err = c.SaveUploadedFile(file, filePath)

		if err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{
				"error": "Could not save image",
			})
			return
		}

		c.JSON(http.StatusOK, gin.H{
			"message":  "Image uploaded successfully",
			"filename": file.Filename,
			"path":     filePath,
		})
	}
}
