import dynamic from 'next/dynamic'

const DynamicApp = dynamic(() => import('./app'), {
  loading: () => <div className='h-[1100px] bg-amber-50'>
    
  </div >,
})
 
export default function Home() {
  return <DynamicApp />
}