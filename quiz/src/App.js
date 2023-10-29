import React, { useState, useEffect } from 'react';
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
          amount: 1, //Quantidade de perguntas
          category: categoria,
          difficulty: dificuldade,
          type: 'multiple' // Tipo de pergunta (pode ser 'multiple', 'boolean', etc.)
        }
      });
      setPergunta(resposta.data.results[0].question);
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
          <Form.Control as="select" onChange={(e) => setCategoria(e.target.value)}>
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
      {pergunta && <div className="pergunta">{pergunta}</div>}
    </Container>
  );
}

export default App;
