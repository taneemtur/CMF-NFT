import React, { useEffect } from 'react'
import DatePicker from "react-datepicker";
import axiosConfig from '../../axiosConfig';
import "react-datepicker/dist/react-datepicker.css";
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router';
import { type } from 'os';
import { approveCollection, listNFT } from '../../blockchain/mintContracts';
import { useSelector } from 'react-redux';

const LISTINGTYPE = {
    auction: 'auction',
    fixedprice: 'fixedprice'
}

const NFTListModel = ({ id, labelledby, nftAddress, setNFT, prevPrice, nft }) => {
    const navigate = useNavigate()
    const {account} = useSelector(state => state.theme);
    const [listingType, setListingType] = React.useState(LISTINGTYPE.fixedprice)
    const [startDate, setStartDate] = React.useState(new Date());
    const [price, setPrice] = React.useState(nft?.price)
    const [paymentToken, setPaymentToken] = React.useState('Eth')
    const btnRef = React.useRef(null)
    
    const handleListNFT = async () => {
        const id = toast.loading('Listing NFT')
        try {
            nft?.collection?.approved == false && (
                await approveCollection(account, nft.blockchain, nft?.collection?.collectionAddress),
                await updateCollectionApproval(nft?.collection?.collectionAddress, true)
            )
            const fixedListingId = await listNFT(paymentToken, parseInt(nft?.nftAddress), 1, nft?.price, nft?.collection?.collectionAddress, nft?.blockchain, account);
            await axiosConfig.put("/nfts/listnft", {
                listingType,
                endDate: listingType == LISTINGTYPE.fixedprice ? null : startDate,
                nftAddress,
                price,
                fixedListingId
            }).then(res => {
                toast.update(id, {
                    render: `${res.data.message}`, closeOnClick: true, isLoading: false, autoClose: 5000, closeButton: true, type: 'success'
                })
                setNFT(prev => ({
                    ...prev,
                    listed: true,
                    type: listingType,
                    endDate: listingType == LISTINGTYPE.fixedprice ? null : res.data.data.auctionTimeEnd
                }))
            }).catch(error => {
                toast.update(id, {
                    render: `${error.message}`, closeOnClick: true, isLoading: false, autoClose: 5000, closeButton: true
                })
            })
        } catch (error) {
            toast.update(id, {
                render: `${error.message}`, closeOnClick: true, isLoading: false, autoClose: 5000, closeButton: true
            })
        }
    }

    const updateCollectionApproval = async (collectionAddress, approve) => {
        const body = { collectionAddress, approve };
        await axiosConfig.put(`/collections/approvecollection`, body)
    }

    useEffect(()=>{
        nft && setPrice(nft?.price)
    },[nft])

    return (
        <div
            className="modal fade"
            id={id}
            aria-labelledby={labelledby}
            tabIndex="-1"
        >
            <div className="modal-dialog modal-dialog-centered modal-sm">
                <div className="modal-content border-0 shadow-md rounded-md">
                    <div className="modal-header">
                        <h5 className="modal-title" id={labelledby}>
                            List NFT
                        </h5>
                        <button
                            type="button"
                            className="btn btn-close"
                            data-bs-dismiss="modal"
                            id="close-modal"
                        >
                            <i className="uil uil-times fs-4"></i>
                        </button>
                    </div>
                    <div className="modal-body p-4">
                        <form>
                            <div className="row">
                                <div className="col-12 mb-4">
                                    <label className="form-label fw-bold">Listing Type:</label>
                                    <select
                                        required
                                        value={listingType} className='form-control' onChange={e => setListingType(e.target.value)} >
                                        <option value={LISTINGTYPE.fixedprice}> {LISTINGTYPE.fixedprice} </option>
                                        <option value={LISTINGTYPE.auction}> {LISTINGTYPE.auction} </option>
                                    </select>
                                </div>
                                {
                                    listingType === LISTINGTYPE.auction && (
                                        <div className="col-12 mb-4">
                                            <label className="form-label fw-bold">Auction End Time:</label>
                                            <DatePicker
                                                selected={startDate}
                                                onChange={(date) => {
                                                    console.log(date)
                                                    setStartDate(date)
                                                }}
                                                className='form-control'
                                                showTimeSelect
                                                dateFormat="Pp"
                                            />
                                        </div>
                                    )
                                }
                                <div className="col-12 mb-4">
                                    <label className="form-label fw-bold">Price</label>
                                    <input className='form-control' type="text" value={price} onChange={e => setPrice(e.target.value)} />
                                </div>
                            </div>
                        </form>

                        <div className="mt-4">
                            <button
                                className="btn btn-pills btn-primary w-100"
                                data-bs-dismiss="modal"
                                id="close-modal"
                                onClick={handleListNFT}
                                ref={btnRef}
                            >
                                List NFT
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default NFTListModel