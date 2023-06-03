import React, { useEffect } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { work1, client01, bg01 } from '../../components/imageImport'
import axiosConfig from '../../axiosConfig'
import { useSelector } from 'react-redux'
import { supportedChains } from '../../blockchain/supportedChains'
import Main from '../../Layouts/Main'
import { toast } from 'react-toastify'
import { deployContract } from '../../blockchain/mintContracts'
import { switchChain } from '../../utils'


const UploadWork = () => {
  const navigate = useNavigate()
  const { user, account } = useSelector(state => state.theme)
  const [title, setTitle] = React.useState('Collection 5')
  const [description, setDescription] = React.useState('This is collection')
  const [blockchain, setBlockchain] = React.useState('')
  const [paymentToken, setPaymentToken] = React.useState('Eth')
  const [categories, setCategories] = React.useState([])
  const [category, setCategory] = React.useState('Music')
  const [creating, setCreating] = React.useState(false)
  const [image, setImages] = React.useState(null)
  const [error, setError] = React.useState(null)

  const location = useLocation();
  const { state } = location
  
  useEffect(() => {
    if (state) {
      const collection = state.collection
      setBlockchain(collection.blockchain)
      setPaymentToken(collection.paymentTokens[0])
      setCategory(collection.category.name)
      setTitle(collection.name)
      setDescription(collection.description)
      setImages(collection.collectionImage)
      editPreviewImage(collection.collectionImage)
    }
  }, [])

  useEffect(() => {
    if (!account) {
      navigate('/')
    }
  }, [account, navigate])

  useEffect(() => {
    axiosConfig.get('/categories/getcategories')
      .then(res => {
        setCategories(res.data.data)
        setCategory(res.data.data[0])
      })
      .catch(err => {
        console.log(err)
      })

    return () => {
      setCategories([])
    }
  }, [])


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

  const editPreviewImage = (imagePath) => {
    const parent = document.querySelector('.preview-box')
    parent.innerHTML = `<img className="preview-content" src=${imagePath} />`
  }

  const handleSubmit = async e => {
    e.preventDefault()
    const data = {
      name: title,
      description,
      blockchain,
      paymentTokens: [paymentToken],
      categoryID: category.id,
      owner: state ? state.collection.owner.walletAddress : account
    }
    if (state) {
      data["collectionAddress"] = state.collection.collectionAddress
    }
    if (!image && !state) {
      setError('Please upload an image')
      return
    }

    if (!category) {
      setError('Please select a category')
      return
    }

    const formData = new FormData()
    setCreating(true)
    if (!state) {
      const id = toast.loading('Creating Collection');
      try {
        const contractAddress = await deployContract(account, data.blockchain, data.name, '');
        if(contractAddress){
          console.log(contractAddress);
          data.collectionAddress = contractAddress;
          formData.append('file', image)
          formData.append('data', JSON.stringify(data))
          await axiosConfig.post("/collections/createcollection", formData, {
            body: data,
            headers: {
              'Content-Type': 'multipart/form-data'
            },
          })
          .then(res => {            
            toast.update(id, {
              render: `${res.data.message}. Click to View`, closeOnClick: true, type: 'success', isLoading: false, closeButton: true, onClick: ()=>navigate(`/collection/${res.data.data.collectionAddress}`)
            })
          })
          .catch(err => {
            toast.update(id, {
              render: `${err.message}`, closeOnClick: true, isLoading: false, type: 'error', autoClose: 5000, closeButton: true
            })
          })
        }
      } catch (error) {
        toast.update(id, {
          render: `${error.message}`, closeOnClick: true, isLoading: false, type: 'error', autoClose: 5000, closeButton: true
        })
      }
    } else {
      const id = toast.loading('Updating Collection');
      formData.append('file', image)
      formData.append('data', JSON.stringify(data))
      await axiosConfig.put("/collections/updatecollection", formData, {
        body: data,
        headers: {
          'Content-Type': 'multipart/form-data'
        },
      })
        .then(res => {
          toast.update(id, {
            render: `${res.data.message}. Click to View`, closeOnClick: true, type: 'success', isLoading: false, closeButton: true, onClick: ()=>navigate(`/collection/${res.data.data.collectionAddress}`)
          })
        })
        .catch(err => {
          toast.update(id, {
            render: `${err.message}`, closeOnClick: true, isLoading: false, type: 'error', autoClose: 5000, closeButton: true
          })
        })
    }
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
                  Create Collection
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
                  Create Collection
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
                              Collection Title <span className="text-danger">*</span>
                            </label>
                            <input
                              onChange={e => setTitle(e.target
                                .value)}
                              name="name"
                              required
                              id="name"
                              value={title}
                              type="text"
                              className="form-control"
                              placeholder="Title :"
                            />
                          </div>
                          {/*end col*/}

                          <div className="col-12 mb-4">
                            <label className="form-label fw-bold">
                              {' '}
                              Description :{' '}
                            </label>
                            <textarea
                            required
                              onChange={e => setDescription(e.target.value)}
                              value={description}
                              name="escription"
                              id="escription"
                              rows="4"
                              className="form-control"
                              placeholder="Description :"
                            ></textarea>
                          </div>
                          {/*end col*/}

                          {!state ? (
                          <>
                          <div className="col-md-6 mb-4">
                            <label className="form-label fw-bold">Blockchain:</label>
                            <select
                            required
                            value={blockchain} className='form-control' onChange={e => setBlockchain(e.target.value)} >
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

                          <div className="col-md-6 mb-4">
                            <label className="form-label fw-bold">Payment Token:</label>
                            <select
                            required
                              onChange={e => setPaymentToken(e.target.value)}
                              value={paymentToken}
                              className="form-control">
                              <option>Eth</option>
                            </select>
                          </div>
                          </>
                          ) : ''}

                          <div className="col-12 mb-4">
                            <label className="form-label fw-bold">Category:</label>
                            {
                              categories && (
                                <select
                                required
                                  onChange={e => {
                                    setCategory(categories.find(category => category.name === e.target.value))
                                  }}
                                  value={category.name}
                                  className="form-control">
                                  {
                                    categories?.map((category, index) => (
                                      <option key={index}>{category.name}</option>
                                    ))
                                  }
                                </select>
                              )
                            }
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
                                state ? creating ? "Updating..." : "Update Collection" 
                                : creating ? "Creating..." : "Create Collection"
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

export default UploadWork
