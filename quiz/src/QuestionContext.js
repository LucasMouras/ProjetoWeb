import React, { createContext, useContext, useState } from 'react';
import axios from 'axios';

const QuestionContext = createContext();

export const useQuestionContext = () => {
  return useContext(QuestionContext);
};

export const QuestionProvider = ({ children }) => {
  const [perguntaData, setPerguntaData] = useState(null);
  const [loading, setLoading] = useState(false);

  const carregarPergunta = async (categoria, dificuldade) => {
    try {
      setLoading(true);
      const resposta = await axios.get('https://opentdb.com/api.php', {
        params: {
          amount: 1,
          category: categoria,
          difficulty: dificuldade,
          type: 'multiple',
        },
      });
      const perguntaData = resposta.data.results[0];
      setPerguntaData({
        question: perguntaData.question,
        options: [...perguntaData.incorrect_answers, perguntaData.correct_answer],
      });
    } catch (error) {
      console.error('Erro ao carregar pergunta:', error);
    } finally {
      setLoading(false);
    }
  };

  const verificarResposta = (respostaUsuario) => {
    if (respostaUsuario === perguntaData.options[3]) {
      return 'Parabéns! Você acertou!';
    } else {
      return `Ops! Você errou. A resposta correta é: ${perguntaData.options[3]}`;
    }
  };

  const contextValue = {
    perguntaData,
    loading,
    carregarPergunta,
    verificarResposta,
  };

  return <QuestionContext.Provider value={contextValue}>{children}</QuestionContext.Provider>;
};
