import React, { useState, useEffect } from 'react';
import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import axios from 'axios';
import { Modal, ModalBody, ModalFooter, ModalHeader } from 'reactstrap';
import logohotel from './assets/logohotel.jpg';

function App() {

  const baseUrl = ("https://localhost:44357/api/Guests");

  const [data, setData] = useState([]);

  const orderGet = async () => {
    await axios.get(baseUrl)
      .then(response => {
        setData(response.data);
      }).catch(error => {
        console.log(error);
      })
  }

  useEffect(() => {
    orderGet();
  })


  return (
    <div className="App">
      <br />
      <h3>Cadastro de Hóspedes</h3>
      <header>
        <img src={''} alt='Cadastro' />
        <button className='btn btn-success'>Incluir Novo Hóspede </button>
      </header>
      <table className='table table-bordered'>
        <thead>
          <tr>
            <th>Id</th>
            <th>Name</th>
            <th>Email</th>
            <th>Adress</th>
            <th>Cpf</th>
            <th>CellNumber</th>
            <th>Checkin</th>
            <th>Checkout</th>
          </tr>
        </thead>
        <tbody>
          {data.map(guest => {
            <tr key={guest.Id}>
              <td>{guest.Id}</td>
              <td>{guest.Name}</td>
              <td>{guest.Email}</td>
              <td>{guest.Adress}</td>
              <td>{guest.Cpf}</td>
              <td>{guest.CellNumber}</td>
              <td>{guest.Checkin}</td>
              <td>{guest.Checkout}</td>
              <td>
                <button className="btn btn-primary">Editar</button> {" "}
                <button className="btn btn-danger">Excluir</button>
              </td>
            </tr>

          })}
        </tbody>

      </table>
    </div>
  );
}

export default App;
