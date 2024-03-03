import React, { useEffect, useState } from 'react';
import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import axios from 'axios';
import { Modal, ModalBody, ModalFooter, ModalHeader } from 'reactstrap';
import hotelcalifornialogo from './assets/hotelcalifornialogo.jpg';


function App() {

  const baseUrl = ("https://localhost:44357/api/Guests");

  const [data, setData] = useState([]);
  const [modalIncluir, setModalIncluir] = useState(false);
  const [modalEditar, setModalEditar] = useState(false);
  const [modalDelete, setModalDelete] = useState(false);
  const [updateData, setUpdateData] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  const [guestSelect, setguestSelect] = useState({
    id: '',
    name: '',
    email: '',
    address: '',
    cpf: '',
    cellNumber: '',
    status: ''

  })

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
  };

  const handleChangeFilter = e => {
    const { name, value } = e.target;
    setguestSelect({
      ...guestSelect,
      [name]: value
    });
  };

  const selectGuest = (guests, opcao) => {
    setguestSelect(guests);
    (opcao === "Editar") ?
      openCloseModalEditar() : openCloseModalExcluir();
  }

  const openCloseModalIncluir = () => {
    setModalIncluir(!modalIncluir);
  }

  const openCloseModalEditar = () => {
    setModalEditar(!modalEditar)
  }

  const openCloseModalExcluir = () => {
    setModalDelete(!modalDelete)
  }

  const handleChange = e => {
    const { name, value } = e.target;
    setguestSelect({
      ...guestSelect, [name]: value
    });
    console.log(guestSelect);
  }


  const orderGet = async () => {
    await axios.get(baseUrl)
      .then(response => {
        setData(response.data);
      }).catch(error => {
        console.log(error);
      })
  }

  const orderPost = async () => {
    delete guestSelect.id;
    await axios.post(baseUrl, guestSelect)
      .then(response => {
        setData(data.concat(response.data));
        setUpdateData(true);
        openCloseModalIncluir();
      }).catch(error => {
        console.log(error);
      })
  }

  const orderPut = async () => {
    await axios.put(baseUrl + "/" + guestSelect.id, guestSelect)
      .then(response => {
        var reply = response.data;
        var auxiliaryData = data;
        auxiliaryData.map(guests => {
          if (guests.id === guestSelect.id) {
            guests.name = reply.name;
            guests.email = reply.email;
            guests.address = reply.address;
            guests.cpf = reply.cpf;
            guests.cpf = reply.cellNumber;
            guests.status = reply.status;
          }
        });
        setUpdateData(true);
        openCloseModalEditar();
      }).catch(error => {
        console.log(error);
      })
  }

  const orderDelete = async () => {
    await axios.delete(baseUrl + "/" + guestSelect.id)
      .then(response => {
        setData(data.filter(guests => guests.id !== response.data));
        setUpdateData(true);
        openCloseModalExcluir();
      }).catch(error => {
        console.log(error);
      })

  }

  useEffect(() => {
    if (updateData) {
      orderGet();
      setUpdateData(false);
    }
  }, [updateData])

  return (
    <div className="guest-container">
      <br />
      <h3>Cadastro de Hóspedes</h3>
          <input
      type="text"
      placeholder="Filtrar por nome"
      value={searchTerm}
      onChange={handleSearchChange}
    />
      <header>
        <img src={hotelcalifornialogo} alt="Cadastro" />
        <button className="btn btn-success" onClick={() => openCloseModalIncluir()}> Incluir Novo Hóspede </button>
      </header>
      <table className="table table-bordered">
        <thead>
          <tr>
            <th>Id</th>
            <th>Nome</th>
            <th>E-mail</th>
            <th>Endereço</th>
            <th>CPF</th>
            <th>Númedo do Celular</th>
            <th>Operação</th>
          </tr>
        </thead>
        <tbody>
        {data.filter(guest => guest.name && guest.name.toLowerCase().includes(searchTerm.toLowerCase()))
  .map(guests => (
            <tr key={guests.id}>
              <td>{guests.id}</td>
              <td>{guests.name}</td>
              <td>{guests.email}</td>
              <td>{guests.address}</td>
              <td>{guests.cpf}</td>
              <td>{guests.cellNumber}</td>
              <td>
                <button className="btn btn-primary" onClick={() => selectGuest(guests, "Editar")}>Editar</button> {" "}
                <button className="btn btn-danger" onClick={() => selectGuest(guests, "Exluir")}>Excluir</button>
              </td>
            </tr>
          ))}

        </tbody>
      </table>
      <Modal isOpen={modalIncluir}>

        <ModalHeader> Incluir Hóspedes</ModalHeader>

        <ModalBody>

          <div className="form-group">
            <label>Nome: </label>
            <br />
            <input type="text" className="form-control" name="name" onChange={handleChange} />
            <br />
            <label>Email:</label>
            <br />
            <input type="text" className="form-control" name="email" onChange={handleChange} />
            <br />
            <label>Endereço:</label>
            <br />
            <input type="text" className="form-control" name="address" onChange={handleChange} />
            <br />
            <label>Cpf:</label>
            <br />
            <input type="text" className="form-control" name="cpf" onChange={handleChange} />
            <br />
            <label>Número do Celular:</label>
            <br />
            <input type="text" className="form-control" name="cellNumber" onChange={handleChange} />
            <br />

          </div>
        </ModalBody>
        <ModalFooter>
          <button className="btn btn-primary" onClick={() => orderPost()}>Registrar Entrada</button>{" "}
          <button className="btn btn-danger" onClick={() => openCloseModalIncluir()}>Cancelar</button>
        </ModalFooter>

      </Modal>

      <Modal isOpen={modalEditar}>

        <ModalHeader> Editar Hóspede</ModalHeader>

        <ModalBody>

          <div className="form-group">
            <label>Id: </label>
            <br /> <input type="text" className="form-control" readOnly value={guestSelect && guestSelect.id} />
            <label>Nome: </label><br />
            <input type="text" className="form-control" name="name" onChange={handleChange}
              value={guestSelect && guestSelect.name} />
            <label>Email: </label>
            <br />
            <input type="text" className="form-control" name="email" onChange={handleChange}
              value={guestSelect && guestSelect.email} />
            <br />
            <label>Endereço: </label>
            <br />
            <input type="text" className="form-control" name="address" onChange={handleChange}
              value={guestSelect && guestSelect.address} />
            <br />
            <label>CPF: </label>
            <br />
            <input type="text" className="form-control" name="cpf" onChange={handleChange}
              value={guestSelect && guestSelect.cpf} />
            <br />
            <label>Número do Celular: </label>
            <br />
            <input type="text" className="form-control" name="cellNumber" onChange={handleChange}
              value={guestSelect && guestSelect.cellNumber} />
            <br />

          </div>
        </ModalBody>
        <ModalFooter>
          <button className="btn btn-primary" onClick={() => orderPut()}>Editar</button>{" "}
          <button className="btn btn-danger" onClick={() => openCloseModalEditar()}>Cancelar</button>
        </ModalFooter>
      </Modal>

      <Modal isOpen={modalDelete}>
        <ModalBody>
          Confirma a exlusão deste(a) hóspede(a) : {guestSelect && guestSelect.name} ?
        </ModalBody>
        <ModalFooter>
          <button className="btn btn-danger" onClick={() => orderDelete()}> Sim </button>
          <button className="btn btn-secundary" onClick={() => openCloseModalExcluir()}> Não </button>
        </ModalFooter>
      </Modal>
    </div>
  );
}

export default App;
