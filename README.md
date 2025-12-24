<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>AI Kata: Building an AI Tool for Learning Intelligence</title>
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }
        
        body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
            line-height: 1.6;
            color: #333;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            padding: 20px;
        }
        
        .container {
            max-width: 900px;
            margin: 0 auto;
            background: white;
            border-radius: 12px;
            box-shadow: 0 20px 60px rgba(0,0,0,0.3);
            overflow: hidden;
        }
        
        .header {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            padding: 40px;
            text-align: center;
        }
        
        .header h1 {
            font-size: 2.2em;
            margin-bottom: 10px;
            font-weight: 700;
        }
        
        .header p {
            font-size: 1.1em;
            opacity: 0.95;
            line-height: 1.5;
        }
        
        .content {
            padding: 40px;
        }
        
        h2 {
            color: #667eea;
            font-size: 1.8em;
            margin: 30px 0 20px 0;
            padding-bottom: 10px;
            border-bottom: 3px solid #667eea;
        }
        
        h3 {
            color: #764ba2;
            font-size: 1.4em;
            margin: 25px 0 15px 0;
        }
        
        h4 {
            color: #555;
            font-size: 1.2em;
            margin: 20px 0 10px 0;
        }
        
        .code-block {
            background: #f4f4f9;
            border-left: 4px solid #667eea;
            padding: 15px 20px;
            margin: 15px 0;
            border-radius: 4px;
            font-family: 'Courier New', monospace;
            overflow-x: auto;
        }
        
        .code-block code {
            color: #e83e8c;
            font-size: 0.95em;
        }
        
        .step {
            background: #f8f9fa;
            padding: 20px;
            margin: 15px 0;
            border-radius: 8px;
            border-left: 4px solid #764ba2;
        }
        
        .step h4 {
            color: #764ba2;
            margin-top: 0;
        }
        
        table {
            width: 100%;
            border-collapse: collapse;
            margin: 20px 0;
            box-shadow: 0 2px 8px rgba(0,0,0,0.1);
        }
        
        table thead {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
        }
        
        table th, table td {
            padding: 12px 15px;
            text-align: left;
            border-bottom: 1px solid #ddd;
        }
        
        table tbody tr:hover {
            background: #f5f5f5;
        }
        
        .info-box {
            background: #e7f3ff;
            border-left: 4px solid #2196F3;
            padding: 15px 20px;
            margin: 20px 0;
            border-radius: 4px;
        }
        
        .warning-box {
            background: #fff3cd;
            border-left: 4px solid #ffc107;
            padding: 15px 20px;
            margin: 20px 0;
            border-radius: 4px;
        }
        
        ul, ol {
            margin: 15px 0 15px 30px;
        }
        
        li {
            margin: 8px 0;
        }
        
        .badge {
            display: inline-block;
            padding: 4px 12px;
            background: #667eea;
            color: white;
            border-radius: 12px;
            font-size: 0.85em;
            margin: 5px 5px 5px 0;
        }
        
        hr {
            border: none;
            border-top: 2px solid #eee;
            margin: 30px 0;
        }
        
        .footer {
            background: #f8f9fa;
            padding: 20px 40px;
            text-align: center;
            color: #666;
            border-top: 1px solid #eee;
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>🚀 AI Kata: Building an AI Tool for Learning Intelligence</h1>
            <p>A production-ready AI-powered tool built for the AI Kata: Building an AI Tool for Learning Intelligence (Data Science & Machine Learning Internship Assessment). This tool predicts whether a learner will complete an online course based on their engagement data, using a trained machine learning model.</p>
        </div>
        
        <div class="content">
            <h2>🏃 How to Run It Locally</h2>
            
            <div class="step">
                <h4>Step 1: Clone the Repository</h4>
                <div class="code-block">
                    <code>git clone https://github.com/atharvadeo101/atharvadeo101-kara.git<br>
                    cd atharvadeo101-kara</code>
                </div>
            </div>
            
            <div class="step">
                <h4>Step 2: Install Dependencies</h4>
                <div class="code-block">
                    <code>cd backend<br>
                    pip install -r requirements.txt</code>
                </div>
            </div>
            
            <div class="step">
                <h4>Step 3: Ensure Model File Exists</h4>
                <p>The pre-trained model must be present at <code>backend/models/completion_model.pkl</code>.</p>
                <p>If the model file doesn't exist, train it first:</p>
                <div class="code-block">
                    <code>python train.py</code>
                </div>
            </div>
            
            <div class="step">
                <h4>Step 4: Run the Backend</h4>
                <div class="code-block">
                    <code>python app.py</code>
                </div>
            </div>
            
            <div class="step">
                <h4>Step 5: Run the UI</h4>
                <div class="code-block">
                    <code>npm install<br>
                    npm run dev</code>
                </div>
            </div>
            
            <hr>
            
            <h2>📋 Input and Output Format</h2>
            
            <h3>Input Fields (Required)</h3>
            <table>
                <thead>
                    <tr>
                        <th>Field</th>
                        <th>Type</th>
                        <th>Description / Constraints</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td><strong>TimeSpentOnCourse</strong></td>
                        <td><span class="badge">float</span></td>
                        <td>Total time spent (e.g., 120.5 hours)</td>
                    </tr>
                    <tr>
                        <td><strong>NumberOfVideosWatched</strong></td>
                        <td><span class="badge">int</span></td>
                        <td>Number of videos watched (≥ 0)</td>
                    </tr>
                    <tr>
                        <td><strong>NumberOfQuizzesTaken</strong></td>
                        <td><span class="badge">int</span></td>
                        <td>Number of quizzes taken (≥ 0)</td>
                    </tr>
                    <tr>
                        <td><strong>QuizScores</strong></td>
                        <td><span class="badge">float</span></td>
                        <td>Average quiz score (0–100)</td>
                    </tr>
                    <tr>
                        <td><strong>CompletionRate</strong></td>
                        <td><span class="badge">float</span></td>
                        <td>Current completion percentage (0–100)</td>
                    </tr>
                    <tr>
                        <td><strong>CourseCategory</strong></td>
                        <td><span class="badge">string</span></td>
                        <td>One of: Programming, Business, Design, Marketing, Data Science, Other</td>
                    </tr>
                    <tr>
                        <td><strong>DeviceType</strong></td>
                        <td><span class="badge">string</span></td>
                        <td>One of: Desktop, Mobile, Tablet</td>
                    </tr>
                </tbody>
            </table>
            
            <hr>
            
            <h2>🤖 AI Model</h2>
            
            <div class="info-box">
                <h4>Model Architecture</h4>
                <p><strong>Model:</strong> XGBoost Classifier (XGBClassifier)</p>
                <p><strong>Pipeline:</strong> Scikit-learn Pipeline containing:</p>
                <ul>
                    <li><strong>Preprocessing:</strong> ColumnTransformer
                        <ul>
                            <li>Numerical features → StandardScaler</li>
                            <li>Categorical features → OneHotEncoder(drop='first')</li>
                        </ul>
                    </li>
                    <li><strong>Classifier:</strong> XGBClassifier(random_state=42, eval_metric='logloss')</li>
                </ul>
            </div>
            
            <h3>Why these choices?</h3>
            <ul>
                <li><strong>XGBoost</strong> performs exceptionally well on tabular data with mixed types</li>
                <li><strong>StandardScaler + OneHotEncoder</strong> ensures proper feature scaling and encoding</li>
                <li>No additional feature engineering was needed as the dataset is already clean and informative</li>
                <li>The pipeline approach ensures consistent preprocessing during training and prediction</li>
            </ul>
            
            <hr>
            
            <h2>🔍 AI Usage Disclosure</h2>
            
            <div class="warning-box">
                <h4>AI Tools Used</h4>
                <p><strong>Grok:</strong> I used Grok to assist with this project for code suggestions and debugging.</p>
                <p><strong>V0:</strong> I used V0 to develop an interactive UI for the application.</p>
                <p><br><strong>Important Note:</strong> All core logic (data preprocessing, model training, prediction handling, risk thresholds) was written and verified by me independently.</p>
            </div>
        </div>
        
        <div class="footer">
            <p>Built with 💜 for AI Kata Assessment | © 2024</p>
        </div>
    </div>
</body>
</html>
