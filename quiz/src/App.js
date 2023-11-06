import React, { useRef, useState } from 'react';
import { Container, Form, Button, Alert } from 'react-bootstrap';
import { useQuizContext } from './QuizContext';
import { useQuestionContext } from './QuestionContext';
import './App.css';

function App() {
  const { categorias, categoria, setCategoria, dificuldade, setDificuldade, decodificador } = useQuizContext();
  const { loading, perguntaData, carregarPergunta, verificarResposta } = useQuestionContext();
  const [respostaUsuario, setRespostaUsuario] = useState('');
  const [mensagem, setMensagem] = useState('');
  const inputRef = useRef(null);

  const handleSubmit = (e) => {
    e.preventDefault();
    carregarPergunta(categoria, dificuldade);
  };

  const handleVerificarResposta = () => {
    const mensagem = verificarResposta(respostaUsuario);
    setMensagem(mensagem);
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
      {loading && <p>Carregando pergunta...</p>}
      {perguntaData && (
        <div className="pergunta">
          <p>{decodificador(perguntaData.question)}</p>
          <Form.Group controlId="formRespostas">
            {perguntaData.options.map((opcao, index) => (
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
          <Button variant="primary" onClick={handleVerificarResposta}>
            Verificar Resposta
          </Button>
          {mensagem && <Alert variant={respostaUsuario === perguntaData.options[3] ? 'sucesso' : 'errado'}>{mensagem}</Alert>}
        </div>
      )}
    </Container>
  );
}

export default App;
