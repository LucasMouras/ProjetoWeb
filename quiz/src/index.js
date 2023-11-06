import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import { QuizProvider } from './QuizContext';
import { QuestionProvider } from './QuestionContext';



ReactDOM.render(
  <React.StrictMode>
    <QuizProvider>
      <QuestionProvider>
        <App />
      </QuestionProvider>
    </QuizProvider>
  </React.StrictMode>,
  document.getElementById('root')
);
