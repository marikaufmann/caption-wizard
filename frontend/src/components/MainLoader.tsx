import Icons from "./Icons"

const MainLoader = () => {
  return (
    <div className="bg-background min-h-screen h-full overflow-y-hidden ">
    <div className=" flex items-center justify-center flex-col gap-2 h-[600px]">
      <Icons.Spinner/>
      <p className="bg-gradient-to-r from-[#A3CDCD] to-primaryDarker text-transparent bg-clip-text md:text-2xl text-lg font-bold tracking-wider">
        Effortless Captions, Endless Possibilities
      </p>
    </div>
  </div>
  )
}

export default MainLoader