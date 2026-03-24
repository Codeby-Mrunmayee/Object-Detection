"""
Core risk analysis engine for hidden-camera surveillance risk estimation.

This module keeps logic simple and explainable for competition demos:
1) Detect objects with YOLO (pretrained COCO model).
2) Apply rule-based risk scoring based on suspicious objects and placement.
3) Detect bright circular spots as possible lens-like reflections.
"""

from __future__ import annotations

from dataclasses import dataclass
from typing import Dict, List, Tuple

import cv2
import numpy as np
from ultralytics import YOLO


@dataclass
class Detection:
    label: str
    confidence: float
    bbox: Tuple[int, int, int, int]  # x1, y1, x2, y2


@dataclass
class RiskResult:
    risk_score: int
    risk_level: str
    detections: List[Detection]
    suspicious_zones: List[Tuple[int, int, int, int]]
    explanations: List[str]
    reflection_count: int


class HiddenCameraRiskAnalyzer:
    def __init__(self, model_path: str = "yolov8n.pt") -> None:
        # The first run downloads weights automatically via ultralytics.
        self.model = YOLO(model_path)

        # Object classes from COCO that can hide/host camera modules in practice.
        self.suspicious_weights: Dict[str, int] = {
            "clock": 20,
            "tv": 18,
            "cell phone": 16,
            "laptop": 12,
            "mouse": 8,
            "remote": 8,
            "book": 5,
            "toaster": 10,
        }

    def analyze_image(self, image_bgr: np.ndarray) -> RiskResult:
        h, w, _ = image_bgr.shape
        detections = self._detect_objects(image_bgr)

        risk_score = 5
        explanations: List[str] = []
        suspicious_zones: List[Tuple[int, int, int, int]] = []

        for det in detections:
            base_weight = self.suspicious_weights.get(det.label, 0)
            if base_weight <= 0:
                continue

            x1, y1, x2, y2 = det.bbox
            cx, cy = (x1 + x2) / 2, (y1 + y2) / 2

            # Position heuristic: objects near center have broader room visibility.
            center_distance = np.sqrt((cx - w / 2) ** 2 + (cy - h / 2) ** 2)
            max_distance = np.sqrt((w / 2) ** 2 + (h / 2) ** 2) + 1e-6
            center_factor = 1 - (center_distance / max_distance)  # 0..1

            # Confidence amplifies score but keeps it bounded.
            obj_risk = int(base_weight * (0.6 + 0.4 * det.confidence) * (0.7 + 0.3 * center_factor))
            risk_score += obj_risk
            suspicious_zones.append(det.bbox)

            explanations.append(
                f"{det.label.title()} detected (conf {det.confidence:.2f}) in a potentially strategic position."
            )

        # Reflection heuristic: tiny bright circular highlights can indicate lenses.
        reflection_count, reflection_boxes = self._detect_lens_like_reflections(image_bgr)
        if reflection_count > 0:
            reflection_boost = min(25, reflection_count * 4)
            risk_score += reflection_boost
            suspicious_zones.extend(reflection_boxes)
            explanations.append(
                f"Detected {reflection_count} bright circular reflection(s), possible lens-like cues."
            )

        # Normalize and classify.
        risk_score = int(max(0, min(100, risk_score)))
        if risk_score < 30:
            risk_level = "LOW"
        elif risk_score < 60:
            risk_level = "MEDIUM"
        else:
            risk_level = "HIGH"

        if not explanations:
            explanations.append("No major suspicious patterns detected in this image.")

        return RiskResult(
            risk_score=risk_score,
            risk_level=risk_level,
            detections=detections,
            suspicious_zones=suspicious_zones,
            explanations=explanations,
            reflection_count=reflection_count,
        )

    def draw_result_overlay(self, image_bgr: np.ndarray, result: RiskResult) -> np.ndarray:
        vis = image_bgr.copy()

        # Draw object detections.
        for det in result.detections:
            x1, y1, x2, y2 = det.bbox
            color = (0, 255, 255) if det.label in self.suspicious_weights else (0, 180, 0)
            cv2.rectangle(vis, (x1, y1), (x2, y2), color, 2)
            cv2.putText(
                vis,
                f"{det.label} {det.confidence:.2f}",
                (x1, max(20, y1 - 8)),
                cv2.FONT_HERSHEY_SIMPLEX,
                0.5,
                color,
                1,
                cv2.LINE_AA,
            )

        # Draw suspicious zones with red border.
        for (x1, y1, x2, y2) in result.suspicious_zones:
            cv2.rectangle(vis, (x1, y1), (x2, y2), (0, 0, 255), 2)

        # Header label.
        cv2.rectangle(vis, (0, 0), (420, 42), (25, 25, 25), -1)
        cv2.putText(
            vis,
            f"Risk Score: {result.risk_score}% | Level: {result.risk_level}",
            (10, 28),
            cv2.FONT_HERSHEY_SIMPLEX,
            0.7,
            (255, 255, 255),
            2,
            cv2.LINE_AA,
        )
        return vis

    def _detect_objects(self, image_bgr: np.ndarray) -> List[Detection]:
        yolo_out = self.model.predict(image_bgr, verbose=False, conf=0.25)
        result = yolo_out[0]

        detections: List[Detection] = []
        names = result.names

        if result.boxes is None:
            return detections

        for box in result.boxes:
            cls_id = int(box.cls.item())
            conf = float(box.conf.item())
            x1, y1, x2, y2 = [int(v) for v in box.xyxy[0].tolist()]
            detections.append(
                Detection(
                    label=names.get(cls_id, str(cls_id)),
                    confidence=conf,
                    bbox=(x1, y1, x2, y2),
                )
            )
        return detections

    def _detect_lens_like_reflections(self, image_bgr: np.ndarray) -> Tuple[int, List[Tuple[int, int, int, int]]]:
        gray = cv2.cvtColor(image_bgr, cv2.COLOR_BGR2GRAY)
        blur = cv2.GaussianBlur(gray, (5, 5), 0)

        # High threshold for tiny bright spots.
        _, thresh = cv2.threshold(blur, 240, 255, cv2.THRESH_BINARY)

        # Remove noise.
        kernel = np.ones((3, 3), np.uint8)
        clean = cv2.morphologyEx(thresh, cv2.MORPH_OPEN, kernel, iterations=1)

        contours, _ = cv2.findContours(clean, cv2.RETR_EXTERNAL, cv2.CHAIN_APPROX_SIMPLE)

        reflection_boxes: List[Tuple[int, int, int, int]] = []
        for cnt in contours:
            area = cv2.contourArea(cnt)
            if area < 5 or area > 150:
                continue

            x, y, w, h = cv2.boundingRect(cnt)
            aspect = w / (h + 1e-6)
            if 0.6 <= aspect <= 1.4:
                reflection_boxes.append((x, y, x + w, y + h))

        return len(reflection_boxes), reflection_boxes
