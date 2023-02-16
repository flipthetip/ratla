interface NftCardProps {
  image: string
  name: String
  select(): void
  unselect(): void
  selected: Boolean
}

export const NftCard = (props: NftCardProps) => {
  let classes = props.selected ? 'shadow-md w-4 card card-compact bg-amber-500' : 'shadow-xl w-4 card card-compact bg-base-100'
  return (
  
      <div className={classes}>
        <figure>
          <img
            src={props.image}
            alt='NFT'
            className='image-square'
            width={'90px'}
          />
        </figure>
        <div className='card-body'>
          <h2 className='card-title overflow-x-hidden'>{props.name}</h2>
          <div className='justify-center card-actions'>
            {props.selected ? (
              <button onClick={props.unselect} className='btn'>
                x
              </button>
            ) : (
              <button onClick={props.select} className='btn btn-primary'>
                +
              </button>
            )}
          </div>
        </div>
      </div>
    
  )
}
