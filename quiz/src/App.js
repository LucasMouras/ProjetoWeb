import React, { useState, useEffect, useRef } from 'react';
import { Container, Form, Button } from 'react-bootstrap';
import axios from 'axios';
import './App.css';

const URL_CATEGORIAS_API = 'https://opentdb.com/api_category.php';
const API_URL = 'https://opentdb.com/api.php';

function App() {
  const [categorias, setCategorias] = useState([]);
  const [categoria, setCategoria] = useState('');
  const [dificuldade, setDificuldade] = useState('');
  const [pergunta, setPergunta] = useState('');
  const [opcoesResposta, setOpcoesResposta] = useState([]);
  const inputRef = useRef(null);

  useEffect(() => {
    const obterCategorias = async () => {
      try {
        const resposta = await axios.get(URL_CATEGORIAS_API);
        setCategorias(resposta.data.trivia_categories);
      } catch (error) {
        console.error('Erro ao carregar categorias:', error);
      }
    };

    obterCategorias();
  }, []);

  const carregarPergunta = async () => {
    try {
      const resposta = await axios.get(API_URL, {
        params: {
          amount: 1,
          category: categoria,
          difficulty: dificuldade,
          type: 'multiple'
        }
      });
      const perguntaData = resposta.data.results[0];
      setPergunta(perguntaData.question);
      setOpcoesResposta(perguntaData.incorrect_answers.concat(perguntaData.correct_answer));
      inputRef.current.focus();
    } catch (error) {
      console.error('Erro ao carregar pergunta:', error);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    carregarPergunta();
  };

  return (
    <Container className="formulario">
      <Form onSubmit={handleSubmit}>
        <Form.Group controlId="categoria">
          <Form.Label>Categoria:</Form.Label>
          <Form.Control as="select" onChange={(e) => setCategoria(e.target.value)} ref={inputRef}>
            <option value="">Selecione uma categoria</option>
            {categorias.map((categoria) => (
              <option key={categoria.id} value={categoria.id}>
                {categoria.name}
              </option>
            ))}
          </Form.Control>
        </Form.Group>
        <Form.Group controlId="dificuldade">
          <Form.Label>Dificuldade:</Form.Label>
          <Form.Control as="select" onChange={(e) => setDificuldade(e.target.value)}>
            <option value="">Selecione uma dificuldade</option>
            <option value="easy">Fácil</option>
            <option value="medium">Médio</option>
            <option value="hard">Difícil</option>
          </Form.Control>
        </Form.Group>
        <Button variant="primary" type="submit">
          Gerar Pergunta
        </Button>
      </Form>
      {pergunta && (
        <div className="pergunta">
          <p>{pergunta}</p>
          <Form.Group controlId="formRespostas">
            {opcoesResposta.map((opcao, index) => (
              <Form.Check
                type="radio"
                label={opcao}
                name="opcaoResposta"
                id={`opcaoResposta-${index}`}
                key={`opcaoResposta-${index}`}
              />
            ))}
          </Form.Group>
        </div>
      )}
    </Container>
  );
}

export default App;
