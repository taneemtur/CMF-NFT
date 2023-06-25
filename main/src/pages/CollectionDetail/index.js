import { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import {
  bg01,
  item1,
  item2,
  item3,
  item4,
  item5,
  item6,
  item7,
  item8,
  item9,
  item10,
  gif1,
  gif2,
  gif3,
  gif4,
  gif5,
  gif6,
  cta,
  client05,
  client06,
  client08,
  client01,
  single,
} from '../../components/imageImport'
import axiosConfig from '../../axiosConfig'
import { useSelector } from 'react-redux'
import Main from '../../Layouts/Main'
import { toast } from 'react-toastify'
import NftCard from '../../components/NftCard'
import { getChainName } from '../../blockchain/supportedChains'
import { USER_ACTIVITIES } from '../../activities'


const CollectionDetail = () => {
  const navigate = useNavigate()
  const { user, account } = useSelector(state => state.theme)
  const [collection, setCollection] = useState(null);
  const [nfts, setNfts] = useState(null);
  const [start, setStart] = useState(0);
  const [end, setEnd] = useState(10);
  const { collectionAddress } = useParams();

  const getCollectionData = async () => {
    await axiosConfig.get(`/collections/collection/${collectionAddress}`).then((res) => {
      console.log(res.data)
      setCollection(res.data.data)
    })
  }

  const getCollectionNfts = async () => {
    await axiosConfig.get(`/nfts/getcollectionnfts/${collectionAddress}`).then((res) => {
      console.log(res.data)
      setNfts(res.data.data)
    })
  }

  useEffect(() => {
    if (collectionAddress) {
      getCollectionData();
      getCollectionNfts();
    }

    return () => {
      setCollection(null);
      setNfts([]);
    }
  }, [collectionAddress])

  return (
    <Main>
      {/* collection banner and name section */}
      <section className='bg-creator-profile'>
        <div className="container">
          {/* this is collection banner image */}
          <div className="profile-banner">
            <div className="position-relative d-inline-block">
              <img
                src={collection?.collectionImage || single}
                className="rounded-md shadow-sm img-fluid"
                id="profile-banner"
                alt=""
              />
              <label
                className="icons position-absolute bottom-0 end-0"
                htmlFor="pro-banner"
              >
              </label>
            </div>
          </div>
          {/* collection banner image end */}
          <div className="row justify-content-center">
            <div className="col">
              <div className="text-left mt-n80 ">
                {/* collection logo image */}
                <div className="profile-pic">
                  <div className="position-relative d-inline-block">
                    <img
                      src={collection?.collectionImage || client01}
                      className="avatar avatar-medium img-thumbnail rounded-pill shadow-sm"
                      id="profile-image"
                      alt=""
                    />
                    <label
                      className="icons position-absolute bottom-0 end-0"
                      htmlFor="pro-img"
                    >
                    </label>
                  </div>
                </div>
                {/* collection logo image */}
                {/* collection name and details */}
                <div className="content mt-3">
                  <h5 className="m-2"> {collection?.name} </h5>
                  <div className='row align-items-baseline '>
                    <div className='col-lg-9 col-md-9 col-sm-12 d-lg-flex d-sm-block d-md-flex' >
                      <p className='m-2'> Owner:  { (collection?.owner.walletAddress == account ? 'YOU' : collection?.owner?.walletAddress) } </p>
                      <p className='m-2'> Chain: {getChainName(collection?.blockchain)} </p>
                      <p className='m-2'> Category: {collection?.category.name} </p>
                    </div>
                    {/* edit and delete button for owner only */}
                    {
                      collection?.owner.walletAddress == account && (
                        <div className='col-lg-3 col-md-3 col-sm-12 text-center'>
                        <a
                          href="/upload-work"
                          onClick={e => {
                            e.preventDefault()
                            navigate('/upload-work', {
                              state: {
                                collection
                              }
                            })
                          }}
                          className="btn btn-pills btn-outline-primary mx-1"
                        >
                          Edit Collection
                        </a>
                        <a
                          href="/upload-work"
                          onClick={async (e) => {
                            e.preventDefault()
                            const id = toast.loading('Collection Deleteing');
                            // navigate('/upload-work')
                            await axiosConfig.delete(`/collections/${collection.collectionAddress}`)
                            .then(async (res) => {
                              await axiosConfig.post("/activity/useractivity", {
                                // userId, activityName, activityData
                                userId: account,
                                activityName: USER_ACTIVITIES.DELETE_COLLECTION,
                                activityData: {
                                  ...res.data.data,
                                  deleteAt: new Date()
                                }
                              })
                              toast.update(id, {
                                render: `${res.data.message}`, closeOnClick: true, type: 'success', isLoading: false, closeButton: true, onClick: ()=>navigate(`/creator-profile`)
                              })
                              navigate(`/creator-profile`)
                            }).catch(err => {
                              console.log(err)
                            })
                          }}
                          className="btn btn-pills btn-icon btn-outline-primary mx-1"
                        >
                          <i className="uil uil-trash"></i>
                        </a>
                        </div>
                      )
                    }
                    {/* edit and delete button for owner only */}
                  </div>
                  <h6 className='m-2'> {collection?.description} </h6>
                </div>
                {/* collection name and details */}
              </div>
            </div>
          </div>
        </div>
      </section>
      {/* collection banner and name section */}

      {/* collection nfts section */}
      <section className="section">
        <div className="container">
          <div className="row row-cols-xl-4 row-cols-lg-4 row-cols-1">
            {nfts && nfts.slice(start, end)?.map((nft, index) => {
              return (
                <NftCard nft={nft} index={index} />
              )
            })}
          </div>
          {/*end row*/}
        </div>
        {/*end container*/}
      </section>
      {/* collection nfts section */}
    </Main>
  )
}

export default CollectionDetail
