from fastapi import FastAPI, File, UploadFile, Form
from fastapi.middleware.cors import CORSMiddleware
import spacy
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity
import pdfplumber
import re

app = FastAPI()

# Allow CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

nlp = spacy.load("en_core_web_sm")

def preprocess_text(text):
    text = re.sub(r'[^\w\s]', '', text.lower())
    doc = nlp(text)
    return ' '.join([token.lemma_ for token in doc if not token.is_stop])

def extract_keywords(text):
    doc = nlp(text)
    return [token.lemma_ for token in doc if token.pos_ in ['NOUN', 'PROPN', 'VERB']]

@app.post("/analyze")
async def analyze(
    resume: UploadFile = File(...),
    jd: str = Form(...)
):
    # Process PDF
    with pdfplumber.open(resume.file) as pdf:
        resume_text = "\n".join([page.extract_text() for page in pdf.pages])

    # Preprocess texts
    clean_resume = preprocess_text(resume_text)
    clean_jd = preprocess_text(jd)

    # Keyword analysis
    jd_keywords = set(extract_keywords(clean_jd))
    resume_keywords = set(extract_keywords(clean_resume))
    
    matched_keywords = jd_keywords & resume_keywords
    missing_keywords = jd_keywords - resume_keywords
    
    # Calculate score based on matched keywords
    total_keywords = len(jd_keywords)
    matched_count = len(matched_keywords)
    score = round((matched_count / total_keywords) * 100, 1) if total_keywords > 0 else 0
    
    return {
        "score": score,
        "matched": list(matched_keywords),
        "missing": list(missing_keywords)
    }






