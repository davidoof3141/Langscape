import React from 'react';
import FolderIcon from '../../assets/folders.svg';
import ChartIcon from '../../assets/chart.svg';
import MailIcon from '../../assets/mail.svg';
import TeacherIcon from '../../assets/chat.svg';
import CardsIcon from '../../assets/cards.svg';
import SettingIcon from '../../assets/settings.svg';

const Navbar = () => {
  const NavIcons = [
    {
      svg: FolderIcon,
      text: 'Home',
      url: '/'
    },
    {
      svg: ChartIcon,
      text: 'Profile',
      url: '/'
    },
    {
      svg: MailIcon,
      text: 'Messages',
      url: '/'
    },
    {
      svg: TeacherIcon,
      text: 'Teacher',
      url: '/chat'
    },
    {
      svg: CardsIcon,
      text: 'Vocabulary',
      url: '/vocabulary'
    }
  ];

  const handleNavigation = (url: string) => {
    window.location.href = url;
  };

  return (
    <nav className="relative left-0 top-0 h-full bg-[#373B53] w-16 hover:w-48 transition-all duration-300 ease-in-out group/sidebar">
      <ul className="h-full flex flex-col">
        <div className="space-y-4 p-2">
          {NavIcons.map(({ svg, text, url }) => (
            <li
              key={text}
              className="flex items-center cursor-pointer hover:bg-[#38B72D] rounded-lg group"
              onClick={() => handleNavigation(url)}
            >
              <div className="p-2 ">
                <img src={svg} className='h-6'></img>
              </div>
              <span
                className="
                  ml-2 
                  w-0 
                  group-hover/sidebar:w-24 
                  overflow-hidden 
                  transition-all 
                  duration-300 
                  ease-in-out 
                  whitespace-nowrap 
                  text-white
                  group-hover:text-black
                "
              >
                {text}
              </span>
            </li>
          ))}
        </div>
        <div className="mt-auto p-2">
          <li
            className="flex items-center cursor-pointer hover:bg-[#38B72D] rounded-lg group"
          >
            <div className="p-2  rounded-full">
              <img src={SettingIcon} />
            </div>
            <span
              className="
                  ml-2 
                  w-0 
                  group-hover/sidebar:w-24 
                  overflow-hidden 
                  transition-all 
                  duration-300 
                  ease-in-out 
                  whitespace-nowrap 
                  text-white
                  group-hover:text-black
              "
            >
              Settings
            </span>
          </li>
        </div>
      </ul>
    </nav >
  );
};

export default Navbar;
