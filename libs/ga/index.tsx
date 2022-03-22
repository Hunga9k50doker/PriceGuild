 //@ts-ignore
export const pageView = (url) => {
     //@ts-ignore
    window.gtag('config', process.env.NEXT_PUBLIC_GOOGLE_ANALYTICS, {
      page_path: url,
    })
  }
  
 //@ts-ignore
export const event = ({ action, params }) => {
     //@ts-ignore
    window.gtag('event', action, params)
}