import sys
import json
from pathlib import Path

import cv2
import numpy as np
import torch
import torch.nn as nn
from torchvision import transforms, models
from PIL import Image


# Settings

DEVICE = "cpu"

BASE_DIR = Path(__file__).resolve().parent
MODEL_PATH = BASE_DIR / "best_model.pt"


IMG_SIZE = 224

imagenet_mean = [0.485, 0.456, 0.406]
imagenet_std = [0.229, 0.224, 0.225]


# Load model

def load_model():

    checkpoint = torch.load(
        MODEL_PATH,
        map_location=DEVICE
    )

    model = models.efficientnet_b0(
        weights=models.EfficientNet_B0_Weights.DEFAULT
    )

    in_features = model.classifier[1].in_features
    #  Replace the classifier with a new one for binary classification
    model.classifier[1] = nn.Linear(
        in_features,
        1
    )

    model.load_state_dict(
        checkpoint["model_state"]
    )

    model = model.to(DEVICE)

    model.eval()

    class_to_idx = checkpoint["class_to_idx"]

    return model, class_to_idx


# Image preprocessing

preprocess = transforms.Compose([
    transforms.Resize((IMG_SIZE, IMG_SIZE)),
    transforms.ToTensor(),
    transforms.Normalize(
        imagenet_mean,
        imagenet_std
    ),
])


# Grad-CAM

class GradCAM:

    def __init__(self, model, target_layer):

        self.model = model
        self.target_layer = target_layer

        self.activations = None
        self.gradients = None

        self.target_layer.register_forward_hook(
            self.save_activation
        )

        self.target_layer.register_full_backward_hook(
            self.save_gradient
        )

    def save_activation(self, module, input, output):

        self.activations = output.detach()

    def save_gradient(self, module, grad_input, grad_output):

        self.gradients = grad_output[0].detach()

    def __call__(self, x):

        self.model.zero_grad(
            set_to_none=True
        )

        logits = self.model(x)

        logits[0, 0].backward()

        grads = self.gradients
        acts = self.activations

        weights = grads.mean(
            dim=(2, 3),
            keepdim=True
        )

        cam = (weights * acts).sum(
            dim=1
        )[0]

        cam = torch.relu(cam)

        cam = cam.cpu().numpy()

        cam = (
            cam - cam.min()
        ) / (
            cam.max() + 1e-8
        )

        return logits.detach(), cam


# Main prediction

def predict(image_path):

    model, class_to_idx = load_model()

    # Load original image
    original = cv2.imread(
        str(image_path)
    )

    if original is None:

        raise FileNotFoundError(
            f"Could not read image: {image_path}"
        )

    # Convert BGR → RGB
    img_rgb = cv2.cvtColor(
        original,
        cv2.COLOR_BGR2RGB
    )

    # PIL image for torchvision
    pil_image = Image.fromarray(
        img_rgb
    )

    # Preprocess
    x = preprocess(
        pil_image
    ).unsqueeze(0).to(DEVICE)

    # Grad-CAM
    cammer = GradCAM(
        model,
        model.features[-1]
    )

    logits, cam = cammer(x)

    # Probability
    probability = torch.sigmoid(
        logits
    )[0, 0].item()

    # Binary prediction
    predicted_class = int(
        probability >= 0.5
    )

    # Create Grad-CAM overlay

    height, width = original.shape[:2]

    cam_resized = cv2.resize(
        cam,
        (width, height)
    )

    heatmap = cv2.applyColorMap(
        (cam_resized * 255).astype(
            np.uint8
        ),
        cv2.COLORMAP_JET
    )

    overlay = cv2.addWeighted(
        original,
        0.60,
        heatmap,
        0.40,
        0
    )

    # Save next to input image
    output_path = (
        image_path.parent /
        f"gradcam_{image_path.stem}.png"
    )

    cv2.imwrite(
        str(output_path),
        overlay
    )

    # Get class name

    idx_to_class = {
        value: key
        for key, value in class_to_idx.items()
    }

    class_name = idx_to_class.get(
        predicted_class,
        str(predicted_class)
    )

    # Return result

    result = {
        "prediction": class_name,
        "class_index": predicted_class,
        "probability": probability,
        "confidence": probability if predicted_class == 1 else 1 - probability,
        "gradcam_path": str(output_path)
    }

    return result


# Command line entry point

if __name__ == "__main__":

    if len(sys.argv) < 2:

        print(
            "Usage: python predict.py <image_path>"
        )

        sys.exit(1)

    image_path = Path(
        sys.argv[1]
    )

    try:

        result = predict(
            image_path
        )

        print(
            json.dumps(result)
        )

    except Exception as e:

        print(
            json.dumps({
                "error": str(e)
            })
        )

        sys.exit(1)