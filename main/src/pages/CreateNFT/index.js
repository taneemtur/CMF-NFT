import React, { useEffect, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { work1, client01, bg01 } from '../../components/imageImport'
import axiosConfig from '../../axiosConfig'
import { useSelector } from 'react-redux'
import { supportedChains } from '../../blockchain/supportedChains'
import { v4 as uuid } from 'uuid';
import Main from '../../Layouts/Main'
import { toast } from 'react-toastify'
import { mint } from '../../blockchain/mintContracts'
import { getChainById } from '../../blockchain/supportedChains'


const CreateNFT = () => {
  const navigate = useNavigate()
  const { user, account, chain } = useSelector(state => state.theme)
  const [title, setTitle] = React.useState('')
  const [description, setDescription] = React.useState('')
  const [blockchain, setBlockchain] = React.useState('')
  const [price, setPrice] = React.useState(0)
  const [supply, setSupply] = React.useState(1)
  const [creating, setCreating] = React.useState(false)
  const [image, setImages] = React.useState(null)
  const [collections, setCollections] = useState([])
  const [collection, setCollection] = useState(null)
  const [externalLink, setExternalLink] = React.useState('')
  const [error, setError] = React.useState(null)

  const location = useLocation();
  const { state } = location

  useEffect(() => {
    if (state) {
      const nft = state.nft
      console.log(nft)
      setTitle(nft.name)
      setDescription(nft.description)
      setBlockchain(nft.blockchain)
      setPrice(nft.price)
      setCollection(nft.collection)
      setSupply(nft.supply)
      setExternalLink(nft.externalLink)
    }
  }, [])


  useEffect(() => {
    axiosConfig.get(`/collections/user/${account}`)
      .then(res => {
        console.log(res.data.data)
        const collections = res.data.data
        setCollections(collections)
        setCollection(collections[0])
      })
      .catch(err => {
        console.log(err)
      })

    return () => {
      setCollections([])
    }
  }, [account])

  const resetFields = () => {
    setTitle('')
    setDescription('')
    setBlockchain('Ethereum')
    setPrice(0)
    setSupply(1)
    setImages(null)
    setExternalLink('')
  }

  const handleChange = (e) => {
    const fileUploader = document.querySelector('#input-file')
    const getFile = fileUploader.files
    if (getFile.length !== 0) {
      const uploadedFile = getFile[0]
      const file = e.target.files[0]
      readFile(uploadedFile)
      setImages(file)
    }
  }

  const readFile = uploadedFile => {
    if (uploadedFile) {
      const reader = new FileReader()
      reader.onload = () => {
        const parent = document.querySelector('.preview-box')
        parent.innerHTML = `<img className="preview-content" src=${reader.result} />`
      }

      reader.readAsDataURL(uploadedFile)
    }
  }


  const handleSubmit = async e => {
    e.preventDefault()

    if(account == null){
      return;
    }

    const nftAddress = uuid()

    const data = {
      name: title,
      description,
      blockchain,
      collectionAddress: collection.collectionAddress,
      owner: account,
      price,
      supply,
      externalLink,
      nftAddress: state ? state.nft.nftAddress : nftAddress
    }
    
    if (state) {
      data["collectionAddress"] = state.nft.collection.collectionAddress
    }
    if (!image && !state) {
      setError('Please upload an image')
      return
    }

    if (!collection) {
        setError('Please select a collection')
        return
    }

    const formData = new FormData()
    formData.append('file', image)
    
    setCreating(true)
    if (!state) {
      if(chain != data.blockchain){
        const chainParam = getChainById(data.blockchain)
          try {
            await ethereum.request({
              method: 'wallet_switchEthereumChain',
              params: [{ chainId: data.blockchain }],
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
      const mintItem = await mint(data.blockchain, image.name ,account);
      if(mintItem?.code == 200){
        const id = toast.loading('Creating Item');
        const tokenId = mintItem.data.Transfers.returnvalues.tokenId;
        data.tokenID = tokenId;
        formData.append('data', JSON.stringify(data))
        await axiosConfig.post("/nfts/createnft", formData, {
          body: data,
          headers: {
            'Content-Type': 'multipart/form-data'
          },
        })
          .then(res => {
            toast.update(id, {
              render: `${res.data.message}. Click to View`, closeOnClick: true, type: 'success', isLoading: false, closeButton: true, onClick: ()=>navigate(`/nft/${res.data.data.nftAddress}`)
            })
          })
          .catch(err => {
            toast.update(id, {
              render: `${err}`, closeOnClick: true, isLoading: false, type: 'error', autoClose: 5000, closeButton: true
            })
          })
      }
    } else {
      const id = toast.loading('Updating Item');
      await axiosConfig.put("/nfts/updatenft", formData, {
        body: data,
        headers: {
          'Content-Type': 'multipart/form-data'
        },
      })
        .then(res => {
            toast.update(id, {
                render: `${res.data.message}. Click to View`, closeOnClick: true, type: 'success', isLoading: false, closeButton: true, onClick: ()=>navigate(`/nft/${res.data.data.nftAddress}`)
              })
        })
        .catch(err => {
          console.log(err)
        })
    }
    resetFields()
    setCreating(false)
  }


  return (
    <Main>
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
                  Create Item
                </h5>
                <p className="text-white-50 para-desc mx-auto mb-0">
                  Add your digital art and work
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
                    href="/"
                    onClick={e => {
                      e.preventDefault()
                      navigate('/')
                    }}
                  >
                    Chain Master Finance
                  </a>
                </li>
                <li className="breadcrumb-item active" aria-current="page">
                  Create Item
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

      {/* Start */}
      <section className="section">
        <div className="container">
          <div className="row">
            <div className="col-lg-3 col-md-4 order-2 order-md-1 mt-4 pt-2 mt-sm-0 pt-sm-0">
              <div className="card creators creator-primary rounded-md shadow overflow-hidden sticky-bar">
                <div
                  className="py-5"
                  style={{ background: `url(${user?.bannerImage || work1})`, backgroundSize: 'cover' }}
                ></div>
                <div className="position-relative mt-n5">
                  <img
                    src={user?.profileImage || client01}
                    className="avatar avatar-md-md rounded-pill shadow-sm bg-light img-thumbnail mx-auto d-block"
                    alt=""
                  />

                  <div className="content text-center pt-2 p-4">
                    <h6 className="mb-0"></h6>
                    <small className="text-muted">{"@" + user?.name}</small>

                    <ul className="list-unstyled mb-0 mt-3" id="navmenu-nav">
                      <li className="px-0">
                        <a
                          href="/creator-profile"
                          onClick={e => {
                            e.preventDefault()
                            navigate('/creator-profile')
                          }}
                          className="d-flex align-items-center text-dark"
                        >
                          <span className="fs-6 mb-0">
                            <i className="uil uil-user"></i>
                          </span>
                          <small className="d-block fw-semibold mb-0 ms-2">
                            Profile
                          </small>
                        </a>
                      </li>

                      <li className="px-0 mt-2">
                        <a
                          href="/creator-profile-edit"
                          onClick={e => {
                            e.preventDefault()
                            navigate('/creator-profile-edit')
                          }}
                          className="d-flex align-items-center text-dark"
                        >
                          <span className="fs-6 mb-0">
                            <i className="uil uil-setting"></i>
                          </span>
                          <small className="d-block fw-semibold mb-0 ms-2">
                            Settings
                          </small>
                        </a>
                      </li>

                      <li className="px-0 mt-2">
                        <a
                          href="/lock-screen"
                          onClick={e => {
                            e.preventDefault()
                            navigate('/lock-screen')
                          }}
                          className="d-flex align-items-center text-dark"
                        >
                          <span className="fs-6 mb-0">
                            <i className="uil uil-sign-in-alt"></i>
                          </span>
                          <small className="d-block fw-semibold mb-0 ms-2">
                            Logout
                          </small>
                        </a>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
            {/*end col*/}

            <div className="col-lg-9 col-md-8 order-1 order-md-2">
              <div className="card rounded-md shadow p-4">
                <div className="row">
                  <div className="col-lg-5">
                    <div className="d-grid">
                      <p className="fw-semibold mb-4">
                        Upload your ART here, Please click the "Upload Image"
                        Button.
                      </p>
                      <div className="preview-box d-block justify-content-center rounded-md shadow overflow-hidden bg-light text-muted p-2 text-center small">
                        Supports JPG, PNG, GIF and MP4 videos. Max file size : 10MB.
                      </div>
                      <input
                        type="file"
                        id="input-file"
                        name="input-file"
                        accept="image/*"
                        onChange={(e) => handleChange(e)}
                        hidden
                      />
                      <label
                        className="btn-upload btn btn-primary rounded-md mt-4"
                        htmlFor="input-file"
                      >
                        Upload Image
                      </label>
                    </div>
                  </div>
                  {/*end col*/}

                  <div className="col-lg-7 mt-4 mt-lg-0">
                    <div className="ms-lg-4">
                      <form onSubmit={handleSubmit}>
                        <div className="row">
                          <div className="col-12 mb-4">
                            <label className="form-label fw-bold">
                              NFT Title <span className="text-danger">*</span>
                            </label>
                            <input
                              onChange={e => setTitle(e.target
                                .value)}
                              name="name"
                              id="name"
                              value={title}
                              type="text"
                              className="form-control"
                              placeholder="Title :"
                              required
                            />
                          </div>
                          {/*end col*/}

                          <div className="col-12 mb-4">
                            <label className="form-label fw-bold">
                              {' '}
                              Description :{' '}
                            </label>
                            <textarea
                              onChange={e => setDescription(e.target.value)}
                              value={description}
                              name="description"
                              id="description"
                              rows="4"
                              className="form-control"
                              placeholder="Description :"
                              required
                            ></textarea>
                          </div>
                          {/*end col*/}

                          <div className="col-md-6 mb-4">
                            <label className="form-label fw-bold">Blockchain:</label>
                            <select required value={blockchain} className='form-control' onChange={(e) => setBlockchain(e.target.value) } >
                              <option value=''> Select Chain </option>
                              {supportedChains.map((item) => {
                                return (
                                  <>
                                    <option value={item.chainId}> {item.chainName} </option>
                                  </>
                                )
                              })}
                            </select>
                          </div>
                          {/*end col*/}

                          <div className="col-md-6 mb-4">
                            <label className="form-label fw-bold">Price:</label>
                            <input
                            required
                              onChange={e => setPrice(e.target
                                .value)}
                              name="price"
                              id="price"
                              value={price}
                              min="0"
                              step={"any"}
                              type="number"
                              className="form-control"
                              placeholder="Price :"
                            />
                          </div>
                          {/*end col*/}

                          <div className="col-12 mb-4">
                            <label className="form-label fw-bold">Collection:</label>
                            {
                              collections && (
                                <select
                                required
                                  onChange={e => {
                                    setCollection(collections.find(collection => collection.name === e.target.value))
                                  }}
                                  value={collection?.name}
                                  className="form-control">
                                  {
                                    collections?.map((collection, index) => (
                                      <option key={collection.collectionAddress}>{collection.name}</option>
                                    ))
                                  }
                                </select>
                              )
                            }
                          </div>
                          {/*end col*/}

                          <div className="col-12 mb-4">
                            <label className="form-label fw-bold">Supply:</label>
                            <input
                            required
                              onChange={e => setSupply(e.target
                                .value)}
                              name="supply"
                              id="supply"
                              value={supply}
                              type="number"
                              min="1"
                              className="form-control"
                              placeholder="Supply :"
                            />
                          </div>
                          {/*end col*/}

                          <div className="col-12 mb-4">
                            <label className="form-label fw-bold">External Link:</label>
                            <input
                            required
                              onChange={e => setExternalLink(e.target
                                .value)}
                              name="externalLink"
                              id="externalLink"
                              value={externalLink}
                              type="text"
                              className="form-control"
                              placeholder="External Link :"
                            />
                          </div>
                          {/*end col*/}



                          {
                            error && (
                              <div className="col-12 mb-4">
                                <p style={{
                                  color: "red", marginBott
                                    : 0
                                }}>{error}</p>
                              </div>
                            )
                          }
                          <div className="col-lg-12">
                            <button
                              type="submit"
                              disabled={creating}
                              className="btn btn-primary rounded-md"
                            >
                              {
                                state ? creating ? "Updating..." : "Update NFT" 
                                : creating ? "Creating..." : "Create NFT"
                              }
                            </button>
                          </div>
                          {/*end col*/}
                        </div>
                      </form>
                    </div>
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
      </section>
      {/*end section*/}
      {/* End */}
    </Main>
  )
}

export default CreateNFT
