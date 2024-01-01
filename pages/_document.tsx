import Document, {
  Html,
  Head,
  Main,
  NextScript,
  DocumentContext,
  DocumentInitialProps,
} from 'next/document'
import { extractCritical } from '@emotion/server'

type NewDocumentInitialProps = DocumentInitialProps & {
  ids: string[]
  css: string
}

class CustomDocument extends Document<NewDocumentInitialProps> {
  static async getInitialProps(
    ctx: DocumentContext,
  ): Promise<DocumentInitialProps> {
    const initialProps = await Document.getInitialProps(ctx)
    const critical = extractCritical(initialProps.html)
    initialProps.html = critical.html
    initialProps.styles = (
      <>
        {initialProps.styles}
        <style
          data-emotion-css={critical.ids.join(' ')}
          dangerouslySetInnerHTML={{ __html: critical.css }}
        />
      </>
    )

    return initialProps
  }

  render() {
    return (
      <Html lang="en">
        <Head>

          {/* <!-- Google Tag Manager --> */}
          <script
            dangerouslySetInnerHTML={{
              __html: `
            (function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
            new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
            j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
            'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
            })(window,document,'script','dataLayer','GTM-MT7TTLRR');
            `}} />
          {/* <!-- End Google Tag Manager --> */}


          <style
            data-emotion-css={this.props?.ids?.join(' ')}
            dangerouslySetInnerHTML={{ __html: this.props.css }}
          />

        </Head>
        <body>
          {/* <!-- Google Tag Manager (noscript) --> */}
          <noscript>
            <iframe src="https://www.googletagmanager.com/ns.html?id=GTM-MT7TTLRR"
            height="0" width="0" 
            style={{display: 'none', visibility: 'hidden'}}
            ></iframe>
        </noscript>
          {/* <!-- End Google Tag Manager (noscript) --> */}
          <Main />
          <NextScript />
        </body>
      </Html >
    )
  }
}

export default CustomDocument
