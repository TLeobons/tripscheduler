import Document from 'next/document'
import { ServerStyleSheet } from 'styled-components'

// i didn't understand pretty much anything that this module does
/*
  The _document.tsx file is used here to support styled components on the SSR performed by next.js. 
  Basically, this file gathers all the styles from the styled-components created and merges them in a style tag, 
  and append that to the head of the HTML document.
*/
export default class MyDocument extends Document {
  static async getInitialProps(ctx: any) {
    const sheet = new ServerStyleSheet()
    const originalRenderPage = ctx.renderPage

    try {
      ctx.renderPage = () =>
        originalRenderPage({
          enhanceApp: (App: React.FC) => (props: any) => sheet.collectStyles(<App {...props} />),
        })

      const initialProps = await Document.getInitialProps(ctx)
      return {
        ...initialProps,
        styles: (
          <>
            {initialProps.styles}
            {sheet.getStyleElement()}
          </>
        ),
      }
    } finally {
      sheet.seal()
    }
  }
}
