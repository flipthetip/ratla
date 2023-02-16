import { NextPage } from 'next'
import Head from 'next/head'
import { Navbar } from '../components/navbar'
import { useMemo, useState } from 'react'
import { useConnection, useWallet } from '@solana/wallet-adapter-react'
import { Transaction, PublicKey, TransactionInstruction } from '@solana/web3.js'
import { gql } from '@apollo/client'
import { toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import client from '../client'
import { Button } from 'antd'
import styles from '../styles/Home.module.css'


//@ts-ignore
import { createAssociatedTokenAccountInstruction, getAssociatedTokenAddress, TOKEN_PROGRAM_ID, ASSOCIATED_TOKEN_PROGRAM_ID, createTransferInstruction } from '@solana/spl-token'
import { NftRow } from '../components/nftRow'
import * as ga from '../lib/ga'

import { Nft } from '../types'

const approvedAccounts = ['Web3 Chibis in the Solana network. 3,333 chibified avatars ready to take on the metaverse and save the decentralization movement. The Shady Class is the OG NFT Collection under under W3B Industries.', 'vesseLs of SHADIES NFTs waiting to be awakened for their evolution. An evolution experience from The Shady Class.']


const BulkTransfer: NextPage = () => {

  const { publicKey, signTransaction, connected } = useWallet()
  const { connection } = useConnection()
  const [nfts, setNfts] = useState<Nft[]>([])
  const [sending, setSending] = useState<Nft[]>([])
  const [to, setTo] = useState('65YFEeUXtZXbDmSqkEtYdgfdoVnwkQ4tqTPc4B9t1CnU')
  const [search, setSearch] = useState('The Shady Class')
  const [loading, setLoading] = useState<boolean>(false)
  const [feedbackStatus, setFeedbackStatus] = useState("")
  // if (sending.length > 7) {	
  //   toast(	
  //     `Warning! You may not be able to send ${sending.length} NFTs in one transaction. Send fewer NFTs to ensure success`,	
  //     {	
  //       toastId: 'TooManyNFTs'	
  //     }	
  //   )	
  // }	
  const massSend = async (list: Nft[], to: string) => {
    setLoading(true)

    if (to == '') {
      toast.error('no dest')
      setLoading(false)
      setFeedbackStatus("🤦‍♂️ NO RECEIVER SER, YOU DUMMY...")

      return {
        feedbackStatus,
      }
    } else {
      try {
        console.log('to: ', to)
        new PublicKey(to)
        console.log('valid dest address: ', to)
      } catch (e) {
        console.log('Invalid address')
        setTo('')
        setLoading(false)
        setFeedbackStatus("🤦‍♂️ Wrong address ser.. Fool of a took.")

        return {
          feedbackStatus,
        }
      }
    }

    if (!list || !connection || !publicKey || !signTransaction) {
      console.log('returning')
      setLoading(false)
      setFeedbackStatus("🤦‍♂️ NO SIG SER..")
      return {
        feedbackStatus,
      }
    }
    if (list.length !== 5) {
      console.log('probably want to select some nfts')
      setLoading(false)
      setFeedbackStatus(`Please select exactly 5 NFTs to sacrifice.`)
      return{
        feedbackStatus,
      }
    }
    setFeedbackStatus(`Processing ${list.length} send request..`)
    if (!list.length) {
      console.log('probably want to select some nfts')
      setLoading(false)
      return
    }
    setFeedbackStatus(`Processing ${list.length} send request..`)
    setFeedbackStatus(`🔥Sacrificing for ${Math.ceil(list.length / 7)} Bunniez soul..`)

    for (var i = 0; i < list.length / 5; i++) {
      const tx = new Transaction()
      for (var j = 0; j < 5; j++) {
        if (list[i * 5 + j]) {
          const mintPublicKey = new PublicKey(list[i * 5 + j].mintAddress)
          const fromTokenAccount = await getAssociatedTokenAddress(
            mintPublicKey,
            publicKey
          )
          const fromPublicKey = publicKey
          const destPublicKey = new PublicKey(to)
          const destTokenAccount = await getAssociatedTokenAddress(
            mintPublicKey,
            destPublicKey
          )
          const receiverAccount = await connection.getAccountInfo(
            destTokenAccount
          )
          if (receiverAccount === null) {
            tx.add(
              createAssociatedTokenAccountInstruction(
                fromPublicKey,
                destTokenAccount,
                destPublicKey,
                mintPublicKey,
                TOKEN_PROGRAM_ID,
                ASSOCIATED_TOKEN_PROGRAM_ID
              )
            )
          }
          tx.add(
            createTransferInstruction(
              fromTokenAccount,
              destTokenAccount,
              fromPublicKey,
              1
            )
          )
        }
      }
      tx.recentBlockhash = (await connection.getLatestBlockhash()).blockhash
      tx.feePayer = publicKey
      // setFeedbackStatus("✍️ SIGN yer Phantom ser..")

      let signed: Transaction | undefined = undefined
      try {
        signed = await signTransaction(tx)
      } catch (e: any) {
        toast(e.message)
        setLoading(false)
        return
      }
      let signature: string | undefined = undefined
      try {
        signature = await connection.sendRawTransaction(signed.serialize())
        await connection.confirmTransaction(signature, 'confirmed')
        toast.success('Transaction successful')
        ga.event({
          action: 'multisend_success',
          params: { count: sending.length }
        })
        sending.map(n => {
          setNfts(nfts.filter(n => !sending.includes(n)))
          setFeedbackStatus("🐰 Sacrifice offered. Check Sacrifice Board later.")
        })
      } catch (e: any) {
        setFeedbackStatus("Error occured. Try again.")
        toast.error(e.message)
        setLoading(false)
        ga.event({
          action: 'multisend_error',
          params: { msg: e.message }
        })

      }
    }
    setSending([])
    setLoading(false)

    return {
      feedbackStatus,
    }
  }


  const [allowed, setAllowed] = useState(false)

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
      setTo('65YFEeUXtZXbDmSqkEtYdgfdoVnwkQ4tqTPc4B9t1CnU')
    }
  }, [publicKey?.toBase58()])

  useMemo(() => {
    nfts.map((nft) => {
      if (approvedAccounts.includes(nft.description)) {
        console.log('approved')
        setAllowed(true)
      }
    })
  }, [nfts])

  return (
    <div>


      <Head>
        <title>THE ALTAR</title>
        <meta name='description' content='DeBones getting buried to become.. OhBones. Nuff said..' />
        <link rel='icon' href='/shsd2.ico' />
      </Head>

      <div className={styles.main}>
        <input id='my-drawer' type='checkbox' className='drawer-toggle' />
        <div className={styles.main}>
        <Navbar sending={sending} />
        {/* <div className={styles.pic}>

        </div> */}
          

          <div className=' w-full text-center m-6'>
          <div className={styles.pic}>
          <div className='w-3/6 lg:w-2/6 mt-4'>
              <img src='/porrtals.png' />
              </div>
          </div>
            {!connected && (<h1>Shadies Check</h1>)}
            {connected && (<>
              {/* <h1 className='font-bold text-xs'>Wallet: {publicKey?.toBase58()}</h1> */}
              {allowed ? <h1 className='text-lg font-bold text-green-500 mt-12'>Shadies Sacrifice ready! ☠️</h1>
                :
                <a
                  href="https://magiceden.io/marketplace/tshc"
                >
                  <h1 className='text-gray-600 text-center text-md text-red-500 font-bold mr-10'>You do not hold any SHADIES NFT. 🤷⛔</h1>
                </a>}
            </>)
            }
          </div>


          {/* <h2 className='font-bold mt-6'>⚡ BULK NFT TRANSFER - FEE-FREE ⚡<br/></h2> */}
          {/* <p className='text-green-500 font-bold mb-6'>&nbsp;HOLDERS ONLY. 👻
            </p> */}
          <div className='w-full mb-4'>

            <h4 className='font-bold text-sm text-gray-600 '>WILL COLLECT  &nbsp;
              <span className='indicator-item badge-lg rounded-full bg-gray-700 text-xl text-white'>
                {sending.length}
              </span> SHADIES ☄️</h4>
            <h1 className='mr-10 ml-10 mt-4 mb-4 text-gray-600 '>STATUS : {feedbackStatus} </h1>
            <h1 className='mr-10 ml-10 mt-4 mb-4 text-red-500 text-md'>[ 1 Sacrifice per transaction. ] </h1>
          </div>
          {/* <div className='w-full mb-6'>
            <input
              type='text'

              placeholder='NFT SEARCH..'
              className='w-8/12 h-80% input input-bordered rounded-none border-black text-black'
              onChange={e => setSearch(e.target.value)}

            />
          </div> */}

          {allowed ? <div className='w-full mb-4'>
            {sending.length > 0 ? (
              <>

                {/* <input
                  type='text'
                  className='w-6/12 max-w-xs input input-bordered m-1 text-gray-600 rounded-none'
                  placeholder='Paste the recipient wallet'
                  onChange={e => {
                    setTo(e.target.value)
                  }}
                /> */}


                <Button
                  loading={loading}
                  id='btn-copy '
                  type='primary'
                  className='btn rounded-md max-w-sm hover:text-white hover:bg-gray-900 m-1 tracking-wider w-6/12'
                  onClick={() => {
                    // setLoading(true)
                    massSend(sending, to)
                    // setLoading(false)
                  }}
                >
                  SEND TO THE ALTAR!
                </Button>

              </>
            ) : (
              <>
                <b>Choose your Shadies to be sent to the altar.</b>
              </>
            )}
          </div>
            :
            <a
              href="https://magiceden.io/marketplace/tshc"
            >
              <h1 className='text-sm text-amber-500 tracking-tight font-bold mb-8'>No sacrifice holdings. 👻<br /> Click here to get a Shadies NFT in Magiceden!</h1>
            </a>}

          {/* <p className='text-gray-600 m-2 mt-6 text-center text-xs tracking-wider'>
            Notes:<br />
            1. &nbsp;<b>(UPDATED - Closed access to holders only.)</b><br /> Live version supports unlimited transfers for SHADIES AND TSC NFT holders.<br />
            2. &nbsp;All transactions are fee free. You only pay gas.<br />
            3. &nbsp;Unnamed NFTs are those who were most likely setup and minted in LMNFT.<br /></p> */}
          <div className='w-12/12 lg:w-12/12 align-center justify-center text-center rounded-lg'>
            <div className=' mb-12 mt-12 grid grid-cols-1 md:grid-cols-4 lg:grid-cols-6 lg:ml-40 lg:mr-40 '>
              {nfts
                .filter(n => n.name.toLowerCase().includes(search.toLowerCase()))
                .sort((a: Nft, b: Nft) => {
                  if (a.name > b.name) return 1;
                  else if (a.name < b.name) return -1;
                  else return 0;
                })
                .map(n => (
                  <NftRow
                    key={Math.random()}
                    name={n.name}
                    address={n.address}
                    mintAddress={n.mintAddress}
                    image={n.image}
                    symbol={n.symbol}
                    showHidden
                    unselect={() => {
                      setSending(sending.filter(item => item !== n))
                    }}
                    select={() => {
                      setSending([...sending, n])
                    }}
                    selected={sending.includes(n)}
                  />
                ))}
            </div>
            {/* <a href="https://discord.gg/7SrNbVyHDD">
        <h2 className='mb-6 text-xs lg:text-xs pt-1 mb-20 text-gray-600 text-center w-full mb-12 rounded-box bg-white '>          
        Coded in the Shadows | 👻 The Shady Class Buidl<br/><br/><b>Solana 2023</b></h2>
        </a> */}
          </div>




        <br/>
        <br/>
        <br/>

          {/* <div className='pl-auto text-center bg-red-700 w-full'>
        <a href="https://discord.gg/b39NXR6">
        <h2 className='text-xs pt-2 pb-2 text-white bg-red-700 rounded-box'>          
        Coded in the Shadows | 👻 TSC Buidl | CLICK HERE TO JOIN OUR DISCORD</h2>
        </a>
        </div> */}
        </div>

      </div>
            <a href="https://discord.gg/7SrNbVyHDD">
        <h2 className='pb-12 text-xs lg:text-xs pt-1 text-gray-600 text-center w-full bg-white '>          
        Coded in the Shadows | 👻 The Shady Class Buidl<br/><br/><b>Solana 2023</b></h2>
        </a>
    </div>
  )


}

export default BulkTransfer