package controllers

import (
	"encoding/json"
	"net/http"
	"os"
	"os/exec"
	"path/filepath"

	"github.com/gin-gonic/gin"
)

func DetectBreastCancer() gin.HandlerFunc {
	return func(c *gin.Context) {

		// -----------------------------
		// 1. Get uploaded image
		// -----------------------------

		file, err := c.FormFile("image")

		if err != nil {
			c.JSON(http.StatusBadRequest, gin.H{
				"error": "No image uploaded",
			})
			return
		}

		// -----------------------------
		// 2. Make sure uploads exists
		// -----------------------------

		err = os.MkdirAll("uploads", os.ModePerm)

		if err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{
				"error": "Could not create upload folder",
			})
			return
		}

		// -----------------------------
		// 3. Save uploaded image
		// -----------------------------
		filePath := filepath.Join(
			"uploads",
			file.Filename,
		)

		err = c.SaveUploadedFile(
			file,
			filePath,
		)

		if err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{
				"error": "Could not save image",
			})
			return
		}

		// -----------------------------
		// 4. Run Python prediction
		// -----------------------------

		cmd := exec.Command(
			"python",
			"ml/predict.py",
			filePath,
		)

		output, err := cmd.CombinedOutput()

		if err != nil {

			c.JSON(http.StatusInternalServerError, gin.H{
				"error":   "Python prediction failed",
				"details": string(output),
			})

			return
		}

		// -----------------------------
		// 5. Convert Python JSON
		//    into Go data
		// -----------------------------

		var result map[string]interface{}

		err = json.Unmarshal(
			output,
			&result,
		)

		if err != nil {

			c.JSON(http.StatusInternalServerError, gin.H{
				"error":  "Could not parse Python response",
				"output": string(output),
			})

			return
		}

		// -----------------------------
		// 6. Send result to React
		// -----------------------------

		c.JSON(http.StatusOK, gin.H{

			"message": "Detection completed",

			"filename": file.Filename,

			"prediction": result["prediction"],

			"class_index": result["class_index"],

			"probability": result["probability"],

			"confidence": result["confidence"],

			"gradcam_path": result["gradcam_path"],
		})
	}
}
