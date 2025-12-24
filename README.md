# AI Kata: Building an AI Tool for Learning Intelligence
This project is a production-ready AI-powered tool built for the AI Kata: Building an AI Tool for Learning Intelligence (Data Science & Machine Learning Internship Assessment).
It predicts whether a learner will complete an online course based on their engagement data, using a trained machine learning model.
<br><hr>
<h3>How to Run It Locally</h3>
<h4>Step 1: Clone the Repository</h4><br>
- git clone https://github.com/atharvadeo101/atharvadeo101-kara.git<br>
- cd atharvadeo101-kara
<h4>Step 2: Install Dependencies</h4><br>
- cd backend<br>
- pip install -r requirements.txt
<h4>Step 3: Ensure Model File Exists</h4>
The pre-trained model must be present at <br>backend/models/completion_model.pkl.<br>
- python train.py
<h4>Step 4: Run the Tool</h4> 
- python app.py
<h4>Step 5: Run UI</h4>
- npm install <br>
- npm run dev 
<h4>Input and Output Format</h4>
Input Fields (Required)
FieldTypeDescription / ConstraintsTimeSpentOnCoursefloatTotal time spent (e.g., 120.5)NumberOfVideosWatchedintNumber of videos watched (≥ 0)NumberOfQuizzesTakenintNumber of quizzes taken (≥ 0)QuizScoresfloatAverage quiz score (0–100)CompletionRatefloatCurrent completion percentage (0–100)CourseCategorystringOne of: Programming, Business, Design, Marketing, Data Science, OtherDeviceTypestringOne of: Desktop, Mobile, Tablet
