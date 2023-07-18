import React from 'react'
import { getChainByName } from '../../blockchain/supportedChains'
import { useNavigate } from 'react-router-dom'
import Countdown from 'react-countdown';
import axiosConfig from "../../axiosConfig"
import { useSelector } from 'react-redux';
import { client01 } from '../imageImport';

const NftCardAuction = ({data, index}) => {
    const navigate = useNavigate();
    const { account } = useSelector(state => state.theme);

  async function likedNFT(nft){
    await axiosConfig.post('/profile/addlikednfts',{walletAddress: account, nft: nft}).then((res)=>{
      toast(res.data.message)
    })
  }

  return (
  <div key={index} className='mt-5'>
    <div className="card nft-items nft-primary nft-auction rounded-md shadow overflow-hidden mb-1 p-3">
      <div className="d-flex align-items-center justify-content-between">
        <div className="d-flex align-items-center">
          <img
            src={data?.owner?.profileImage || client01}
            alt="user"
            className="avatar avatar-sm-sm img-thumbnail border-0 shadow-sm rounded-circle"
          />
          <a
            href=""
            onClick={e => e.preventDefault()}
            className="text-dark small creator-name h6 mb-0 ms-2"
          >
            {data?.owner?.name ? `@ ${data?.owner?.name}` : ''}
          </a>
        </div>
      </div>

      <div className="nft-image rounded-md mt-3 position-relative overflow-hidden">
        <a
          href={`/nft/${data?.nftAddress}`}
          onClick={e => {
            e.preventDefault()
            navigate(`/nft/${data?.nftAddress}`)
          }}
        >
          <img src={data?.image} className="img-fluid" alt="" style={{ width: '100%', height: '250px', objectFit: 'cover', }} />
        </a>
        <div className="position-absolute top-0 start-0 m-2">
          <a
            href=""
            onClick={e => e.preventDefault()}
            className="badge badge-link bg-primary"
          >
            {data?.collection?.category?.name}
          </a>
        </div>
        <div className="position-absolute top-0 end-0 m-2">
          <span className="like-icon shadow-sm">
            <a
              href=""
              onClick={e => {
                e.preventDefault()
                likedNFT(data)
              }}
              className="text-muted icon"
            >
              <i className="mdi mdi-18px mdi-heart mb-0"></i>
            </a>
          </span>
        </div>

        <div className="position-absolute bottom-0 start-0 m-2 h5 bg-gradient-primary text-white title-dark rounded-pill px-3">
          <i className="uil uil-clock"></i>{' '}
          <Countdown
            date={new Date(data?.auctionTimeEnd * 1000)}
            renderer={({ days, hours, minutes, seconds }) => (
              <span>
                {days}:{hours}:{minutes}:{seconds}
              </span>
            )}
          />
        </div>
      </div>

      <div className="card-body content position-relative p-0 mt-3">
        <a
          href={`/nft/${data?.nftAddress}`}
          onClick={e => {
            e.preventDefault()
            navigate(`/nft/${data?.nftAddress}`)
          }}
          className="title text-dark h6"
        >
          {data?.name}
        </a>

        <div className="d-flex align-items-center justify-content-between mt-3">
          <div className="">
            <small className="mb-0 d-block fw-semibold">
              Starting Bid:
            </small>
            <small className="rate fw-bold"> {data?.price} {getChainByName(data?.blockchain)} </small>
          </div>
        </div>
      </div>
    </div>
  </div>
  )
}

export default NftCardAuction