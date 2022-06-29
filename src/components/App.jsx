import React, { useContext, useState } from "react";
import { store } from '../store/store'
import { setupEthers } from '../hooks/useBlockchain'
import { getNetworkNameFromURL } from '../utils/networkUtil'
import { useQueryClient } from 'react-query'






export default class App extends React.Component {
 render() {
/*
    const { state, dispatch } = useContext(store)
    const {
      wallet: { address, balance, zoomBalance, daiBalance },
      contracts,
    } = state
    
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
}