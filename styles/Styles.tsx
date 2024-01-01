import tw from 'twin.macro'

const Style = {
  text: {
    sm: tw`text-sm font-normal text-center`,
    smbold: tw`text-sm text-black1 font-medium`,
    smfull: tw`text-sm text-black2 font-normal text-center`,
    md: tw`text-[22px] text-black1 text-center w-max font-medium `,
    color: {
      gray: tw`text-gray2`,
      black1: tw`text-black1`,
    },
  },
  input: {
    base: tw`rounded-xl bg-gray-100  text-sm border-0`,
    bold: tw`rounded-xl bg-gray-100  text-sm border-0 font-medium`,
    search: tw`bg-gray-100  text-sm border-0 font-medium rounded-full`,
    edit: tw`rounded-xl bg-gray-100 font-medium text-black1 text-sm border-0 pt-[0.85rem]`,
    referal: tw` bg-white font-medium text-black1 text-lg border-0 pt-[0.85rem] rounded-full`,
    error: tw`text-sm`,
  },
  btn: {
    transparent: tw`mt-24 text-black bg-transparent border-[1px] border-gray-400`,
  },
  utils: {},
}

export default Style
