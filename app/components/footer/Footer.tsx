"use client"
import Link from "next/link"
import Image from "next/image"
import logo from '../../../public/logo.svg'
import twitter from '../../../public/twitter.svg'
import website from '../../../public/website.svg'


// const desText = 'MultiAdaptive is building the first Multi-Chain Data Availability Layer with true native support.'
export default function Footer() {

    return <div id="footer" className="bg-amber-50 pb-10 pt-10">
        <div className=" w-full bg-black border-black border-solid border-[4px] " />
        <div className="flex gap-5 justify-between self-center px-5   w-full  mt-10">
            <div className="flex flex-col justify-center items-start px-8">
                <Image
                    width={240}
                    height={80}
                    alt='MultiAdaptive'
                    src={logo}
                />
            </div>
            <div className="my-auto text-2xl font-medium leading-6 text-center text-black">
                <Link href="https://docsend.com/view/b356nwj6k6mpukkp" target="_blank" >WhitePaper</Link>


            </div>
            <div className="flex gap-10 mt-4">

                <Link href="https://MultiAdaptive.com/" target="_blank">
                    <Image
                        width={40}
                        height={40}
                        alt=''
                        src={website}
                    />
                </Link>

                <Link href="https://twitter.com/MultiAdaptive" target="_blank">
                    <Image
                        width={36}
                        height={40}
                        alt=''
                        className="mr-12 "
                        src={twitter}
                    />
                </Link>
            </div>
        </div>
    </div>
}