import React, { useState, useEffect, useRef } from 'react';
import { Container, Form, Button, Alert } from 'react-bootstrap';
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
  const [respostaUsuario, setRespostaUsuario] = useState('');
  const [mensagem, setMensagem] = useState('');
  const [perguntaData, setPerguntaData] = useState(null);
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

  const decodificador = (html) => {
    var txt = document.createElement('textarea');
    txt.innerHTML = html;
    return txt.value;
  };

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
      setPerguntaData(perguntaData);
      setPergunta(perguntaData.question);
      setOpcoesResposta(perguntaData.incorrect_answers.concat(perguntaData.correct_answer));
      inputRef.current.focus();
      setRespostaUsuario('');
      setMensagem('');
    } catch (error) {
      console.error('Erro ao carregar pergunta:', error);
    }
  };

  const verificarResposta = () => {
    if (respostaUsuario === perguntaData.correct_answer) {
      setMensagem('Parabéns! Você acertou!');
    } else {
      setMensagem(`Ops! Você errou. A resposta correta é: ${perguntaData.correct_answer}`);
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
          <p>{decodificador(pergunta)}</p>
          <Form.Group controlId="formRespostas">
            {opcoesResposta.map((opcao, index) => (
              <Form.Check
                type="radio"
                label={decodificador(opcao)}
                name="opcaoResposta"
                id={`opcaoResposta-${index}`}
                key={`opcaoResposta-${index}`}
                onChange={() => setRespostaUsuario(opcao)}
              />
            ))}
          </Form.Group>
          <Button variant="primary" onClick={verificarResposta}>
            Verificar Resposta
          </Button>
          {mensagem && <Alert variant={respostaUsuario === perguntaData.correct_answer ? 'sucesso' : 'errado'}>{mensagem}</Alert>}
        </div>
      )}
    </Container>
  );
}

export default App;