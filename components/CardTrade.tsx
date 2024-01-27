import { ReactElement, useEffect, useRef, useState } from 'react'

import tw from 'twin.macro'

import Image from 'next/image'
import { useRouter } from 'next/router'

import axios from 'axios'

import {
  TextInput,
  Button,
  Textarea,
  Drawer,
  Select,
  Group,
  ScrollArea,
} from '@mantine/core'
import { showNotification, useNotifications } from '@mantine/notifications'
import { useForm } from '@mantine/form'
import {
  successNotification,
  unsuccessfullNotification,
} from '../libs/notifications'

import style from '../styles/Styles'

import imageCompression from 'browser-image-compression'
import { FaChevronDown } from 'react-icons/fa'
import NumberFormat, { NumericFormat } from 'react-number-format'
import SuccessMessage from './SuccesMessage'

import CustomSelectItem from './CustomSelectItem'

export interface ICardsProps {
  card?: any
  setShowAction: React.Dispatch<React.SetStateAction<boolean>>
}

const Cards = ({ card }: ICardsProps) => {
  const notifications = useNotifications()
  const router = useRouter()

  const [subCategories, setSubCategories] = useState<[] | any>(null)
  const [loading, setLoading] = useState(false)
  const [amount, setAmount] = useState('') //
  const [value, setValue] = useState('0')
  const [terms, setTerms] = useState('')
  const [confirm, setConfirm] = useState(false)
  const [success, setSuccess] = useState(false)
  const [imageSrcs, setImageSrcs] = useState<any[]>([])


  // prevent the gift card input from auto focusing
  const giftCardAmountInputRef = useRef<HTMLInputElement>(null);
  const distractionRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setTimeout(() => {
      if(distractionRef.current){
        if(giftCardAmountInputRef.current){
          giftCardAmountInputRef?.current.blur();
          distractionRef.current.focus();
        }
      }
    },300)
  },[])

  const [subCategory, setSubCategory] = useState<{
    minimum_amount: number
    rate: number
    label: string
    terms: string
  } | null>(null)
  const [files, setFiles] = useState<FileList | null>(null)
  const fileRef = useRef<HTMLLabelElement>(null)

  useEffect(() => {
    const nSubcat = card?.subcategories.map((item: any, index: number) => {
      item.label = item['name']
      //delete item.name
      item.image = getCardFlag(item.name)
      item.value = index.toString()
      return item
    })

    setSubCategories(nSubcat)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const form = useForm({
    initialValues: {
      subcat: '',
      comment: '',
    },
    validate: {
      subcat: value =>
        value.length > 0 ? null : 'Please choose a sub category',
    },
  })

  const handleCategoryChangeX = (e: any) => {
    form.setFieldValue('subcat', e)
    const index = parseInt(e)
    let subcat: any

    subcat = subCategories[index]
    setSubCategory(subcat)
    setTerms(subcat.terms)
  }

  const handleAmountChange = (e: any) => {
    if (subCategory == null) {
      unsuccessfullNotification({
        message: 'Please select a sub caterogry first',
      })
    } else {
      setAmount(e.target.value)
    }
  }

  useEffect(() => {
    if (subCategory !== null)
      setValue((parseInt(amount) * subCategory?.rate).toString())
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [amount])

  const handleImageUpload = async (files: FileList) => {
    try {
      const fileArray = Object.keys(files)
      const srcs = []
      const options = {
        maxSizeMB: 0.1,
      }

      for (let imageIndex = 0; imageIndex < fileArray.length; imageIndex++) {
        const compressedImage = await imageCompression(
          files[imageIndex],
          options,
        )
        const form = new FormData()
        form.append('file', compressedImage)
        form.append('upload_preset', 'king-cards-unsigned')
        const response = await fetch(
          'https://api.cloudinary.com/v1_1/king-cards/upload',
          {
            method: 'POST',
            body: form,
          },
        )
        const res = await response.json()
        srcs.push(res.secure_url)
      }

      return srcs
    } catch (error: any) {
      throw new Error(error)
    }
  }
  const handleSubmit = async () => {
    if (form.validate().hasErrors) {
      return
    }

    if (subCategory?.minimum_amount) {
      if (parseInt(amount) < subCategory.minimum_amount) {
        showNotification({
          disallowClose: true,
          title: 'Notice!',
          message: `Amount is less than the minimun trade amount of ($${subCategory.minimum_amount}) for this sub-category`,
          autoClose: 3000,
          color: 'red',
          radius: 'md',
          style: tw`backdrop-blur-sm bg-[#fff3cd]`,
          styles: {
            root: {
              '::before': {
                backgroundColor: 'transparent',
              },
            },
            description: {
              color: 'black',
            },
            title: {
              fontWeight: 'bold',
            },
          },
        })
        return
      }
    }

    // if (files == null) {
    //   showNotification({
    //     disallowClose: true,
    //     title: 'Notice!',
    //     message: `Select image(s) to upload`,
    //     autoClose: 3000,
    //     color: 'red',
    //     radius: 'md',
    //     style: tw`backdrop-blur-sm bg-[#fff3cd]`,
    //     styles: {
    //       root: {
    //         '::before': {
    //           backgroundColor: 'transparent',
    //         },
    //       },
    //       description: {
    //         color: 'black',
    //       },
    //       title: {
    //         fontWeight: 'bold',
    //       },
    //     },
    //   })
    //   return
    // }
    setLoading(true)
    // const srcs = await handleImageUpload(files)
    // setImageSrcs(srcs)
    setLoading(false)
    setConfirm(true)
  }

  const clearAll = () => {
    setLoading(false)
    setSubCategory(null)
    setAmount('')
    setValue('')
    setTerms('')
    setFiles(null)
    form.reset()
    setLoading(false)
    setConfirm(false)
  }

  const CreateConversation = async (message: string) => {
    try {
      const response = await axios.post('/api/create-conversation', {
        to: '60967ce06c9e1e0015399a1c',
        message,
      })

      if (response.status == 200) {
      }
    } catch (error: any) {
      unsuccessfullNotification({message: error?.response.data.data.message})
    }
  }

  const SendMessages = async () => {
    const messagge = `TRADE DETAILS\n\nAmount: ${amount},\nType: ${card?.category}`
    await CreateConversation(messagge)

    for (let index = 0; index < imageSrcs?.length; index++) {
      await CreateConversation(imageSrcs[index])
    }
    return true
  }

  const SubmitForm = async () => {
    if (confirm) {
      setLoading(true)
      try {
        const response = await axios.post('/api/create-gift-card-trade', {
          purchaseAmount: amount,
          rate: subCategory?.rate,
          value: value,
          images: imageSrcs,
          category: card?.category,
          subCategory: subCategory?.label,
          comments: form.values.comment,
        })
        if (response.status == 200) {
          clearAll()

          successNotification({ message: 'Trade submitted' })

          const success = await SendMessages()

          if (success) {
            /*  successNotification({
              message: 'Gift card(s) uploaded succesfully',
            })

            setTimeout(() => {
              setSuccess(true)
            }, 3000) */
            setSuccess(true)
          }
        }
      } catch (error: any) {
        setLoading(false)
        unsuccessfullNotification({message: error?.response.data.data.message})
      }
    }
  }

  const getCardFlag = (name: string) => {
    // '/img/flags/FRANCE.png'
    // USA EURO AUD NZD CUD BRAZIL Poland(USD) UK CHF(swiss)
    let flag = ''
    if (name.toLocaleLowerCase().includes('usa')) {
      flag = '/img/flags/US.png'
    } else if (name.toLocaleLowerCase().includes('euro')) {
      flag = '/img/flags/EU.png'
    } else if (name.toLocaleLowerCase().includes('eur')) {
      flag = '/img/flags/EU.png'
    } else if (name.toLocaleLowerCase().includes('aud')) {
      flag = '/img/flags/AUSTRALIA.png'
    } else if (name.toLocaleLowerCase().includes('nzd')) {
      flag = '/img/flags/ZEALAND.png'
    } else if (name.toLocaleLowerCase().includes('cad')) {
      flag = '/img/flags/CANADA.png'
    } else if (name.toLocaleLowerCase().includes('brazil')) {
      flag = '/img/flags/BRAZIL.png'
    } else if (name.toLocaleLowerCase().includes('poland')) {
      flag = '/img/flags/US.png'
    } else if (name.toLocaleLowerCase().includes('uk')) {
      flag = '/img/flags/UK.png'
    } else if (name.toLocaleLowerCase().includes('chf')) {
      flag = '/img/flags/SWITZERLAND.png'
    } else {
      flag = '/img/flags/US.png'
    }

    return flag
  }
  return (
    <>
      <Drawer
        opened={confirm}
        position="bottom"
        padding="xs"
        withCloseButton
        size={470}
        onClose={() => setConfirm(false)}
        tw="rounded-tr-xl rounded-tl-xl"
      >
        <p style={style.text.md}>Please confirm</p>
        <div tw="flex flex-col divide-y-2 mt-2">
          <div tw="flex justify-between py-4">
            <p>Gift card Amount</p>
            <p tw="font-medium">{'$' + amount}</p>
          </div>

          <div tw="flex items-center justify-between py-4">
            <p>Card type</p>
            <p tw=" font-medium">{card?.category}</p>
          </div>

          <div tw="flex items-center justify-between py-4">
            <p>Card Category</p>
            <p tw=" font-medium">{subCategory?.label}</p>
          </div>

          <div tw="flex items-center justify-between py-4">
            <p>Card Rate</p>
            <p tw=" font-medium">₦{subCategory?.rate}.00/$</p>
          </div>
        </div>
        <hr tw="border-2" />
        <div tw="flex justify-between mt-4">
          <p>Total Payment</p>
          <p tw="text-green-500 text-lg">
            <NumericFormat
              thousandsGroupStyle="thousand"
              value={value}
              prefix="₦"
              suffix=".00"
              decimalSeparator="."
              displayType="text"
              type="text"
              thousandSeparator={true}
              allowNegative={true}
            />
          </p>
        </div>
        <Button
          loading={loading}
          onClick={async () => await SubmitForm()}
          tw="bg-primary"
          size="lg"
          mt="xl"
          fullWidth
          type="submit"
        >
          Confirm
        </Button>
      </Drawer>

      {success && (
        <SuccessMessage
          redirectTo="/transactions"
          title="Gift card(s) uploaded succesfully"
        />
      )}

      <div tw="px-4 w-full" ref={distractionRef}>
        <Group tw="flex-col gap-0" position="center">
          <Image
            src={card?.image}
            tw="h-[150px]"
            width="200"
            height="140"
            alt=""
          />
          <p>{card?.category}</p>
        </Group>
      </div>
      <form
        onSubmit={form.onSubmit(handleSubmit)}
        action=""
        tw="w-full block mt-4"
      >
        <div tw="px-4  w-full ">
          {subCategories && (
            <Select
              itemComponent={CustomSelectItem}
              placeholder="Select sub category"
              size="xl"
              rightSection={<FaChevronDown />}
              required
              ref={distractionRef}
              maxDropdownHeight={400}
              onBlur={() => form.validateField('subcat')}
              onChange={e => handleCategoryChangeX(e)}
              error={form.errors?.subcat}
              styles={{
                input: style.input.base,
                error: style.input.error,
                rightSection: { pointerEvents: 'none' },
              }}
              data={subCategories}
            />
          )}
        </div>

            
        <div tw="px-4 mb-4">
          <p tw="w-full text-black2 text-sm mt-5">Trade terms</p>
          {true && (
            // <Textarea
            //   value={terms}
            //   autosize
            //   contentEditable={false}
            //   minRows={2}
            //   // maxRows={4}              
            //   styles={{
            //     input: style.input.base,
            //     error: style.input.error,
            //   }}
            // />

            <div style={{backgroundColor: '#f8f8f8'}} tw="p-3 rounded">
              { !subCategory ? "Select sub category to see terms": terms }
            </div>
          )}
          {terms == 'no terms' && (
            <TextInput
              tw="mt-3 w-full"
              required
              placeholder="No trade terms for this card"
              size="xl"
              styles={{
                input: style.input.base,
                error: style.input.error,
              }}
            />
          )}

        </div>


        <div tw="px-4  w-full mt-3">
          <TextInput
            required
            placeholder="Gift card amount"
            rightSection={'Amount (USD)'}
            value={amount}
            size="xl"
            type="number"
            ref={giftCardAmountInputRef}
            // autoFocus={false}
            autoComplete="off"
            onChange={(e: any) => handleAmountChange(e)}
            styles={{
              input: style.input.bold,
              error: tw`text-xs text-gray2`,
              rightSection: tw`text-xs w-max text-black3 mr-4`,
            }}
            tw="mt-3"
          />
          {subCategory && (
            <span tw="text-xs text-gray2">
              Minimun trade amount is ${subCategory?.minimum_amount}
            </span>
          )}
        </div>

        <div tw="bg-black6 w-full mt-3">
          <div tw="px-4 py-5 w-full">
            <div tw="w-full bg-[#F8F8F8] px-2 mt-3">
              <p tw="text-sm text-black2 font-medium py-2">
                Selected card info
              </p>
              <div tw="block divide-y-2">
                <div tw="flex justify-between py-3">
                  <p tw="text-sm font-normal text-black3">Rate</p>
                  <p tw="text-sm font-medium text-black1">
                    {subCategory && subCategory.rate}.00/$
                  </p>
                </div>
                <div tw="flex justify-between py-3">
                  <p tw="text-sm font-normal text-black3">Value</p>
                  <p tw="text-sm font-medium text-black1">
                    <NumericFormat
                      thousandsGroupStyle="thousand"
                      value={value}
                      prefix="₦"
                      suffix=".00"
                      decimalSeparator="."
                      displayType="text"
                      type="text"
                      thousandSeparator={true}
                      allowNegative={true}
                    />
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

         <div tw="px-4 py-5 w-full">
        {/*
          <div tw="w-full block">
            <div tw="inline-flex items-center w-full  mt-5">
              <label
                ref={fileRef}
                className="custom-file-upload"
                css={[style.input.base]}
                tw="items-center h-[48px] w-8/12 rounded-tr-none  rounded-br-none"
                htmlFor="file-upload"
              >
                <input
                  onChange={(e: any) => setFiles(e.target.files)}
                  id="file-upload"
                  accept="image/*"
                  type="file"
                  multiple
                />
                Choose files...
              </label>
              <Button
                onClick={() => fileRef?.current?.click()}
                size="lg"
                tw="w-4/12 text-primary text-sm font-medium bg-primary3 rounded-tl-none  rounded-bl-none"
              >
                Browse
              </Button>
            </div>
            {files && (
              <div tw="flex flex-row space-x-2 mt-2">
                {Object.keys(files).map((_, index) => {
                  const src = URL.createObjectURL(files[index])
                  return (
                    <div
                      tw="h-12 w-12 rounded-md"
                      key={index}
                      style={{
                        backgroundImage: `url(${src})`,
                        backgroundSize: 'cover',
                        border: '1px solid skyblue',
                      }}
                    />
                  )
                })}
              </div>
            )}
            <span tw="text-[10px] text-gray2">
              You can select multiple files at once{' '}
              <span tw="text-red-500"> (max file size is 3MB)</span>
            </span>
          </div>
          <div tw="block w-full">
            <Textarea
              label=""
              placeholder="Leave comment here"
              autosize
              mt="md"
              minRows={2}
              maxRows={4}
              {...form.getInputProps('comment')}
              styles={{
                input: style.input.base,
                error: style.input.error,
              }}
            />
          </div>
*/}
          <div tw="w-full mt-10">
            <Button
              loading={loading}
              tw="bg-primary mb-9"
              size="lg"
              fullWidth
              type="submit"
            >
              Submit for trade
            </Button>
          </div>
        </div> 
      </form>

      <style jsx>{`
        input[type='file'] {
          display: none;
        }
        .custom-file-upload {
          display: inline-flex;
          padding: 6px 12px;
          cursor: pointer;
        }
        .scrollbar::-webkit-scrollbar {
          display: none;
        }
        .scrollbar {
          scrollbar-width: none;
        }
      `}</style>
    </>
  )
}

export default Cards
