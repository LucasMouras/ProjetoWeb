import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

const QuizContext = createContext();

export const useQuizContext = () => {
  return useContext(QuizContext);
};

export const QuizProvider = ({ children }) => {
  const [categorias, setCategorias] = useState([]);
  const [categoria, setCategoria] = useState('');
  const [dificuldade, setDificuldade] = useState('');
  const [pergunta, setPergunta] = useState('');
  const [opcoesResposta, setOpcoesResposta] = useState([]);
  const [respostaUsuario, setRespostaUsuario] = useState('');
  const [mensagem, setMensagem] = useState('');
  const [perguntaData, setPerguntaData] = useState(null);

  useEffect(() => {
    const obterCategorias = async () => {
      try {
        const resposta = await axios.get('https://opentdb.com/api_category.php');
        setCategorias(resposta.data.trivia_categories);
      } catch (error) {
        console.error('Erro ao carregar categorias:', error);
      }
    };

    obterCategorias();
  }, []);

  const decodificador = (html) => {
    var txt = document.createElement('textarea');
    txt.innerHTML = html;
    return txt.value;
  };

  const contextValue = {
    categorias,
    categoria,
    setCategoria,
    dificuldade,
    setDificuldade,
    pergunta,
    setPergunta,
    opcoesResposta,
    setOpcoesResposta,
    respostaUsuario,
    setRespostaUsuario,
    mensagem,
    setMensagem,
    perguntaData,
    setPerguntaData,
    decodificador,
  };

  return <QuizContext.Provider value={contextValue}>{children}</QuizContext.Provider>;
};
