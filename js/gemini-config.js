// ===== KONFIGURASI GEMINI AI =====
// Dapatkan API Key gratis di https://aistudio.google.com/apikey
const GEMINI_API_KEY = "YOUR_GEMINI_API_KEY";
const GEMINI_MODEL = "gemini-2.0-flash"; // Model: gemini-2.0-flash / gemini-1.5-flash / gemini-1.5-pro

// API Endpoint
const GEMINI_API_URL = `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}:generateContent?key=${GEMINI_API_KEY}`;

// System prompt untuk generate soal kuis
const QUIZ_GENERATION_PROMPT = `Kamu adalah pembuat soal kuis berhadiah. 
Buatkan 5 soal pilihan ganda dengan tema PENGETAHUAN UMUM INDONESIA.
Setiap soal memiliki 5 pilihan jawaban (A, B, C, D, E).
Soal harus bervariasi (sejarah, geografi, budaya, sains, teknologi, olahraga, dll).
Tingkat kesulitan: campuran mudah-sedang.

Format output HARUS sebagai JSON array saja, tanpa teks lain:
[
  {
    "q": "teks soal",
    "options": ["pilihan A", "pilihan B", "pilihan C", "pilihan D", "pilihan E"],
    "correct": 0,
    "explanation": "penjelasan singkat jawaban"
  }
]

Aturan:
- "correct" adalah INDEX jawaban benar (0 untuk A, 1 untuk B, dst)
- "explanation" adalah penjelasan singkat mengapa jawaban itu benar
- Jangan gunakan markdown, HANYA JSON array yang valid
- Pastikan jawaban benar-benar akurat secara faktual`;
