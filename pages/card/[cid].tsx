import React, { ReactElement, useEffect, useState } from 'react'

import tw from 'twin.macro'

import Layout from '../../layouts/layout'
import AppTab from '../../layouts/home'
import Back from '../../layouts/back'

import Link from 'next/link'
import Image from 'next/image'

import { Badge, TextInput, Button, Textarea, Select } from '@mantine/core'
import { useNotifications } from '@mantine/notifications'

import { useForm } from '@mantine/form'

import { BsArrowRightShort } from 'react-icons/bs'

import style from '../../styles/Styles'

import { useAtom } from 'jotai'
import { activeHomeTabAtom } from '../../stores'

import { useGiftCards } from '../../hooks/api'

import axios from 'axios'

import imageCompression from 'browser-image-compression'
import { FaChevronDown } from 'react-icons/fa'
import {
  successNotification,
  unsuccessfullNotification,
} from '../../libs/notifications'

export interface ICardsProps {}

const cardsX = [
  { image: 'apple.png' },
  { image: 'footlocker.png' },
  { image: 'nike.png' },
  { image: 'walmart.png' },
  { image: 'goggleplay.png' },
  { image: 'steam.png' },
  { image: 'appleamerica.png' },
  { image: 'jcpenny.png' },
  { image: 'visa.png' },
  { image: 'americanexpress.png' },
  { image: 'amazon.png' },
  { image: 'target.png' },
  { image: 'ebay.png' },
  { image: 'sephora.png' },
  { image: 'macys.png' },
  { image: 'vanilla.png' },
  { image: 'nordstorm.png' },
  { image: 'bestbuy.png' },
]

