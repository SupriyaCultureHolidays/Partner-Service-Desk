import { DotLottieReact } from '@lottiefiles/dotlottie-react'
import loadingAnimation from '../../assets/loading.lottie?url'
import './PageLoader.css'

export default function PageLoader() {
  return (
    <div className="page-loader">
      <DotLottieReact src={loadingAnimation} loop autoplay className="page-loader-anim" />
    </div>
  )
}
