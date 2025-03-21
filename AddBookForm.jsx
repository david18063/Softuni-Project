import React, { useState } from "react";

const AddBookForm = () => {
  const [formData, setFormData] = useState({
    title: "",
    author: "",
    publisher: "",
    price: "",
    address: "",
    city: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Form submitted:", formData);
    // Add submission logic here (e.g., API request)
  };

  return (
    <div className="center_content">
      <div className="center_title_bar">📚 Добавяне на книга</div>
      <div>
        <div>
          <div>
            <div className="container">
              <div className="row flex-lg-nowrap">
                <div className="col">
                  <div className="row">
                    <div className="col mb-3">
                      <div className="card">
                        <div className="card-body">
                          <div className="e-profile">
                            <div className="row">
                                <div className="mx-auto" style={{ width: "140px" }}>
                                    <div
                                    className="d-flex justify-content-center align-items-center rounded"
                                    style={{ height: "140px" }}
                                    >
                                    <img
                                        width="150px"
                                        height="150px"
                                        src="https://www.shareicon.net/data/256x256/2016/06/27/623443_book_256x256.png"
                                        alt="Add Book Image"
                                    />
                                    </div>
                                </div>
                            </div>
                              
                            <div className="tab-content pt-3">
                              <div className="tab-pane active">
                                <form className="form" onSubmit={handleSubmit}>
                                  <div className="row">
                                    <div className="col">
                                      <div className="row">
                                        <div className="col mb-3">
                                          <div className="form-group">
                                            <label>Заглавие</label>
                                            <input
                                              style={{ width: "90%" }}
                                              className="form-control"
                                              type="text"
                                              name="title"
                                              onChange={handleChange}
                                            />
                                          </div>
                                        </div>
                                        <div className="col mb-3">
                                          <div className="form-group">
                                            <label>Автор</label>
                                            <input
                                              style={{ width: "90%" }}
                                              className="form-control"
                                              type="text"
                                              name="author"
                                              onChange={handleChange}
                                            />
                                          </div>
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                  <div className="row">
                                    <div className="col mb-3">
                                        <div className="form-group">
                                            <label>Категория</label>
                                            <select
                                            className="form-control"
                                            style={{ width: "90%" }}
                                            name="category"
                                            value={formData.category}
                                            onChange={handleChange}
                                            >
                                            <option value="Компютърна литература">Компютърна литература</option>
                                            <option value="Бизнес и икономика">Бизнес и икономика</option>
                                            <option value="Художествена литература">Художествена литература</option>
                                            <option value="Детски книги">Детски книги</option>
                                            </select>
                                        </div>
                                        </div>

                                        <div className="col mb-3">
                                        <div className="form-group">
                                            <label>Издателство</label>
                                            <select
                                            className="form-control"
                                            style={{ width: "90%" }}
                                            name="publisher"
                                            value={formData.publisher}
                                            onChange={handleChange}
                                            >
                                            <option value="Асеневци">Асеневци</option>
                                            <option value="Кръгозор">Кръгозор</option>
                                            <option value="Сиела">Сиела</option>
                                            <option value="Световна библиотека">Световна библиотека</option>
                                            </select>
                                        </div>
                                    </div>

                                  </div>
                                  <div className="row">
                                    <div className="col mb-3">
                                        <div className="form-group">
                                            <label>URL на изображението</label>
                                            <input
                                                style={{ width: "95%" }}
                                                className="form-control"
                                                type="text"
                                                name="title"
                                                onChange={handleChange}
                                            />
                                        </div>
                                    </div>
                                  </div>
                                  <div className="row">
                                  <div className="col mb-3">
                                        <div className="form-group">
                                            <label>Описание</label>
                                            <input
                                                style={{ width: "95%" }}
                                                className="form-control"
                                                type="text"
                                                name="title"
                                                onChange={handleChange}
                                            />
                                        </div>
                                    </div>
                                  </div>
                                  <div className="row">
                                    <div className="col mb-3">
                                        <div className="form-group">
                                        <label>Град</label>
                                        <input
                                            style={{ width: "90%" }}
                                            className="form-control"
                                            type="text"
                                            name="title"
                                            onChange={handleChange}
                                        />
                                        </div>
                                    </div>
                                    <div className="col mb-3">
                                        <div className="form-group">
                                        <label>Адрес</label>
                                        <input
                                            style={{ width: "90%" }}
                                            className="form-control"
                                            type="text"
                                            name="author"
                                            onChange={handleChange}
                                        />
                                        </div>
                                    </div>
                                    </div>
                                    <div className="row">
                                    <div className="col mb-3">
                                        <div className="form-group">
                                        <label>Стара цена (лв.)</label>
                                        <input
                                            style={{ width: "90%" }}
                                            className="form-control"
                                            type="text"
                                            name="title"
                                            onChange={handleChange}
                                        />
                                        </div>
                                    </div>
                                    <div className="col mb-3">
                                        <div className="form-group">
                                        <label>Цена (лв.)</label>
                                        <input
                                            style={{ width: "90%" }}
                                            className="form-control"
                                            type="text"
                                            name="author"
                                            onChange={handleChange}
                                        />
                                        </div>
                                    </div>
                                    </div>
                                    <button
                                        style={{ marginTop: "10px", marginLeft: "200px" }}
                                        className="btn btn-light"
                                        type="submit"
                                    >
                                        Добавяне
                                    </button>
                                </form>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddBookForm;
