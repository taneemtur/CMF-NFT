import React, { useContext, useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Footer from '../../components/Footer'
import Navbar from '../../components/Navbar'
import { bg01, client01, set } from '../../components/imageImport'
import { FiCamera } from 'react-icons/fi'
import axiosConfig from '../../axiosConfig'
import { useDispatch, useSelector } from 'react-redux'
import { toast } from 'react-toastify'
import Main from '../../Layouts/Main'
import { setUser } from '../../Store/Slicers/theme'

const CreatorProfileEdit = (props) => {
  const navigate = useNavigate()
  const dispatch = useDispatch();
  const { user, account } = useSelector(state => state.theme)
  const [name, setName] = useState(user?.name || "")
  const [url, setUrl] = useState(user?.url || "")
  const [twitter, _twitter] = useState(user?.twitterAccount || "")
  const [website, setWebsite] = useState(user?.website || "")
  const [email, setEmail] = useState(user?.email || "")
  const [bio, setBio] = useState(user?.bio || "")
  const [follow, setFollow] = useState(true)
  const [job, setJob] = useState(true)
  const [unsubscribe, setUnsubscribe] = useState(true)

  const [updating, setUpdating] = useState(false)

  useEffect(() => {
    if (!account) {
      navigate('/')
    }
  }, [account, navigate])

  useEffect(() => {
    if (user) {
      console.log(user)
      setName(user.name)
      setUrl(user.url)
      _twitter(user.twitterAccount)
      setWebsite(user.website)
      setEmail(user.email)
      setBio(user.bio)
    }
    return () => {
      setName("")
      setUrl("")
      _twitter("")
      setWebsite("")
      setEmail("")
      setBio("")
    }
  }, [user])


  const loadFile = async function (event, banner = false) {
    var image = document.getElementById(event.target.name)
    image.src = URL.createObjectURL(event.target.files[0])

    const data = new FormData();
    data.append("file", event.target.files[0]);
    const endpoint = banner ? "/profile/uploadbannerimage" : "/profile/uploadprofileimage"
    await axiosConfig.post(`${endpoint}/${account}`, data, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    })
      .then((res) => {
        console.log(res);
      })
      .catch((err) => {
        console.log(err);
      });

  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setUpdating(true)
    const data = {
      name,
      url,
      twitterAccount: twitter,
      website,
      email,
      bio,
      walletAddress: account,
    }
    try {
      const res = await toast.promise(axiosConfig.put('/profile/updateprofile', data), {
        pending: {
          render() {
            return "Updating Profile"
          },
          icon: false,
        },
        success: {
          render({ data }) {
            return `${data.data.message}`
          },
          icon: "🟢",
        },
        error: {
          render({ data }) {
            return data.data.message
          }
        }
      })

      setUpdating(false)
      dispatch(setUser({ ...user, 
        name: data.name,
        url: data.url,
        twitterAccount: data.twitterAccount,
        website: data.website,
        email: data.email,
        bio: data.bio,
        walletAddress: data.walletAddress,
      }));
      console.log(res)
    } catch (error) {
      toast.error(error)
      console.log(error)
    }
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
                  Edit Profile
                </h5>
                <p className="text-white-50 para-desc mx-auto mb-0">
                  Edit your profile
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
                  Profile Edit
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
            <div className="col-lg-9">
              <h5>
                You can set your display name, add your branded profile
                URL and manage other profile options here.
              </h5>
            </div>
          </div>
          <div className="row">
            <div className="col-lg-8 col-md-7 col-12 order-2 order-md-1 mt-4 pt-2">
              <div className="rounded-md shadow">
                <div className="p-4 border-bottom">
                  <h5 className="mb-0">Edit Your Profile:</h5>
                </div>

                <div className="p-4">
                  <form className="profile-edit" onSubmit={handleSubmit}>
                    <div className="row">
                      <div className="col-12 mb-4">
                        <label className="form-label h6">Display Name:</label>
                        <input
                          name="name"
                          id="first"
                          type="text"
                          className="form-control"
                          value={name}
                          onChange={e => setName(e.target.value)}
                        />
                      </div>
                      {/*end col*/}

                      <div className="col-12 mb-4">
                        <label className="form-label h6">URL:</label>
                        <div className="form-icon">
                          <input
                            name="url"
                            id="Chain Master Finance-url"
                            type="url"
                            className="form-control"
                            value={url}
                            onChange={e => setUrl(e.target.value)}
                          />
                        </div>
                      </div>
                      {/*end col*/}

                      <div className="col-12 mb-4">
                        <label className="form-label h6">Your Bio:</label>
                        <textarea
                          onChange={(e) => setBio(e.target.value)}
                          value={bio}
                          name="comments"
                          id="comments"
                          rows="3"
                          className="form-control"
                          placeholder="I'm a Digital Artist. I create Digital Art with over 3 years of experience. Experienced with all stages of the Art cycle for dynamic NFT projects."
                        ></textarea>
                      </div>
                      {/*end col*/}

                      <div className="col-12 mb-4">
                        <label className="form-label h6">Twitter Account:</label>
                        <p className="text-muted">
                          Link your twitter account to gain more traction on the CMF
                          Marketplace
                        </p>
                        <div className="form-icon">
                          <input
                            name="url"
                            id="twitter-url"
                            type="url"
                            className="form-control"
                            value={twitter}
                            onChange={e => _twitter(e.target.value)}
                          />
                        </div>
                      </div>
                      {/*end col*/}

                      <div className="col-12 mb-4">
                        <label className="form-label h6">Website:</label>
                        <div className="form-icon">
                          <input
                            name="url"
                            id="web-url"
                            type="url"
                            className="form-control"
                            value={website}
                            onChange={e => setWebsite(e.target.value)}
                          />
                        </div>
                      </div>
                      {/*end col*/}

                      <div className="col-12 mb-4">
                        <label className="form-label h6">Email:</label>
                        <input
                          name="email"
                          id="email"
                          type="email"
                          className="form-control"
                          value={email}
                          onChange={e => setEmail(e.target.value)}
                        />
                      </div>
                      {/*end col*/}
                    </div>
                    {/*end row*/}

                    <div className="row">
                      <div className="col-12">
                        <button
                          type="submit"
                          id="submit"
                          name="send"
                          disabled={updating}
                          className="btn btn-primary rounded-md"
                        >
                          {updating ? "Updating ..." : "Update Profile"}
                        </button>
                      </div>
                      {/*end col*/}
                    </div>
                    {/*end row*/}
                  </form>
                </div>
              </div>

              {/* <div className="rounded-md shadow mt-4">
                <div className="p-4 border-bottom">
                  <h5 className="mb-0">Account Notifications:</h5>
                </div>

                <div className="p-4">
                  <div className="d-flex justify-content-between pb-4">
                    <h6 className="mb-0">When someone mentions me</h6>
                    <div className="form-check">
                      <input
                        className="form-check-input"
                        type="checkbox"
                        value=""
                        id="noti1"
                      />
                      <label
                        className="form-check-label"
                        htmlFor="noti1"
                      ></label>
                    </div>
                  </div>
                  <div className="d-flex justify-content-between py-4 border-top">
                    <h6 className="mb-0">When someone follows me</h6>
                    <div className="form-check">
                      <input
                        className="form-check-input"
                        type="checkbox"
                        value=""
                        checked={follow}
                        onClick={() => setFollow(!follow)}
                        id="noti2"
                      />
                      <label
                        className="form-check-label"
                        htmlFor="noti2"
                      ></label>
                    </div>
                  </div>
                  <div className="d-flex justify-content-between py-4 border-top">
                    <h6 className="mb-0">When my activity is shared</h6>
                    <div className="form-check">
                      <input
                        className="form-check-input"
                        type="checkbox"
                        value=""
                        id="noti3"
                      />
                      <label
                        className="form-check-label"
                        htmlFor="noti3"
                      ></label>
                    </div>
                  </div>
                  <div className="d-flex justify-content-between py-4 border-top">
                    <h6 className="mb-0">When someone messages me</h6>
                    <div className="form-check">
                      <input
                        className="form-check-input"
                        type="checkbox"
                        value=""
                        id="noti4"
                      />
                      <label
                        className="form-check-label"
                        htmlFor="noti4"
                      ></label>
                    </div>
                  </div>
                </div>
              </div>

              <div className="rounded-md shadow mt-4">
                <div className="p-4 border-bottom">
                  <h5 className="mb-0">CMF Marketing Notifications:</h5>
                </div>

                <div className="p-4">
                  <div className="d-flex justify-content-between pb-4">
                    <h6 className="mb-0">There is a sale or promotion</h6>
                    <div className="form-check">
                      <input
                        className="form-check-input"
                        type="checkbox"
                        value=""
                        id="noti5"
                      />
                      <label
                        className="form-check-label"
                        htmlFor="noti5"
                      ></label>
                    </div>
                  </div>
                  <div className="d-flex justify-content-between py-4 border-top">
                    <h6 className="mb-0">General CMF news</h6>
                    <div className="form-check">
                      <input
                        className="form-check-input"
                        type="checkbox"
                        value=""
                        id="noti6"
                      />
                      <label
                        className="form-check-label"
                        htmlFor="noti6"
                      ></label>
                    </div>
                  </div>
                  <div className="d-flex justify-content-between py-4 border-top">
                    <h6 className="mb-0">NFT Releases</h6>
                    <div className="form-check">
                      <input
                        className="form-check-input"
                        type="checkbox"
                        value=""
                        checked={job}
                        onClick={() => setJob(!job)}
                        id="noti7"
                      />
                      <label
                        className="form-check-label"
                        htmlFor="noti7"
                      ></label>
                    </div>
                  </div>
                  <div className="d-flex justify-content-between py-4 border-top">
                    <h6 className="mb-0">Unsubscribe From News</h6>
                    <div className="form-check">
                      <input
                        className="form-check-input"
                        type="checkbox"
                        value=""
                        checked={unsubscribe}
                        onClick={() => setUnsubscribe(!unsubscribe)}
                        id="noti8"
                      />
                      <label
                        className="form-check-label"
                        htmlFor="noti8"
                      ></label>
                    </div>
                  </div>
                </div>
              </div> */}

              {/* <div className="rounded-md shadow mt-4">
                <div className="p-4 border-bottom">
                  <h5 className="mb-0 text-danger">Delete Account :</h5>
                </div>

                <div className="p-4">
                  <h6 className="mb-0">
                    Do you want to delete the account? Please press below
                    "Delete" button
                  </h6>
                  <div className="mt-4">
                    <button className="btn btn-danger">Delete Account</button>
                  </div>
                </div>
              </div> */}
            </div>
            {/*end col*/}

            <div className="col-lg-4 col-md-5 col-12 order-1 order-md-2 mt-4 pt-2">
              <div className="card ms-lg-5">
                <div className="profile-pic">
                  <input
                    id="pro-img"
                    name="profile-image"
                    type="file"
                    className="d-none"
                    onChange={e => loadFile(e)}
                  />
                  <div className="position-relative d-inline-block">
                    <img
                      src={user?.profileImage || client01}
                      className="avatar avatar-medium img-thumbnail rounded-pill shadow-sm"
                      id="profile-image"
                      alt=""
                    />
                    <label
                      className="icons position-absolute bottom-0 end-0"
                      htmlFor="pro-img"
                    >
                      <span className="btn btn-icon btn-sm btn-pills btn-primary">
                        <FiCamera className="icons" />
                      </span>
                    </label>
                  </div>
                </div>

                <div className="mt-4">
                  <p className="text-muted mb-0">
                    We recommend an image of at least 400X400, GIFs work too.
                  </p>
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
      {/* End */}
    </Main>
  )
}

export default CreatorProfileEdit
