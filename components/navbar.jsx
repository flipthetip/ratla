import { WalletMultiButton } from '@solana/wallet-adapter-react-ui'

import Link from 'next/link'
import { useState } from 'react'

export const Navbar = props => {
  return (
    <div className='navbar bg-none text-white text-sm max-h-1 w-full w-6/6'>
      <div className='navbar-start'>       
        <div className='dropdown'>
          <label tabIndex='0' className='btn btn-ghost lg:hidden'>
          {/* SHADIES TOOL KIT */}
          <svg
              xmlns='http://www.w3.org/2000/svg'
              className='w-5 h-5'
              fill='none'
              viewBox='0 0 24 24'
              stroke='gray'
            >
              <path
                strokeLinecap='round'
                strokeLinejoin='round'
                strokeWidth='2'
                d='M4 6h16M4 12h8m-8 6h16'
              />
            </svg>


          </label>

          <ul
            tabIndex='0'
            className='content-left justify-left p-1 mt-4 pt-4 shadow menu menu-compact dropdown-content bg-gray-700 rounded-md w-6/6 pr-0'
          >
                <li>
            <Link href='/' passHref> 
              <button className='tracking-wide font-bold uppercase'>
                HOME
              </button>
            </Link>
          </li>
          <li>
          <Link href='altar' passHref>
              <button className='tracking-wide font-bold uppercase'>
              ALTAR 🧙‍♂️
              </button>
            </Link>

          </li>

          <li>
            <Link href='sacrifice' passHref>
              <button className='tracking-wide font-bold uppercase'>
                SACRIFICE BOARD 🥕
              </button>
            </Link>
          </li>
          {/* <li>
          <Link href='fm' passHref>
              <button className='tracking-wide font-bold uppercase'>
              ????? ❓
              </button>
            </Link>


          </li> */}
          <li>
            <Link href='https://magiceden.io/marketplace/tshc' passHref>
              <button className='tracking-wide font-bold uppercase'>
                MAGICEDEN ✨
              </button>
            </Link>
          </li>
            <li>
            <WalletMultiButton className='max-h-12 pr-8' />
            </li>
            <div className='mt-4 w-full rounded-none content-center text-xs mb-2'>
            Coded in the Shadows | 👻 TSC Buidl
            </div>
          </ul>
        </div>

      </div>

        <div className='pl-4 bg-gray-700 hidden navbar-center max-h-12 mb-16 lg:flex rounded-md'>

        <ul className='shadow-white menu menu-horizontal'>

        <li>
            <Link href='/' passHref> 
              <button className='tracking-wide font-bold uppercase'>
                HOME
              </button>
            </Link>
          </li>
          <li>
          <Link href='altar' passHref>
              <button className='tracking-wide font-bold uppercase'>
              ALTAR 🧙‍♂️
              </button>
            </Link>

          </li>

          <li>
            <Link href='sacrifice' passHref>
              <button className='tracking-wide font-bold uppercase'>
              SACRIFICE BOARD 🥕
              </button>
            </Link>
          </li>
          {/* <li>
          <Link href='fm' passHref>
              <button className='tracking-wide font-bold uppercase'>
              ????? ❓
              </button>
            </Link>


          </li> */}
          <li>
            <Link href='https://magiceden.io/marketplace/tshc' passHref>
              <button className='tracking-wide font-bold uppercase'>
                MAGICEDEN ✨
              </button>
            </Link>
          </li>
          <li>

            <WalletMultiButton className='max-h-12' />

          </li>

          </ul>
      </div>
    </div>
  )
}
