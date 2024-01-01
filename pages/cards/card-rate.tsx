import React, { ReactElement, useEffect, useState } from 'react'

import tw from 'twin.macro'

import Layout from '../../layouts/layout'
import AppTab from '../../layouts/home'
import Back from '../../layouts/back'

import Image from 'next/image'

import { useAtom } from 'jotai'
import { activeHomeTabAtom } from '../../stores'

import { Text, Select, TextInput, Button, Group, Input } from '@mantine/core'

import style from '../../styles/Styles'
import { FaChevronDown } from 'react-icons/fa'
import { useGiftCards } from '../../hooks/api'
import LoadingScreen from '../../components/LoadingScreen'
import { useForm } from '@mantine/form'
import { useNotifications } from '@mantine/notifications'
import NumberFormat, { NumericFormat } from 'react-number-format'
import { unsuccessfullNotification } from '../../libs/notifications'

export interface ICardsProps { }

const Cards = ({ }: ICardsProps) => {
  const [, setActiveTab] = useAtom(activeHomeTabAtom)
  useEffect(() => {
    setActiveTab('Cards')
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const notifications = useNotifications()

  const { cards, isLoading, isError } = useGiftCards()
  const [categories, setCategories] = useState([])
  //const [subCategory, setSubCategory] = useState<{ minimum_amount: number, rate: number, name: string, terms: string } | null>(null)
  const [subCategory, setSubCategory] = useState([])
  const [category, setCategory] = useState<{
    minimum_amount: number
    rate: number
    name: string
    terms: string
  } | null>(null)

  const [subCategories, setSubCategories] = useState<[] | any>(null)

  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [amount, setAmount] = useState('') //
  const [value, setValue] = useState('')
  const [terms, setTerms] = useState('')

  if (!isLoading) {
    //   console.log(cards)
  }

  useEffect(() => {
    const nCategories = cards?.map((item: any, index: number) => {
      item['label'] = item['category']
      item.value = index.toString()
      delete item['category']
      delete item['createdAt']
      return item
    })
    nCategories?.unshift({ value: '', label: 'Select category' })
    setCategories(nCategories)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isLoading])

  const form = useForm({
    initialValues: {
      category: '',
      subcategory: '',
      comment: '',
    },
    validate: {
      category: value => (value.length > 0 ? null : 'Please choose a category'),
      subcategory: value =>
        value.length > 0 ? null : 'Please choose a sub category',
    },
  })

  const handleCategoryChange = (e: any) => {
    let subcat: any

    form.setFieldValue('category', e)
    const index = parseInt(e)
    setCategory(null)
    setSubCategory([])
    setAmount('')
    setValue('')
    if (!isNaN(index)) {
      subcat = categories[index + 1]
      const nSubCats = subcat.subcategories.map((item: any, index: number) => {
        item['label'] = item['name']
        item['value'] = index.toString()
        //delete item['name']
        return item
      })
      nSubCats?.unshift({ value: '', label: 'Select sub category' })

      setSubCategory(nSubCats)
    } else {
      setSubCategory([])
      setAmount('')
      setValue('')
      //setTerms('')
    }
  }

  const handleSubCategoryChange = (e: any) => {
    form.setFieldValue('subcategory', e)
    const index = parseInt(e)

    if (!isNaN(index)) {
      const cat = subCategory[index + 1]
      setCategory(cat)
    } else {
      setCategory(null)
      setAmount('')
      setValue('')
    }
  }

  const handleAmountChange = (e: any) => {
    if (category == null) {
      unsuccessfullNotification({ message: 'Please select sub category' })
    } else {
      setAmount(e.target.value)
    }
  }

  useEffect(() => {
    if (category !== null)
      setValue((parseInt(amount) * category?.rate).toString())
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [amount])

  if (isLoading) return <LoadingScreen />
  return (
    <>
      <Group position="center" tw="flex flex-col">
        <Image
          tw="mt-5"
          src="/img/addbank.svg"
          width={132}
          height={156}
          alt=""
        />

        <div tw="mt-5">
          <Text css={[style.text.md, style]}>Calculte gift card rate</Text>
        </div>
        <form action="" tw="w-full block mt-4">
          {categories && (
            <Select
              tw=""
              placeholder="Select category"
              size="xl"
              {...form.getInputProps('category')}
              onBlur={() => form.validateField('category')}
              onChange={handleCategoryChange}
              value={form.values.category}
              rightSection={<FaChevronDown />}
              styles={{
                input: style.input.base,
                error: style.input.error,
                rightSection: { pointerEvents: 'none' },
              }}
              data={categories}
            />
          )}

          {subCategory.length > 0 && (
            <Select
              tw="mt-2"
              placeholder="Select sub category"
              size="xl"
              rightSection={<FaChevronDown />}
              {...form.getInputProps('subcategory')}
              onBlur={() => form.validateField('subcategory')}
              onChange={handleSubCategoryChange}
              value={form.values.subcategory}
              styles={{
                input: style.input.base,
                error: style.input.error,
                rightSection: { pointerEvents: 'none' },
              }}
              data={subCategory}
            />
          )}

          <Input.Wrapper error={form.errors.amount}>
            <NumericFormat
              css={[
                style.input.base,
                tw`p-4 outline-none font-normal w-full my-2`,
              ]}
              thousandsGroupStyle="thousand"
              onBlur={() => form.validateField('amount')}
              placeholder="Amount"
              prefix="$"
              suffix=""
              decimalSeparator="."
              displayType="input"
              type="text"
              thousandSeparator={true}
              value={amount}
              onValueChange={values => {
                if (category == null) {
                  unsuccessfullNotification({
                    message: 'Please select a sub category',
                  })
                } else {
                  setAmount(values.value)
                }
              }}
            />
          </Input.Wrapper>
          {category && (
            <span tw="text-xs text-gray2">
              Minimun amount is $ {category?.minimum_amount}
            </span>
          )}
        </form>

        <div tw="w-full bg-[#F8F8F8] px-2 mt-3  rounded-lg">
          <div tw="block divide-y-2">
            <div tw="flex justify-between py-3">
              <p tw="text-sm font-normal text-black3">Amount</p>
              <p tw="text-sm font-medium text-black1">
                <NumericFormat
                  thousandsGroupStyle="thousand"
                  value={isNaN(parseInt(amount)) ? '0' : amount}
                  prefix="$"
                  suffix=""
                  decimalSeparator="."
                  displayType="text"
                  type="text"
                  thousandSeparator={true}
                  allowNegative={true}
                />
                /$
              </p>
            </div>
            <div tw="flex justify-between py-3">
              <p tw="text-sm font-normal text-black3">Rate</p>
              <p tw="text-sm font-medium text-black1">{category?.rate}/$</p>
            </div>
            <div tw="flex justify-between py-3">
              <p tw="text-sm font-normal text-black3">Value</p>
              <p tw="text-sm font-medium text-black1">
                <NumericFormat
                  css={[tw`text-sm font-medium text-black1`]}
                  thousandsGroupStyle="thousand"
                  value={isNaN(parseInt(value)) ? '0' : value}
                  prefix="₦"
                  suffix=""
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

        {/*  <div tw="w-full mt-10">
                    <Button tw="bg-primary mb-9" size="lg" fullWidth type="submit">Calculate</Button>
                </div> */}
        <style jsx>{`
          input[type='file'] {
            display: none;
          }
          .custom-file-upload {
            display: inline-flex;
            padding: 6px 12px;
            cursor: pointer;
          }
        `}</style>
      </Group>
    </>
  )
}

Cards.getLayout = function getLayout(page: ReactElement) {
  return (
    <Layout>
      <Back />
      <AppTab />
      <div tw="px-4 py-5 w-full">{page}</div>
    </Layout>
  )
}

export default Cards
