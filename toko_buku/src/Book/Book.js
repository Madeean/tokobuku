import React, { useEffect, useRef, useState } from "react";
import Dummy from "../image/Dummy.jpg";
import { Button } from "bootstrap";
import axios from "axios";
import { useHistory } from "react-router";
import toast, { Toaster } from "react-hot-toast";
function Books() {
  const history = useHistory();
  const [data, setData] = useState([]);
  const [deleteId, setDeleteId] = useState(0);
  const [editId, setEditId] = useState(0);

  const judulRef = useRef();
  const sinopsisRef = useRef();
  const [image, setImage] = useState(null);

  const [judul, setJudul] = useState("");
  const [sinopsis, setSinopsis] = useState("");
  const [foto_buku, setFoto_buku] = useState("");

  const getData = () => {
    axios
      .get("https://madeetokobuku.madee.my.id/buku", {
        headers: { "Content-Type": "application/json" },
      })
      .then((res) => {
        setData(res.data.data);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const showBookHandler = (id) => {
    history.push(`/show-book/${id}`);
  };

  useEffect(() => {
    getData();
  }, []);

  const deleteHandler = () => {
    axios
      .post(`https://madeetokobuku.madee.my.id/buku/delete/${deleteId}`)
      .then((res) => {
        // reload page
        window.location.reload(false);
        getData();
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const changeDeleteId = (id) => {
    setDeleteId(id);
  };

  const postHandle = () => {
    const data = new FormData();
    data.append("foto_buku", image);
    data.append("judul", judulRef.current.value);
    data.append("sinopsis", sinopsisRef.current.value);

    axios
      .post("https://madeetokobuku.madee.my.id/buku", data)
      .then((res) => {
        // reload page
        // show toast
        toast("sukses menambah buku");

        getData();
        judulRef.current.value = "";
        sinopsisRef.current.value = "";
        setImage(null);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const editChangeID = (id) => {
    setEditId(id);
    // axios.get(`https://madeetokobuku.madee.my.id/buku/${id}`).then((res) => {
    //   setJudul(res.data.data.judul);
    //   setSinopsis(res.data.data.sinopsis);
    //   setFoto_buku(res.data.data.foto_buku);
    // });
    const myModal = document.getElementById("editModal");
    axios.get(`https://madeetokobuku.madee.my.id/buku/${id}`).then((res) => {
      console.log(res.data.data);
      setJudul(res.data.data[0].judul);
      setSinopsis(res.data.data[0].sinopsis);
      setFoto_buku(res.data.data[0].foto_buku);
      myModal.addEventListener("shown.bs.modal", function () {});
    });
  };

  const editHandle = () => {
    if (image == null) {
      const data = new FormData();
      data.append("judul", judulRef.current.value);
      data.append("sinopsis", sinopsisRef.current.value);
      axios
        .post(`https://madeetokobuku.madee.my.id/buku/edit/${editId}`, data)
        .then((res) => {
          // reload page
          // show toast
          toast("sukses mengedit buku");

          getData();
          judulRef.current.value = "";
          sinopsisRef.current.value = "";
          window.location.reload(false);
        })
        .catch((err) => {
          console.log(err);
        });
      return;
    } else {
      const data = new FormData();
      data.append("foto_buku", image);
      data.append("judul", judulRef.current.value);
      data.append("sinopsis", sinopsisRef.current.value);

      axios
        .post(`https://madeetokobuku.madee.my.id/buku/edit/${editId}`, data)
        .then((res) => {
          // reload page
          // show toast
          toast("sukses mengedit buku");

          getData();
          judulRef.current.value = "";
          sinopsisRef.current.value = "";
          setImage(null);
          window.location.reload(false);
        })
        .catch((err) => {
          console.log(err);
        });
    }
  };

  return (
    <>
      <div
        className="modal fade"
        id="deleteModal"
        tabIndex="-1"
        aria-labelledby="deleteModalLabel"
        aria-hidden="true"
      >
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content">
            <div className="modal-header">
              <h1 className="modal-title fs-5" id="deleteModalLabel">
                Delete Post
              </h1>
              <button
                type="button"
                className="btn-close"
                data-bs-dismiss="modal"
                aria-label="Close"
              ></button>
            </div>
            <div className="modal-body">serius ingin menghapus post ?</div>
            <div className="modal-footer">
              <button
                type="button"
                className="btn btn-secondary"
                data-bs-dismiss="modal"
              >
                Tidak jadi hapus
              </button>
              <button
                type="button"
                className="btn btn-danger"
                data-bs-dismiss="modal"
                onClick={deleteHandler}
              >
                yakin menghapus
              </button>
            </div>
          </div>
        </div>
      </div>

      <div
        className="modal fade"
        id="tambahbuku"
        tabIndex="-1"
        aria-labelledby="tambahbukuLabel"
        aria-hidden="true"
      >
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content">
            <div className="modal-header">
              <h1 className="modal-title fs-5" id="exampleModalLabel">
                Tambah Buku
              </h1>
              <button
                type="button"
                className="btn-close"
                data-bs-dismiss="modal"
                aria-label="Close"
              ></button>
            </div>
            <div className="modal-body">
              <div className="mb-3">
                <label htmlFor="judul" className="col-form-label">
                  Judul buku :
                </label>
                <input
                  type="text"
                  className="form-control"
                  id="judul"
                  ref={judulRef}
                />
              </div>
              <div className="mb-3">
                <label htmlFor="sinopsis" className="col-form-label">
                  Sinopsis:
                </label>
                <textarea
                  className="form-control"
                  id="sinopsis"
                  ref={sinopsisRef}
                ></textarea>
              </div>
              <div className="mb-3">
                <label htmlFor="sinopsis" className="col-form-label">
                  Foto Buku:
                </label>
                <input
                  className="form-control"
                  type="file"
                  id="sinopsis"
                  onChange={(e) => {
                    setImage(e.target.files[0]);
                  }}
                />
              </div>
            </div>
            <div className="modal-footer">
              <button
                type="button"
                className="btn btn-secondary"
                data-bs-dismiss="modal"
              >
                Close
              </button>
              <button
                type="button"
                className="btn btn-primary"
                data-bs-dismiss="modal"
                onClick={postHandle}
              >
                Tambah Buku
              </button>
            </div>
          </div>
        </div>
      </div>

      <div
        className="modal fade"
        id="editModal"
        tabIndex="-1"
        aria-labelledby="editModalLabel"
        aria-hidden="true"
      >
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content">
            <div className="modal-header">
              <h1 className="modal-title fs-5" id="editModalLabel">
                Edit Buku
              </h1>
              <button
                type="button"
                className="btn-close"
                data-bs-dismiss="modal"
                aria-label="Close"
              ></button>
            </div>
            <div className="modal-body">
              <div className="mb-3">
                <label htmlFor="judul" className="col-form-label">
                  Judul buku :
                </label>
                <input
                  type="text"
                  className="form-control"
                  id="judul"
                  defaultValue={judul}
                  ref={judulRef}
                />
              </div>
              <div className="mb-3">
                <label htmlFor="sinopsis" className="col-form-label">
                  Sinopsis:
                </label>
                <textarea
                  className="form-control"
                  id="sinopsis"
                  defaultValue={sinopsis}
                  ref={sinopsisRef}
                ></textarea>
              </div>
              <div className="mb-3">
                <label htmlFor="sinopsis" className="col-form-label">
                  Foto Buku:
                </label>
                <input
                  className="form-control"
                  type="file"
                  id="sinopsis"
                  defaultValue={foto_buku}
                  onChange={(e) => {
                    setImage(e.target.files[0]);
                  }}
                />
              </div>
            </div>
            <div className="modal-footer">
              <button
                type="button"
                className="btn btn-secondary"
                data-bs-dismiss="modal"
              >
                Close
              </button>
              <button
                type="button"
                className="btn btn-primary"
                data-bs-dismiss="modal"
                onClick={editHandle}
              >
                Edit Buku
              </button>
            </div>
          </div>
        </div>
      </div>

      <React.Fragment>
        <nav className="navbar bg-light">
          <div className="container-fluid">
            <span className="navbar-brand mb-0 h1 mx-auto">Toko Buku</span>
          </div>
        </nav>
        <div className="container">
          <div className="d-grid gap-5 mb-4 mt-3">
            <button
              type="button"
              className="btn btn-info "
              data-bs-toggle="modal"
              data-bs-target="#tambahbuku"
            >
              Tambah Buku
            </button>
          </div>
          {data &&
            data.map((item) => (
              <div
                className="card mb-3"
                style={{ height: "250px" }}
                key={item.id}
              >
                <div className="row g-0">
                  <div className="col-md-3">
                    <img
                      src={item.foto_buku ? item.foto_buku : Dummy}
                      className="img-fluid rounded  w-100"
                      style={{ height: "250px" }}
                    />
                  </div>
                  <div className="col-md-9">
                    <div className="card-body">
                      <h5 className="card-title">{item.judul}</h5>
                      <p className="card-text">{item.sinopsis}</p>
                      <div className="row">
                        <div className="col-4">
                          <div className="d-grid">
                            <button
                              className="btn btn-primary"
                              onClick={() => showBookHandler(item.id)}
                            >
                              Lihat Buku
                            </button>
                          </div>
                        </div>
                        <div className="col-4">
                          <div className="d-grid">
                            <button
                              className="btn btn-secondary"
                              data-bs-toggle="modal"
                              data-bs-target="#editModal"
                              onClick={() => editChangeID(item.id)}
                            >
                              Edit Buku
                            </button>
                          </div>
                        </div>
                        <div className="col-4">
                          <div className="d-grid">
                            <button
                              className="btn btn-danger"
                              data-bs-toggle="modal"
                              data-bs-target="#deleteModal"
                              onClick={() => changeDeleteId(item.id)}
                            >
                              Delete Buku
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
        </div>
      </React.Fragment>
    </>
  );
}

export default Books;
