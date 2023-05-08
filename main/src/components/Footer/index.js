import React from 'react'
import { useNavigate } from 'react-router-dom'
import { FiMail } from 'react-icons/fi'
import BackToTop from '../BackToTop'
import { MetaMask_Fox, playStore, app, iconLogo } from '../imageImport'

const Footer = () => {
  const navigate = useNavigate()
  const closeModal = () => {
    //   metamask modal
    const modal = document.getElementById('modal-metamask')
    modal.classList.remove('show')
    modal.style.display = 'none'
  }
  return (
    <>
      <footer className="bg-footer">
        <div className="py-5">
          <div className="container">
            <div className="row d-flex justify-content-center">

              <div className="col-xl-4 col-lg-5 col-md-6 mt-4 mt-sm-0">
                <h5 className="text-light fw-normal title-dark text-center">
                  Join the CMF communities
                </h5>

                <ul className="list-unstyled social-icon foot-social-icon d-flex justify-content-center mb-0 mt-4 text-lg-end">

                  <li
                    className="list-inline-item lh-1"
                    style={{ paddingRight: 3 }}
                  >
                    <a href="https://www.chainmaster.io" className="rounded">
                      <i className="uil uil-dribbble"></i>
                    </a>
                  </li>
                  <li
                    className="list-inline-item lh-1"
                    style={{ paddingRight: 3 }}
                  >
                    <a href="https://t.me/Chainmasterfinance" className="rounded">
                      <i className="uil uil-twitter"></i>
                    </a>
                  </li>

                  <li
                    className="list-inline-item lh-1"
                    style={{ paddingRight: 3 }}
                  >
                    <a href="https://twitter.com/chainmasterfin" className="rounded">
                      <i className="uil uil-telegram"></i>
                    </a>
                  </li>
 
                </ul>
              </div>
              {/*end col*/}
            </div>
            {/*end row*/}
          </div>
          {/*end container*/}
        </div>
        {/*end div*/}

        <div className="container">
          <div className="row">
            <div className="col-12">
              <div className="footer-py-60 footer-border">
                <div className="row">
                  <div className="col-lg-4 col-12 mb-0 mb-md-4 pb-0 pb-md-2">
                    <a href="#" className="logo-footer">
                      <img src={iconLogo} alt="" />
                    </a>
                    <p className="para-desc mb-0 mt-4">
                      Buy, sell and discover exclusive digital assets by the best artists of NFTs in the globe on CMF.
                    </p>
                  </div>
                  {/*end col*/}

                  <div className="col-lg-2 col-md-4 col-12 mt-4 mt-sm-0 pt-2 pt-sm-0">
                    <h5 className="footer-head">Chain Master Finance</h5>
                    <ul className="list-unstyled footer-list mt-4">
                      <li>
                        <a
                          href="/explore-two"
                          onClick={e => {
                            e.preventDefault()
                            navigate('/explore-two')
                          }}
                          className="text-foot"
                        >
                          <i className="uil uil-angle-right-b me-1"></i> Explore
                        </a>
                      </li>
                      <li>
                        <a
                          href="/auction"
                          onClick={e => {
                            e.preventDefault()
                            navigate('/auction')
                          }}
                          className="text-foot"
                        >
                          <i className="uil uil-angle-right-b me-1"></i> Live
                          Auction
                        </a>
                      </li>
                      <li>
                        <a
                          href="/activity"
                          onClick={e => {
                            e.preventDefault()
                            navigate('/activity')
                          }}
                          className="text-foot"
                        >
                          <i className="uil uil-angle-right-b me-1"></i>{' '}
                          Activities
                        </a>
                      </li>
                      <li>
                        <a
                          href="/wallet"
                          onClick={e => {
                            e.preventDefault()
                            navigate('/wallet')
                          }}
                          className="text-foot"
                        >
                          <i className="uil uil-angle-right-b me-1"></i> Wallet
                        </a>
                      </li>
                      <li>
                        <a
                          href="/creators"
                          onClick={e => {
                            e.preventDefault()
                            navigate('/creators')
                          }}
                          className="text-foot"
                        >
                          <i className="uil uil-angle-right-b me-1"></i>{' '}
                          Creators
                        </a>
                      </li>
                    </ul>
                  </div>
                  {/*end col*/}

                  <div className="col-lg-3 col-md-4 col-12 mt-4 mt-sm-0 pt-2 pt-sm-0">
                    <h5 className="footer-head">Community</h5>
                    <ul className="list-unstyled footer-list mt-4">
                      <li>
                        <a
                          href="/aboutus"
                          onClick={e => {
                            e.preventDefault()
                            navigate('/aboutus')
                          }}
                          className="text-foot"
                        >
                          <i className="uil uil-angle-right-b me-1"></i> About
                          Us
                        </a>
                      </li>
                      <li>
                        <a
                          href="/terms"
                          onClick={e => {
                            e.preventDefault()
                            navigate('/terms')
                          }}
                          className="text-foot"
                        >
                          <i className="uil uil-angle-right-b me-1"></i> Terms &
                          Conditions
                        </a>
                      </li>
                      <li>
                        <a
                          href="/privacy"
                          onClick={e => {
                            e.preventDefault()
                            navigate('/privacy')
                          }}
                          className="text-foot"
                        >
                          <i className="uil uil-angle-right-b me-1"></i> Privacy
                          Policy
                        </a>
                      </li>
                      <li>
                        <a
                          href="mailto:support@chainmaster.io"
                          className="text-foot"
                        >
                          <i className="uil uil-angle-right-b me-1"></i>{' '}
                          Subscribe
                        </a>
                      </li>
                      <li>
                        <a
                          href="/contact"
                          onClick={e => {
                            e.preventDefault()
                            navigate('/contact')
                          }}
                          className="text-foot"
                        >
                          <i className="uil uil-angle-right-b me-1"></i> Contact
                        </a>
                      </li>
                    </ul>
                  </div>
                  {/*end col*/}

                  <div className="col-lg-3 col-md-4 col-12 mt-4 mt-sm-0 pt-2 pt-sm-0">
                    <h5 className="footer-head">Newsletter</h5>
                    <p className="mt-4">
                      Sign up and receive the latest tips via email.
                    </p>
                    <form>
                      <div className="row">
                        <div className="col-lg-12">
                          <div className="foot-subscribe mb-3">
                            <label className="form-label">
                              Your email (We don't spam){' '}
                              <span className="text-danger">*</span>
                            </label>
                            <div className="form-icon position-relative">
                              <FiMail className="fea icon-sm icons" />
                              <input
                                type="email"
                                name="email"
                                id="emailsubscribe"
                                className="form-control ps-5 rounded"
                                placeholder="Your email : "
                                required
                                style={{ height: 46 }}
                              />
                            </div>
                          </div>
                        </div>
                        <div className="col-lg-12">
                          <div className="d-grid">
                            <input
                              type="submit"
                              id="submitsubscribe"
                              name="send"
                              className="btn btn-soft-primary"
                              value="Subscribe"
                            />
                          </div>
                        </div>
                      </div>
                    </form>
                  </div>
                  {/*end col*/}
                </div>
                {/*end row*/}
              </div>
            </div>
            {/*end col*/}
          </div>
          {/*end row*/}
        </div>
        {/*end container*/}

        <div className="footer-py-30 footer-bar">
          <div className="container text-center">
            <div className="row align-items-center">
              <div className="col-sm-6">
                <div className="text-sm-start">
                  <p className="mb-0">
                    © <script>document.write(new Date().getFullYear())</script>{' '}
                    Chain Master Finance - NFT Marketplace built with {' '}
                    <i className="mdi mdi-heart text-danger"></i> by{' '}
                    <a
                      href="https://shreethemes.in/"
                      target="_blank"
                      className="text-reset"
                    >
                      CMF
                    </a>
                    .
                  </p>
                </div>
              </div>
              {/*end col*/}

              <div className="col-sm-6 mt-4 mt-sm-0 pt-2 pt-sm-0">
                <ul className="list-unstyled footer-list text-sm-end mb-0">
                  <li className="list-inline-item mb-0">
                    <a
                      href="/privacy"
                      onClick={e => {
                        e.preventDefault()
                        navigate('/privacy')
                      }}
                      className="text-foot me-2"
                    >
                      Privacy
                    </a>
                  </li>
                  <li className="list-inline-item mb-0">
                    <a
                      href="/terms"
                      onClick={e => {
                        e.preventDefault()
                        navigate('/terms')
                      }}
                      className="text-foot me-2"
                    >
                      Terms
                    </a>
                  </li>
                  <li className="list-inline-item mb-0">
                    <a
                      href="/helpcenter-overview"
                      onClick={e => {
                        e.preventDefault()
                        navigate('/helpcenter-overview')
                      }}
                      className="text-foot me-2"
                    >
                      Help Center
                    </a>
                  </li>
                  <li className="list-inline-item mb-0">
                    <a
                      href="/contact"
                      onClick={e => {
                        e.preventDefault()
                        navigate('/contact')
                      }}
                      className="text-foot"
                    >
                      Contact
                    </a>
                  </li>
                </ul>
              </div>
              {/*end col*/}
            </div>
            {/*end row*/}
          </div>
          {/*end container*/}
        </div>
      </footer>
      {/*end footer*/}

      {/* Back to top */}
      <BackToTop />

      {/* Wallet Modal */}
      <div
        className="modal fade"
        id="modal-metamask"
        tabIndex="-1"
        aria-hidden="true"
      >
        <div className="modal-dialog modal-dialog-centered modal-sm">
          <div className="modal-content justify-content-center border-0 shadow-md rounded-md position-relative">
            <div className="position-absolute top-0 start-100 translate-middle z-index-1">
              <button
                type="button"
                onClick={closeModal}
                className="btn btn-icon btn-pills btn-sm btn-light btn-close opacity-10"
                data-bs-dismiss="modal"
                id="close-modal"
              >
                <i className="uil uil-times fs-4"></i>
              </button>
            </div>

            <div className="modal-body p-4 text-center">
              <img
                src={MetaMask_Fox}
                className="avatar avatar-md-md rounded-circle shadow-sm "
                alt=""
              />

              <div className="content mt-4">
                <h5 className="text-danger mb-4">Error!</h5>

                <p className="text-muted">
                  Please Download MetaMask and create your profile and wallet in
                  MetaMask. Please click and check the details,
                </p>

                <a
                  href="https://metamask.io/"
                  className="btn btn-link primary text-primary fw-bold"
                  target="_blank"
                >
                  MetaMask
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* Wallet Modal */}
    </>
  )
}

export default Footer
