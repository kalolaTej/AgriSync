"""
AgriSync — Classical OpenCV Produce Grading Pipeline

This module implements rule-based produce quality grading using
classical computer-vision techniques.  It is NOT a trained ML
model.  The scoring weights and thresholds are heuristic defaults
that should be calibrated against real produce datasets before
production use.

Techniques used:
    1. HSV color-space analysis — ripeness / discoloration
    2. Adaptive thresholding + contour detection — blemish / defect
    3. Morphological operations — noise cleanup
    4. Contour-based shape analysis — circularity, solidity
    5. Weighted rule-based scoring — transparent, deterministic

Grade mapping (overall_score 0-100):
    A  ≥ 70   — visually healthy, minimal defects
    B  ≥ 40   — acceptable, moderate defects
    C  <  40   — significant issues detected
"""

from __future__ import annotations

import logging
from dataclasses import dataclass, field
from typing import List, Tuple

import cv2
import numpy as np

logger = logging.getLogger("grading")

# ── constants ────────────────────────────────────────────────────────────────

# maximum dimension (width or height) before resizing.
# keeps processing under ~3 s on commodity hardware.
MAX_IMAGE_DIM = 1024

# ── scoring weights (must sum to 1.0) ────────────────────────────────────────
# these are heuristic defaults — calibrate with real produce data.
W_COLOR      = 0.30   # ripeness / color health
W_DEFECT     = 0.35   # blemish / surface defect
W_SHAPE      = 0.20   # shape regularity
W_UNIFORMITY = 0.15   # color uniformity across the produce region

assert abs(W_COLOR + W_DEFECT + W_SHAPE + W_UNIFORMITY - 1.0) < 1e-6, \
    "scoring weights must sum to 1.0"

# ── grade thresholds ─────────────────────────────────────────────────────────
GRADE_A_THRESHOLD = 70   # overall_score ≥ 70 → A
GRADE_B_THRESHOLD = 40   # overall_score ≥ 40 → B
                          # overall_score <  40 → C


# ── data classes ─────────────────────────────────────────────────────────────

@dataclass
class GradingResult:
    """Structured output from the grading pipeline."""
    grade: str                          # "A", "B", or "C"
    defect_flags: List[str] = field(default_factory=list)
    notes: str = ""
    # internal detail — not exposed via the API
    overall_score: float = 0.0
    color_score: float = 0.0
    defect_score: float = 0.0
    shape_score: float = 0.0
    uniformity_score: float = 0.0


# ── preprocessing ────────────────────────────────────────────────────────────

def preprocess_image(img: np.ndarray) -> np.ndarray:
    """Resize large images while preserving aspect ratio.

    Returns a BGR image with its longest edge ≤ MAX_IMAGE_DIM.
    """
    h, w = img.shape[:2]
    if max(h, w) > MAX_IMAGE_DIM:
        scale = MAX_IMAGE_DIM / max(h, w)
        new_w = int(w * scale)
        new_h = int(h * scale)
        img = cv2.resize(img, (new_w, new_h), interpolation=cv2.INTER_AREA)
        logger.debug("resized %dx%d → %dx%d", w, h, new_w, new_h)
    return img


def _extract_produce_mask(img_bgr: np.ndarray) -> np.ndarray:
    """Create a binary mask isolating the primary produce region.

    Strategy: convert to HSV, threshold out low-saturation (white/grey)
    and very dark (black/shadow) regions, then keep the largest connected
    component as the produce.
    """
    hsv = cv2.cvtColor(img_bgr, cv2.COLOR_BGR2HSV)
    # keep pixels with reasonable saturation and value (not background)
    lower = np.array([0, 25, 40])
    upper = np.array([180, 255, 255])
    mask = cv2.inRange(hsv, lower, upper)

    # morphological close to fill small holes, then open to remove specks
    kernel = cv2.getStructuringElement(cv2.MORPH_ELLIPSE, (9, 9))
    mask = cv2.morphologyEx(mask, cv2.MORPH_CLOSE, kernel, iterations=2)
    mask = cv2.morphologyEx(mask, cv2.MORPH_OPEN, kernel, iterations=1)

    # keep only the largest contour (assumed to be the produce)
    contours, _ = cv2.findContours(mask, cv2.RETR_EXTERNAL, cv2.CHAIN_APPROX_SIMPLE)
    if not contours:
        return mask  # fallback: use entire mask

    largest = max(contours, key=cv2.contourArea)
    clean_mask = np.zeros_like(mask)
    cv2.drawContours(clean_mask, [largest], -1, 255, cv2.FILLED)
    return clean_mask


