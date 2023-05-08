import React from 'react'
import { useNavigate } from 'react-router-dom'
import Footer from '../../components/Footer'
import Navbar from '../../components/Navbar'
import { bg01, office } from '../../components/imageImport'


const Contact = () => {
  const navigate = useNavigate()
  // Contact Form
  function validateForm() {
    var name = document.forms["myForm"]["name"].value;
    var email = document.forms["myForm"]["email"].value;
    var subject = document.forms["myForm"]["subject"].value;
    var comments = document.forms["myForm"]["comments"].value;
    document.getElementById("error-msg").style.opacity = 0;
    document.getElementById('error-msg').innerHTML = "";
    if (name == "" || name == null) {
      document.getElementById('error-msg').innerHTML = "<div class='alert alert-warning error_message'>*Please enter a Name*</div>";
      fadeIn();
      return false;
    }
    if (email == "" || email == null) {
      document.getElementById('error-msg').innerHTML = "<div class='alert alert-warning error_message'>*Please enter a Email*</div>";
      fadeIn();
      return false;
    }
    if (subject == "" || subject == null) {
      document.getElementById('error-msg').innerHTML = "<div class='alert alert-warning error_message'>*Please enter a Subject*</div>";
      fadeIn();
      return false;
    }
    if (comments == "" || comments == null) {
      document.getElementById('error-msg').innerHTML = "<div class='alert alert-warning error_message'>*Please enter a Comments*</div>";
      fadeIn();
      return false;
    }
    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function () {
      if (this.readyState == 4 && this.status == 200) {
        document.getElementById("simple-msg").innerHTML = this.responseText;
        document.forms["myForm"]["name"].value = "";
        document.forms["myForm"]["email"].value = "";
        document.forms["myForm"]["subject"].value = "";
        document.forms["myForm"]["comments"].value = "";
      }
    };
    xhttp.open("POST", "php/contact.php", true);
    xhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
    xhttp.send("name=" + name + "&email=" + email + "&subject=" + subject + "&comments=" + comments);
    return false;
  }
  function fadeIn() {
    var fade = document.getElementById("error-msg");
    var opacity = 0;
    var intervalID = setInterval(function () {
      if (opacity < 1) {
        opacity = opacity + 0.5
        fade.style.opacity = opacity;
      } else {
        clearInterval(intervalID);
      }
    }, 200);
  }
  return (
    <>
      {/* Navbar */}
      <Navbar />

      {/* Start Home */}
      <section
        className="bg-half-170 d-table w-100"
        style={{ background: `url(${bg01}) bottom` }}
      >
        <div className="bg-overlay bg-gradient-overlay-2"></div>
        <div className="container">
          <div className="row mt-5 justify-content-center">
            <div className="col-12">
              <div className="title-heading text-center">
                <h5 className="heading fw-semibold sub-heading text-white title-dark">
                  Contact CMF
                </h5>
                <p className="text-white-50 para-desc mx-auto mb-0">
                  Write to us with any queries and the team will get back to you shortly!
                </p>
              </div>
            </div>
            {/*end col*/}
          </div>
          {/*end row*/}

          <div className="position-middle-bottom">
            <nav aria-label="breadcrumb" className="d-block">
              <ul
                className="breadcrumb breadcrumb-muted mb-0 p-0"
                style={{ backgroundColor: 'transparent' }}
              >
                <li className="breadcrumb-item">
                  <a
                    href="/index"
                    onClick={e => {
                      e.preventDefault()
                      navigate('/index')
                    }}
                  >
                    Chain Master Finance
                  </a>
                </li>
                <li className="breadcrumb-item active" aria-current="page">
                  Reach out to CMF
                </li>
              </ul>
            </nav>
          </div>
        </div>
        {/*end container*/}
      </section>
      {/*end section*/}
      <div className="position-relative">
        <div className="shape overflow-hidden text-white">
          <svg
            viewBox="0 0 2880 48"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M0 48H1437.5H2880V0H2160C1442.5 52 720 0 720 0H0V48Z"
              fill="currentColor"
            ></path>
          </svg>
        </div>
      </div>
      {/* End Home */}

      {/* Start Section */}
      <section className="section">
        <div className="container">
          <div className="row justify-content-center">
            <div className="col-lg-4 col-md-6">
              <div className="card border-0 text-center features feature-primary feature-clean">
                <div className="icons text-center mx-auto">
                <i className="uil uil-telegram d-block rounded-md h3 mb-0"></i>
                </div>
                <div className="content mt-4 px-4">
                  <h5 className="fw-bold">Telegram</h5>
                  <p className="text-muted">
                    Contact Chain Master Finance on Telegram
                  </p>
                  <a href="https://t.me/Chainmasterfinance" className="text-primary">
                    @Chainmasterfinance
                  </a>
                </div>
              </div>
            </div>
            {/*end col*/}

            <div className="col-lg-4 col-md-6 mt-4 mt-sm-0 pt-2 pt-sm-0">
              <div className="card border-0 text-center features feature-primary feature-clean">
                <div className="icons text-center mx-auto">
                  <i className="uil uil-envelope d-block rounded-md h3 mb-0"></i>
                </div>
                <div className="content mt-4 px-4">
                  <h5 className="fw-bold">Email</h5>
                  <p className="text-muted">
                    Contact Chain Master Finance and get help
                  </p>
                  <a href="mailto:support@chainmaster.io" className="text-primary">
                    support@chainmaster.io
                  </a>
                </div>
              </div>
            </div>
            {/*end col*/}
          </div>
          {/*end row*/}
        </div>
        {/*end container*/}

        <div className="container mt-100 mt-60">
          <div className="row align-items-center">
            <div className="col-lg-5 col-md-6 pt-2 pt-sm-0 order-2 order-md-1">
              <div className="card shadow rounded border-0">
                <div className="card-body py-5">
                  <h4 className="card-title">Get In Touch With CMF!</h4>
                  <div className="custom-form mt-3">
                    <form
                      method="post"
                      name="myForm"
                      onSubmit={(e) => {
                        e.preventDefault();
                        validateForm()
                      }}
                    // id="myForm"
                    >
                      <p className="mb-0" id="error-msg"></p>
                      <div id="simple-msg"></div>
                      <div className="row">
                        <div className="col-md-6">
                          <div className="mb-3">
                            <label className="form-label">
                              Your Name <span className="text-danger">*</span>
                            </label>
                            <input
                              name="name"
                              id="name"
                              type="text"
                              className="form-control"
                              placeholder="John..."
                            />
                          </div>
                        </div>

                        <div className="col-md-6">
                          <div className="mb-3">
                            <label className="form-label">
                              Your Email <span className="text-danger">*</span>
                            </label>
                            <input
                              name="email"
                              id="email"
                              type="email"
                              className="form-control"
                              placeholder="myemail@cmf.com"
                            />
                          </div>
                        </div>
                        {/*end col*/}

                        <div className="col-12">
                          <div className="mb-3">
                            <label className="form-label">Subject</label>
                            <input
                              name="subject"
                              id="subject"
                              className="form-control"
                              placeholder="I need help with..."
                            />
                          </div>
                        </div>
                        {/*end col*/}

                        <div className="col-12">
                          <div className="mb-3">
                            <label className="form-label">
                              Comments <span className="text-danger">*</span>
                            </label>
                            <textarea
                              name="comments"
                              id="comments"
                              rows="4"
                              className="form-control"
                              placeholder="Enter Your Message to CMF..."
                            ></textarea>
                          </div>
                        </div>
                      </div>
                      <div className="row">
                        <div className="col-12">
                          <div className="d-grid">
                            <button
                              type="submit"
                              id="submit"
                              name="send"
                              className="btn btn-primary rounded-md"
                            >
                              Send your message
                            </button>
                          </div>
                        </div>
                        {/*end col*/}
                      </div>
                      {/*end row*/}
                    </form>
                  </div>
                  {/*end custom-form*/}
                </div>
              </div>
            </div>
            {/*end col*/}

            <div className="col-lg-7 col-md-6 order-1 order-md-2">
              <div className="card border-0">
                <div className="card-body p-0">
                  <img
                    src={office}
                    className="img-fluid d-block mx-auto"
                    style={{ maxWidth: 550 }}
                    alt=""
                  />
                </div>
              </div>
            </div>
            {/*end col*/}
          </div>
          {/*end row*/}
        </div>
        {/*end container*/}
      </section>
      {/*end section*/}

      {/* footer */}
      <Footer />
    </>
  )
}

export default Contact
