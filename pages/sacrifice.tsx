import { NextPage } from 'next'
import Head from 'next/head'
import { Navbar } from '../components/navbar'
import styles from '../styles/Home.module.css'
import { useMemo, useState } from 'react'
import { useConnection, useWallet } from '@solana/wallet-adapter-react'
import { Transaction, PublicKey, TransactionInstruction } from '@solana/web3.js'
import { gql } from '@apollo/client'
import { toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import client from '../client'
// import { Button } from 'antd'
// import styles from '../styles/Home.module.css'

import { createAssociatedTokenAccountInstruction, getAssociatedTokenAddress, TOKEN_PROGRAM_ID, ASSOCIATED_TOKEN_PROGRAM_ID, createTransferInstruction } from '@solana/spl-token'
import { NftRow } from '../components/nftRow'
import * as ga from '../lib/ga'

import { Nft } from '../types'

const Home: NextPage = () => {

  const { publicKey, signTransaction, connected } = useWallet()
  const { connection } = useConnection()
  const [nfts, setNfts] = useState<Nft[]>([])
  const [sending, setSending] = useState<Nft[]>([])
  const [to, setTo] = useState('7VGhCnHjnw5QqGt7Xou35E8uBf43FbYAPvr1q63CUG21')
  const [search, setSearch] = useState('')
  const [loading, setLoading] = useState<boolean>(false)
  const [feedbackStatus, setFeedbackStatus] = useState("")

  const sacri = [

    {	wallet:	'27ehuqS1xmfkchkdKAdah3H9FiyJJu4wZ2P2LFpB3fch'	,	bunniez:	'👑 29' 	},
    {	wallet:	'GueGgggeNaCvkR4eg2PUifNwVi1wNsh9gse5bgTCok76'	,	bunniez:	'22'	},
    {	wallet:	'AayTwf3Qf7XpFoiQLVHHzf4L6VFkjBwBwZcKZT5KCrMZ'	,	bunniez:	'16'	},
    {	wallet:	'HnTgvonz24TEJ1w9VxFPRxC76W8UuQzb9NfqPxXMHvgU'	,	bunniez:	'15'	},
    {	wallet:	'8eT4VG9EsBbCzetSeZayhWaRcymkhuiZfAAuVB3t3XRi'	,	bunniez:	'10'	},
    {	wallet:	'Gnte8z3r4Jwdwm85Y2udyXhu1aZwdgunnT84aSocEtoM'	,	bunniez:	'10'	},
    {	wallet:	'EsMvk4t684ceDVYiKt7vydtqSHofseErnUje3hXKdWvM'	,	bunniez:	'8'	},
    {	wallet:	'8KtVpvHLfz7tVXUqVjFbkQSRTS46GPGFfNzJsR7kcNhJ'	,	bunniez:	'6'	},
    {	wallet:	'APZxQkEDVZovNxrk4sQt3FTUHVjZ3F7f4wyXUh3o2xMe'	,	bunniez:	'6'	},
    {	wallet:	'BWZcvSf9THcxBfJ8eiqqEeGhb9Xs47SWBK4un7X31ALg'	,	bunniez:	'6'	},
    {	wallet:	'6m4JHBytdccTTDUhPVN6YSHVnWA9nXXe4whbFDCFd2RZ'	,	bunniez:	'5'	},
    {	wallet:	'B4yPWKFtGHESYPDd7sbtJPFLmk2wFZ2xc7pZqLkveAem'	,	bunniez:	'5'	},
    {	wallet:	'DeCSV1e12UXFJCfSmF69J7x2D8WqqdgzZo86vieGCsGh'	,	bunniez:	'4'	},
    {	wallet:	'FQ89H6bkdT6UeWbsfTetqr3hhjSEuVFTa1jZfnVH2wi5'	,	bunniez:	'4'	},
    {	wallet:	'3RM3iE5KzfM4C5sjKBTX4B2sJDQfxXvByWaTqbT38DRX'	,	bunniez:	'3'	},
    {	wallet:	'EL3ag5cEUAsJi5vTPvHRoPZnSdUnadX7mr6HYsxP937s'	,	bunniez:	'3'	},
    {	wallet:	'FmanVZNoYHHV9Y7u6mL5pCG1PrzT5dNeRBytpehK8Phx'	,	bunniez:	'3'	},
    {	wallet:	'6cxvUcQ9sfeHzDmfb3MMiUMBGeujcyxZT6emS5KKYiZi'	,	bunniez:	'2'	},
    {	wallet:	'6ZuTU7BETTLQfHaL2wbQQy9WJPVDpNiDecaH6tim5wXQ'	,	bunniez:	'2'	},
    {	wallet:	'7sAkopqsohH3W7rFpaUxdbEVQbpZrgVx5hn7XaWuWGA6'	,	bunniez:	'2'	},
    {	wallet:	'8JPu9aGrcDXRKaxMRah3shWB6La9QrbLf9AnCBwjQGfa'	,	bunniez:	'2'	},
    {	wallet:	'HsCbC2swVB66M9Rks1bCPt3HRuwmKa3irSshxApkJCVu'	,	bunniez:	'2'	},
    {	wallet:	'GpR6UsyRjo3XAiJrBZXs8PpKRcJG4zUPKQrzY24NZvRS'	,	bunniez:	'1'	},
    {	wallet:	'C37ECSmRPteNd2vvdyfXCRCjQg4MgxxHMY4om2ULxbsC'	,	bunniez:	'1'	},
    {	wallet:	'3jAuCTzsnDhsZktQ2E8T16AsUZjqh26WNHsF29UX3Y58'	,	bunniez:	'1'	},
    {	wallet:	'3KenWUy6TY8N1uXL7FigT3BcyRfpSd8qT8tptA6Vs684'	,	bunniez:	'1'	},
    {	wallet:	'4XQBDWgu2qJYJH4zD8SM8pkCCDeTMwexF3GqXJAikiTW'	,	bunniez:	'1'	},
    {	wallet:	'5gNrzf1r4nFdq8yb94pJCa9q1CwmdD4GsTp2iQGZykyM'	,	bunniez:	'1'	},
    {	wallet:	'6cut9fD3qTbDRFara7sZo7tnBGi6y3unmZKSt96VhcDU'	,	bunniez:	'1'	},
    {	wallet:	'6mu4SGA237eQv8H8vuWoWWkZTdinM28xg6ioPRPEy5CQ'	,	bunniez:	'1'	},
    {	wallet:	'Ay9bba3FBs8KAbszYUWPp82jDH2X53pQkrjDoY4CWfoP'	,	bunniez:	'1'	},
    {	wallet:	'DC7rNdH2xWXr3dpqtuzLMq8dPLZ175c8dMfCHbzaXdiX'	,	bunniez:	'1'	},
    {	wallet:	'GbQpWGJ7fxheP4F4EkXJhiTYyrtVk93Z369qLuftNYFR'	,	bunniez:	'1'	},
    // {	wallet:	'7VGhCnHjnw5QqGt7Xou35E8uBf43FbYAPvr1q63CUG21'	,	bunniez:	'999'	},
  
  ];

  const GET_NFTS = gql`
  query GetNfts($owners: [PublicKey!], $limit: Int!, $offset: Int!) {
    nfts(owners: $owners, limit: $limit, offset: $offset) {
      address
      mintAddress
      name
      description
      image
      owner {
        address
        associatedTokenAccountAddress
      }
    }
  }
`

  useMemo(() => {
    if (publicKey?.toBase58()) {
      client
        .query({
          query: GET_NFTS,
          variables: {
            owners: [publicKey?.toBase58()],
            offset: 0,
            limit: 10000
          }
        })
        .then(res => setNfts(res.data.nfts))
    } else {
      setNfts([])
      setSending([])
      setTo('7VGhCnHjnw5QqGt7Xou35E8uBf43FbYAPvr1q63CUG21')
    }
  }, [publicKey?.toBase58()])

  return (
    <div>
      <Head>
        <title>SACRIFICE BOARD</title>
        <meta name='description' content='Check out the Sacrifice Board. Check your wallet for Bunniez sacrifice!' />
        <link rel='icon' href='/shsd2.ico' />
      </Head>



      <main className={styles.main}>
        {/* <h1 className={styles.title}>

        <br/>SHADOW INSTRUMENTS
        </h1>*/}
        <br/> 

                <Navbar  />

              
          {/* <div className='pl-20 mt-2 w-9/12 md:w-3/12 sm:w-3/12 xs:w-3/12 rounded-none justify-center'>
              <img src='/arc.png' />
          </div> */}
          {/* <div className='mt-12 lg:w-1/6 w-4/6 rounded-xl align-items-center justify-center'>
              <img src='/vessel.gif' />
          </div> */}
        {/* <p className={styles.description}>
          Get started by checking out our tools below<br/>
        </p> */}
        <div className={styles.pic}>
          <div className='w-6/6 lg:w-3/6 mt-12'>
              <img src='/gost.jpeg' />
              </div>
          </div>
          {/* <h4 className='font-bold justify-center align-center text-black text-lg '>SACRIFICE BOARD 🪧</h4> */}
          {/* <div className='text-xs mt-8 justify-center text-center w-3/6 lg:w-3/12 p-4 border-4 border-violet-700 bg-gray-900 rounded-xl'>
          <a href="https://mint.theshadyclass.xyz/" className='text-lg mt-20 justify-center text-center text-black' >
            <h4 className='font-bold '>The vesseLs are here!</h4>
            <p className='text-black '>🧬VESSEL MINTING EVENT!🧬</p>
            <p className='text-black '>2000 Supply  ▪  2.5% Royalty</p>
            <p className='text-black '>0.1 ◉ Whitelist  ▪ 0.25 ◉ Public</p>
            <p className='text-black font-bold text-xl'>MINT HERE</p>
          </a>
          <div className={styles.pic}>
          <div className='w-3/6 lg:w-12/12 mt-4'>
              <img src='/meden.png' />
              </div>
          </div>
        </div> */}
        

        <div className='text-3xl mt-8 justify-center text-center'>
          {/* <a  className='text-lg justify-center text-center text-gray-700' >
            <h4 className='font-bold'>OHBONES TOWN</h4>
          </a> */}

        </div>

        <div className='grid grid-col-2 text-xs justify-center align-center'>


            <br/>
            {/* <p className='text-gray-600 text-sm'><b className='bg-gray-700 rounded-full p-0.5'>🦴</b>  Updating Soon..</p> */}

            {/* <h1 className='font-bold text-xs'>Wallet: {publicKey?.toBase58()}</h1> */}
            <div className='w-full mb-6'>
              <br/>
            <input
              type='text'

              placeholder='Wallet search..'
              className='w-8/12 h-80% input input-bordered rounded-none bg-gray-900 border-black text-white'
              onChange={e => setSearch(e.target.value)}

              

            />
          </div>
          <div className='w-12/12 lg:w-12/12 align-center justify-center text-center rounded-lg'>

          <p className='font-bold justify-center align-center text-black text-2xl '>🏆 SACRIFICE BOARD 🏆</p>
          <br/>
          <h5 className='justify-center align-center text-gray-500 text-lg '>Last Updated: 02/20/2023 21:00 UTC 🥕</h5>
            <div className=' mb-12 mt-12 grid grid-cols-1 md:grid-cols-1 lg:grid-cols-1 lg:ml-40 lg:mr-40 text-white'>


        {sacri
        .filter(n => n.wallet.toLowerCase().includes(search.toLowerCase()))
        .map((n) => (
          <div
          key={Math.random()}

            className={styles.kek}


          >
            <a>	Shadow <u>{n.wallet}</u>, you have sacrificed your SHADIES for &nbsp;<span className='indicator-item badge-lg rounded-full bg-gray-900 text-xl text-amber-300 p-2'>{n.bunniez}</span> &nbsp;BUNNiEZ!	🐰</a>
          
            </div>
        ))
        }

          {/* <a className={styles.code} >	GueGgggeNaCvkR4eg2PUifNwVi1wNsh9gse5bgTCok76	22 	</a>
          <a className={styles.code}>	AayTwf3Qf7XpFoiQLVHHzf4L6VFkjBwBwZcKZT5KCrMZ	16	</a>
          <a className={styles.code}>	8eT4VG9EsBbCzetSeZayhWaRcymkhuiZfAAuVB3t3XRi	10	</a>
          <a className={styles.code}>	Gnte8z3r4Jwdwm85Y2udyXhu1aZwdgunnT84aSocEtoM	10	</a>
          <a className={styles.code}>	3Zs4Bb3efDp4tgSZQkJU4G9orrRGMSzzyw2fCtWnHp61	55	</a>
          <a className={styles.code}>	EsMvk4t684ceDVYiKt7vydtqSHofseErnUje3hXKdWvM	8	</a> */}
            </div>
            {/* <a href="https://discord.gg/7SrNbVyHDD">
        <h2 className='mb-6 text-xs lg:text-xs pt-1 mb-20 text-gray-600 text-center w-full mb-12 rounded-box bg-white '>          
        Coded in the Shadows | 👻 The Shady Class Buidl<br/><br/><b>Solana 2023</b></h2>
        </a> */}
          </div>
          <br/>
          <br/>
        </div>
        <br/>
        <br/>
        <br/>
        <br/>
        <a >
        <h2 className='font-bold mb-6 text-xs lg:text-xs pt-1 pb-1 text-gray-600 text-center w-full mb-12 rounded-box'>          
        Coded in the Shadows | 👻 SHADIES x STUDIOS<br/><br/><b>Solana 2023</b></h2>
        </a>
        {/* <div className={styles.pic}>
          <div className='w-3/6 lg:w-3/12 mb-2'>
              <img src='/shad.png' />
              </div>
          </div> */}
          {/* <div className={styles.pic}>
          <div className='w-4/12 lg:w-1/12 mt-2'>
              <img src='/solwyt2.png' />
              </div>
          </div>
          <div className='lg:mx-96 mb-4 mt-2 grid grid-cols-2 md:grid-cols-4 lg:grid-cols-2'>
          <div className={styles.pic2}>
          <div className='ml-32 w-10 h-10 lg:w-12 lg:h-12 lg:ml-80 mb-2'>
          <a href="https://discord.gg/7SrNbVyHDD">
              <img src='/dc.png' /> 
              </a>
              </div>
              
              </div>
          <div className={styles.pic2}>
          <div className='mr-32 w-10 h-10 lg:w-12 lg:h-12 lg:mr-80 mb-2'>
          <a href="https://twitter.com/shadies_NFT">
              <img src='/twt.png' />
              </a>
          </div>
          
          </div>
          </div> */}
      </main>
      {/* <div className='pl-auto text-center bg-none w-full'>
        <a href="https://discord.gg/b39NXR6">
        <h2 className='text-xs pt-2 pb-2 text-black bg-red-700 rounded-box w-6/12'>          
        Coded in the Shadows | 👻 TSC Buidl | CLICK HERE TO JOIN OUR DISCORD</h2>
        </a>
        </div> */}
    </div>
  )
}

export default Home
