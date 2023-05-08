import React from 'react'
import { useNavigate } from 'react-router-dom'
import Footer from '../../components/Footer'
import Navbar from '../../components/Navbar'
import { bg02 } from '../../components/imageImport'

const Terms = () => {
  const navigate = useNavigate()
  return (
    <>
      {/* Navbar */}
      <Navbar />

      {/* Start Home   */}
      <section
        className="bg-half-170 d-table w-100"
        style={{ background: `url(${bg02}) center` }}
      >
        <div className="bg-overlay bg-gradient-overlay-2"></div>
        <div className="container">
          <div className="row mt-5 justify-content-center">
            <div className="col-12">
              <div className="title-heading text-center">
                <h5 className="heading fw-semibold sub-heading text-white title-dark">
                  Terms
                </h5>
                {/* <p className="text-white-50 para-desc mx-auto mb-0"></p>   */}
              </div>
            </div>
            {/*end col  */}
          </div>
          {/*end row  */}

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
                  Terms
                </li>
              </ul>
            </nav>
          </div>
        </div>
        {/*end container  */}
      </section>
      {/*end section  */}
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
      {/* End Home   */}

      {/* Start Terms & Conditions   */}
      <section className="section">
        <div className="container">
          <div className="row justify-content-center">
            <div className="col-lg-9">
              <div className="card shadow border-0 rounded">
                <div className="card-body">
                  <h5 className="card-title">Introduction:</h5>
                  <p className="text-muted mt-4">
                    CMF Terms & Conditions 1
                  </p>

                  <h5 className="card-title mt-5">User & Usage Agreements:</h5>
                  <p className="text-muted mt-4">
                    CMF Terms & Conditions 2
                  </p>
                  <p className="text-muted">
                    CMF Terms & Conditions 3
                  </p>
                  <p className="text-muted">
                    CMF Terms & Conditions 4
                  </p>

                  <h5 className="card-title mt-5">Restrictions:</h5>
                  <p className="text-muted mt-4">
                    You are specifically agreeing to the following:
                  </p>
                  <ul className="list-unstyled text-muted">
                    <li className="mt-2">
                      <i
                        data-feather="arrow-right"
                        className="fea icon-sm me-2"
                      ></i>
                      CMF Terms & Conditions 5
                    </li>
                    <li className="mt-2">
                      <i
                        data-feather="arrow-right"
                        className="fea icon-sm me-2"
                      ></i>
                      CMF Terms & Conditions 6
                    </li>
                    <li className="mt-2">
                      <i
                        data-feather="arrow-right"
                        className="fea icon-sm me-2"
                      ></i>
                      CMF Terms & Conditions 7
                    </li>
                    <li className="mt-2">
                      <i
                        data-feather="arrow-right"
                        className="fea icon-sm me-2"
                      ></i>
                      CMF Terms & Conditions 8
                    </li>
                    <li className="mt-2">
                      <i
                        data-feather="arrow-right"
                        className="fea icon-sm me-2"
                      ></i>
                      CMF Terms & Conditions 9
                    </li>
                    <li className="mt-2">
                      <i
                        data-feather="arrow-right"
                        className="fea icon-sm me-2"
                      ></i>
                      CMF Terms & Conditions 10
                    </li>
                  </ul>

                  <h5 className="card-title mt-5">General Questions & Answers:</h5>

                  <div className="accordion mt-4 pt-2" id="buyingquestion">
                    <div className="accordion-item rounded">
                      <h2 className="accordion-header" id="headingOne">
                        <button
                          className="accordion-button border-0"
                          type="button"
                          data-bs-toggle="collapse"
                          data-bs-target="#collapseOne"
                          aria-expanded="true"
                          aria-controls="collapseOne"
                        >
                          How does it work?
                        </button>
                      </h2>
                      <div
                        id="collapseOne"
                        className="accordion-collapse border-0 collapse show"
                        aria-labelledby="headingOne"
                        data-bs-parent="#buyingquestion"
                      >
                        <div className="accordion-body text-muted bg-white">
                          Q&A 1
                        </div>
                      </div>
                    </div>

                    <div className="accordion-item rounded mt-2">
                      <h2 className="accordion-header" id="headingTwo">
                        <button
                          className="accordion-button border-0 collapsed"
                          type="button"
                          data-bs-toggle="collapse"
                          data-bs-target="#collapseTwo"
                          aria-expanded="false"
                          aria-controls="collapseTwo"
                        >
                          Do I need a designer to use Chain Master Finance?
                        </button>
                      </h2>
                      <div
                        id="collapseTwo"
                        className="accordion-collapse border-0 collapse"
                        aria-labelledby="headingTwo"
                        data-bs-parent="#buyingquestion"
                      >
                        <div className="accordion-body text-muted bg-white">
                          Q&A 2
                        </div>
                      </div>
                    </div>

                    <div className="accordion-item rounded mt-2">
                      <h2 className="accordion-header" id="headingThree">
                        <button
                          className="accordion-button border-0 collapsed"
                          type="button"
                          data-bs-toggle="collapse"
                          data-bs-target="#collapseThree"
                          aria-expanded="false"
                          aria-controls="collapseThree"
                        >
                          What do I need to do to start selling?
                        </button>
                      </h2>
                      <div
                        id="collapseThree"
                        className="accordion-collapse border-0 collapse"
                        aria-labelledby="headingThree"
                        data-bs-parent="#buyingquestion"
                      >
                        <div className="accordion-body text-muted bg-white">
                          Q&A 3
                        </div>
                      </div>
                    </div>

                    <div className="accordion-item rounded mt-2">
                      <h2 className="accordion-header" id="headingFour">
                        <button
                          className="accordion-button border-0 collapsed"
                          type="button"
                          data-bs-toggle="collapse"
                          data-bs-target="#collapseFour"
                          aria-expanded="false"
                          aria-controls="collapseFour"
                        >
                          What happens when I sell an NFT?
                        </button>
                      </h2>
                      <div
                        id="collapseFour"
                        className="accordion-collapse border-0 collapse"
                        aria-labelledby="headingFour"
                        data-bs-parent="#buyingquestion"
                      >
                        <div className="accordion-body text-muted bg-white">
                          Q&A 4
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="mt-4">
                    <a
                      href=""
                      onClick={e => e.preventDefault()}
                      className="btn btn-primary rounded-md mt-2 me-2"
                    >
                      Accept CMF T&C's
                    </a>
                    <a
                      href=""
                      onClick={e => e.preventDefault()}
                      className="btn btn-outline-primary rounded-md mt-2"
                    >
                      Decline CMF T&C's
                    </a>
                  </div>
                </div>
              </div>
            </div>
            {/*end col  */}
          </div>
          {/*end row  */}
        </div>
        {/*end container  */}
      </section>
      {/*end section  */}
      {/* End Terms & Conditions   */}

      {/* footer */}
      <Footer />
    </>
  )
}

export default Terms
