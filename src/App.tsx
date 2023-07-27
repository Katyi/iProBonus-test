import { useEffect, useState } from 'react';
import './App.css';
import axios from 'axios';
import icon1 from './assets/icon1.svg';
import icon2 from './assets/icon2.svg';
import icon3 from './assets/icon3.svg';
import icon4 from './assets/icon4.svg';
import icon5 from './assets/icon5.svg';
import icon6 from './assets/icon6.svg';

function App() {
  interface AccessTokenType {
    idClient: string;
    accessToken: string;
    paramName: string;
    paramValue: string;
    latitude: number;
    longitude: number;
    sourceQuery: number;
  };

  interface BonusData {
    typeBonusName: string;
    currentQuantity: number;
    forBurningQuantity: number;
    dateBurning: string;
  }
  
  const [bonusData, setBonusData] = useState<BonusData>({
    typeBonusName: "",
    currentQuantity: 0,
    forBurningQuantity: 0,
    dateBurning: "",
  });
  const [dateBurning, setDateBurning] = useState<string>("");

  async function getBonusData() {
    try {
      const { data, status } = await axios.post<AccessTokenType>(
        `${import.meta.env.VITE_BASE_URL}`,
        {
          idClient: import.meta.env.VITE_CLIENT_ID,
          accessToken: "",
          paramName: "device",
          paramValue: import.meta.env.VITE_DEVICE_ID,
          latitude: 0,
          longitude: 0,
          sourceQuery: 0
        },
        {
          headers: {
            'Content-Type': 'application/json',
            AccessKey: import.meta.env.VITE_ACCESS_KEY,
          },
        },
      );
  
      let accessToken: string =  data.accessToken;
      console.log(status);
      console.log(accessToken);
      
      try {
        const { data, status } = await axios.get(
          `${import.meta.env.VITE_SECOND_URL}${accessToken}`,
          {
            headers: {
              AccessKey: import.meta.env.VITE_ACCESS_KEY,
            },
          },
        );
    
        let newBonusData: BonusData = data.data;
        setBonusData(newBonusData);
        const dateBurningDate = new Date(newBonusData.dateBurning);

        let burningDate = dateBurningDate.getDate();
        let burningMonth = dateBurningDate.getMonth() + 1;
        setDateBurning(burningDate + "." + burningMonth);

        console.log(bonusData);
        console.log(status);

    
        return data;
      } catch (error) {
        if (axios.isAxiosError(error)) {
          console.log('error message: ', error.message);
          return error.message;
        } else {
          console.log('unexpected error: ', error);
          return 'An unexpected error occurred';
        }
      }

    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.log('error message: ', error.message);
        return error.message;
      } else {
        console.log('unexpected error: ', error);
        return 'An unexpected error occurred';
      }
    }
  };
  
  useEffect(() =>{
    getBonusData();
  },[]);
  


  return (
    <div className='container'>
      <div className='navbar'>
        <div className="column1">
          <img src={icon1} alt="icon1" className='icon1'/>
          <div className='title1'>Figma</div>
          <img src={icon2} alt="icon2" className='icon2'/>
        </div>
        <div className="column2">
          <div className='title1'>9:42 AM</div>
        </div>
        <div className="column3">
          <div className='title1'>42%</div>
          <img src={icon3} alt="icon3" className='icon3' />
        </div>
      </div>
      <div className='row1'>
        <div className='title2'>ЛОГОТИП</div>
        <img src={icon4} alt="icon4" className='icon4'/>
      </div>
      <div className='row2'></div>
      <div className="row3">
        <div className="bonusDiv">
          <div className='column4'>
            <div className='title3'>{bonusData.currentQuantity} бонусов</div>
            <div className='row4'>
              <div className='title4'>{dateBurning}  сгорит</div>
              <img src={icon5} alt="icon5" className='icon5'/>
              <div className='title4'>{bonusData.forBurningQuantity} бонусов</div>
            </div>
          </div>
          <img src={icon6} alt="icon6" className='icon6'/>
        </div>
      </div>
      
    </div>
    
  )
}

export default App
