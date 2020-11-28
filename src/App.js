import React, {useState} from 'react';
import {Menu, Segment, Loader, Dropdown, Header, Image, Button, Card} from 'semantic-ui-react';
import doTenGacha from './gacha.js'
import './App.css';

const getRandomItemFromArray = (array) => array[Math.floor(Math.random() * array.length)];
const rootURL = "https://cgss-gacha.feroid.com";
//const rootURL = ".";

function App() {
  const [gachaInfo, setGachaInfo] = useState([]);
  const [selectedGacha, setSelectedGacha] = useState(undefined);
  const [mainImg, setMainImg] = useState(undefined);
  const [gachaResultItems, setGachaResultItems] = useState([]);

  const getCurrGachaInfo = async () => {
    var result = await fetch(rootURL + "/api/gachainfo/");
    result = await result.json();
    setGachaInfo(result);
  };

  const getGachaInfoByID = (ID) => gachaInfo.filter(x => x.ID.includes(ID))[0];

  const gachaInfoToContent = (singleGachaInfo) => {
    return(<Header>
      {singleGachaInfo['ID'] + ":" + singleGachaInfo['name']} <br/>
      {singleGachaInfo["ssr_pickup_list"].map(singleGachaInfo => {
        return singleGachaInfo["pickup_list"].map(z=>{
          return <Image src = {rootURL + '/img/'+ z } />
        });
      })}
    </Header>);
  };

  const gachaInfoToItemList = () => {
    return gachaInfo.map(x=>{
      return {
        key : x['ID'],
        value : x['ID'],
        text : x['ID'] +  ":" + x['name'],
        content : gachaInfoToContent(x)
      };
    })
  }

  const handleDropDownChange = (e, {value}) => {
    let target = getGachaInfoByID(value);
    let candidCards = [];

    for(var i in target["ssr_pickup_list"]) candidCards = candidCards.concat(target["ssr_pickup_list"][i]["pickup_list"]);

    if(candidCards.length == 0) candidCards = target["common"]["SSR"];

    const randResult = getRandomItemFromArray(candidCards);
    setSelectedGacha(value);
    setMainImg(randResult);
  };

  const getCardInfoToHeader = async (cardID) => {
    return(
      <Card key = {cardID} image = {rootURL + '/img/'+ cardID}/>
    );
  }

  const gachaOnClick = async (e) =>{
    setGachaResultItems([]);
    var results = doTenGacha(getGachaInfoByID(selectedGacha));
    var resultsItems = await Promise.all(
      results.map(getCardInfoToHeader)
    );
    setGachaResultItems(resultsItems);
  }

  if(!gachaInfo || gachaInfo.length == 0){
    getCurrGachaInfo();
    return(
      <div className = 'App'>
        <Segment>
          <Loader active inline = "centered" content = '현재 가챠 정보를 가져오는 중..'/>
        </Segment>
      </div>
    );
  }
  else if(!gachaResultItems || gachaResultItems.length == 0){
    return (
      <div className = 'App'>
        <div className = 'main' style = {{backgroundImage : mainImg ? 'url(https://hidamarirhodonite.kirara.ca/spread/'+ mainImg +'.png)' : 'none'}}>
          <Dropdown
            className = 'gachaList'
            placeholder='현재 진행되고 있는 가챠 중 선택'
            selection
            onChange = {handleDropDownChange}
            options = {gachaInfoToItemList()}
            defaultOpen
          />
          {selectedGacha && <div id = 'doGacha' onClick = {gachaOnClick}/>}  
        </div>
      </div>
    );
  }
  else{
    return(
      <div className = 'App'>
        <Card.Group itemsPerRow = {5}>
          {gachaResultItems}
        </Card.Group>
        <Button size = 'huge' color = 'green' onClick = {gachaOnClick}>10연차 더 돌리기!</Button>
      </div>
    );
  }
}

export default App;
