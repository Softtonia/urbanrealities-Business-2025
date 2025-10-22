import React, { useContext, useState, useEffect } from 'react';
import axios from 'axios';
import { API_KEY } from '../config';
import { AuthContext } from '../context/MyStore';
import { Fragment } from 'react';
import { useNavigate } from 'react-router-dom';
import { get } from '../Api/api';

function AllCompanyProjectListing() {
  const [agent, setAgent] = useState([]);
  const { auth } = useContext(AuthContext);
  const [activeTab, setActiveTab] = useState(0);
  const[data_id , setDataId] = useState('')
  const[property , setProperty] = useState([])
  const nav = useNavigate()

  console.log(data_id)

  useEffect(() => {
    let fetchData = async () => {
      try {
        // const instance = axios.create({
        //   baseURL: API_KEY,
        //   headers: { "api-token": auth.token }
        // });
        const response = await get(`/api/get-all-properties-listing-by-website`);
        const record = response.data
        const filterResedential = record.filter(rec=>rec.property_id===64)
        setProperty(filterResedential)

        setAgent(response.data);
      } catch (error) {
        console.log(error);
      }
    };
    fetchData();
  }, [auth.token]);

  useEffect(() => {
    let fetchTab = async () => {
      try {
        const response = await get(`${API_KEY}/api/property-listing`);
        // setTabs(response.data);
      } catch (error) {
        console.log(error);
      }
    };
    fetchTab();
  }, []);

  

  const handleTabClick = (index,id) => {
    setActiveTab(index);
    setDataId(id)
    const filterData = agent.filter((data=>data.property_id===id))
    console.log(filterData)
    setProperty(filterData)
  };

  return (
    <>
     
      {property.map((record, index) => (
        <div className='app-dv-4-lft-slider-wp' key={index}>
          <div className='row'>
            <div className='col-lg-3 col-md-3 col-sm-3 col-5 app-dv-4-lft-img'>
              <div className='w-100 h-100'>
                {record.custom_field_values.map((data, i) => (
                  data.field_name === "listing_featured_img" &&
                  <picture key={i}>
                    <img src={data.field_value.join('')} className="img-fluid" />
                  </picture>
                ))}
              </div>
            </div>
            <div className='col-lg-5 col-md-5 col-sm-5 col-7 py-3 '>
              {record.custom_field_values.map((data, i) => (
                data.field_name === "property_list_property_price" &&
                <Fragment key={i}>
                  <h2>₹ {data.field_value}</h2>
                  <hr />
                </Fragment>
              ))}
              <p>
                {record.custom_field_values.map((data, i) => (
                  data.field_name === "property_list_flat" &&
                  <Fragment key={i}>
                    {data.field_value.map((flat, ind) => (
                      <Fragment key={ind}>
                        <span className="text-black">{flat}</span><label className="span-divider-label"></label>
                      </Fragment>
                    ))}
                  </Fragment>
                ))}
                 {record.custom_field_values.map((data, i) => (
                  data.field_name === "listing_propety_area" &&
                  data.field_value
                ))}.
              </p>
              <hr />
              {record.custom_field_values.map((data, i) => {
                if (data.field_name === "listing_property_address") {
                  return (
                    <Fragment key={i}>
                      <p >
                        {data.field_value}
                        {record.custom_field_values.map((nestedData, j) => {
                          if (nestedData.field_name === "listing_name") {
                            return <span key={j}>{nestedData.field_value}</span>;
                          }
                          return null;
                        })}
                      </p>
                      <hr />
                    </Fragment>
                  );
                }
                return null;
              })}
              {record.custom_field_values.map((data, i) => (
                data.field_name === "listing_available_from" &&
                <Fragment key={i}>
                  <p>Available for <strong>{data.field_value}</strong> </p>
                  <hr />
                </Fragment>
              ))}
              {record.custom_field_values.map((data, i) => (
                data.field_name === "listing_carpet_area" &&
                <p key={i}>Carpet Area <strong>{data.field_value}</strong> </p>
              ))}
              <div className='app-dv-4-info-mb-btn d-flex justify-content-between'>
                <button><span>Request Call-back</span></button>
                <button  onClick={() => nav('/property-detail/' + record.id)}><span>Get Info</span></button>
              </div>
            </div>
            <div className='col-4 d-flex align-center justify-content-center py-3 px-3 mb-none-get-info '>
              <div className='app-dv-4-lft-btn-wp app4-col-gray-wp w-100 h-100 d-flex align-center justify-content-center'>
                <div>
                  <button><span>Request Call-back</span></button>
                  <button onClick={() => nav('/property-detail/' + record.id)}><span>Visit property</span></button>
                </div>
              </div>
            </div>
          </div>
        </div>
      ))}
    </>
  );
}

export default AllCompanyProjectListing;
