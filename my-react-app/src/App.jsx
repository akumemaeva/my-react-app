import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'


const opentdbCategoryMap = {
  english: 9,
  math: 19,
  science: 17,
  geography: 22,
  random: null
}

const StartScreen = () => {
const [numQuestions, setNumberQuestions] = useState(5);
const [category, setCategory] = useState("random");
const [level, setLevel] = useState("beginner");
const [isQuizStarted, setisQuizStarted] = useState(false);
const [quizQuestions, setQuizQuestions] = useState([]);
const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
const [score, setScore] = useState(0);
const [isQuizFinished, setisQuizFinished] = useState(false);

// Runs when the Start button is clicked
const handleStartQuiz = async () => {
 const difficultyMap = {
  beginner: "easy",
  intermediate: "medium",
  advanced: "hard",
 };

 let apiUrl = `https://opentdb.com/api.php?amount=${numQuestions}&type=multiple`;

 // Add difficulty
 apiUrl += `&difficulty=${difficultyMap[level]}`;

 if (category !=="random" && opentdbCategoryMap[category] !== null) {
 apiUrl += `&category=${opentdbCategoryMap[category]}`;
 }

 try {
  const response = await fetch(apiUrl);
  const data = await response.json();

  if (!data.results || data.results.length === 0) {
    alert("No question found for your selection. Try a different category or level.")
  }

  // Format answer nicely
  const formattedQuestions = data.results.map((q) => {
    const allOptions = [...q.incorrect_answers, q.correct_answer];
    return{
      question: decodeHTML(q.question),
      options: shuffleArray(allOptions.map(decodeHTML)),
      answer: decodeHTML(q.correct_answer),
    };
  });

  setQuizQuestions(formattedQuestions);
  setisQuizStarted(true);
  console.log("Questions:", formattedQuestions);

 } catch (error) {
  console.error("Failed to load questions:", error)
 }
};

const handleAnswer = (selectedOption) => {
  const currentQuestion = quizQuestions[currentQuestionIndex];

  if (selectedOption === currentQuestion.answer) {
    setScore((prevScore) => prevScore + 1)
  }

  const nextIndex = currentQuestionIndex + 1;
  if (nextIndex < quizQuestions.length) {
    setCurrentQuestionIndex(nextIndex);
  } else{
    setisQuizFinished(true);
  }
};

const resetQuiz = () => {
  setisQuizStarted(false);
  setisQuizFinished(false);
  setQuizQuestions([]);
  setCurrentQuestionIndex(0);
  setScore(0)
}


  return(
  <>
  <div className='App'>
    {!isQuizStarted && (
      <div style={{ padding: "20px", fontFamily: "Arial" }}>
      <h1>Welcome to the Quiz App</h1>
  
      <div style={{ marginBottom: "10px" }}>
        <label htmlFor="">
          Number of Question:
          <input type="number"
           min="1"
           max="20"
           value={numQuestions}
           onChange={ (e) => setNumberQuestions(e.target.value) }
           style={{marginLeft:"10px" }} />
        </label>
      </div>
  
      <div style={{ marginBottom: "10px" }}>
        <label htmlFor="">
          Category:
          <select 
          value={category}
          onChange={ (e) => setCategory(e.target.value)}
          style={{ marginLeft:"10px" }}>
            <option value="english">English</option>
            <option value="math">Math</option>
            <option value="geography">Geography</option>
            <option value="science">Science</option>
            <option value="random">Random</option>
            <option value="mixed">Mixed</option>
          </select>
        </label>
      </div>
  
      <div style={{ marginBottom: "10px" }}>
        <label htmlFor="">
          Level
          <select 
          value={level}
          onChange={ (e) => setLevel(e.target.value)}
          style={{ marginLeft:"10px" }}>
            <option value="beginner">Beginner</option>
            <option value="intermediate">Intermediate</option>
            <option value="advanced">Advanced</option>
          </select>
        </label>
      </div>
  
      <button onClick={handleStartQuiz}>Start Quiz</button>
    </div>
    )}
  </div>
  

  {isQuizStarted && !isQuizFinished && quizQuestions.length > 0 && (
  <div>
    <h2>Question {currentQuestionIndex + 1} of {quizQuestions.length}</h2>
    <p>{quizQuestions[currentQuestionIndex].question}</p>

    <div>
      {quizQuestions[currentQuestionIndex].options.map((option, index) => (
        <button
        key={index}
        onClick={() => handleAnswer(option)}
        style={{display: 'block', margin: '10px 0'}}
        >
          {option}
        </button>
      ))}
    </div>
  </div>
)}

{isQuizFinished && (
  <div>
    <h2>Quiz Completed!</h2>
    <p>Your Score: {score} out of {quizQuestions.length}</p>
    <button onClick={resetQuiz}>Play Again</button>
  </div>
)};
  </>

  )
}

function shuffleArray(array) {
  return [...array].sort(() => Math.random() - 0.5);
}

function decodeHTML(html) {
  const txt = document.createElement("textarea");
  txt.innerHTML = html;
  return txt.value;
}

const Question = () => {

}

const Result = () => {

}

const App = () => {
  return(
    <>
     < StartScreen/>
    </>
   
  )
}

export default App
