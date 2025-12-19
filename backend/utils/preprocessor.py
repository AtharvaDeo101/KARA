import pandas as pd
from sklearn.preprocessing import StandardScaler, OneHotEncoder
from sklearn.compose import ColumnTransformer

def get_preprocessor():
    """Returns the same preprocessor used during training"""
    numerical_cols = [
        'TimeSpentOnCourse',
        'NumberOfVideosWatched',
        'NumberOfQuizzesTaken',
        'QuizScores',
        'CompletionRate'
    ]
    categorical_cols = ['CourseCategory', 'DeviceType']

    preprocessor = ColumnTransformer(
        transformers=[
            ('num', StandardScaler(), numerical_cols),
            ('cat', OneHotEncoder(drop='first', handle_unknown='ignore'), categorical_cols)
        ]
    )
    return preprocessor