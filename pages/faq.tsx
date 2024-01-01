import * as React from 'react'
import { ReactElement, useEffect, useState } from 'react'

import Layout from '../layouts/layout'
import Back from '../layouts/back'
import AppTab from '../layouts/home'
import tw from 'twin.macro'

import { Accordion } from '@mantine/core'

interface FaqProps {}

const Faq = (props: FaqProps) => {
  const allFAQ = [{ title: 'Profile', content: 'gfgg' }]

  const [search, setSearch] = useState('')
  const [settings, setBills] = useState(allFAQ)

  const handleSearch = (e: any) => {
    const searched = allFAQ.filter(
      faq => faq.title.toLocaleLowerCase().indexOf(e.target.value) > -1,
    )
    setSearch(e.target.value)
    setBills(searched)
    //console.log(searched)
  }
  return (
    <>
      <p tw="w-full text-2xl font-medium px-4 mt-8">
        Frequently Asked Questions
      </p>
      <div tw="w-full">
        <Accordion
          styles={{
            label: tw`text-sm text-black1 font-normal`,
            item: tw`text-xs text-black2 font-normal`,
          }}
        >
          <Accordion.Item value="crypto-trade">
            <Accordion.Control>
              How do I trade crypto on KWIQ?
            </Accordion.Control>
            <Accordion.Panel>
              Basically, trading with us is sending crypto to your wallet
              address and waiting for it to confirm on the crypto network.
              <ul>
                <li>
                  • To start, you need a crypto wallet address for the trade. To
                  generate your wallet, click on the respective crypto options
                  for the coin you want to trade, the wallet address will be
                  displayed to you.
                </li>
                <li>
                  • Based on the selected crypto, rates for the trade are
                  displayed on the same page as your wallet.
                </li>
                <li>
                  • Copy your wallet address to trade. Note that any coin sent
                  to your address will be instantly converted to naira and added
                  to your naira wallet.
                </li>
                <li>
                  • The naira value of your total trades will be added to your
                  balance which will be available for immediate withdrawal.
                </li>
                <li>
                  • You can proceed to withdraw into your Nigerian bank account.
                </li>
              </ul>
            </Accordion.Panel>
          </Accordion.Item>

          <Accordion.Item value="transaction-time">
            <Accordion.Control>
              How long does a transaction take?
            </Accordion.Control>
            <Accordion.Panel>
              Time varies for all transactions. It depends on the particular
              crypto or gift card transaction you want to make. For instance,
              hash rate or network fee can affect the flow of the transaction.
              The average crypto transaction time is 10 mins - 1 hour depending
              on the network fee used. The time strains for Gift card
              transaction varies solely on the type of card you want to trade.
              Cards like Steam, Razergold take as little as 5 mins. On the
              contrary cards like Apple and Amex take 2-3 hours to get approved.
            </Accordion.Panel>
          </Accordion.Item>

          <Accordion.Item value="copy-wallet-address">
            <Accordion.Control>
              How can I copy my wallet address?
            </Accordion.Control>
            <Accordion.Panel>
              You have a unique wallet for different coins when you sign up on
              KWIQ. For instance, when you want to trade bitcoin, go to the
              trade crypto icon, then click on bitcoin, your QR code and wallet
              address will come up. Click on copy to copy to clip board and
              start trading.
            </Accordion.Panel>
          </Accordion.Item>

          <Accordion.Item value="wallet-change">
            <Accordion.Control>Can my wallet address change?</Accordion.Control>
            <Accordion.Panel>
              No. The first wallet address generated is your only wallet
              address. It doesn&apos;t change and its permanent.
            </Accordion.Panel>
          </Accordion.Item>

          <Accordion.Item value="recieve-crypto">
            <Accordion.Control>
              Can I receive crypto from any country?
            </Accordion.Control>
            <Accordion.Panel>
              You can receive crypto from any country, as long as you have
              access to KWIQ app, or got to our website, sign in and start
              trading.
            </Accordion.Panel>
          </Accordion.Item>

          <Accordion.Item value="create-wallet-address">
            <Accordion.Control>
              How do I create my KWIQ wallet address?
            </Accordion.Control>
            <Accordion.Panel>
              You get a personalized wallet address with unique QR code When you
              sign up on KWIQ. All you have to do is copy and paste.
            </Accordion.Panel>
          </Accordion.Item>

          <Accordion.Item value="recieve-crypto">
            <Accordion.Control>
              How do I receive crypto on KWIQ?
            </Accordion.Control>
            <Accordion.Panel>
              Copy and send your wallet address to whoever you want to receive
              crypto from. The funds will be directed straight to your wallet
              and converted to the Naira.
            </Accordion.Panel>
          </Accordion.Item>

          <Accordion.Item value="how-fast">
            <Accordion.Control>How fast is payment?</Accordion.Control>
            <Accordion.Panel>
              Our payments are automated, so you will get credited immediately
              your trade is confirmed.
            </Accordion.Panel>
          </Accordion.Item>

          <Accordion.Item value="transaction-limit">
            <Accordion.Control>
              Is there a transaction limit on KWIQ?
            </Accordion.Control>
            <Accordion.Panel>
              No there are no transaction limits. You can trade your largest
              numbers with us. Bring all coins to us. We&apos;ve got you!
            </Accordion.Panel>
          </Accordion.Item>

          <Accordion.Item value="store-crypto">
            <Accordion.Control>
              Can I store crypto in my KWIQ wallet?
            </Accordion.Control>
            <Accordion.Panel>
              No. We operate strictly on helping you sell your crypto and gift
              cards for the Naira equivalent with the best market rates.
            </Accordion.Panel>
          </Accordion.Item>

          <Accordion.Item value="wrong-address">
            <Accordion.Control>
              What happens if I send crypto to the wrong address?
            </Accordion.Control>
            <Accordion.Panel>
              When this happens, the crypto sent is lost and cannot be
              retrieved. We advise to always copy and paste wallet addresses
              when undergoing a transaction. Also, crosscheck that you&apos;re
              sending to the recipients correct wallet address.
            </Accordion.Panel>
          </Accordion.Item>

          <Accordion.Item value="safety">
            <Accordion.Control>
              How safe is trading bitcoin on KWIQ?
            </Accordion.Control>
            <Accordion.Panel>
              We use the industry standard best practices to ensure the safety
              of your funds. Our security is top-notch and your account is
              secured.
            </Accordion.Panel>
          </Accordion.Item>

          <Accordion.Item value="how-it-works">
            <Accordion.Control>How does KWIQ work?</Accordion.Control>
            <Accordion.Panel>
              KWIQ is a trading platform that allows crypto traders to sell or
              share their coins or gift card. You can download the app, or use
              the web. The signup process is super easy; all you have to do is
              enter your email, set a strong password, accept our terms and
              conditions, and viola!! You start trading in minutes.
            </Accordion.Panel>
          </Accordion.Item>

          <Accordion.Item value="bank-details">
            <Accordion.Control>
              How can I add or change my Bank account details?
            </Accordion.Control>
            <Accordion.Panel>
              You can easily add/change your payment details on any of our
              applications or on your web dashboard. Kindly navigate to
              &apos;Account Details&apos;. You can add, edit or delete your
              payment details from there. Your password/pin will be required for
              any changes to be made.
            </Accordion.Panel>
          </Accordion.Item>

          <Accordion.Item value="sell-giftcards">
            <Accordion.Control>How can I sell Gift Cards?</Accordion.Control>
            <Accordion.Panel>
              <ul>
                <li>
                  - Click on the &quot;Start A Trade&quot; button on the app
                  homepage. - Select the brand of card you want to sell in
                  &quot;Category&quot;.
                </li>
                <li>
                  - The &quot;Subcategory&quot; option is for you to be more
                  specific with your type of card. For instance, the amazon gift
                  card brand has several options, there&quot;s Amazon gift card
                  with cash receipt, there&quot;s Amazon gift card with debit
                  receipt and amazon with no receipt. The subcategory is where
                  you specify which option describes your gift card.
                </li>
                <li>
                  - Enter the total amount of the gift card you want to trade.
                </li>
                <li>
                  - The total payable amount will be displayed according to the
                  current rate.
                </li>
                <li>
                  - Attach your gift card pictures and receipt (if trade
                  requires receipt), you can upload up to 20 pictures at a time.
                </li>
                <li>
                  - There&quot;s an optional &quot;Comment to write things out…
                </li>
              </ul>
            </Accordion.Panel>
          </Accordion.Item>

          <Accordion.Item value="sub-cat">
            <Accordion.Control>
              What are categories and subcategories?
            </Accordion.Control>
            <Accordion.Panel>
              Categories are the gift card brand names. E.G iTunes, Amazon.
              Subcategories are the types of gift cards we accept under a
              particular gift card brand. For instance, if you want to trade a
              $25 physical iTunes gift card. The category is “iTunes” and the
              sub-category will be “iTunes Physical Card ($25-$100)”. It is just
              our way of arrangement in order not to get you confused. If you
              need further clarification, you can contact our customer support
              via live chat.
            </Accordion.Panel>
          </Accordion.Item>

          <Accordion.Item value="verify-email">
            <Accordion.Control>How do I verify my email? </Accordion.Control>
            <Accordion.Panel>
              This is a one-time process to ensure that the email provided
              during registration is correct because every important update
              concerning your account and transactions will be sent the email
              address. To complete every registration process, log in to your
              email, a verification link must have been sent there. If you
              don&apos;t find it in your inbox, check the spam folder. Click the
              verification link in the email and you are good to go. If you did
              not receive any verification email, contact our support team to
              help with the verification.
            </Accordion.Panel>
          </Accordion.Item>

          <Accordion.Item value="what-next">
            <Accordion.Control>
              My trade is completed, what next?
            </Accordion.Control>
            <Accordion.Panel>
              Once your trade is completed, you&apos;ll receive a notification
              to that effect. Your balance would be immediately topped up with
              the trade amount. You can now proceed to withdraw your funds to
              your bank account.
            </Accordion.Panel>
          </Accordion.Item>

          <Accordion.Item value="delete-app">
            <Accordion.Control>
              If I delete the app, will my money still be intact?
            </Accordion.Control>
            <Accordion.Panel>
              Yes. Your data does not reside on the app. As long as you have
              your login details, deleting the app has no effect on your balance
              and all user data.
            </Accordion.Panel>
          </Accordion.Item>

          <Accordion.Item value="upload-files">
            <Accordion.Control>
              Can I upload multiple gift cards at the same time?
            </Accordion.Control>
            <Accordion.Panel>
              Yes. Our platform allows multiple file uploads,
            </Accordion.Panel>
          </Accordion.Item>

          <Accordion.Item value="minimum-trade">
            <Accordion.Control>
              What&apos;s minimum trade amount?
            </Accordion.Control>
            <Accordion.Panel>
              It&apos;s the Minimum amount / value your Giftcard should have
              before it can be traded,
            </Accordion.Panel>
          </Accordion.Item>
        </Accordion>
      </div>
    </>
  )
}

Faq.getLayout = function getLayout(page: ReactElement) {
  return (
    <Layout>
      <Back />
      <AppTab />
      {page}
    </Layout>
  )
}

export default Faq
