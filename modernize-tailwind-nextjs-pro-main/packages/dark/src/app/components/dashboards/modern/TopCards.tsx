"use client"
import Image from "next/image"
import { useRouter } from "next/navigation"
import CardBox from "../../shared/CardBox"
import iconConnect from "/public/images/svgs/icon-connect.svg"
import iconSpeechBubble from "/public/images/svgs/icon-speech-bubble.svg"
import iconFavorites from "/public/images/svgs/icon-favorites.svg"
import iconMailbox from "/public/images/svgs/icon-mailbox.svg"
import iconBriefcase from "/public/images/svgs/icon-briefcase.svg"
// import iconUser from "/public/images/svgs/icon-user-male.svg"

// Import Swiper React components
import { Swiper, SwiperSlide } from 'swiper/react';

// Import Swiper styles
import 'swiper/css';

const TopCards = () => {
    const router = useRouter();
    
    const TopCardInfo = [
        {
            key:"card1",
            title:"Pending notifications",
            desc:"59",
            img:iconMailbox,
            bgcolor:"bg-lightprimary dark:bg-lightprimary ",
            textclr:"text-primary dark:text-primary",
            filterType:"pending"
        },
        {
            key:"card2",
            title:"In seven days",
            desc:"96",
            img:iconSpeechBubble,
            bgcolor:"bg-lightsuccess dark:bg-lightsuccess",
            textclr:"text-success dark:text-success",
            filterType:"7days"
        },
        {
            key:"card3",
            title:"In 30 days",
            desc:"696",
            img:iconBriefcase,
            bgcolor:"bg-lighterror dark:bg-lighterror",
            textclr:"text-error dark:text-error",
            filterType:"30days"
        },
        {
            key:"card4",
            title:"Completed",
            desc:"3,560",
            img:iconFavorites,
            bgcolor:"bg-lightwarning dark:bg-lightwarning",
            textclr:"text-warning dark:text-warning",
            filterType:"completed"
        },
        {
            key:"card5",
            title:"Active notifications",
            desc:"356",
            img:iconConnect,
            bgcolor:"bg-lightinfo dark:bg-darkinfo",
            textclr:"text-info dark:text-info",
            filterType:"active"
        },
    ]

    const handleCardClick = (filterType: string) => {
        router.push(`/apps/invoice/list?filter=${filterType}`);
    }


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
              slidesPerView: 5, // Changed to 5 since we have 5 items
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
                <CardBox 
                    className={`shadow-none ${item.bgcolor} w-full cursor-pointer transition-transform hover:scale-105`}
                    onClick={() => handleCardClick(item.filterType)}
                >
                    <div className="text-center">
                        <div className="flex justify-center">
                            <Image src={item.img}
                                width="50" height="50" className="mb-3" alt="icon"/>
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