const options = [
  { value: 'react', label: 'React' },
  { value: 'ng', label: 'Angular' },
  { value: 'svelte', label: 'Svelte' },
  { value: 'vue', label: 'Vue' },
]
const Cards = (props: ICardsProps) => {
  const [, setActiveTab] = useAtom(activeHomeTabAtom)
  useEffect(() => {
    setActiveTab('Cards')
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])
  const notifications = useNotifications()

  const { cards, isLoading, isError } = useGiftCards()
  const [subCategories, setSubCategories] = useState<[] | any>(null)
  const [category, setCategory] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [amount, setAmount] = useState(0) //
  const [value, setValue] = useState('')
  const [terms, setTerms] = useState('')
  const [subCategory, setSubCategory] = useState<{
    minimum_amount: number
    rate: number
    name: string
    terms: string
  } | null>(null)

  const [formErrors, setFormError] = useState({
    subcat: '',
    amount: '',
    files: '',
  })

  const [valueX, setValueX] = useState<string | null>('')
  const [files, setFiles] = useState<FileList | null>(null)

  //console.log(cards)

  const handleCardClick = (index: any) => {
    //handle when a card is clicked to set the sub-categories and set the selected subcategory to empty
    //selected value and also selected amount

    setCategory(cards[index].category)
    setValue('')
    setAmount(0)
    setTerms('')

    //setSubCategories(cards[index].subcategories)
    const subcats = cards[index].subcategories
    //console.log(subcats)
    const xx = subcats.map((item: any, index: number) => {
      item['label'] = item['name']
      item['value'] = index + '' // item["rate"]
      return item
    })

    /* setSubCategories([
           {
               "minimum_amount": 10,
               "terms": "Test",
               "name": "$100",
               "rate": 250,
               "label": "$100 dnjkvh",
               "value": "0"
               
           },
           {
               "minimum_amount": 10,
               "terms": "Test",
               "name": "$100",
               "rate": 250,
               "label": "$100",
               "value": "1"
           }
       ])  */

    //setSubCategories(null)
    setSubCategories(xx)

    setValueX(null)
    setSubCategory(null)

    setFiles(null)
    handleCategoryChangeX(null)
    //handleCategoryChange(null, index)// initilally set first subcat
  }

  const handleCategoryChange = (e: any | null, pos: number | null) => {
    let subcat: any

    //console.log('changed')
    if (pos !== null) {
      subcat = cards[pos].subcategories[0]
      setSubCategory(subcat)
      //console.log(cards[pos].subcategories[0])
      setTerms(subcat?.terms)
    } else {
      subcat = subCategories![parseInt(e)]
      setTerms(subcat?.terms)
      setSubCategory(subcat)
    }
  }

  const handleCategoryChangeX = (e: any) => {
    let subcat: any

    if (e != null) {
      setValueX(e)
      subcat = subCategories![parseInt(e)]
      setSubCategory(subcat)
      form.setFieldValue('subcat', e)
    } else {
      form.setFieldValue('subcat', '')
    }
  }

  const handleAmountChange = (e: any) => {
    if (subCategory == null) {
      unsuccessfullNotification({
        message: 'Please select a card',
      })
    } else {
      setAmount(e.target.value)
    }
  }

  useEffect(() => {
    if (subCategory !== null) setValue((amount * subCategory?.rate).toString())
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [amount])

  const form = useForm({
    initialValues: {
      subcat: '',
      comment: '',
    },
    validate: {
      subcat: value => (value ? null : 'Please choose a sub category'),
    },
  })

  const handleSubmit = async () => {
    if (form.validate().hasErrors) {
      return
    }

    if (subCategory?.minimum_amount) {
      if (amount < subCategory.minimum_amount) {
        unsuccessfullNotification({
          message: `Amount is less than the minimun trade amount($${subCategory.minimum_amount})`,
        })
        return
      }
    }

    if (files == null) {
      unsuccessfullNotification({ message: 'Please select at least one file' })
      return
    }

    const srcs = await handleImageUpload(files)

    setLoading(true)
    try {
      const response = await axios.post('/api/create-gift-card-trade', {
        purchaseAmount: amount,
        rate: subCategory?.rate,
        value: value,
        images: srcs,
        category: category,
        subCategory: subCategory?.name,
        comments: form.values.comment,
      })
      if (response.status == 200) {
        setLoading(false)
        setAmount(0)
        setSubCategory(null)
        setValue('')
        form.reset()
        successNotification({ message: 'Your trade was created succesfully' })
      }
    } catch (e: any) {
      setLoading(false)
      setError(e.response.data.data.message)
    }
  }

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

  return (
    <>
      <div tw="px-4 w-full">
        <div tw="w-full flex items-center justify-between mt-2">
          <p tw="text-2xl font-medium">Cards</p>
          <Link passHref href="/cards/all-cards">
            <Badge
              rightSection={<BsArrowRightShort />}
              tw="bg-[#EEF8FF] text-[#279AED] normal-case font-normal px-2 py-3 cursor-pointer"
              variant="filled"
            >
              view all
            </Badge>
          </Link>
        </div>
        <div tw="max-w-3xl mx-auto min-w-0 mt-3">
          <div className="scrollbar" tw="overflow-x-auto  flex space-x-3">
            {cards &&
              cards.map((item: any, index: number) => (
                <div tw="flex-none flex flex-col " key={index}>
                  <div tw="hocus:border-2 hocus:border-blue-400">
                    <Image
                      tw="flex-none rounded-lg py-3 cursor-pointer "
                      src={item?.image}
                      width={246}
                      height={168}
                      alt=""
                      onClick={() => handleCardClick(index)}
                    />
                  </div>
                  <p tw="[font-size:16px] text-center">{item?.category}</p>
                </div>
              ))}
          </div>
        </div>
        <p tw="w-full text-gray2 text-2xl font-medium mt-5">Sub category</p>
      </div>
      <form
        onSubmit={form.onSubmit(handleSubmit)}
        action=""
        tw="w-full block mt-4"
      >
        <div tw="px-4  w-full ">
          {subCategories && (
            <Select
              tw=""
              placeholder="Select sub category"
              size="xl"
              rightSection={<FaChevronDown />}
              required
              value={form.values.subcat}
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

        <div tw="px-4  w-full mt-3">
          <TextInput
            required
            placeholder="Gift card amount"
            rightSection={'Amount (USD)'}
            value={amount}
            size="xl"
            type="number"
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
                  <p tw="text-sm font-medium text-black1">&#8358;{value}.00</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div tw="px-4 py-5 w-full">
          <p tw="w-full text-black2 text-sm mt-5">Trade terms</p>
          {terms && (
            <Textarea
              value={terms}
              autosize
              contentEditable={false}
              minRows={2}
              maxRows={4}
              styles={{
                input: style.input.base,
                error: style.input.error,
              }}
            />
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

          <div tw="w-full block">
            <div tw="inline-flex items-center w-full  mt-5">
              <label
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
            {/* <p tw="w-full text-black2 text-sm mt-5">Comment</p> */}
            <Textarea
              label=""
              autosize
              minRows={2}
              maxRows={4}
              {...form.getInputProps('comment')}
              styles={{
                input: style.input.base,
                error: style.input.error,
              }}
            />
          </div>

          <div tw="w-full mt-10">
            <Button
              loading={loading}
              tw="bg-primary mb-9"
              size="lg"
              fullWidth
              type="submit"
            >
              Start Trade
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
Cards.auth = true
Cards.getLayout = function getLayout(page: ReactElement) {
  return (
    <Layout>
      <Back />
      <AppTab />
      {page}
    </Layout>
  )
}

export default Cards
