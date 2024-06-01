
import useMediaQuery from '../useMedia';
import Swipe from '../components/swipe';
function Home(){
    const isAboveMedium=useMediaQuery('(min-width:768px)');
return(
    <>
    {isAboveMedium ?(
     <Swipe/>
    ):(
        <h1>hyy</h1>
    )
}
    </>
)
}
export default Home;