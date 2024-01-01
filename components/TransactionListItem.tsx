import tw from 'twin.macro'

import Link from 'next/link'
import Image from 'next/image'

import { Avatar, Badge } from '@mantine/core'

import dayjs from 'dayjs'
import { NumericFormat } from 'react-number-format'

export interface ITransactiontItemProps {
  amount: number
  charge: number
  comments: string
  createdAt: string
  currency: string
  iconType: string
  iconUrl: string
  images: []
  narration: string
  status: string
  tradeId: null | string
  type: string
  updatedAt: string
  userId: string
  vendor: string
  _id: string
}

const getImage = (narration: string) => {
  const nNarration = narration.toLowerCase()

  if (nNarration.toLocaleLowerCase().includes('withdrawal')) {
    return '/img/transactions/withdraw.png'
  }
  //cards
  if (nNarration.toLocaleLowerCase().includes('itunes')) {
    return '/img/cards/itunes.png'
  }

  if (nNarration.toLocaleLowerCase().includes('nike')) {
    return '/img/cards/nike.png'
  }

  if (nNarration.toLocaleLowerCase().includes('walmart')) {
    return '/img/cards/walmart.png'
  }

  if (nNarration.toLocaleLowerCase().includes('footlocker')) {
    return '/img/cards/footlocker.png'
  }

  if (nNarration.toLocaleLowerCase().includes('google play')) {
    return '/img/cards/googleplay.png'
  }

  if (nNarration.toLocaleLowerCase().includes('steam')) {
    return '/img/cards/steam.png'
  }

  if (nNarration.toLocaleLowerCase().includes('jcpenney')) {
    return '/img/cards/jcpenney.png'
  }

  if (nNarration.toLocaleLowerCase().includes('apple')) {
    return '/img/cards/apple.png'
  }

  if (nNarration.toLocaleLowerCase().includes('target')) {
    return '/img/cards/target.png'
  }

  if (nNarration.toLocaleLowerCase().includes('visa')) {
    return '/img/cards/visa.png'
  }

  if (nNarration.toLocaleLowerCase().includes('american express')) {
    return '/img/cards/americanexpress.png'
  }

  if (nNarration.toLocaleLowerCase().includes('amazon')) {
    return '/img/cards/amazon.png'
  }

  if (nNarration.toLocaleLowerCase().includes('ebay')) {
    return '/img/cards/ebay.png'
  }

  if (nNarration.toLocaleLowerCase().includes('sephora')) {
    return '/img/cards/sephora.png'
  }

  if (nNarration.toLocaleLowerCase().includes('macys')) {
    return '/img/cards/macys.png'
  }

  if (nNarration.toLocaleLowerCase().includes('vanilla')) {
    return '/img/cards/vanilla.png'
  }

  if (nNarration.toLocaleLowerCase().includes('nordstorm')) {
    return '/img/cards/nordstorm.png'
  }

  if (nNarration.toLocaleLowerCase().includes('best buy')) {
    return '/img/cards/bestbuy.png'
  }

  //end of cards

  // start of networks

  if (nNarration.toLocaleLowerCase().includes('mtn')) {
    return '/img/transactions/mtn.png'
  }

  if (nNarration.toLocaleLowerCase().includes('airtel')) {
    return '/img/transactions/airtel.png'
  }

  if (nNarration.toLocaleLowerCase().includes('9mobile')) {
    return '/img/transactions/9mobile.png'
  }

  if (nNarration.toLocaleLowerCase().includes('glo')) {
    return '/img/transactions/glo.png'
  } //end of networks

  if (nNarration.toLocaleLowerCase().includes('dstv')) {
    //start of Tvs
    return '/img/transactions/dstv.png'
  }

  if (nNarration.toLocaleLowerCase().includes('gotv')) {
    return '/img/transactions/gotv.png'
  }

  if (nNarration.toLocaleLowerCase().includes('startimes')) {
    return '/img/transactions/startimes.png'
  } //end of Tvs

  if (nNarration.toLocaleLowerCase().includes('ikedc')) {
    // start of electricity
    return '/img/transactions/ikedc.png'
  }

  if (nNarration.toLocaleLowerCase().includes('ibedc')) {
    return '/img/transactions/ibedc.png'
  }

  if (nNarration.toLocaleLowerCase().includes('ekedc')) {
    return '/img/transactions/ekedc.png'
  }

  if (nNarration.toLocaleLowerCase().includes('eedc')) {
    return '/img/transactions/eedc.png'
  }

  if (nNarration.toLocaleLowerCase().includes('phedc')) {
    return '/img/transactions/phedc.png'
  }

  if (nNarration.toLocaleLowerCase().includes('bedc')) {
    return '/img/transactions/bedc.png'
  }

  if (nNarration.toLocaleLowerCase().includes('yedc')) {
    return '/img/transactions/yedc.png'
  }

  if (nNarration.toLocaleLowerCase().includes('kedc')) {
    return '/img/transactions/kedc.png'
  } //end of electricity

  if (nNarration.toLocaleLowerCase().includes('bitcoin')) {
    return '/img/transactions/btc.png'
  }

  if (nNarration.toLocaleLowerCase().includes('btc')) {
    return '/img/transactions/btc.png'
  }

  if (nNarration.toLocaleLowerCase().includes('trc20')) {
    return '/img/transactions/usdt.png'
  }

  if (nNarration.toLocaleLowerCase().includes('eth')) {
    return '/img/transactions/eth.png'
  }

  if (nNarration.toLocaleLowerCase().includes('erc20')) {
    return '/img/transactions/eth.png'
  }

  if (nNarration.toLocaleLowerCase().includes('bnb')) {
    return '/img/transactions/bnb.png'
  }

  if (nNarration.toLocaleLowerCase().includes('doge')) {
    return '/img/transactions/doge.png'
  }

  if (nNarration.toLocaleLowerCase().includes('tron')) {
    return '/img/transactions/trx.png'
  }

  if (nNarration.toLocaleLowerCase().includes('xrp')) {
    return '/img/transactions/xrp.png'
  }

  if (nNarration.toLocaleLowerCase().includes('sol')) {
    return '/img/transactions/sol.png'
  }

  return ''
}
export function TransactionListItem({
  amount,
  iconUrl,
  status,
  tradeId,
  iconType,
  narration,
  _id,
}: ITransactiontItemProps) {
  return (
    <div tw="w-full flex flex-col justify-between p-3 bg-white rounded-lg mt-1 [min-height:112px]">
      <div tw="w-full inline-flex space-x-2">
        <div>
          {iconUrl.startsWith('http') ? (
            <Image src={iconUrl} height="45" width="50" alt="" />
          ) : (
            getImage(narration).length !== 0 && (
              <div>
                <Image
                  src={getImage(narration)}
                  height="45"
                  width="50"
                  alt=""
                />
              </div>
            )
          )}
        </div>

        <div tw="flex-1 space-y-1">
          <p tw="font-semibold text-sm w-[80%]">{narration}</p>
          <p tw="text-sm capitalize">{iconType}</p>
        </div>
        <div>
          <p tw="text-sm text-right">Amount</p>
          <NumericFormat
            css={[tw` font-semibold text-right`]}
            thousandsGroupStyle="thousand"
            value={amount}
            prefix="₦"
            suffix=".00"
            decimalSeparator="."
            displayType="text"
            type="text"
            thousandSeparator={true}
            allowNegative={true}
          />
        </div>
      </div>

      <div tw="self-end">
        {status == 'pending' && (
          <Badge size="md" radius="sm" color="blue" tw="px-1">
            PENDING
          </Badge>
        )}
        {status == 'approved' && (
          <Badge size="md" radius="sm" color="green" tw="px-1">
            APPROVED
          </Badge>
        )}
        {status == 'declined' && (
          <Badge size="md" radius="sm" color="red" tw="px-1">
            DECLINED
          </Badge>
        )}
      </div>
    </div>
  )
}
