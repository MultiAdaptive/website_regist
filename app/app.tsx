
'use client'

import Image from 'next/image'
import Link from "next/link"
import { Account, ConnectButton, Connector, useAccount } from '@ant-design/web3';
import React, { useEffect, useState } from 'react';
import { MetaMask, OkxWallet, TokenPocket, WagmiWeb3ConfigProvider, WalletConnect, } from '@ant-design/web3-wagmi';
import { QueryClient } from '@tanstack/react-query';
import { createConfig, http, useReadContract, useWriteContract } from 'wagmi';
import { sepolia } from 'wagmi/chains';
import { walletConnect } from 'wagmi/connectors';
import adoptionJson from './abi/wl.json';
import DaABIJson from './abi/da.json';
import { Input, message } from "antd";
import logo from '../public/logo.svg'
import arrow_home from '../public/arrow_home.svg'
import introduce_right from '../public/introduce_right.svg'
import introduce_left from '../public/introduce_left.svg'
import invite_bg from '../public/invite_bg.svg'
import sun from '../public/sun.svg'
import twitter from '../public/twitter.svg'
import { useSearchParams, useRouter } from 'next/navigation';

const { TextArea } = Input;
const queryClient = new QueryClient();
const config = createConfig({
  chains: [sepolia],
  transports: {
    [sepolia.id]: http(),
  },
  connectors: [
    walletConnect({
      showQrModal: false,
      projectId: '4952e44d29161d84a3af200e4f7533f3',
    }),
  ],
});



