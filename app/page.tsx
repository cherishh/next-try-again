import BackgroundBlur from '@/components/shared/background-blur';
import ExampleGallery from '@/components/shared/example-gallery';
import FAQSection from '@/components/shared/faq-section';
import Footer from '@/components/shared/footer';
import { Button } from '@/components/ui/button';

export default function Home() {
  return (
    <main className='min-h-screen bg-background'>
      {/* Hero Section */}
      <div className='relative py-16 lg:py-24'>
        <div className='max-w-7xl mx-auto px-4'>
          {/* Main Content */}
          <div className='text-center mb-16'>
            <h1 className='text-5xl lg:text-6xl font-bold mb-6'>
              <span className='text-orange-400'>Blur Background</span>{' '}
              <span className='text-foreground'>using AI in seconds</span>
            </h1>
            <p className='text-lg text-muted-foreground mb-8 max-w-2xl mx-auto'>
              Upload, download with the background automatically blurred.
              <br />
              Free to use. No signup required!
            </p>
          </div>

          {/* Main Interface */}
          <BackgroundBlur />
        </div>
      </div>

      {/* Example Gallery Section */}
      {/* <div className='max-w-7xl mx-auto px-4 mb-16'>
        <ExampleGallery />
      </div> */}

      {/* Key Features Section */}
      <div className='bg-card/30 py-16'>
        <div className='max-w-6xl mx-auto px-4'>
          <div className='text-center mb-12'>
            <p className='text-primary font-medium mb-2'>Why Us</p>
            <h2 className='text-3xl font-bold mb-4'>Why Choose us for blur image background ?</h2>
            <p className='text-muted-foreground max-w-2xl mx-auto'>
              Professional photo editing made simple with AI-powered background detection and blur effects.
            </p>
          </div>

          <div className='grid md:grid-cols-2 lg:grid-cols-3 gap-8'>
            {/* Feature Cards */}
            <div className='text-center p-6 hover:scale-105 transition-transform duration-300'>
              <div className='w-12 h-12 bg-primary rounded-full flex items-center justify-center mx-auto mb-4'>
                <span className='text-primary-foreground text-xl'>🎯</span>
              </div>
              <h3 className='text-xl font-semibold mb-2'>AI Background Selection</h3>
              <p className='text-muted-foreground text-sm'>
                Advanced AI automatically identifies and preserves the main subject while blurring the background
                perfectly.
              </p>
            </div>

            <div className='text-center p-6 hover:scale-105 transition-transform duration-300'>
              <div className='w-12 h-12 bg-primary rounded-full flex items-center justify-center mx-auto mb-4'>
                <span className='text-primary-foreground text-xl'>⚡</span>
              </div>
              <h3 className='text-xl font-semibold mb-2'>Simple to Use</h3>
              <p className='text-muted-foreground text-sm'>No complex settings - just upload and download.</p>
            </div>

            <div className='text-center p-6 hover:scale-105 transition-transform duration-300'>
              <div className='w-12 h-12 bg-primary rounded-full flex items-center justify-center mx-auto mb-4'>
                <span className='text-primary-foreground text-xl'>📱</span>
              </div>
              <h3 className='text-xl font-semibold mb-2'>Adjust Blur</h3>
              <p className='text-muted-foreground text-sm'>
                Modify the background blur intensity to increase or decrease the visual separation between the subject
                and the background—the stronger the blur, the more pronounced the depth and focus on the subject.
              </p>
            </div>

            <div className='text-center p-6 hover:scale-105 transition-transform duration-300'>
              <div className='w-12 h-12 bg-primary rounded-full flex items-center justify-center mx-auto mb-4'>
                <span className='text-primary-foreground text-xl'>💰</span>
              </div>
              <h3 className='text-xl font-semibold mb-2'>Generous Free Quota</h3>
              <p className='text-muted-foreground text-sm'>
                No login required, no watermarks, no limits. Blur background at zero cost.
              </p>
            </div>

            <div className='text-center p-6 hover:scale-105 transition-transform duration-300'>
              <div className='w-12 h-12 bg-primary rounded-full flex items-center justify-center mx-auto mb-4'>
                <span className='text-primary-foreground text-xl'>📸</span>
              </div>
              <h3 className='text-xl font-semibold mb-2'>Professional Results</h3>
              <p className='text-muted-foreground text-sm'>
                Create stunning portrait effects and depth-of-field blur that rivals expensive camera equipment.
              </p>
            </div>

            <div className='text-center p-6 hover:scale-105 transition-transform duration-300'>
              <div className='w-12 h-12 bg-primary rounded-full flex items-center justify-center mx-auto mb-4'>
                <span className='text-primary-foreground text-xl'>🔒</span>
              </div>
              <h3 className='text-xl font-semibold mb-2'>Privacy Protected</h3>
              <p className='text-muted-foreground text-sm'>
                Your images are processed securely and never stored on our servers. Complete privacy guaranteed.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Section */}
      <div className='py-16'>
        <div className='max-w-4xl mx-auto px-4 text-center'>
          <div className='mb-8'>
            <p className='text-primary font-medium mb-2'>Impact</p>
            <h2 className='text-3xl font-bold mb-4'>Trusted by Creators Worldwide</h2>
            <p className='text-muted-foreground'>Join millions who create professional photos with background blur</p>
          </div>

          <div className='grid md:grid-cols-3 gap-8'>
            <div className='text-center'>
              <p className='text-muted-foreground text-sm mb-1'>Photos Processed</p>
              <p className='text-4xl font-bold text-primary mb-1'>2.5M+</p>
              <p className='text-muted-foreground text-sm'>Backgrounds Blurred</p>
            </div>

            <div className='text-center'>
              <p className='text-muted-foreground text-sm mb-1'>Processing Speed</p>
              <p className='text-4xl font-bold text-primary mb-1'>&lt;3s</p>
              <p className='text-muted-foreground text-sm'>Average Processing Time</p>
            </div>

            <div className='text-center'>
              <p className='text-muted-foreground text-sm mb-1'>User Satisfaction</p>
              <p className='text-4xl font-bold text-primary mb-1'>98%</p>
              <p className='text-muted-foreground text-sm'>Happy with Results</p>
            </div>
          </div>
        </div>
      </div>

      {/* FAQ Section */}
      <FAQSection />

      {/* Footer */}
      <Footer />
    </main>
  );
}
