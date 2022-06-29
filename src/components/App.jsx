import React, { useContext, useState } from "react";
import { store } from '../store/store'
import { setupEthers } from '../hooks/useBlockchain'
import { getNetworkNameFromURL } from '../utils/networkUtil'
import { useQueryClient } from 'react-query'

function App() {

    const { state, dispatch } = useContext(store)
    console.log(store);
    console.log(state);
    /*
    const {
      wallet: { address, balance, zoomBalance },
      contracts,
    } = state

    console.log(store);
/*
        
    const onConnect = async (dispatch, networkName, queryClient) => {
        await setupEthers(dispatch, queryClient, networkName)
    }
*/

  return (
   <div style={{ textAlign: "center" }}>
    <h1>Hello World</h1>
    <p>Your balance is : </p>
   </div>
  );
 }

 export default App;