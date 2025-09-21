# streamlit_app.py
import streamlit as st

st.set_page_config(layout="wide")

st.markdown(
    """
    <iframe src="https://resume-analyze-automate.netlify.app/"
            style="width:100%; height:90vh; border:none;">
    </iframe>
    """,
    unsafe_allow_html=True
)

