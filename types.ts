export interface Owner {
    address: string
    associatedTokenAccountAddress: string
  }

export interface third {
  address: string
  associatedTokenAccountAddress: string
}

  export interface thirdNft {
    symbol: String
    name: string
    address: string
    description: string
    image: string
    mintAddress: string
    thirdowner: Owner
    updateAuthority: string
  }

  export interface Nft {
    symbol: String
    name: string
    address: string
    description: string
    image: string
    mintAddress: string
    owner: Owner
    updateAuthority: string
  }