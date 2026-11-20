[README.md](https://github.com/user-attachments/files/35170876/README.md)
# Hospital Management & Breast Cancer Detection System

A full-stack hospital management portfolio project designed for doctors.
The application provides patient record management and an experimental
breast-image classification workflow with Grad-CAM visualisation.

> **Important:** The breast cancer detection feature is an
> educational/portfolio experiment. Its predictions and Grad-CAM
> visualisations are not medical diagnoses and must not be used to make
> clinical decisions.

## Features

### Patient management

-   Doctor login using username and password.
-   JWT-based authentication for protected API routes.
-   View the patient list.
-   Search patients by name.
-   Add, view, edit, and delete patient records.
-   Store patient information in PostgreSQL.

### Breast image analysis

-   Upload an image from the React interface.
-   Send the image to the Go backend.
-   Run a trained EfficientNet-B0 model using Python and PyTorch.
-   Return the predicted class, model output, confidence value, and
    Grad-CAM image path.
-   Display the uploaded image and Grad-CAM visualisation in the
    frontend.

Grad-CAM highlights image regions that influenced the model's output. It
does **not** identify confirmed cancer boundaries or prove that cancer
is present.

## Technology stack

  Layer                  Technology
  ---------------------- -----------------------------------------------
  Frontend               React, Tailwind CSS, React Router
  Backend                Go, Gin
  Database               PostgreSQL
  Database driver/pool   `pgx/v5/pgxpool`
  Authentication         JWT, bcrypt
  Machine learning       Python, PyTorch, Torchvision, EfficientNet-B0
  Image processing       OpenCV, Pillow, NumPy
  Visual explanation     Grad-CAM

## Project structure

The exact structure may vary as the project develops. The main
components are organised approximately as follows:

``` text
project-root/
├── frontend/                 # React application
├── backend/                  # Go/Gin API
│   ├── controllers/
│   ├── database/
│   ├── middleware/
│   ├── models/
│   ├── routes/
│   ├── uploads/               # Uploaded images and Grad-CAM outputs
│   ├── main.go
│   └── .env                   # Local environment variables (not committed)
└── ml/
    ├── predict.py             # Image prediction and Grad-CAM script
    └── best_model.pt          # Trained model checkpoint
```

Adjust the paths above to match the actual folders in your repository.

## Prerequisites

Install the following before running the application:

-   Go
-   Node.js and npm
-   PostgreSQL
-   Python
-   Git

You will also need the Python packages used by the prediction script:

-   `torch`
-   `torchvision`
-   `opencv-python`
-   `numpy`
-   `Pillow`

Use compatible versions of PyTorch and Torchvision. The trained
checkpoint must match the model architecture and class mapping expected
by `predict.py`.

## Configuration

### 1. Database

Create a PostgreSQL database for the application. For example:

``` sql
CREATE DATABASE hospital;
```

Configure the database connection string in the backend `.env` file:

``` env
DATABASE_URL=postgres://YOUR_USERNAME:YOUR_PASSWORD@localhost:5432/hospital
JWT_SECRET=replace_with_a_long_random_secret
```

Replace the placeholders with your local PostgreSQL credentials and a
strong, private JWT secret.

**Do not commit `.env` files, database passwords, JWT secrets, or other
credentials to Git.** Add `.env` to `.gitignore`.

### 2. Machine learning model

Place the trained checkpoint where `predict.py` expects it:

``` text
ml/
├── predict.py
└── best_model.pt
```

The script currently uses:

``` python
DEVICE = "cpu"
```

It loads the model checkpoint, reconstructs EfficientNet-B0, applies the
image preprocessing pipeline, performs inference, and creates a Grad-CAM
overlay.

Make sure the model checkpoint contains the keys expected by the script,
including `model_state` and `class_to_idx`.

### 3. Frontend API configuration

The frontend currently communicates with the Go API at:

``` text
http://localhost:3000
```

The React development server is configured to run at:

``` text
http://localhost:5173
```

The backend CORS configuration must allow the frontend's development
origin. If you use different ports or deploy the application, update the
API address and CORS settings accordingly.

## Running the application

Open separate terminal windows for the frontend and backend.

### 1. Start PostgreSQL

Make sure your PostgreSQL service is running and the configured database
exists.

### 2. Start the Go backend

From the backend directory:

``` bash
go mod download
go run main.go
```

The API is configured to listen on:

``` text
http://localhost:3000
```

The root endpoint can be used as a basic health check:

``` text
GET http://localhost:3000/
```

### 3. Start the React frontend

From the frontend directory:

``` bash
npm install
npm run dev
```

Open the local development URL printed by Vite, expected to be:

``` text
http://localhost:5173
```

### 4. Run the Python prediction script

The Go detection controller invokes the script when an authenticated
detection request is received. You can also test the script directly
from the project root:

``` bash
python ml/predict.py path/to/image.jpg
```

The script prints a JSON result to standard output. It also saves a
Grad-CAM overlay next to the input image.

Ensure that the Python environment used by the Go process has the
required packages installed and that the `python` command is available
on the system PATH.

## API overview

The backend currently provides the following endpoints:

  Method     Endpoint          Purpose                                  Access
  ---------- ----------------- ---------------------------------------- ---------------
  `POST`     `/login`          Authenticate a doctor and return a JWT   Public
  `GET`      `/patients`       Retrieve patient records                 Authenticated
  `GET`      `/patients/:id`   Retrieve one patient                     Authenticated
  `POST`     `/patients`       Create a patient                         Authenticated
  `PUT`      `/patients/:id`   Update a patient                         Authenticated
  `DELETE`   `/patients/:id`   Delete a patient                         Authenticated
  `POST`     `/detect`         Run breast-image detection               Authenticated

For protected endpoints, include the token in the request header:

``` http
Authorization: Bearer YOUR_JWT_TOKEN
```

The detection endpoint expects a multipart form upload with the field
name:

``` text
image
```

The frontend and Go controller must use the same field name.

## How the detection workflow works

1.  A doctor selects an image in the React frontend.
2.  React sends the image to `POST /detect` as multipart form data,
    including the JWT.
3.  Gin checks authentication and receives the uploaded file.
4.  Go saves the image in the uploads directory.
5.  Go starts `ml/predict.py`, passing the saved image path as a
    command-line argument.
6.  Python loads the trained EfficientNet-B0 checkpoint and preprocesses
    the image.
7.  The model produces a binary classification output.
8.  Grad-CAM generates a visualisation of image regions that influenced
    the model output.
9.  Python prints the result as JSON.
10. Go parses the JSON and returns the result to React.
11. React displays the prediction information and Grad-CAM
    visualisation.

## Current limitations and planned improvements

The following are useful next steps for the project:

-   **Detection history:** Save each detection result in PostgreSQL and
    associate it with a patient using a `patient_id` foreign key.
    Detection history is not currently persisted in the database.
-   **Image security:** Generate unique server-side filenames, validate
    uploaded file types and sizes, and avoid exposing sensitive patient
    images through an unrestricted public static route.
-   **Authorisation:** Add record-level access checks. A valid JWT
    authenticates a user but does not automatically grant permission to
    every patient record.
-   **Model lifecycle:** Consider keeping the model loaded in a
    persistent Python service instead of loading it for every detection
    request.
-   **Error handling:** Improve logging and return safe client-facing
    errors without exposing internal Python or server details.
-   **Validation:** Add stronger validation for patient fields and
    uploaded images.
-   **Medical safeguards:** Clearly label model outputs as experimental
    and ensure they are not presented as clinical diagnoses.

## Security notes

This project is intended as a portfolio/demo application. Before using a
system like this with real patient information:

-   Use HTTPS.
-   Protect secrets and database credentials.
-   Restrict access to patient records and uploaded images.
-   Apply appropriate authentication, authorisation, audit logging, and
    data-retention controls.
-   Review applicable healthcare privacy and data-protection
    requirements.
-   Have any medical AI system independently validated and reviewed by
    qualified professionals.

## Disclaimer

This project demonstrates full-stack development and an experimental
machine-learning workflow. The model may make incorrect predictions, and
Grad-CAM visualisations are not proof of disease location. It is not a
medical device or a substitute for professional medical assessment.
