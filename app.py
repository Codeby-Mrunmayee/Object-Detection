import io
import json
from datetime import datetime
from typing import Dict, Optional

import cv2
import numpy as np
import pandas as pd
import streamlit as st
from PIL import Image

from risk_engine import HiddenCameraRiskAnalyzer


st.set_page_config(
    page_title="SentinelEye - Privacy Risk Scanner",
    page_icon="🛡️",
    layout="wide",
    initial_sidebar_state="expanded",
)


@st.cache_resource
def get_analyzer() -> HiddenCameraRiskAnalyzer:
    return HiddenCameraRiskAnalyzer(model_path="yolov8n.pt")


def inject_custom_css() -> None:
    st.markdown(
        """
        <style>
        .stApp {
            background: radial-gradient(circle at 10% 10%, #151f37 0%, #0b1220 40%, #050912 100%);
            color: #f0f4ff;
        }
        .block-container {padding-top: 1.4rem;}
        .hero-card {
            border: 1px solid rgba(91, 123, 255, 0.35);
            background: linear-gradient(145deg, rgba(26, 36, 66, 0.92), rgba(13, 20, 37, 0.95));
            border-radius: 16px;
            padding: 1rem 1.2rem;
            margin-bottom: 0.8rem;
        }
        .kpi-card {
            border: 1px solid rgba(125, 154, 255, 0.35);
            border-radius: 12px;
            background: rgba(12, 21, 42, 0.9);
            padding: 0.7rem 0.9rem;
            text-align: center;
        }
        .small-note {
            color: #b8c7ff;
            font-size: 0.87rem;
        }
        </style>
        """,
        unsafe_allow_html=True,
    )


def init_state() -> None:
    if "scan_history" not in st.session_state:
        st.session_state.scan_history = []


def pil_to_bgr(image: Image.Image) -> np.ndarray:
    rgb = np.array(image.convert("RGB"))
    return cv2.cvtColor(rgb, cv2.COLOR_RGB2BGR)


def bgr_to_pil(image_bgr: np.ndarray) -> Image.Image:
    rgb = cv2.cvtColor(image_bgr, cv2.COLOR_BGR2RGB)
    return Image.fromarray(rgb)


def format_recommendation(score: int) -> str:
    if score < 30:
        return "Low risk pattern. Do a quick manual mirror/smoke detector/sockets check."
    if score < 60:
        return "Moderate risk. Verify suspicious objects physically before using private space."
    return "High risk. Avoid private activity, document evidence, and request room change/report."


def risk_color(level: str) -> str:
    colors = {"LOW": "#3ddc97", "MEDIUM": "#ffb020", "HIGH": "#ff5b6e"}
    return colors.get(level, "#8fb3ff")


def make_detection_table(result) -> pd.DataFrame:
    if not result.detections:
        return pd.DataFrame(columns=["Object", "Confidence", "Bounding Box", "Suspicion Tag"])
    rows = []
    suspicious_set = {"clock", "tv", "cell phone", "laptop", "mouse", "remote", "book", "toaster"}
    for d in result.detections:
        rows.append(
            {
                "Object": d.label,
                "Confidence": round(d.confidence, 3),
                "Bounding Box": str(d.bbox),
                "Suspicion Tag": "Potentially suspicious" if d.label in suspicious_set else "Normal",
            }
        )
    return pd.DataFrame(rows)


def download_image_button(label: str, img: Image.Image, file_name: str) -> None:
    buf = io.BytesIO()
    img.save(buf, format="PNG")
    st.download_button(label=label, data=buf.getvalue(), file_name=file_name, mime="image/png")


def context_multiplier(place_type: str) -> float:
    mapping = {
        "Hotel / Airbnb Room": 1.15,
        "Trial Room": 1.25,
        "Washroom": 1.3,
        "Office Cabin": 1.0,
        "Home Bedroom": 1.1,
    }
    return mapping.get(place_type, 1.0)


def render_hero() -> None:
    st.markdown(
        """
        <div class="hero-card">
            <h2 style="margin:0;">🛡️ SentinelEye: Hidden Surveillance Risk Intelligence</h2>
            <p style="margin:0.35rem 0 0 0;" class="small-note">
            Privacy-first AI scanner for quick environment risk screening. Built for competition-grade storytelling.
            </p>
        </div>
        """,
        unsafe_allow_html=True,
    )


def add_history_record(score: int, level: str, location: str) -> None:
    st.session_state.scan_history.append(
        {
            "Timestamp": datetime.now().strftime("%Y-%m-%d %H:%M:%S"),
            "Location Type": location,
            "Score": score,
            "Level": level,
        }
    )


def render_sidebar_controls() -> Dict[str, object]:
    with st.sidebar:
        st.header("Scan Configuration")
        location_type = st.selectbox(
            "Environment Type",
            ["Hotel / Airbnb Room", "Trial Room", "Washroom", "Office Cabin", "Home Bedroom"],
        )
        sensitivity = st.slider("Sensitivity", min_value=0.8, max_value=1.25, value=1.0, step=0.05)
        st.markdown("---")
        st.caption(
            "This prototype estimates risk patterns and is not a forensic/legal guarantee of hidden camera detection."
        )
    return {"location_type": location_type, "sensitivity": sensitivity}


def build_report_json(result, adjusted_score: int, location_type: str) -> str:
    report = {
        "timestamp": datetime.now().isoformat(),
        "location_type": location_type,
        "raw_score": int(result.risk_score),
        "adjusted_score": int(adjusted_score),
        "risk_level": result.risk_level,
        "reflection_count": int(result.reflection_count),
        "explanations": list(result.explanations),
        "detections": [
            {"label": d.label, "confidence": round(float(d.confidence), 4), "bbox": list(d.bbox)}
            for d in result.detections
        ],
    }
    return json.dumps(report, indent=2)


