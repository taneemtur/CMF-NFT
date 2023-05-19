import React, { useState, useCallback, useEffect, useMemo, useContext } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { MetaMask_Fox, character, client01, lightLogo, logoDark } from '../imageImport'
import { IoIosHome, IoMdMap, IoIosStats, IoIosAlbums, } from 'react-icons/io'
import { MdNotificationAdd } from 'react-icons/md'
import { CgFileDocument } from 'react-icons/cg'
import ThemeSwitcher from '../ThemeSwitcher'
import axiosConfig from "../../axiosConfig"
import AuthContext from '../../AuthContext'
import { useDispatch, useSelector } from 'react-redux';
import { setAccount, setChain, setUser } from '../../Store/Slicers/theme';
import { defaultChain, getChainById, isChainSupported } from '../../blockchain/supportedChains'
require('dotenv').config()

const Navbar = () => {
  const { account, chain, user } = useSelector(state => state.theme)
  const dispatch = useDispatch()
  const location = useLocation()
  const navigate = useNavigate()
  const url = useMemo(() => location?.pathname === '/blog-detail', [])
  const templatePage = [
    '/become-creator',
    '/creator-profile',
    '/item-detail-one',
    '/index-two',
    '/index-four',
    '/index-five',
    '/index-five-rtl',
    '/index-four-rtl',
    '/index-two-rtl'
  ]
  const becomeUrl = templatePage.includes(location?.pathname)
  const [mobile, setMobile] = useState([])
  // const {profile} = useContext(AuthContext)
  // const {data} = profile

  const mobileHandler = (e, panel) => {
    e.preventDefault()
    const dataIndex = mobile?.findIndex(data => data === panel)
    if (dataIndex === -1) {
      setMobile([...mobile, panel])
    } else {
      const updateRecord = mobile?.filter((data, index) => index !== dataIndex)
      setMobile(updateRecord)
    }
  }

  const showModal = () => {
    const modal = document.getElementById('modal-metamask')
    modal.classList.add('show')
    modal.style.display = 'block'
  }

  const showChainModal = () => {
    const modal = document.getElementById('modal-chain')
    modal.classList.add('show')
    modal.style.display = 'block'
  }

  const isMetaMaskInstalled = useCallback(() => {
    //Have to check the ethereum binding on the window object to see if it's installed
    const { ethereum } = window
    return Boolean(ethereum && ethereum.isMetaMask)
  }, [])

  const connectWallet = async () => {
    if (window.ethereum !== undefined) {
      await window.ethereum.request({ method: "eth_requestAccounts" }).then((accounts) => {
        if (accounts.length > 0) {
          fetchProfile(accounts[0])
        }
      })
        .then(async () => {
          const chainId = await window.ethereum.request({ method: 'eth_chainId' });
          checkChainId(chainId)
        })
        .catch((error) => {
          if (error.code === 4001) {
            // EIP-1193 userRejectedRequest error
            console.log('Please connect to MetaMask.');
          } else {
            console.error(error);
          }
        })
    } else {
      showModal()
    }
  };

  const checkAccountChanges = (accounts) => {
    if (accounts.length === 0) {
      dispatch(setAccount(null));
    } else {
      fetchProfile(accounts[0])
    }
  }

  const checkChainId = (newChain) => {
    if (window.ethereum) {
      if (isChainSupported(newChain)) {
        dispatch(setChain(newChain))
      } else {
        switchChain(defaultChain.chainId)
      }
    }
  }

  const switchChain = async (chainId) => {
    const chainParam = getChainById(chainId)
    try {
      await ethereum.request({
        method: 'wallet_switchEthereumChain',
        params: [{ chainId: chainId }],
      });
    } catch (switchError) {
      // This error code indicates that the chain has not been added to MetaMask.
      if (switchError.code === 4902) {
        try {
          await ethereum.request({
            method: 'wallet_addEthereumChain',
            params: [chainParam],
          });
        } catch (addError) {
          // handle "add" error
        }
      }
      // handle other "switch" errors
    }
  }

  const fetchProfile = async (account) => {
    //save user to firebase db when wallet connected
    await axiosConfig.post(`/profile/createprofile`, {
      walletAddress: account,
    })
      .then((res) => {
        dispatch(setUser(res.data.data))
        dispatch(setAccount(account))
        console.log(res.data)
      })
      .catch((err) => {
        console.log(err)
      })
  }

  useEffect(() => {
    window.ethereum.on('accountsChanged', (accounts) => checkAccountChanges(accounts));
  }, []);

  useEffect(()=>{
    account != null && window.ethereum?.on('chainChanged', (newChain) => checkChainId(newChain))
  },[account])

  const getClosest = (elem, selector) => {

    // Element.matches() polyfill
    if (!Element.prototype.matches) {
      Element.prototype.matches =
        Element.prototype.matchesSelector ||
        Element.prototype.mozMatchesSelector ||
        Element.prototype.msMatchesSelector ||
        Element.prototype.oMatchesSelector ||
        Element.prototype.webkitMatchesSelector ||
        function (s) {
          var matches = (this.document || this.ownerDocument).querySelectorAll(s),
            i = matches.length;
          while (--i >= 0 && matches.item(i) !== this) { }
          return i > -1;
        };
    }

    // Get the closest matching element
    for (; elem && elem !== document; elem = elem.parentNode) {
      if (elem.matches(selector)) return elem;
    }
    return null;

  };

  const activateMenu = () => {
    var menuItems = document.getElementsByClassName("sub-menu-item");
    if (menuItems) {

      var matchingMenuItem = null;
      for (var idx = 0; idx < menuItems.length; idx++) {
        if (menuItems[idx].href === window.location.href) {
          matchingMenuItem = menuItems[idx];
        }
      }

      if (matchingMenuItem) {
        matchingMenuItem.classList.add('active');
        var immediateParent = getClosest(matchingMenuItem, 'li');
        if (immediateParent) {
          immediateParent.classList.add('active');
        }

        var parent = getClosest(matchingMenuItem, '.parent-menu-item');
        if (parent) {
          parent.classList.add('active');
          var parentMenuitem = parent.querySelector('.menu-item');
          if (parentMenuitem) {
            parentMenuitem.classList.add('active');
          }
          var parentOfParent = getClosest(parent, '.parent-parent-menu-item');
          if (parentOfParent) {
            parentOfParent.classList.add('active');
          }
        } else {
          var parentOfParent = getClosest(matchingMenuItem, '.parent-parent-menu-item');
          if (parentOfParent) {
            parentOfParent.classList.add('active');
          }
        }
      }
    }
  }

  const toggleMenu = () => {
    document.getElementById('isToggle').classList.toggle('open');
    var isOpen = document.getElementById('navigation')
    if (isOpen.style.display === "block") {
      isOpen.style.display = "none";
    } else {
      isOpen.style.display = "block";
    }
  };


  return (
    <>
      {/* Navbar STart */}
      <header
        id="topnav"
        className={`defaultscroll sticky ${url && 'gradient'}`}
      >
        <div className="container">
          {/* Logo Start*/}
          <a

            className="logo"
            href="/"
            onClick={e => {
              e.preventDefault()
              navigate('/')
              setTimeout(() => {
                activateMenu()
              }, 1000)
            }}
          >
            <span className="">
              <img
                src={logoDark}
                height="26"
                className={becomeUrl ? 'logo-light-mode' : 'l-dark'}
                alt=""
              />
              <img
                src={lightLogo}
                height="26"
                className={becomeUrl ? 'logo-dark-mode' : 'l-light'}
                alt=""
              />
            </span>
          </a>
          {/* Logo end*/}

          {/* Mobile */}
          <div className="menu-extras">
            <div className="menu-item">
              {/* Mobile menu toggle*/}
              <a
                className="navbar-toggle"
                id="isToggle"
                onClick={e => {
                  e.preventDefault()
                  toggleMenu()
                }}
              >
                <div className="lines">
                  <span></span>
                  <span></span>
                  <span></span>
                </div>
              </a>
              {/* End mobile menu toggle*/}
            </div>
          </div>
          {/* Mobile */}

          {/*Login button Start*/}
          <ul className="buy-button list-inline mb-0">
            <li className="list-inline-item mb-0 me-1">
              <div className="dropdown">
                <button
                  type="button"
                  className="btn dropdown-toggle p-0"
                  data-bs-toggle="dropdown"
                  aria-haspopup="true"
                  aria-expanded="false"
                >
                  {becomeUrl ? (
                    <i className="uil uil-search text-dark fs-5 align-middle"></i>
                  ) : (
                    <>
                      <i className="uil uil-search text-white title-dark btn-icon-light fs-5 align-middle"></i>
                      <i className="uil uil-search text-dark btn-icon-dark fs-5 align-middle"></i>
                    </>
                  )}
                </button>
                <div
                  className="dropdown-menu dd-menu dropdown-menu-end bg-white shadow rounded border-0 mt-3 p-0"
                  style={{ width: 300 }}
                >
                  <div className="search-bar">
                    <div id="itemSearch" className="menu-search mb-0">
                      <form
                        role="search"
                        method="get"
                        id="searchItemform"
                        className="searchform"
                      >
                        <input
                          type="text"
                          className="form-control border rounded"
                          name="s"
                          id="searchItem"
                          placeholder="Search..."
                        />
                        <input
                          type="submit"
                          id="searchItemsubmit"
                          value="Search"
                        />
                      </form>
                    </div>
                  </div>
                </div>
              </div>
            </li>
            <li className="list-inline-item mb-0 me-1">
              {becomeUrl ? (
                <a
                  onClick={connectWallet}
                  id="connectWallet"
                  className="btn btn-icon btn-pills btn-primary"
                >
                  <i className="uil uil-wallet fs-6"></i>
                </a>
              ) : (
                <p id="connectWallet" onClick={connectWallet}>
                  <span className="btn-icon-dark">
                    <span className="btn btn-icon btn-pills btn-primary">
                      <i className="uil uil-wallet fs-6"></i>
                    </span>
                  </span>
                  <span className="btn-icon-light">
                    <span className="btn btn-icon btn-pills btn-light">
                      <i className="uil uil-wallet fs-6"></i>
                    </span>
                  </span>
                </p>
              )}
            </li>

            <li className="list-inline-item mb-0 me-1">
              {
                account && (
                  <div className="dropdown dropdown-primary">
                    {!isMetaMaskInstalled() ?
                      <button
                        type="button"
                        className="btn btn-pills dropdown-toggle p-0 "

                      ><a href='https://metamask.io/'
                        style={{ minWidth: 30 }}>
                          <img src={MetaMask_Fox} alt="metamask" className='hover-zoom' />
                        </a>
                      </button>
                      :
                      <button
                        type="button"
                        className="btn btn-pills dropdown-toggle p-0"
                        data-bs-toggle="dropdown"
                        aria-haspopup="true"
                        aria-expanded="false"
                      >
                        <img
                          src={ user?.profileImage || client01}
                          className="rounded-pill avatar avatar-sm-sm"
                          alt={user?.name}
                        />
                      </button>
                    }
                    <div
                      className="dropdown-menu dd-menu dropdown-menu-end bg-white shadow border-0 mt-3 pb-3 pt-0 overflow-hidden rounded"
                      style={{ minWidth: 200 }}
                    >
                      <div className="position-relative">
                        <div className="pt-5 pb-3 bg-gradient-primary"></div>
                        <div className="px-3">
                          <div className="d-flex align-items-end mt-n4">
                            <img
                              src={ user?.profileImage || client01}
                              className="rounded-pill avatar avatar-md-sm img-thumbnail shadow-md"
                              alt={user?.name}
                            />
                            <h6 className="text-dark fw-bold mb-0 ms-1">
                              {user ? user?.name : ''}
                            </h6>
                          </div>
                          <div className="mt-2">
                            <small className="text-start text-dark d-block fw-bold">
                              Wallet:
                            </small>
                            <div className="d-flex justify-content-between align-items-center">
                              <small id="myPublicAddress" className="text-muted">
                                {account}
                              </small>
                              <a href="" onClick={e => e.preventDefault()} className="text-primary">
                                <span className="uil uil-copy"></span>
                              </a>
                            </div>
                          </div>

                          <div className="mt-2">
                            <small className="text-dark">
                              Balance:
                              <span className="text-primary fw-bold">
                                0
                              </span>
                            </small>
                          </div>
                        </div>
                      </div>
                      <div className="mt-2">
                        <a
                          className="dropdown-item small fw-semibold text-dark d-flex align-items-center"
                          href="/creator-profile"
                          onClick={e => {
                            e.preventDefault()
                            navigate('/creator-profile')
                          }}
                        >
                          <span className="mb-0 d-inline-block me-1">
                            <i className="uil uil-user align-middle h6 mb-0 me-1"></i>
                          </span>{' '}
                          Profile
                        </a>
                        <a
                          className="dropdown-item small fw-semibold text-dark d-flex align-items-center"
                          href="/upload-work"
                          onClick={e => {
                            e.preventDefault()
                            navigate('/upload-work')
                          }}
                        >
                          <span className="mb-0 d-inline-block me-1">
                            <i className="uil uil-grid align-middle h6 mb-0 me-1"></i>
                          </span>{' '}
                          Create Collection
                        </a>
                        <a
                          className="dropdown-item small fw-semibold text-dark d-flex align-items-center"
                          href="/creator-profile-edit"
                          onClick={e => {
                            e.preventDefault()
                            setTimeout(() => {
                              activateMenu()
                            }, 1000)
                            navigate('/creator-profile-edit')
                          }}
                        >
                          <span className="mb-0 d-inline-block me-1">
                            <i className="uil uil-cog align-middle h6 mb-0 me-1"></i>
                          </span>{' '}
                          Settings
                        </a>
                        <a
                          className="dropdown-item small fw-semibold text-dark d-flex align-items-center"
                          href="#"
                          onClick={e => {
                            e.preventDefault()
                            showChainModal()
                          }}
                        >
                          <span className="mb-0 d-inline-block me-1">
                            <i className="uil uil-cog align-middle h6 mb-0 me-1"></i>
                          </span>{' '}
                          Switch Chain
                        </a>
                        <a
                          className="dropdown-item small fw-semibold text-dark d-flex align-items-center"
                          href="/"
                          onClick={e => {
                            e.preventDefault()
                            dispatch(setUser(null))
                            dispatch(setAccount(null))
                          }}
                        >
                          <span className="mb-0 d-inline-block me-1">
                            <i className="uil uil-cog align-middle h6 mb-0 me-1"></i>
                          </span>{' '}
                          Logout
                        </a>
                      </div>
                    </div>
                  </div>
                )
              }
            </li>
            <li className="list-inline-item mb-0">
              <div className="dropdown dropdown-primary">
                <ThemeSwitcher />
              </div>
            </li>
          </ul>
          {/*Login button End*/}

          <div id="navigation">
            {/* Navigation Menu*/}
            <ul
              className={`navigation-menu nav-left`}
            >
              <li>
                <a
                  href="/"
                  onClick={e => {
                    e.preventDefault()
                    setTimeout(() => {
                      activateMenu()
                    }, 1000)
                    navigate('/')
                  }}
                  className="sub-menu-item"
                >
                  <IoIosHome />
                  {' '}
                  Home
                </a>
              </li>
              <li className="has-submenu parent-parent-menu-item">
                <a href="" onClick={e => mobileHandler(e, 'pages')}>
                  Marketplace
                </a>
                <span className="menu-arrow"></span>
                <ul
                  className={`submenu ${mobile.includes('pages') ? 'open' : ''
                    }`}
                >
                  <li>
                    <a
                      href="/explore"
                      onClick={e => {
                        e.preventDefault()
                        setTimeout(() => {
                          activateMenu()
                        }, 1000)
                        navigate('/explore')
                      }}
                      className="sub-menu-item"
                    >
                      Explore
                    </a>
                  </li>
                  <li>
                    <a
                      href="/auction"
                      onClick={e => {
                        e.preventDefault()
                        setTimeout(() => {
                          activateMenu()
                        }, 1000)
                        navigate('/auction')
                      }}
                      className="sub-menu-item"
                    >
                      Live Auction
                    </a>
                  </li>
                  <li>
                    <a
                      href="/activity"
                      onClick={e => {
                        e.preventDefault()
                        setTimeout(() => {
                          activateMenu()
                        }, 1000)
                        navigate('/activity')
                      }}
                      className="sub-menu-item"
                    >
                      Activity
                    </a>
                  </li>
                  <li>
                    <a
                      href="/wallet"
                      onClick={e => {
                        e.preventDefault()
                        setTimeout(() => {
                          activateMenu()
                          toggleSwitcher(false)
                        }, 1000)
                        navigate('/wallet')
                      }}
                      className="sub-menu-item"
                    >
                      Wallet
                    </a>
                  </li>
                  <li>
                    <a
                      href="/creators"
                      onClick={e => {
                        e.preventDefault()
                        setTimeout(() => {
                          activateMenu()
                          toggleSwitcher(false)
                        }, 1000)
                        navigate('/creators')
                      }}
                      className="sub-menu-item"
                    >
                      Creators
                    </a>
                  </li>
                  {/* <li className="has-submenu parent-menu-item">
                    <a href="" onClick={e => mobileHandler(e, 'creators')}>
                      {' '}
                      Creator{' '}
                    </a>
                    <span className="submenu-arrow"></span>
                    <ul
                      className={`submenu ${mobile.includes('creators') ? 'open' : ''
                        }`}
                    >
                      <li>
                        <a
                          href="/creators"
                          onClick={e => {
                            e.preventDefault()
                            setTimeout(() => {
                              activateMenu()
                              toggleSwitcher(false)
                            }, 1000)
                            navigate('/creators')
                          }}
                          className="sub-menu-item"
                        >
                          {' '}
                          Creators
                        </a>
                      </li>
                      <li>
                        <a
                          href="/creator-profile"
                          onClick={e => {
                            e.preventDefault()
                            setTimeout(() => {
                              activateMenu()
                              toggleSwitcher(false)
                            }, 1000)
                            navigate('/creator-profile')
                          }}
                          className="sub-menu-item"
                        >
                          {' '}
                          Creator Profile
                        </a>
                      </li>
                      <li>
                        <a
                          href="/creator-profile-edit"
                          onClick={e => {
                            e.preventDefault()
                            setTimeout(() => {
                              activateMenu()
                              toggleSwitcher(false)
                            }, 1000)
                            navigate('/creator-profile-edit')
                          }}
                          className="sub-menu-item"
                        >
                          {' '}
                          Profile Edit
                        </a>
                      </li>
                      <li>
                        <a
                          href="/become-creator"
                          onClick={e => {
                            e.preventDefault()
                            setTimeout(() => {
                              activateMenu()
                              toggleSwitcher(false)
                            }, 1000)
                            navigate('/become-creator')
                          }}
                          className="sub-menu-item"
                        >
                          {' '}
                          Become Creator
                        </a>
                      </li>
                    </ul>
                  </li> */}
                </ul>
              </li>
              <li>
                <a
                  href="/"
                  onClick={e => {
                    e.preventDefault()
                    setTimeout(() => {
                      activateMenu()
                    }, 1000)
                    navigate('/')
                  }}
                  className="sub-menu-item"
                >
                  <IoIosStats />
                  {' '}
                  Tokenomics
                </a>
              </li>
              <li>
                <a
                  href="/"
                  onClick={e => {
                    e.preventDefault()
                    setTimeout(() => {
                      activateMenu()
                    }, 1000)
                    navigate('/create-nft')
                  }}
                  className="sub-menu-item"
                >
                  <IoIosAlbums />
                  {' '}
                  Create
                </a>
              </li>
              <li>
                <a
                  href="/subscriptions"
                  onClick={e => {
                    e.preventDefault()
                    setTimeout(() => {
                      activateMenu()
                    }, 1000)
                    navigate('/subscriptions')
                  }}
                  className="sub-menu-item"
                >
                  <MdNotificationAdd />
                  {' '}
                  Subscriptions
                </a>
              </li>
              <li>
                <a
                  href="/"
                  onClick={e => {
                    e.preventDefault()
                    setTimeout(() => {
                      activateMenu()
                    }, 1000)
                    navigate('/')
                  }}
                  className="sub-menu-item"
                >
                  <CgFileDocument />
                  {' '}
                  Whitepaper
                </a>
              </li>
            </ul>
            {/*end navigation menu*/}
          </div>
          {/*end navigation*/}
        </div>
        {/*end container*/}
      </header>
      {/*end header*/}
      {/* Navbar End */}
    </>
  )
}

export default Navbar
