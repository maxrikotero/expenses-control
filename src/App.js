import React, { Fragment, useState, useEffect } from "react";
import uuid from "uuid/v4";
import {
  Button,
  Form,
  DropdownButton,
  Dropdown,
  Table,
  thead,
  tr,
  th,
  Container,
  Row,
  Col,
  FormControl
} from "react-bootstrap";

const expenseTypes = [
  { id: 1, text: "Niñera" },
  { id: 2, text: "tarjeta" },
  { id: 3, text: "Servicios" },
  { id: 4, text: "Otros" }
];
const initialState = {
  description: "",
  amount: 0,
  typeId: 0
};
const FormExpense = ({ onSave, expense }) => {
  const [state, setState] = useState(initialState);
  useEffect(() => {
    if (expense) setState(expense);
  }, [expense]);

  const { amount, description, typeId } = state;

  const handleChange = ({ target: { name, value } }) => {
    setState(prevState => ({ ...prevState, [name]: value }));
  };

  const handleSave = event => {
    event.preventDefault();
    event.stopPropagation();

    onSave(state);
    setState(initialState);
  };

  return (
    <Fragment key="formexpense">
      <Form onSubmit={handleSave}>
        <Form.Group controlId="formExpense">
          <Form.Label>Tipo de Gasto</Form.Label>
          <Form.Control
            onChange={handleChange}
            name="typeId"
            as="select"
            value={typeId}
            placeholder="Seleccione"
          >
            <option value="">select</option>
            {expenseTypes.map(type => (
              <option value={type.id}>{type.text}</option>
            ))}
          </Form.Control>
          <Form.Label>Monto</Form.Label>
          <Form.Control
            type="text"
            name="amount"
            placeholder="Monto"
            value={amount}
            onChange={handleChange}
          />
          <Form.Label>Descripción</Form.Label>
          <Form.Control
            type="text"
            name="description"
            placeholder="Descripción"
            value={description}
            onChange={handleChange}
          />
        </Form.Group>

        <Button variant="primary" type="submit">
          Guardar
        </Button>
      </Form>
    </Fragment>
  );
};

const Expense = ({ expense, onSet, onRemove }) => {
  const { id, typeId, amount, description } = expense;
  const { text } = expenseTypes
    .filter(i => i.id === parseInt(typeId, 10))
    .reduce(({ text }) => ({ text }));

  const handleEdit = () => {
    onSet(expense);
  };

  const handleRemove = () => {
    onRemove(expense);
  };

  return (
    <Fragment key="expense">
      <tr>
        <td>{id}</td>
        <td>{text}</td>
        <td>{amount}</td>
        <td>{description}</td>
        <td>
          {
            <Fragment key="expensetd">
              <Row>
                <Col>
                  {" "}
                  <Button variant="primary" onClick={handleEdit}>
                    Editar
                  </Button>
                </Col>
                <Col>
                  {" "}
                  <Button variant="danger" onClick={handleRemove}>
                    Borrar
                  </Button>
                </Col>
              </Row>
            </Fragment>
          }
        </td>
      </tr>
    </Fragment>
  );
};

const ListExpenses = ({ expenses, onAdd, onSet, onRemove }) => {
  return (
    <Fragment key="listexpense">
      <Table striped bordered hover>
        <thead>
          <tr>
            <th>#</th>
            <th>Tipo de Gasto</th>
            <th>Monto</th>
            <th>Descripción</th>
          </tr>
        </thead>
        <tbody>
          {expenses.map((expense, index) => (
            <Expense key={index} {...{ expense, onSet, onRemove }} />
          ))}
        </tbody>
      </Table>
    </Fragment>
  );
};

function App() {
  const [state, setState] = useState({
    expenses: [],
    newExpense: null,
    editExpense: null
  });

  const { expenses, newExpense, editExpense } = state;

  const handleSave = expense => {
    const { id } = expense;
    const isEdit = expenses.some(e => e.id === id);
    setState({
      ...state,
      expenses: isEdit
        ? expenses.map(i => (i.id === id ? (i = expense) : i))
        : expenses.concat({ ...expense, id: `id${expenses.length}` })
    });
  };

  const handleSet = expense => {
    const { id } = expense;
    const { expenses } = state;
    const isEdit = expenses.some(i => i.id === id);
    const exp = expenses.reduce(e => (e.id === id ? expense : e));
    if (isEdit) {
      setState({
        ...state,
        editExpense: exp
      });
    } else {
      setState({
        ...state,
        newExpense: { ...exp, id: `id${expenses.length}` }
      });
    }
  };

  const handleRemove = ({ id }) => {
    debugger;
    setState(prevState => ({
      ...prevState,
      expenses: expenses.filter(e => e.id !== id)
    }));
  };

  return (
    <Container fluid>
      <Row>
        <Col sm={8}>
          <ListExpenses
            {...{
              expenses,
              handleSave,
              onSet: handleSet,
              onRemove: handleRemove
            }}
          />
        </Col>
        <Col sm={4}>
          <FormExpense
            onSave={handleSave}
            expense={editExpense ? editExpense : newExpense}
          />
        </Col>
      </Row>
    </Container>
  );
}

export default App;