# ── color / ripeness analysis ────────────────────────────────────────────────

def analyze_color(img_bgr: np.ndarray, mask: np.ndarray) -> Tuple[float, List[str]]:
    """Evaluate color health / ripeness within the produce region.

    Returns (score 0-100, defect_flags).

    Approach:
        - Convert to HSV inside the masked produce region.
        - Measure the ratio of pixels in "healthy green-yellow-orange-red"
          hue ranges versus those in "unhealthy brown/dark" ranges.
        - Penalise very low saturation (washed-out / pale patches) and
          very low value (dark spots that may indicate rot).
    """
    hsv = cv2.cvtColor(img_bgr, cv2.COLOR_BGR2HSV)

    # extract only produce pixels
    h_ch = hsv[:, :, 0][mask > 0]
    s_ch = hsv[:, :, 1][mask > 0]
    v_ch = hsv[:, :, 2][mask > 0]

    if len(h_ch) == 0:
        return 50.0, []

    flags: List[str] = []
    total = len(h_ch)

    # --- dark-region penalty (possible rot / bruising) ---
    dark_ratio = np.sum(v_ch < 50) / total
    if dark_ratio > 0.15:
        flags.append("discoloration")

    # --- pale / washed-out region penalty ---
    pale_ratio = np.sum(s_ch < 30) / total
    if pale_ratio > 0.25:
        flags.append("discoloration")

    # --- brownish hue detection (hue ~10-20 with low saturation) ---
    brown_mask_pixels = np.sum(
        (h_ch >= 8) & (h_ch <= 22) & (s_ch >= 30) & (s_ch < 100) & (v_ch < 120)
    )
    brown_ratio = brown_mask_pixels / total
    if brown_ratio > 0.12:
        if "discoloration" not in flags:
            flags.append("discoloration")

    # score: start at 100, penalise for dark / pale / brown regions
    score = 100.0
    score -= dark_ratio * 120    # heavy penalty for dark patches
    score -= pale_ratio * 60     # moderate penalty for pale patches
    score -= brown_ratio * 100   # heavy penalty for browning

    # reward reasonable mean saturation (vivid produce is typically healthy)
    mean_sat = float(np.mean(s_ch))
    if mean_sat > 80:
        score += 5
    elif mean_sat < 40:
        score -= 10

    # deduplicate flags
    flags = list(dict.fromkeys(flags))
    return max(0.0, min(100.0, score)), flags


# ── defect / blemish detection ───────────────────────────────────────────────

def detect_defects(img_bgr: np.ndarray, mask: np.ndarray) -> Tuple[float, List[str]]:
    """Detect surface blemishes and defects via classical CV.

    Returns (score 0-100, defect_flags).
    Higher score = fewer defects.

    Approach:
        - Convert to greyscale, apply Gaussian blur.
        - Adaptive threshold to highlight dark spots / blemishes.
        - Restrict to produce mask, then find contours.
        - Measure total blemish area relative to produce area.
        - Count distinct blemish regions.
    """
    grey = cv2.cvtColor(img_bgr, cv2.COLOR_BGR2GRAY)
    grey = cv2.GaussianBlur(grey, (5, 5), 0)

    # adaptive threshold — highlights dark spots on lighter produce surface
    thresh = cv2.adaptiveThreshold(
        grey, 255,
        cv2.ADAPTIVE_THRESH_GAUSSIAN_C,
        cv2.THRESH_BINARY_INV,
        blockSize=31,
        C=12,
    )

    # erode the mask inward before applying it to the threshold.
    # adaptive thresholding uses a 31x31 neighbourhood; at the produce
    # boundary the neighbourhood mixes bright background pixels with
    # darker produce pixels, creating false-positive "blemish" edges.
    # eroding by ~15 px removes these boundary artifacts.
    erode_kernel = cv2.getStructuringElement(cv2.MORPH_ELLIPSE, (15, 15))
    inner_mask = cv2.erode(mask, erode_kernel, iterations=1)

    # fall back to the original mask if erosion removed too much area
    # (very small produce regions)
    produce_area_full = float(np.sum(mask > 0))
    if np.sum(inner_mask > 0) > produce_area_full * 0.3:
        thresh = cv2.bitwise_and(thresh, inner_mask)
    else:
        thresh = cv2.bitwise_and(thresh, mask)

    # morphological open to remove tiny noise specks
    kernel = cv2.getStructuringElement(cv2.MORPH_ELLIPSE, (5, 5))
    thresh = cv2.morphologyEx(thresh, cv2.MORPH_OPEN, kernel, iterations=1)

    # find blemish contours
    contours, _ = cv2.findContours(thresh, cv2.RETR_EXTERNAL, cv2.CHAIN_APPROX_SIMPLE)

    produce_area = float(np.sum(mask > 0))
    if produce_area == 0:
        return 80.0, []

    # filter out extremely tiny contours (< 0.1 % of produce area)
    min_blemish_area = produce_area * 0.001
    significant_contours = [c for c in contours if cv2.contourArea(c) > min_blemish_area]

    blemish_area = sum(cv2.contourArea(c) for c in significant_contours)
    blemish_ratio = blemish_area / produce_area
    blemish_count = len(significant_contours)

    flags: List[str] = []

    if blemish_ratio > 0.03:
        flags.append("blemish")
    if blemish_ratio > 0.08:
        flags.append("possible_damage")
    if blemish_count > 8:
        flags.append("bruising")

    # score: start at 100, penalise proportionally
    score = 100.0
    score -= blemish_ratio * 350        # heavy penalty for total blemish area
    score -= blemish_count * 2.5        # penalty per distinct blemish region

    return max(0.0, min(100.0, score)), flags


