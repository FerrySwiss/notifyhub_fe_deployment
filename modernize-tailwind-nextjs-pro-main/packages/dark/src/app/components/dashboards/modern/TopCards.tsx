"use client"
import Image from "next/image"
import CardBox from "../../shared/CardBox"
// import iconConnect from "/public/images/svgs/icon-connect.svg"
// import iconSpeechBubble from "/public/images/svgs/icon-speech-bubble.svg"
// import iconFavorites from "/public/images/svgs/icon-favorites.svg"
// import iconMailbox from "/public/images/svgs/icon-mailbox.svg"
// import iconBriefcase from "/public/images/svgs/icon-briefcase.svg"
// import iconUser from "/public/images/svgs/icon-user-male.svg"
import dailyReminders from "/public/images/dailyreminders.png"
import weeklyUpdtaes from "/public/images/weeklyreminders.png"
import monthlyUpdates from "/public/images/monthlyupdates.png"
import ongoing from "/public/images/ongoing.png"
import completed from  "/public/images/completed.png"
import upcoming from "/public/images/upcoming.png"
// Import Swiper React components
import { Swiper, SwiperSlide } from 'swiper/react';

// Import Swiper styles
import 'swiper/css';

const TopCards = () => {
    
    const TopCardInfo = [
        {
            key:"card1",
            title:"Daily Alerts",
            desc:"59",
            img:dailyReminders,
            bgcolor:"bg-lightprimary dark:bg-lightprimary ",
            textclr:"text-primary dark:text-primary"
        },
        {
            key:"card2",
            title:"Weekly Alerts",
            desc:"$96k",
            img:weeklyUpdtaes,
            bgcolor:"bg-lightsuccess dark:bg-lightsuccess",
            textclr:"text-success dark:text-success"
        },
        {
            key:"card3",
            title:"Monthly Updates",
            desc:"696",
            img:monthlyUpdates,
            bgcolor:"Ongoing",
            textclr:"text-error dark:text-error"
        },
        {
            key:"card4",
            title:"OnGoing",
            desc:"356",
            img:ongoing,
            bgcolor:"bg-lightinfo dark:bg-darkinfo",
            textclr:"text-info dark:text-info"
        },
        {
            key:"card5",
            title:"Completed",
            desc:"3,560",
            img:completed,
            bgcolor:"bg-lightwarning dark:bg-lightwarning",
            textclr:"text-warning dark:text-warning"

        },
        {
            key:"card7",
            title:"Upcoming",
            desc:"96",
            img:upcoming,
            bgcolor:"bg-lightprimary dark:bg-lightprimary",
            textclr:"text-primary dark:text-primary"
        },
       
    ]


    return (
        <>
          <div>
          <Swiper
        slidesPerView={6}
        spaceBetween={24}
        loop={true}
        dir="ltr"
        grabCursor={true}
        breakpoints={{
            0 : {
              slidesPerView: 1,
              spaceBetween: 10,
            },
            640: {
              slidesPerView: 2,
              spaceBetween: 14,
            },
            768: {
              slidesPerView: 3,
              spaceBetween: 18,
            },
            1030: {
              slidesPerView: 4,
              spaceBetween: 18,
            },
            1200: {
              slidesPerView: 6,
              spaceBetween: 24,
            },
          }}
        pagination={{
          clickable: true,
        }}
        className="mySwiper"
      >
     {
        TopCardInfo.map((item)=>{
            return(
                <SwiperSlide key={item.key} >
                <CardBox className={`shadow-none ${item.bgcolor} w-full`}>
                    <div className="text-center">
                        <div className="flex justify-center">
                            <Image src={item.img}
                                width="50" height="50" className="mb-3" alt="profile-image"/>
                        </div>
                        <p className={`font-semibold ${item.textclr} mb-1`}>
                            {item.title}
                        </p>
                        <h5 className={`text-lg font-semibold ${item.textclr} mb-0`}>{item.desc}</h5>
                    </div>
                </CardBox>
                </SwiperSlide>
            )
        })
     }

      </Swiper>
          </div>
        </>
    )
}
export { TopCards }