def compute_adjusted_score(base_score: int, sensitivity: float, location_type: str) -> int:
    score = int(base_score * sensitivity * context_multiplier(location_type))
    return max(0, min(100, score))


def render_analyze_tab(uploaded_file: Optional[bytes], controls: Dict[str, object]) -> None:
    st.subheader("Room Risk Scan")
    if uploaded_file is None:
        st.info("Upload a room/object-layout image to run the full scan.")
        return

    image = Image.open(uploaded_file)
    image_bgr = pil_to_bgr(image)

    with st.spinner("Analyzing scene with object + reflection engine..."):
        analyzer = get_analyzer()
        result = analyzer.analyze_image(image_bgr)

    adjusted_score = compute_adjusted_score(
        result.risk_score, float(controls["sensitivity"]), str(controls["location_type"])
    )
    adjusted_level = "LOW" if adjusted_score < 30 else "MEDIUM" if adjusted_score < 60 else "HIGH"
    result.risk_level = adjusted_level
    result.risk_score = adjusted_score

    overlay = bgr_to_pil(get_analyzer().draw_result_overlay(image_bgr, result))
    add_history_record(adjusted_score, adjusted_level, str(controls["location_type"]))

    c1, c2 = st.columns([1, 1], gap="large")
    with c1:
        st.markdown("#### Input Frame")
        st.image(image, use_container_width=True)
    with c2:
        st.markdown("#### AI Overlay")
        st.image(overlay, use_container_width=True)

    k1, k2, k3, k4 = st.columns(4)
    k1.markdown(f"<div class='kpi-card'><h4>Risk Score</h4><h2>{adjusted_score}%</h2></div>", unsafe_allow_html=True)
    k2.markdown(
        f"<div class='kpi-card'><h4>Threat Level</h4><h2 style='color:{risk_color(adjusted_level)}'>{adjusted_level}</h2></div>",
        unsafe_allow_html=True,
    )
    k3.markdown(
        f"<div class='kpi-card'><h4>Reflections</h4><h2>{result.reflection_count}</h2></div>",
        unsafe_allow_html=True,
    )
    k4.markdown(
        f"<div class='kpi-card'><h4>Detected Objects</h4><h2>{len(result.detections)}</h2></div>",
        unsafe_allow_html=True,
    )

    left, right = st.columns([1.1, 0.9], gap="large")
    with left:
        st.markdown("#### Explainable Findings")
        for idx, exp in enumerate(result.explanations, start=1):
            st.write(f"{idx}. {exp}")
        st.success(f"Recommendation: {format_recommendation(adjusted_score)}")
    with right:
        st.markdown("#### Detection Confidence Profile")
        df = make_detection_table(result)
        if not df.empty:
            plot_df = df[["Object", "Confidence"]].copy()
            plot_df = plot_df.sort_values("Confidence", ascending=False).head(8)
            st.bar_chart(plot_df.set_index("Object"))
        else:
            st.caption("No major objects detected in this frame.")

    st.markdown("#### Detection Table")
    st.dataframe(make_detection_table(result), use_container_width=True, hide_index=True)

    report_json = build_report_json(result, adjusted_score, str(controls["location_type"]))
    cdl1, cdl2 = st.columns(2)
    with cdl1:
        download_image_button("Download Risk Overlay", overlay, "sentineleye_overlay.png")
    with cdl2:
        st.download_button(
            "Download Risk Report (JSON)",
            data=report_json,
            file_name="sentineleye_report.json",
            mime="application/json",
        )


def render_checklist_tab() -> None:
    st.subheader("Manual Privacy Sweep Checklist")
    st.caption("Use this after AI scan for practical validation.")
    checks = [
        "Cover mirror edges and look for tiny lens-like holes.",
        "Inspect smoke detector / clock / adapter orientation.",
        "Switch lights off and use phone flashlight to spot unusual reflections.",
        "Check unusually angled wall sockets or USB chargers.",
        "Look for unknown devices connected to room Wi-Fi/power.",
    ]
    for item in checks:
        st.checkbox(item, value=False)
    st.info("Tip: Judges love this hybrid AI + practical checklist approach.")


def render_history_tab() -> None:
    st.subheader("Scan Timeline")
    if not st.session_state.scan_history:
        st.caption("No scans yet. Run at least one analysis.")
        return

    hist_df = pd.DataFrame(st.session_state.scan_history)
    st.dataframe(hist_df, use_container_width=True, hide_index=True)
    st.line_chart(hist_df.set_index("Timestamp")["Score"])
    st.caption("Track how risk changes across multiple room images during demo.")


def main() -> None:
    inject_custom_css()
    init_state()
    render_hero()
    controls = render_sidebar_controls()

    uploader_col, info_col = st.columns([1.2, 0.8])
    with uploader_col:
        uploaded = st.file_uploader(
            "Upload Room / Layout Image",
            type=["jpg", "jpeg", "png", "webp"],
            accept_multiple_files=False,
        )
    with info_col:
        st.markdown(
            """
            <div class="hero-card">
                <h4 style="margin:0;">Demo Mode Features</h4>
                <p class="small-note" style="margin-top:0.4rem;">
                - Context-aware risk scaling<br/>
                - Explainable object + reflection scoring<br/>
                - Scan timeline analytics<br/>
                - Downloadable evidence report
                </p>
            </div>
            """,
            unsafe_allow_html=True,
        )

    tab1, tab2, tab3 = st.tabs(["🔍 Analyze", "✅ Privacy Checklist", "📈 Scan History"])
    with tab1:
        render_analyze_tab(uploaded, controls)
    with tab2:
        render_checklist_tab()
    with tab3:
        render_history_tab()


if __name__ == "__main__":
    main()