# ── shape analysis ───────────────────────────────────────────────────────────

def analyze_shape(mask: np.ndarray) -> Tuple[float, List[str]]:
    """Evaluate shape regularity of the primary produce region.

    Returns (score 0-100, defect_flags).

    Metrics:
        - Circularity: 4π × area / perimeter².  Perfect circle = 1.0.
        - Solidity: area / convex-hull area.  Perfectly convex = 1.0.

    Most produce is somewhat round or ovoid, so moderate circularity
    is expected.  Very low values suggest irregular shape.
    """
    contours, _ = cv2.findContours(mask, cv2.RETR_EXTERNAL, cv2.CHAIN_APPROX_SIMPLE)
    if not contours:
        return 50.0, []

    largest = max(contours, key=cv2.contourArea)
    area = cv2.contourArea(largest)
    perimeter = cv2.arcLength(largest, True)

    if perimeter == 0 or area < 100:
        return 50.0, []

    circularity = (4 * np.pi * area) / (perimeter * perimeter)
    hull = cv2.convexHull(largest)
    hull_area = cv2.contourArea(hull)
    solidity = area / hull_area if hull_area > 0 else 0

    flags: List[str] = []

    # circularity: many produce items range 0.4-0.9
    if circularity < 0.30:
        flags.append("shape_irregularity")

    # solidity: most whole produce is > 0.85
    if solidity < 0.80:
        flags.append("shape_irregularity")

    # score: blend of circularity and solidity
    # map circularity 0.3-0.9 → 0-100
    circ_norm = np.clip((circularity - 0.20) / 0.70, 0, 1) * 100
    # map solidity 0.7-1.0 → 0-100
    sol_norm = np.clip((solidity - 0.70) / 0.30, 0, 1) * 100

    score = 0.5 * circ_norm + 0.5 * sol_norm

    # deduplicate
    flags = list(dict.fromkeys(flags))
    return max(0.0, min(100.0, score)), flags


# ── color uniformity ─────────────────────────────────────────────────────────

def analyze_uniformity(img_bgr: np.ndarray, mask: np.ndarray) -> Tuple[float, List[str]]:
    """Measure how uniform the produce color is.

    Returns (score 0-100, defect_flags).

    Approach:
        - Compute std-dev of H, S, V channels within the produce mask.
        - Low std-dev = uniform color = healthy produce.
        - High std-dev = mixed colors = possible ripening issues or damage.
    """
    hsv = cv2.cvtColor(img_bgr, cv2.COLOR_BGR2HSV)

    h_ch = hsv[:, :, 0][mask > 0].astype(np.float32)
    s_ch = hsv[:, :, 1][mask > 0].astype(np.float32)
    v_ch = hsv[:, :, 2][mask > 0].astype(np.float32)

    if len(h_ch) == 0:
        return 50.0, []

    flags: List[str] = []

    # hue std-dev: for most single-variety produce, std < 15 is good
    h_std = float(np.std(h_ch))
    s_std = float(np.std(s_ch))
    v_std = float(np.std(v_ch))

    # combined uniformity metric (weighted)
    # hue matters most, then value, then saturation
    combined_std = 0.50 * h_std + 0.25 * v_std + 0.25 * s_std

    if combined_std > 30:
        flags.append("discoloration")

    # map combined_std 5-50 → 100-0
    score = np.clip((50 - combined_std) / 45, 0, 1) * 100

    return float(max(0.0, min(100.0, score))), flags


