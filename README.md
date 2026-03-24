# Hidden Camera Risk Analyzer (Competition Prototype)

AI + Web app prototype to estimate hidden surveillance risk from room images.

## What it does

- Upload an image of a room or object layout.
- Detect objects using YOLOv8 pretrained model.
- Score suspicious placements and lens-like bright reflections.
- Show:
  - Risk score (0-100)
  - Threat level (LOW / MEDIUM / HIGH)
  - Highlighted suspicious zones
  - Human-readable explanation and recommendation

## Project Structure

- `app.py` - Streamlit UI app
- `risk_engine.py` - detection + explainable risk scoring logic
- `notebooks/hidden_camera_risk_demo.ipynb` - Jupyter notebook demo
- `requirements.txt` - dependencies

## Quick Start

1. Open terminal in this folder.
2. Create virtual env:
   - Windows PowerShell:
     - `python -m venv .venv`
     - `.venv\Scripts\Activate.ps1`
3. Install packages:
   - `pip install -r requirements.txt`
4. Run web app:
   - `streamlit run app.py`
5. Open URL shown by Streamlit in browser.

## Jupyter Notebook Demo

- Start Jupyter:
  - `jupyter notebook`
- Open: `notebooks/hidden_camera_risk_demo.ipynb`
- Run cells in order.

## Important Notes

- This is a **risk estimation prototype**, not a forensic detector.
- Use it for awareness and pre-checking only.
- You can improve performance later by:
  - adding custom dataset for hidden-camera-like objects
  - training detector on real suspicious object placements
  - fusing with RF or infrared sensor signals