const App: React.FC = () => {
  const router = useRouter();

  const [isHidden, setIsHidden] = useState(true);
  const [isUserHidden, setIsUserHidden] = useState(true);
  const [count, setCount] = useState('0');
  const [total, setTotal] = useState('0');
  const [inviteNum, setInviteNum] = useState('0');
  const [score, setScore] = useState('0');
  const [scoreDa, setScoreDa] = useState('0');
  const [address, setAddress] = useState('');
  const [inviteCode, setInviteCode] = useState('');
  const [link, setLink] = useState("");
  const [reloadFlag, setReloadFlag] = useState(false);
  const [registInfo, setRegistInfo] = useState("You will unlock a Web3 DA network! \n\nClick the Regist button to follow me!!!");
  const [registButton, setRegistButton] = useState("Regist");
  const searchParams = useSearchParams();
  const hasRefParam = searchParams.has('ref');
  let refValue = searchParams.get('ref') || '';

  const handleRefresh = () => {
    router.refresh();
  };
  const onInviteCodeChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const invite_code = e.target.value
    refValue = invite_code
    setInviteCode(invite_code)


  };

  useEffect(() => {
    setIsHidden(hasRefParam ? false : true);
    setInviteCode(refValue)
  }, [refValue]);

  const CallTest = () => {
    const { account } = useAccount()
    let aa = account?.address || address;
    const { writeContract } = useWriteContract();
    let result_da_data = '0'
    // 0xE963e90AAAAA907BF9D4C724C6520a832F6a4b0d
    const isCwl = ReadContract(aa, "genesisWhitelists");
    const isNwl = ReadContract(aa, "whitelists");
    const inviteCount = ReadContract(aa, "inviteCount");
    const result_da = ReadContract2(aa, "indices")

    console.log(isCwl + '-------------!ref')
    console.log(isNwl + '-------------!ref')
    console.log(inviteCount + '-------------!ref')
    console.log(result_da + '-------------!ref')

    if (result_da && result_da.data) {
      const data = result_da.data + ''
      result_da_data = data.slice(0, -1)
    }
    const numDA = Number(result_da_data) * 100 > 1000 ? 1000 : Number(result_da_data) * 100;


    if (aa != "") {
      setAddress(aa)


      if (isCwl && isCwl.data) {
        setIsHidden(false)
        setIsUserHidden(true)
        setTotal("10")

        setLink("https://www.test.alpha.multiadaptive.com/?ref=" + account)
        setInviteNum((10 - Number(inviteCount.data)).toString())
        setCount(inviteCount.data + '')
        setScore((Number(inviteCount.data) * 100).toString())
        setScoreDa(numDA.toString())
      } else if (isNwl && isNwl.data) {
        setIsHidden(false)
        setIsUserHidden(true)
        setTotal("3")
        setLink("https://www.test.alpha.multiadaptive.com/?ref=" + account)
        setInviteNum((3 - Number(inviteCount.data)).toString())
        setCount(inviteCount.data + '')
        setScore((Number(inviteCount.data) * 100).toString())
        setScoreDa(numDA.toString())
      } else {
        setIsUserHidden(false)
        // if (registButton=='Go to Task2') {
        // setIsHidden(true)


      }
      return (

        <div className={isUserHidden ? 'hidden' : ''}>
          <div className='absolute top-[660px] left-[200px] '>
            <div className="items-center justify-center mt-10   bg-[#b9e6fe] rounded-[92px] border-4 border-solid border-black rotate-[0.54deg]">
              <button className=" px-14 py-4 [font-family:'Space_Grotesk-Bold',Helvetica] justify-center items-center  text-black text-[29px] text-center "
                onClick={() => {


                  if (registButton == 'Regist') {
                    writeContract(
                      {
                        abi: adoptionJson,
                        address: "0xfC8C0EBE468Fe9B28F3b21dB5b74C818dCEA8765",
                        functionName: "register",
                        args: [inviteCode],
                      },
                      {
                        onSuccess: () => {
                          setRegistInfo('Congratulations! You have successfully unlocked the Web3 DA network.')
                          setRegistButton("Go to Task2")
                          message.success("Regist Success");
                        },
                        onError: (err) => {
                          message.error(err.message);
                        },
                      }
                    );
                  } else {

                    setIsHidden(true)
                    setIsUserHidden(true)

                  }
                }
                }
              >
                {registButton}
              </button>
            </div>
          </div>
        </div>
      );
    } else {
      setIsHidden(true)
    }

  };
  async function handleCopy(textToCopy: string) {
    try {
      await navigator.clipboard.writeText(textToCopy);
      message.success("Copy the share link.");
    } catch (err) {
      console.error('Con‘t copy the text: ', err);
    }
  }
  const ReadContract = (address: string, functionName: string) => {
    return useReadContract({
      abi: adoptionJson,
      address: "0xfC8C0EBE468Fe9B28F3b21dB5b74C818dCEA8765",
      functionName,
      args: [address as `0x${string}`],
    });
  };

  const ReadContract2 = (address: string, functionName: string) => {
    return useReadContract({
      abi: DaABIJson,
      address: "0xb945872cbF327DA5CBEb6aE7286ccEE6CAaBA3B2",
      functionName,
      args: [address as `0x${string}`],
    });
  };
  const handleToggle = () => {
    if (address == '') {
      message.error("Please connect the wallet..");
    }
    setIsHidden(prevState => !prevState);
  };



  return (
    <div className="flex w-full font-mono flex-col pb-16 bg-amber-50 items-center">

      <div className="flex h-20 justify-center bg-white border-black border-solid border-[5px] mt-10 mb-10 shadow-[6px_6px_0px_#00000040]">

        <div className="flex flex-col  ">
          <div className="w-3.5 h-3.5 bg-white border-[3px]  mt-[-10px] ml-[-10px] border-solid border-black   shadow-[6px_6px_0px_#00000040]" />
          <div className="w-3.5 h-3.5  bg-white border-[3px] mt-12 ml-[-10px]  border-solid border-black px-100   shadow-[6px_6px_0px_#00000040]" />
        </div>
        <Image
          width={260}
          height={100}
          alt=''
          className='px-8 my-auto '
          src={logo}
        />

        <div className="flex gap-12 ">
          <div className="shrink-0 self-stretch my-auto w-1.5 bg-black   h-[74px]" />
          <div className=" text-xl text-neutral-950 w-[170px] flex items-center   justify-center ">
            <WagmiWeb3ConfigProvider
              eip6963={{
                autoAddInjectedWallets: true,
              }}
              ens
              wallets={[
                MetaMask(),
                WalletConnect(),
                TokenPocket({
                  group: 'Popular',
                }),
                OkxWallet(),
              ]}

              config={config}
              queryClient={queryClient}
            >

              <Connector
                modalProps={{
                  mode: 'simple',
                }}
                onConnect={() => {
                }}
                onChainSwitched={() => {
                  console.error('onChainSwitched');
                }}

                onConnected={(account?: Account) => {
                  setIsHidden(false)
                  console.log(account?.address + '-------------')
                  if (account != null)
                    setAddress(account.address)

                }}
                onDisconnected={() => {
                  setIsHidden(true)
                  setAddress('')
                  console.error('onDisconnected');
                }}



              >
                <ConnectButton quickConnect />
              </Connector>
              <CallTest />
            </WagmiWeb3ConfigProvider>
          </div>

          <div className="flex flex-col self-stretch">
            <div className="w-3.5 h-3.5 bg-white border-[3px] border-solid border-black  mt-[-10px]   shadow-[6px_6px_0px_#00000040]" />
            <div className="w-3.5 h-3.5  bg-white border-[3px] border-solid border-black px-100 mt-12  shadow-[6px_6px_0px_#00000040]" />
          </div>
        </div>
      </div>



      <div className={isHidden ? '' : 'hidden'}>
        <div className="relative flex flex-col items-center pr-8 pl-20 w-full  ">
          <div className="relative flex gap-9 w-full ">
            <div className=" [-webkit-text-stroke:3px_#000000]  flex-auto text-4xl text-black   ">
              Surprises!!!🚀🚀🚀
              <div className="absolute w-[350px] left-[475px] h-7 top-[65px]  bg-[#ffdc58]" />

              <div className="relative pt-4 text-4xl mb-4">
                Welcome to start your exploration trip ~
              </div>

            </div>

            <div className="flex gap-4 my-auto text-2xl   text-right text-zinc-900"
            >


              Share on
              <Link href="https://twitter.com/intent/tweet?text=You will unlock a Web3 DA network!&url=www.test.alpha.multiadaptive.com" target="_blank">

                <Image
                  width={30}
                  height={28}
                  alt=''
                  className="  "
                  src={twitter}
                />
              </Link>

            </div>

          </div>
          <div className="flex flex-col w-[1250px] mt-[-30px] items-start gap-[95px] relative">
            <div className="flex flex-col mt-10 h-[43px] items-start gap-2.5 relative">
              <div className="inline-flex items-center justify-center gap-2.5 relative flex-[0_0_auto] mr-[-18.31px] bg-[#ffc9f0] overflow-hidden shadow-[1px_1px_11.2px_#00000014]">
                <div className="relative w-fit mt-[-1.50px]  text-[#0c0c0c] text-[30px] text-center  ">
                  How to get your surprises???
                </div>
              </div>
              <Image
                width={42}
                height={79}
                alt=''
                src={arrow_home}
                className="absolute w-[42px] h-[79px] top-[59px] left-1.5"
              />
            </div>
            <div className="flex h-[505.51px] mt-[-30px] items-start relative self-stretch w-full">
              <div className="relative w-[627px] h-[491.36px]">
                <div className="top-5 left-[15px] bg-[#ffe68c] border-[#eecd56] rotate-[-4.00deg] shadow-[5px_5px_20px_#ffe68c21] absolute w-[580px] h-[452px] rounded-lg border-[5px] border-solid" />
                <div className="inline-flex flex-col items-start gap-9 absolute top-[54px] left-[75px] rotate-[-4.00deg]">
                  <Image
                    width={52}
                    height={79}
                    alt=''
                    src={introduce_left}
                    className="relative flex-[0_0_auto] mt-[-2.08px] ml-[-2.08px] rotate-[4.00deg]"
                  />
                  <div className="relative w-fit  font-normal text-transparent text-[32px] text-center tracking-[0] leading-[normal]">
                    <span className="font-medium text-black">
                      Creation white list <br />
                    </span>
                    <span className=" font-bold text-[#4682c8]">10</span>
                    <span className="font-medium text-black">
                      {" "}
                      invitation quotas
                      <br />
                      <br />
                      Ordinary white list <br />
                    </span>
                    <span className=" font-bold text-[#fc74ff]">3</span>
                    <span className=" font-bold text-black">&nbsp;</span>
                    <span className="font-medium text-black">
                      invitation quotas
                      <br />
                      <br />
                    </span>
                    <span className=" font-bold text-[#221f1f]">
                      1 invitation {" "}
                    </span>
                    <span className=" font-bold text-[#bebfb4]">= </span>
                    <span className=" font-bold text-[#f384d4]">100 score</span>
                  </div>
                </div>
                <div className="inline-flex items-center justify-center  absolute top-[33px] left-[418px] bg-[#9ddcff] overflow-hidden shadow-[1px_1px_11.2px_#00000014]">
                  <button className="relative   mt-[-1.50px] ml-[-0.50px] [-webkit-text-stroke:0.5px_#0c0c0c]   font-bold text-black text-3xl text-center hover:text-4xl hover:text-[#f384d4]"
                    onClick={handleToggle}
                  >
                    Invite Task
                  </button>
                </div>
              </div>
              <div className="relative w-[620.65px] h-[505.51px] ">
                <div className="relative w-[621px] h-[506px]">
                  <div className="top-[27px] left-5 bg-[#9ddcff] border-[#59b5e7] rotate-[5.50deg] shadow-[5px_5px_20px_#9ddcff26] absolute w-[580px] h-[452px] rounded-lg border-[5px] border-solid" />
                  <div className="inline-flex flex-col items-start  absolute top-[82px] left-[55px] rotate-[5.50deg]">
                    <Image
                      width={42}
                      height={58}
                      alt=''
                      src={introduce_right}
                      className="relative rotate-[-5.50deg]"
                    />
                    <div className="relative w-[505.04px]  font-normal text-transparent text-[32px] text-center tracking-[0] leading-[normal]">
                      <span className="font-medium text-black">
                        Submit DA data to MultiAdaptve Testnet. <br />
                        <br />
                        <Link className='text-[#4682C8] w-[500px] text-pretty break-words ' href="https://github.com/MultiAdaptive/multiAdaptive-cli/blob/master/TEST.md" target="_blank"> https://github.com/MultiAdaptive/multiAdaptive-cli/blob/master/TEST.md</Link>
                        <br />
                        <br />
                      </span>
                      <span className=" font-bold text-black">
                        1 submission&nbsp;&nbsp;=&nbsp;&nbsp;
                      </span>
                      <span className=" font-bold text-[#f384d4]">10 score</span>
                    </div>
                  </div>
                  <div className="inline-flex items-center justify-center   absolute top-4 left-[305px] bg-[#ffc9f0] overflow-hidden shadow-[1px_1px_11.2px_#00000014]">
                    <div className="relative w-fit mt-[-1.50px] ml-[-0.50px] [-webkit-text-stroke:0.5px_#0c0c0c]   font-bold text-[#0c0c0c] text-3xl  ">
                      DA Task
                    </div>
                  </div>
                </div>
              </div>
              <div className="relative w-[66.53px] h-[66.53px] mr-[-64.18px]" />
            </div>
          </div>



          <div className="flex flex-col items-center px-16 pt-16 pb-10 mt-10 w-full text-center text-black bg-white rounded-sm border-black border-solid border-[6px] max-w-[1235px] max-md:px-5 max-md:mt-10 max-md:max-w-full shadow-[6px_6px_0px_#00000040] ">
            <div className="flex flex-col items-center max-w-full w-[738px] ">
              <div className="text-5xl font-medium max-md:max-w-full max-md:text-4xl">
                Current progress✨
              </div>
              <div className="self-stretch mt-9 text-3xl max-md:max-w-full">
                <span className=" font-normal text-black text-[32px] tracking-[0]">
                  1,000{" "}
                </span>
                <span className="[font-family:'Space_Grotesk-Regular',Helvetica]">
                  invitations for the creation white list
                  <br />
                </span>
                <span className=" font-normal text-black text-[32px] tracking-[0]">
                  8,090{" "}
                </span>
                <span className="[font-family:'Space_Grotesk-Regular',Helvetica]">
                  invitations for the ordinary white list
                  <br />
                </span>
                <span className=" font-normal text-black text-[32px] tracking-[0]">
                  203,000
                </span>
                <span className="[font-family:'Space_Grotesk-Regular',Helvetica]"> node submissions.</span>
              </div>
              {/* <div className="px-14 py-8 mt-11 text-3xl font-bold bg-sky-200 border-8 border-black border-solid rounded-[92px] max-md:px-5 max-md:mt-10">
                {buttoValue}
              </div> */}
            </div>
          </div>
        </div>
      </div>

      <div className={isHidden ? 'hidden' : ''}>
        <div>
          <div className="flex items-center   ">
            <div className={isUserHidden ? '' : 'hidden'}>
              <div className="relative ">
                <div className="relative w-[717px] h-[407px]  ">
                  <div className="absolute w-[370px] h-11 top-[165px] left-[160px] bg-[#ffdc58]" />
                  <div className="absolute mt-10 [-webkit-text-stroke:3px_#000000] [font-family:'Space_Grotesk-Regular',Helvetica] font-normal text-black text-[80px] tracking-[0] leading-[normal]">
                    Congratulations! <br />
                    You have been included in our white list.
                  </div>
                </div>
                <div className="mt-8 mb-8  [-webkit-text-stroke:2px_#000000] font-normal text-black text-4xl tracking-[0] leading-[normal]">
                  {count} / {total}
                  <br />
                  Invite score : {score}
                  <br />

                  DA score : {scoreDa}
                </div>
              </div>
            </div>
            <div className={isUserHidden ? 'hidden' : ''}>
              <div className="relative ">
                <div className="relative w-[717px] h-[507px]  ">
                  <div className="absolute w-[350px] h-11 top-[125px]  bg-[#ffdc58]" />
                  <div className="absolute  [-webkit-text-stroke:3px_#000000] [font-family:'Space_Grotesk-Regular',Helvetica] font-normal text-black text-[80px] tracking-[0] leading-[normal]">
                    {registInfo}
                  </div>
                </div>

              </div>
            </div>
            <Image
              width={100}
              height={50}
              alt=''
              className="absolute  top-[630px] left-[700px]"
              src={sun}
            />
            <div className="relative w-[504px] h-[580px] ">
              <Image
                width={554}
                height={660}
                alt=''
                className="absolute  mt-8 "
                src={invite_bg}
              />
              <div className={isUserHidden ? '' : 'hidden'}>
                <div className='relative w-[300px] text-center text-[30px] mt-52 ml-28'>
                  <div className="text-[22px]  text-black">
                    Super Cool!!!  <br />
                    You can invite another <span className='text-[#4682C8]'>{inviteNum} </span>people to join. <br />
                    Move fast!
                  </div>
                  <div className='mt-6 break-words text-left text-[14px] text-[#4682C8]'>{link}</div>
                </div>
                <div className='flex'>
                  <div className="items-center justify-center mt-4  ml-28 bg-[#b9e6fe] rounded-[92px] border-4 border-solid border-black rotate-[0.54deg]">
                    <button className="  w-[128px] h-[50px] [font-family:'Space_Grotesk-Bold',Helvetica]   text-black text-xl text-center "
                      onClick={() => handleCopy(link + "")}>
                      Copy
                    </button>
                  </div>

                  <div className="  items-center justify-center mt-6    rotate-[0.54deg]">
                    <div className="mt-2 [font-family:'Space_Grotesk-Bold',Helvetica]   text-black text-xl text-center ">
                      <Link href={`https://twitter.com/intent/tweet?text=You will unlock a Web3 DA network!Click the link and explore with me!&url=${link}`} target="_blank">
                        <div className='flex ml-8'>
                          <div  >Share on

                          </div>
                          <Image
                            width={28}
                            height={28}
                            alt=''
                            className="  ml-2 "
                            src={twitter}
                          />

                        </div>

                      </Link>
                    </div>
                  </div>

                </div>

              </div>

              <div className={isUserHidden ? 'hidden' : ''}>
                <div className='relative w-[320px] text-center text-[30px] mt-52 ml-28'>
                  <TextArea placeholder="Invite code" variant="borderless" defaultValue={refValue} allowClear onChange={onInviteCodeChange}
                    style={{ height: 300, resize: 'none' }}
                    className=" break-words   text-left text-[40px] [font-family:'Space_Grotesk-Bold',Helvetica] ">
                  </TextArea>
                </div>

              </div>

            </div>
          </div>
        </div>
        <div className={isUserHidden ? '' : 'hidden'}>
          <div className="flex flex-col items-center px-16 pt-16 pb-10 mt-10 w-full text-center text-black bg-white rounded-sm border-black border-solid border-[6px] max-w-[1235px]   shadow-[6px_6px_0px_#00000040] ">
            <div className="flex flex-col items-center max-w-full w-[738px] ">
              <div className="text-3xl font-medium max-md:max-w-full max-md:text-4xl">
                Task 2：DA Task✨
              </div>

              <div className="self-stretch mt-9 text-xl max-md:max-w-full">
                <div>Submit DA data to MultiAdaptve Testnet. </div>  <br />
                <div className='font-bold'>1 submission  =  <span className='text-[#F384D4]'>10 score</span></div>  <br />
                <div>Reference document:<Link className='text-[#4682C8]' href="https://github.com/MultiAdaptive/multiAdaptive-cli/blob/master/TEST.md" target="_blank"> https://github.com/MultiAdaptive/multiAdaptive-cli/blob/master/TEST.md</Link></div>  <br />
                <div className='text-gray-500'>Tip: Please submit DA data using the new wallet.<br />The upper limit of the score for the Da task is 1000.  </div>
              </div>
              <div className=" w-[268px] h-[67px] items-center justify-center mt-8   bg-[#b9e6fe] rounded-[92px] border-4 border-solid border-black rotate-[0.54deg]">
                <div className="mt-2 [font-family:'Space_Grotesk-Bold',Helvetica]   text-black text-[29px] text-center "
                >
                  <Link className='text-[#4682C8]' href="https://github.com/MultiAdaptive/multiAdaptive-cli/blob/master/TEST.md" target="_blank">
                    Strat
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>





    </div>

  );
}

export default App;