# ── grade computation ────────────────────────────────────────────────────────

def calculate_grade(overall_score: float) -> str:
    """Map overall score (0-100) to a letter grade.

    Thresholds (heuristic defaults):
        A  ≥ 70
        B  ≥ 40
        C  <  40
    """
    if overall_score >= GRADE_A_THRESHOLD:
        return "A"
    elif overall_score >= GRADE_B_THRESHOLD:
        return "B"
    else:
        return "C"


def _build_notes(result: GradingResult) -> str:
    """Compose a human-readable notes string from sub-scores."""
    parts = [
        f"overall={result.overall_score:.1f}/100",
        f"color={result.color_score:.1f}",
        f"defect={result.defect_score:.1f}",
        f"shape={result.shape_score:.1f}",
        f"uniformity={result.uniformity_score:.1f}",
    ]
    summary = ", ".join(parts)

    if result.grade == "A":
        desc = "Produce appears visually healthy with minimal detected issues."
    elif result.grade == "B":
        desc = "Produce shows moderate visual issues; acceptable quality."
    else:
        desc = "Produce shows significant visual issues; lower quality detected."

    if result.defect_flags:
        desc += f" Detected: {', '.join(result.defect_flags)}."

    return f"{desc} (scores: {summary})"


# ── main pipeline ────────────────────────────────────────────────────────────

def grade_image(img_bgr: np.ndarray) -> GradingResult:
    """Run the full grading pipeline on a BGR image.

    Args:
        img_bgr: OpenCV BGR image (numpy array).

    Returns:
        GradingResult with grade, defect_flags, notes, and sub-scores.
    """
    # 1. preprocess
    img = preprocess_image(img_bgr)

    # 2. extract produce mask
    mask = _extract_produce_mask(img)

    # 3. sub-analyses
    color_score, color_flags       = analyze_color(img, mask)
    defect_score, defect_flags     = detect_defects(img, mask)
    shape_score, shape_flags       = analyze_shape(mask)
    uniformity_score, unif_flags   = analyze_uniformity(img, mask)

    # 4. merge defect flags (deduplicated, stable order)
    all_flags: List[str] = []
    for f in color_flags + defect_flags + shape_flags + unif_flags:
        if f not in all_flags:
            all_flags.append(f)

    # 5. weighted overall score
    overall = (
        W_COLOR      * color_score
        + W_DEFECT   * defect_score
        + W_SHAPE    * shape_score
        + W_UNIFORMITY * uniformity_score
    )

    # 5b. flag-severity penalty
    # when defect flags are present, apply an additive penalty so that
    # flagged defects meaningfully reduce the grade even when other
    # sub-scores (color, shape, uniformity) are high.  this prevents
    # an image with substantial detected defects from receiving an
    # unexpectedly high grade.
    flag_penalty = 0.0
    if "possible_damage" in all_flags:
        flag_penalty += 18.0
    if "bruising" in all_flags:
        flag_penalty += 12.0
    if "blemish" in all_flags:
        flag_penalty += 10.0
    if "discoloration" in all_flags:
        flag_penalty += 8.0
    if "shape_irregularity" in all_flags:
        flag_penalty += 5.0

    overall = overall - flag_penalty
    overall = max(0.0, min(100.0, overall))

    # 6. grade
    grade = calculate_grade(overall)

    # 7. build result
    result = GradingResult(
        grade=grade,
        defect_flags=all_flags,
        overall_score=round(overall, 2),
        color_score=round(color_score, 2),
        defect_score=round(defect_score, 2),
        shape_score=round(shape_score, 2),
        uniformity_score=round(uniformity_score, 2),
    )
    result.notes = _build_notes(result)

    logger.info(
        "grade=%s overall=%.1f color=%.1f defect=%.1f shape=%.1f uniformity=%.1f flags=%s",
        grade, overall, color_score, defect_score, shape_score, uniformity_score, all_flags,
    )

    return result
