import React from 'react'
import { getChainByName } from '../../blockchain/supportedChains'
import { useNavigate } from 'react-router-dom'
import Countdown from 'react-countdown';
import axiosConfig from "../../axiosConfig"
import { useSelector } from 'react-redux';


const NftCardDark = ({data, index}) => {
    const navigate = useNavigate();
    const { account } = useSelector(state => state.theme);

    async function likedNFT(nft){
      await axiosConfig.post('/profile/addlikednfts',{walletAddress: account, nft: nft})
    }
    
  return (
    <div key={index} className='mt-5'>
      <div className="card bg-white nft-items nft-primary rounded-md shadow-md overflow-hidden mx-2 my-3">
        <div className="nft-image position-relative overflow-hidden">
          <a
            href={`/nft/${data?.nftAddress}`}
            onClick={e => {
              e.preventDefault()
              navigate(`/nft/${data?.nftAddress}`)
            }}
          >
            <img
              src={data?.image}
              className="img-fluid"
              alt=""
              style={{ width: '100%', height: '250px', objectFit: 'cover', }}
            />
          </a>
          <div className="position-absolute top-0 start-0 m-3">
            <a
              href=""
              onClick={e => e.preventDefault()}
              className="badge badge-link bg-primary"
            >
              {data?.collection?.category?.name}
            </a>
          </div>

          {data?.type == 'auction' && (
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
          )}

        </div>

        <div className="card-body content position-relative">
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
              <small className="rate fw-bold"> {data?.price} { data?.paymentToken == 'USDT' ? data?.paymentToken : getChainByName(data?.blockchain) } </small>
            </div>
          </div>
        </div>
      </div>
  </div>
  )
}

export default NftCardDark