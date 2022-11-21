import React, { useRef } from 'react';
import Footer from './Footer';
import GrootAnimation from './GrootAnimation';


function Home() {
  const LearnMoreRef = useRef(null)

  const scrollToLearnMore = (ref: any ) => window.scrollTo({top: ref.current.offsetTop, left: 0, behavior: 'smooth'})   

  return (
    <>
      <GrootAnimation scrollToFooter={scrollToLearnMore} reference={LearnMoreRef}/>
      <div ref={LearnMoreRef}>
        <Footer/>
      </div>
    </>
  );
}

export default Home;
