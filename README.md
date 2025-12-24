# AI Kata: Building an AI Tool for Learning Intelligence

This project is a production-ready AI-powered tool built for the **AI Kata: Building an AI Tool for Learning Intelligence** (Data Science & Machine Learning Internship Assessment). It predicts whether a learner will complete an online course based on their engagement data, using a trained machine learning model.

---

## 🚀 How to Run It Locally

### Step 1: Clone the Repository
```bash
git clone https://github.com/atharvadeo101/atharvadeo101-kara.git
cd atharvadeo101-kara
```

### Step 2: Install Dependencies
```bash
cd backend
pip install -r requirements.txt
```

### Step 3: Ensure Model File Exists
The pre-trained model must be present at `backend/models/completion_model.pkl`.

If the model file is missing, train it by running:
```bash
python train.py
```

### Step 4: Run the Backend
```bash
python app.py
```

### Step 5: Run the UI
```bash
npm install
npm run dev
```

---

## 📋 Input and Output Format

### Input Fields (Required)

| Field | Type | Description / Constraints |
|-------|------|---------------------------|
| `TimeSpentOnCourse` | float | Total time spent (e.g., 120.5) |
| `NumberOfVideosWatched` | int | Number of videos watched (≥ 0) |
| `NumberOfQuizzesTaken` | int | Number of quizzes taken (≥ 0) |
| `QuizScores` | float | Average quiz score (0–100) |
| `CompletionRate` | float | Current completion percentage (0–100) |
| `CourseCategory` | string | One of: Programming, Business, Design, Marketing, Data Science, Other |
| `DeviceType` | string | One of: Desktop, Mobile, Tablet |

### Output
The model returns a prediction indicating whether the learner is likely to complete the course.

---

## 🤖 AI Model

**Model:** XGBoost Classifier (`XGBClassifier`)

**Pipeline:** Scikit-learn Pipeline containing:
- **Preprocessing:** `ColumnTransformer`
  - Numerical features → `StandardScaler`
  - Categorical features → `OneHotEncoder(drop='first')`
- **Classifier:** `XGBClassifier(random_state=42, eval_metric='logloss')`

### Why these choices?
- XGBoost performs well on tabular data with mixed types
- StandardScaler + OneHotEncoder ensures proper feature scaling and encoding
- No additional feature engineering was needed as the dataset is already clean and informative

---

## 🔍 AI Usage Disclosure

- **Grok** - I used Grok to assist with this project
- **V0** - I used V0 to develop an interactive UI

All core logic (data preprocessing, model training, prediction handling, risk thresholds) was written and verified by me independently.

---

## 📄 License

This project is part of an internship assessment and is for educational purposes.

## 🤝 Contributing

This is an assessment project, but feedback and suggestions are welcome!

---

**Built with ❤️ for AI Kata**
