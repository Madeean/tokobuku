import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { useHistory } from "react-router";

function ShowBook(props) {
  const history = useHistory();
  const [judul, setJudul] = useState("");
  const [sinopsis, setSinopsis] = useState("");
  const [foto, setFoto] = useState("");
  // how to print foto judul sinopsis
  const { id } = useParams();

  const getData = () => {
    axios.get(`https://madeetokobuku.madee.my.id/buku/${id}`).then((res) => {
      console.log(res.data.data);
      setJudul(res.data.data[0].judul);
      setSinopsis(res.data.data[0].sinopsis);
      setFoto(res.data.data[0].foto_buku);
    });
  };

  useEffect(() => {
    getData();
  }, [id]);

  const backhandle = () => {
    history.goBack();
  };

  return (
    <React.Fragment>
      <nav className="navbar bg-light">
        <div className="container-fluid">
          <span className="navbar-brand mb-0 h1 mx-auto">Toko Buku</span>
        </div>
      </nav>
      <div className="container">
        <div className="text-center mt-4">
          <img src={foto} className="img-fluid rounded" />
        </div>
        <div>
          <h1 className="text-center mt-4">{judul}</h1>
          <p className="text-center">{sinopsis}</p>
        </div>
        <div style={{ position: "absolute", top: "70px", start: "0px" }}>
          <button className="btn btn-primary" onClick={backhandle}>
            balik
          </button>
        </div>
      </div>
    </React.Fragment>
  );
}

export default ShowBook;
