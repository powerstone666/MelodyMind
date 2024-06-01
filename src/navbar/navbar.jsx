import React, { useState } from 'react';
import menubar from '../assets/menu.svg';
import useMediaQuery from '../useMedia';

import close from '../assets/close-icon.svg';
import search from '../assets/searchicon.svg';

function Navbar({selected, setSelected}) {
    const isAboveMedium = useMediaQuery('(min-width: 768px)');
    const [isMenuToggled, setIsMenuToggled] = useState(false);
    const selectedStyle = `text-red  `;
    return (
        <>
            {isAboveMedium ? (
                <section>
                    <nav className='z-40 w-full p-4'>
                        <ul className="flex items-center gap-12 justify-center hover:cursor-pointer">
                            <li className='flex rounded-md bg-grey w-96 h-8'>
                                <img src={search} alt='search icon' className='p-2'/>
                                <input type="text" placeholder="Search For Musics, Artists, Albums..." className="p-4 h-8 w-80 bg-transparent outline-none "/>
                            </li>
                            <li className={`${selected==='about' ? selectedStyle:"hover:text-red"}`} onClick={()=>{setSelected("about")}}>About</li>
                            <li className={`${selected==='contact' ? selectedStyle:"hover:text-red"}`} onClick={()=>{setSelected("contact")}}>Contact</li>
                            <li className={`${selected==='mood' ? selectedStyle:"hover:text-red"}`} onClick={()=>{setSelected("mood")}}>Mood Analyse</li>
                            <button className='bg-deep-grey w-24 h-8 border-0 rounded-md text-red hover:shadow-md hover:shadow-red' onClick={()=>{setSelected("login")}}>Login</button>
                            <button className='bg-red w-24 h-8 border-0 rounded-md text-deep-grey hover:shadow-md hover:shadow-deep-blue' onClick={()=>{setSelected("signup")}}>Sign Up</button>
                        </ul>
                    </nav>
                </section>
            ) : (
                <section className='flex justify-end relative right-0'>{/*need to be fixed*/}
                <nav className='z-40 w-full  p-4'>
                    <ul className="flex items-center ">
                    <li><h1 className="bg-gradient-rainbow text-transparent bg-clip-text text-2xl p-6 font-bold text-red">MelodyMind</h1></li>
                        <img src={menubar} alt='menu icon' className='p-2 hover:cursor-pointer' onClick={() => setIsMenuToggled(true)}/>
                    </ul>
                </nav>
                </section>
            )}
            {isMenuToggled && !isAboveMedium && (
                <section className='w-5/6 bg-deep-blue h-screen right-0 bottom-0 fixed z-40'>
                    <div className='flex justify-end p-4 mt-16'>
                        <button onClick={() => setIsMenuToggled(!isMenuToggled)}>
                            <img src={close} alt="close" className="w-6 hover:cursor-pointer"/>
                        </button>
                    </div>
                    <h1 className="bg-gradient-rainbow text-transparent bg-clip-text text-2xl p-6 font-bold text-red">MelodyMind</h1>
                    <div className="align-middle justify-center items-center p-8 hover:cursor-pointer">
                     
                        <div className='p-2' onClick={()=>{setSelected("about")}}><h1 className={`${selected==='about' ? selectedStyle:"hover:text-red"}text-xl`} >About</h1></div>
                        <div className='p-2' onClick={()=>{setSelected("contact")}}><h1 className={`${selected==='contact' ? selectedStyle:"hover:text-red"}text-xl`}>Contact</h1></div>
                        <div className='p-2'onClick={()=>{setSelected("mood")}}><h1 className={`${selected==='mood' ? selectedStyle:"hover:text-red"}text-xl`} >Mood Analyser</h1></div>
                        <div className='p-2'onClick={()=>{setSelected("recently")}}><h1 className={`${selected==='recently' ? selectedStyle:"hover:text-red"}text-xl`} >Recently</h1></div>
                      
                        <div onClick={()=>{setSelected("login")}}><button className='p-2 text-xl text-blue' >Login</button></div>
                        <div onClick={()=>{setSelected("login")}}><button className='p-2 text-xl text-orange-500'>Sign Up</button></div>
                        <div className='p-2 text-xl'>logout</div>
                    </div>
                </section>
            )}
        </>
    );
}

export default Navbar;
