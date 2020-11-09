const getRandomItemFromArray = (array) => array[Math.floor(Math.random() * array.length)];

function doOneGacha(gachaInfo, srGrant){
    var randInt = Math.random();
    var result = undefined;
    var c = 0;
    
    var aboveSR = false;

    //SSR
    for(var i in gachaInfo["ssr_pickup_list"]){
      c += (gachaInfo["ssr_pickup_list"][i]["rate"]/100);
      if(randInt < c && !result){
        result = getRandomItemFromArray(gachaInfo["ssr_pickup_list"][i]["pickup_list"]);
        aboveSR = true;
      }
    }
    
    c = gachaInfo["rate"]["SSR"]/100;
    if(randInt < c && !result){
      result = getRandomItemFromArray(gachaInfo["common"]["SSR"]);
      aboveSR = true;
    }
    
    //SR
    for(var i in gachaInfo["sr_pickup_list"]){
      c += (gachaInfo["sr_pickup_list"][i]["rate"]/100);
      if(randInt < c && !result){
        result = getRandomItemFromArray(gachaInfo["sr_pickup_list"][i]["pickup_list"]); 
        aboveSR = true;
      }
    }
    
    c = gachaInfo["rate"]["SR"]/100;
    if((randInt < c || srGrant) && !result){
      result = getRandomItemFromArray(gachaInfo["common"]["SR"]);
      aboveSR = true;
    }

    if(!result) result = getRandomItemFromArray(gachaInfo["common"]["R"]);

    return {aboveSR, result};
  }

  function doTenGacha(gachaInfo){
    var results = []
    var aboveSR = false;
    for(var i=0; i<9; i++){
      var result = doOneGacha(gachaInfo, false);
      if(result['aboveSR']) aboveSR = true;
      results.push(result['result']);
    }
    results.push(doOneGacha(gachaInfo, !aboveSR)['result']);
    return results;
  }

  export default doTenGacha;