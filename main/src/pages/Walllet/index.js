import React from 'react'
import { useNavigate } from 'react-router-dom'
import Footer from '../../components/Footer'
import Navbar from '../../components/Navbar'
import { bg01, MetaMask_Fox, aave, Airswap, Compound, DDEX, defiSaver, dYdX, IDEX, Kyber, Maker, NUO, PoolTogether, Sablier, set, Uniswap, Zerion, logoDark } from '../../components/imageImport'

const Wallet = () => {
  const navigate = useNavigate()
  const walletData = [
    {
      title: 'MetaMask',
      description: 'Learn about how to get the wallet and much more clicking ',
      image: MetaMask_Fox,
      background: 'bg-gradient-primary',
      popular: true,
    },
    {
      title: 'Aave',
      description: 'Learn about how to get the wallet and much more clicking ',
      image: aave,
      background: 'bg-gradient-primary',
      popular: false,
    },
    {
      title: 'Airswap',
      description: 'Learn about how to get the wallet and much more clicking ',
      image: Airswap,
      background: 'bg-gradient-warning',
      popular: false,
    },
    {
      title: 'Compound',
      description: 'Learn about how to get the wallet and much more clicking ',
      image: Compound,
      background: 'bg-gradient-danger',
      popular: false,
    },
    {
      title: 'DDEX',
      description: 'Learn about how to get the wallet and much more clicking ',
      image: DDEX,
      background: 'bg-gradient-info',
      popular: false,
    },
    {
      title: 'Defi Saver',
      description: 'Learn about how to get the wallet and much more clicking ',
      image: defiSaver,
      background: 'bg-gradient-primary',
      popular: false,
    },
    {
      title: 'DYDX',
      description: 'Learn about how to get the wallet and much more clicking ',
      image: dYdX,
      background: 'bg-gradient-primary',
      popular: false,
    },
    {
      title: 'IDEX',
      description: 'Learn about how to get the wallet and much more clicking ',
      image: IDEX,
      background: 'bg-gradient-warning',
      popular: false,
    },
    {
      title: 'Kyber',
      description: 'Learn about how to get the wallet and much more clicking ',
      image: Kyber,
      background: 'bg-gradient-danger',
      popular: false,
    },
    {
      title: 'Maker',
      description: 'Learn about how to get the wallet and much more clicking ',
      image: Maker,
      background: 'bg-gradient-info',
      popular: false,
    },
    {
      title: 'NUO',
      description: 'Learn about how to get the wallet and much more clicking ',
      image: NUO,
      background: 'bg-gradient-primary',
      popular: false,
    },
    {
      title: 'PoolTogether',
      description: 'Learn about how to get the wallet and much more clicking ',
      image: PoolTogether,
      background: 'bg-gradient-primary',
      popular: false,
    },
    {
      title: 'Sablier',
      description: 'Learn about how to get the wallet and much more clicking ',
      image: Sablier,
      background: 'bg-gradient-warning',
      popular: false,
    },
    {
      title: 'Set',
      description: 'Learn about how to get the wallet and much more clicking ',
      image: set,
      background: 'bg-gradient-danger',
      popular: false,
    },
    {
      title: 'Uniswap',
      description: 'Learn about how to get the wallet and much more clicking ',
      image: Uniswap,
      background: 'bg-gradient-info',
      popular: false,
    },
    {
      title: 'Zerion',
      description: 'Learn about how to get the wallet and much more clicking ',
      image: Zerion,
      background: 'bg-gradient-secondary',
      popular: false,
    },
  ]
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
                  Wallet Connect
                </h5>
                <p className="text-white-50 para-desc mx-auto mb-0">
                  Please check all Wallets and connect with your wallet
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
                  Wallet
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

      {/* Start Hero */}
      <section className="section">
        <div className="container">
          <div className="row row-cols-xl-4 row-cols-lg-3 row-cols-sm-2 row-cols-1 g-4">
            {walletData?.map((wallet, index) => {
              return (
                <div className="col" key={index}>
                  <div className="card wallet wallet-primary rounded-md shadow">
                    {wallet?.popular && (
                      <div className="ribbon ribbon-right ribbon-primary overflow-hidden">
                        <span className="text-center d-block shadow small fw-bold">
                          Popular
                        </span>
                      </div>
                    )}
                    <div
                      className={`${wallet?.background} p-5 rounded-md`}
                    ></div>
                    <div className="position-relative">
                      <div className="position-absolute top-0 start-50 translate-middle">
                        <img
                          src={wallet?.image}
                          className="avatar avatar-md-md rounded-pill shadow-sm p-3 bg-light"
                          alt=""
                        />
                      </div>

                      <div className="content text-center p-4">
                        <h5 className="mt-4 pt-2 mb-0">{wallet?.title}</h5>
                        <p className="text-muted mt-3 mb-0">
                          {wallet?.description}
                          {/* <a
                            href=""
                            onClick={e => e.preventDefault()} //login modal removed we will add 
                            connect with wallet instead
                            data-bs-toggle="modal"
                            data-bs-target="#LoginForm"
                            className="link fw-semibold"
                          >
                            here <i className="uil uil-arrow-right"></i>
                          </a> */}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              )
              {
                /*end col*/
              }
            })}
          </div>
          {/*end row*/}
        </div>
        {/*end container*/}
      </section>
      {/*end section*/}
      {/* End Hero */}
      {/* footer */}
      <Footer />
    </>
  )
}

export default Wallet
