import React, { useEffect, useState } from 'react'
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
} from '../../components/imageImport'

import Choices from 'choices.js'
import axiosConfig from '../../axiosConfig'
import Main from '../../Layouts/Main'
import NftCard from '../../components/NftCard'

const ExploreTwo = () => {
  const [nfts, setNfts] = useState([]);
  const [start, setStart] = useState(0);
  const [end, setEnd] = useState(10);
  const [total, setTotal] = useState(0);
  const [keyword, setKeyword] = useState('')
  const [type, setType] = useState('auction')
  const [category, setCategory] = useState('')
  const [categories, setCategories] = useState([])
  const [filtered, setFiltered] = useState(false)
  const [filterList, setFilterList] = useState([])

  const getAllNfts = async () => {
    await axiosConfig.get(`/nfts/${start}/${end}`).then((res) => {
      setNfts(res.data.data)
      setTotal(res.data.total)
      console.log(res.data.data)
    }).catch((err) => {
      console.log(err)
    })
  }

  function clearFilters(){
    setStart(0)
    setEnd(10)
    getAllNfts()
  }

  useEffect(() => {
    if(!filtered) {
      getAllNfts()
    }

    return () => {
      setNfts([])
    }
  }, [start, end])

  const getCategories = async () => {
    await axiosConfig.get("/categories/getcategories").then((res) => {
      setCategories(res.data.data)
    }).catch((err) => {
      console.log(err)
    })
  }

  useEffect(() => {
    getCategories()
  }, [])


  // useEffect(() => {
  //   new Choices('#choices-criteria')
  //   var singleCategorie = document.getElementById('choices-type')
  //   if (singleCategorie) {
  //     new Choices('#choices-type')
  //   }
  // }, [])

  useEffect(() => {
    setCategory(categories[0]?.name)
  }, [categories])

  const handleSubmit = async (e) => {
    e.preventDefault()
    // filter nfts based on keyword, type, category
    await axiosConfig.get(`/nfts/filter/${keyword.length == 0 ? null : keyword}/${type}/${category}`,).then((res) => {
      setFiltered(true)
      setNfts(res.data.data)
      setTotal(res.data.total)
      setFilterList(res.data.data.slice(start, 10))
      setEnd(1)
    }).catch((err) => {
      console.log(err)
    })
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
                  Marketplace
                </h5>
                <p className="text-white-50 para-desc mx-auto mb-0">
                  Explore the latest NFTs on CMF
                </p>
              </div>
            </div>
            {/*end col*/}
          </div>
          {/*end row*/}
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
          <div className="row justify-content-center">
            <div className="col-12">
              <div className="features-absolute">
                <div className="row justify-content-center" id="reserve-form">
                  <div className="col-xl-10 mt-lg-5">
                    <div className="card bg-white feature-top border-0 shadow rounded p-3">
                      <form onSubmit={handleSubmit}>
                        <div className="registration-form text-dark text-start">
                          <div className="row g-lg-0">
                            <div className="col-lg-3 col-md-6">
                              <div className="filter-search-form position-relative filter-border">
                                <i className="uil uil-search icons"></i>
                                <input
                                value={keyword}
                                onChange={(e) => setKeyword(e.target.value)}
                                  name="name"
                                  type="text"
                                  id="search-keyword"
                                  className="form-control filter-input-box bg-light border-0"
                                  placeholder="Search your keaywords"
                                />
                              </div>
                            </div>
                            {/*end col*/}

                            <div className="col-lg-3 col-md-6 mt-3 mt-md-0">
                              <div className="filter-search-form position-relative filter-border">
                                <i className="uil uil-usd-circle icons"></i>
                                <select
                                value={type}
                                onChange={(e) => setType(e.target.value)}
                                  className="form-select filter-input-box bg-light border-0"
                                  style={{ color: '#fff' }}
                                  data-trigger
                                  name="choices-criteria"
                                  id="choices-criteria"
                                  aria-label="Default select example"
                                  defaultValue="auction"
                                >
                                  <option style={{ color: '#fff' }} value="auction">Auction Product</option>
                                  <option style={{ color: '#fff' }} value="fixedprice">On Sale</option>
                                </select>
                              </div>
                            </div>
                            {/*end col*/}

                            <div className="col-lg-3 col-md-6 mt-3 mt-lg-0">
                              <div className="filter-search-form position-relative filter-border">
                                <i className="uil uil-window icons"></i>
                                <select
                                value={category}
                                onChange={(e) => setCategory(e.target.value)}
                                  className="form-select filter-input-box bg-light border-0"
                                  style={{ color: '#fff' }}
                                  data-trigger
                                  name="choices-type"
                                  id="choices-type"
                                  aria-label="Default select example"
                                  defaultValue={categories[0]?.name}
                                >
                                  {
                                    categories?.map((category, index) => {
                                      return (
                                        <option style={{ color: '#fff' }} key={index} value={category.name}>{category.name}</option>
                                      )
                                    })
                                  }
                                </select>
                              </div>
                            </div>
                            {/*end col*/}

                            <div className="col-lg-3 col-md-6 mt-3 mt-lg-0">
                              <input
                                type="submit"
                                id="search"
                                name="search"
                                style={{ height: 60 }}
                                className="btn btn-primary rounded-md searchbtn submit-btn w-100"
                                value="Search"
                              />
                            </div>
                            {/*end col*/}
                          </div>
                          {/*end row*/}
                          <div className='row g-lg-0 justify-content-end'>
                            <div className="col-lg-3 col-md-3 mt-3 mt-lg-0">
                              <input
                                type="button"
                                onClick={clearFilters}
                                id="clear"
                                style={{ height: 40 }}
                                className="btn btn-primary rounded-md searchbtn submit-btn w-100 mt-2"
                                value="Reset Filters"
                              />
                            </div>
                          </div>
                        </div>
                        {/*end container*/}
                      </form>
                    </div>
                  </div>
                  {/*ed col*/}
                </div>
                {/*end row*/}
              </div>
            </div>
            {/*end col*/}
          </div>
          {/*end row*/}
        </div>
        {/*end container*/}

        <div className="container">
          <div className="row row-cols-xl-4 row-cols-lg-3 row-cols-sm-2 row-cols-1">
            {nfts && filtered ? filterList.map((nft, index) => {
              return (
                <NftCard nft={nft} index={index} />
              )
            }) : nfts?.map((nft, index) => {
              return (
                <NftCard nft={nft} index={index} />
              )
            })}
            {/*end col*/}
          </div>
          {/*end row*/}

          {
            end < total && (
              <div className="row justify-content-center mt-4">
                <div className="col">
                  <div className="text-center">
                    <a
                      href=""
                      onClick={e => {
                        e.preventDefault()
                        if(!filtered){
                          setEnd(prev => prev+10)
                        }else{
                          const newEnd = end+10
                          setEnd(newEnd)
                          setFilterList(nfts.slice(start, newEnd))
                        }
                      }}
                      className="btn btn-primary rounded-md"
                    >
                      <i className="uil uil-process mdi-spin me-1"></i> Load More
                    </a>
                  </div>
                </div>
                {/*end col*/}
              </div>
            )
          }
          {/*end row*/}
        </div>
        {/*end container*/}
      </section>
      {/*end section*/}
      {/* End */}

      {/* CTA Start */}
      <section className="section pt-0 pt-sm-5 mt-0 mt-sm-5">
        <div className="container">
          <div className="bg-black rounded-md p-md-5 p-4">
            <div className="container">
              <div className="row">
                <div className="col-lg-4 col-md-6">
                  <div className="app-subscribe text-center text-md-start">
                    <img src={cta} className="img-fluid" height="120" alt="" />
                  </div>
                </div>
                {/*end col*/}

                <div className="col-lg-8 col-md-6 mt-4 pt-2 mt-sm-0 pt-sm-0">
                  <div className="section-title text-center text-md-start ms-xl-5 ms-md-4">
                    <h4 className="display-6 fw-bold text-white title-dark mb-0">
                      Get{' '}
                      <span className="text-gradient-primary fw-bold">
                        Free collections{' '}
                      </span>{' '}
                      <br />
                      with your subscription
                    </h4>

                    <div className="mt-4">
                      <a
                        href=""
                        onClick={e => e.preventDefault()}
                        className="btn btn-link primary text-white title-dark"
                      >
                        Subscribe Now <i className="uil uil-arrow-right"></i>
                      </a>
                    </div>
                  </div>
                </div>
                {/*end col*/}
              </div>
              {/*end row*/}
            </div>
            {/*end container*/}
          </div>
        </div>
        {/*end container*/}
      </section>
      {/*end section*/}
      {/* CTA End */}
    </Main>
  )
}

export default ExploreTwo
